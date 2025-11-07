/**
 * CSV Schema Detection and Analysis
 * 
 * Provides automatic schema detection, data type inference,
 * and statistical analysis of CSV data.
 */

import { CSVParseResult, CSVColumn, CSVSchema } from './parser';

/**
 * Infers data type from a sample of values
 */
const inferDataType = (values: unknown[]): CSVColumn['type'] => {
  if (values.length === 0) return 'string';
  
  // Count non-null values
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNullValues.length === 0) return 'null';
  
  // Check for boolean values
  const booleanValues = nonNullValues.filter(v => {
    const str = String(v).toLowerCase().trim();
    return ['true', 'false', 'yes', 'no', '1', '0', 'y', 'n'].includes(str);
  });
  
  if (booleanValues.length === nonNullValues.length) {
    return 'boolean';
  }
  
  // Check for date values
  const dateValues = nonNullValues.filter(v => {
    const str = String(v).trim();
    return !isNaN(Date.parse(str)) && str.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/);
  });
  
  if (dateValues.length >= nonNullValues.length * 0.8) { // 80% threshold for dates
    return 'date';
  }
  
  // Check for numeric values
  const numericValues = nonNullValues.filter(v => {
    const str = String(v).replace(/[,,$]/g, ''); // Remove common formatting
    return !isNaN(Number(str)) && str !== '';
  });
  
  if (numericValues.length >= nonNullValues.length * 0.8) { // 80% threshold for numbers
    return 'number';
  }
  
  // Default to string
  return 'string';
};

/**
 * Converts a value to the inferred data type
 */
const convertValue = (value: unknown, targetType: CSVColumn['type']): unknown => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  const str = String(value).trim();
  
  switch (targetType) {
    case 'number':
      const numStr = str.replace(/[,,$]/g, '');
      return isNaN(Number(numStr)) ? null : Number(numStr);
      
    case 'boolean':
      const lowerStr = str.toLowerCase();
      if (['true', 'yes', '1', 'y'].includes(lowerStr)) return true;
      if (['false', 'no', '0', 'n'].includes(lowerStr)) return false;
      return null;
      
    case 'date':
      const date = new Date(str);
      return isNaN(date.getTime()) ? null : date;
      
    case 'string':
    default:
      return str;
  }
};

/**
 * Analyzes a CSV column to determine its schema
 */
const analyzeColumn = (
  name: string,
  index: number,
  data: Record<string, unknown>[]
): CSVColumn => {
  const values = data.map(row => row[name]);
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  const type = inferDataType(values);
  const nullable = nonNullValues.length < values.length;
  
  // Check for uniqueness
  const uniqueValues = new Set(nonNullValues.map(v => String(v)));
  const unique = uniqueValues.size === nonNullValues.length;
  
  // Get sample values (first 5 unique non-null values)
  const sampleValues = Array.from(uniqueValues).slice(0, 5);
  
  // Count null values
  const nullCount = values.length - nonNullValues.length;
  
  return {
    name,
    index,
    type,
    nullable,
    unique,
    sampleValues,
    nullCount
  };
};

/**
 * Detects and analyzes the schema of CSV data
 */
export const detectSchema = (parseResult: CSVParseResult): CSVSchema => {
  const columns = parseResult.headers.map((header, index) => 
    analyzeColumn(header, index, parseResult.data)
  );
  
  return {
    columns,
    delimiter: parseResult.delimiter,
    hasHeader: parseResult.headers.some(h => !h.match(/^Column_\d+$/)),
    rowCount: parseResult.rowCount
  };
};

/**
 * Converts CSV data to match the detected schema
 */
export const applySchema = (
  data: Record<string, unknown>[],
  schema: CSVSchema
): Record<string, unknown>[] => {
  return data.map(row => {
    const convertedRow: Record<string, unknown> = {};
    
    schema.columns.forEach(column => {
      const rawValue = row[column.name];
      const convertedValue = convertValue(rawValue, column.type);
      convertedRow[column.name] = convertedValue;
    });
    
    return convertedRow;
  });
};

/**
 * Generates statistics for a CSV column
 */
export const getColumnStats = (column: CSVColumn, data: Record<string, unknown>[]) => {
  const values = data.map(row => row[column.name]).filter(v => v !== null && v !== undefined) as any[];
  
  if (values.length === 0) {
    return {
      count: 0,
      unique: 0,
      nullCount: data.length,
      min: null,
      max: null,
      mean: null,
      median: null
    };
  }
  
  const uniqueCount = new Set(values.map(v => String(v))).size;
  
  let min = null;
  let max = null;
  let mean = null;
  let median = null;
  
  if (column.type === 'number') {
    const numValues = values as number[];
    numValues.sort((a, b) => a - b);
    min = numValues[0];
    max = numValues[numValues.length - 1];
    mean = numValues.reduce((sum, val) => sum + val, 0) / numValues.length;
    median = numValues.length % 2 === 0
      ? (numValues[numValues.length / 2 - 1] + numValues[numValues.length / 2]) / 2
      : numValues[Math.floor(numValues.length / 2)];
  } else if (column.type === 'date') {
    const dateValues = values as Date[];
    dateValues.sort((a, b) => a.getTime() - b.getTime());
    min = dateValues[0];
    max = dateValues[dateValues.length - 1];
  }
  
  return {
    count: values.length,
    unique: uniqueCount,
    nullCount: data.length - values.length,
    min,
    max,
    mean,
    median
  };
};

/**
 * Validates data against the detected schema
 */
export const validateAgainstSchema = (
  data: Record<string, unknown>[],
  schema: CSVSchema
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  data.forEach((row, rowIndex) => {
    schema.columns.forEach(column => {
      const value = row[column.name];
      
      if (value === null || value === undefined || value === '') {
        if (!column.nullable) {
          errors.push(`Row ${rowIndex + 1}: Column "${column.name}" cannot be null`);
        }
        return;
      }
      
      // Type validation
      const convertedValue = convertValue(value, column.type);
      if (convertedValue === null && value !== null && value !== '') {
        errors.push(`Row ${rowIndex + 1}: Invalid ${column.type} value in column "${column.name}": ${value}`);
      }
      
      // Uniqueness validation
      if (column.unique) {
        const duplicateCount = data.filter(r => r[column.name] === value).length;
        if (duplicateCount > 1) {
          errors.push(`Row ${rowIndex + 1}: Duplicate value in unique column "${column.name}": ${value}`);
        }
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Suggests field mappings for Deneb templates based on column names and types
 */
export const suggestFieldMappings = (
  schema: CSVSchema,
  templateFields?: { name: string; type?: string; required?: boolean }[]
): Record<string, string> => {
  const mappings: Record<string, string> = {};
  
  if (!templateFields || templateFields.length === 0) {
    return mappings;
  }
  
  templateFields.forEach(field => {
    // Try exact name match first
    const exactMatch = schema.columns.find(col => 
      col.name.toLowerCase() === field.name.toLowerCase()
    );
    
    if (exactMatch) {
      mappings[field.name] = exactMatch.name;
      return;
    }
    
    // Try fuzzy name matching
    const fuzzyMatch = schema.columns.find(col => {
      const colName = col.name.toLowerCase();
      const fieldName = field.name.toLowerCase();
      
      // Check if column name contains field name or vice versa
      return colName.includes(fieldName) || fieldName.includes(colName);
    });
    
    if (fuzzyMatch) {
      mappings[field.name] = fuzzyMatch.name;
      return;
    }
    
    // Try type-based matching
    if (field.type) {
      const typeMatch = schema.columns.find(col => {
        if (field.type === 'quantitative' && col.type === 'number') return true;
        if (field.type === 'nominal' && (col.type === 'string' || col.type === 'boolean')) return true;
        if (field.type === 'temporal' && col.type === 'date') return true;
        return false;
      });
      
      if (typeMatch) {
        mappings[field.name] = typeMatch.name;
        return;
      }
    }
  });
  
  return mappings;
};