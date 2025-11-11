/**
 * CSV Data Mapping Utilities
 * 
 * Provides functionality to map CSV columns to Deneb template fields,
 * transform data, and validate compatibility.
 */

import { DenebTemplate, DenebDataConfig } from '../deneb/types';
import { CSVParseResult, CSVSchema } from './parser';
import { suggestFieldMappings, validateAgainstSchema } from './schema';

interface EncodingObject {
  field?: string;
  type?: 'quantitative' | 'nominal' | 'temporal' | 'ordinal';
  [key: string]: unknown;
}

interface TransformObject {
  aggregate?: string | string[];
  field?: string;
  as?: string | string[];
  calculate?: string;
  [key: string]: unknown;
}

interface VegaLiteSpec {
  encoding?: Record<string, EncodingObject>;
  transform?: TransformObject[];
  [key: string]: unknown;
}

export interface FieldMapping {
  templateField: string;
  csvColumn: string;
  transform?: DataTransform;
}

export interface DataTransform {
  type: 'identity' | 'aggregate' | 'calculate' | 'filter' | 'format';
  config: Record<string, unknown>;
}

export interface MappingResult {
  mappedData: Record<string, unknown>[];
  mappings: FieldMapping[];
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  stats: {
    totalRows: number;
    mappedRows: number;
    unmappedColumns: string[];
    requiredFieldsMapped: boolean;
  };
}

/**
 * Extracts field requirements from a Deneb template
 */
export const extractTemplateFields = (template: DenebTemplate): { name: string; type?: string; required?: boolean }[] => {
  const fields: { name: string; type?: string; required?: boolean }[] = [];
  
  // Extract from data config
  if (template.dataConfig) {
    template.dataConfig.forEach(config => {
      fields.push({
        name: config.name,
        type: config.type,
        required: config.required || false
      });
    });
  }
  
  // Extract from Vega-Lite specification
  if (template.vegaLite) {
    const spec = template.vegaLite;
    
    // Extract from encoding
    if (spec.encoding) {
      Object.entries(spec.encoding).forEach(([channel, encoding]) => {
        if (encoding && typeof encoding === 'object' && 'field' in encoding) {
          const encodingObj = encoding as EncodingObject;
          const field = encodingObj.field;
          if (field && typeof field === 'string') {
            const type = encodingObj.type;
            fields.push({
              name: field,
              type: type === 'quantitative' ? 'quantitative' : 
                    type === 'nominal' ? 'nominal' : 
                    type === 'temporal' ? 'temporal' : 'string',
              required: true // Fields in encoding are typically required
            });
          }
        }
      });
    }
    
    // Extract from transforms
    if (spec.transform && Array.isArray(spec.transform)) {
      spec.transform.forEach(transform => {
        if (transform && typeof transform === 'object') {
          const transformObj = transform as TransformObject;
          // Handle aggregate transforms
          if (transformObj.aggregate && transformObj.field) {
            fields.push({
              name: transformObj.field,
              type: 'quantitative', // Aggregates are typically numeric
              required: true
            });
          }
          
          // Handle calculate transforms
          if (transformObj.calculate && transformObj.as) {
            const asField = Array.isArray(transformObj.as) ? transformObj.as[0] : transformObj.as;
            if (asField) {
              fields.push({
                name: asField,
                type: 'string', // Calculated fields can be any type
                required: false
              });
            }
          }
        }
      });
    }
  }
  
  // Remove duplicates while preserving order
  const uniqueFields = fields.filter((field, index, self) =>
    index === self.findIndex(f => f.name === field.name)
  );
  
  return uniqueFields;
};

/**
 * Creates initial field mappings based on template and CSV schema
 */
export const createInitialMappings = (
  template: DenebTemplate,
  csvSchema: CSVSchema
): FieldMapping[] => {
  const templateFields = extractTemplateFields(template);
  const suggestedMappings = suggestFieldMappings(csvSchema, templateFields);
  
  const mappings: FieldMapping[] = [];
  
  templateFields.forEach(field => {
    if (suggestedMappings[field.name]) {
      mappings.push({
        templateField: field.name,
        csvColumn: suggestedMappings[field.name],
        transform: { type: 'identity', config: {} }
      });
    }
  });
  
  return mappings;
};

/**
 * Applies data transformations
 */
const applyTransform = (
  value: unknown,
  transform: DataTransform
): unknown => {
  switch (transform.type) {
    case 'identity':
      return value;
      
    case 'format':
      if (typeof value === 'number' && transform.config.format) {
        // Simple number formatting
        const format = transform.config.format as string;
        if (format.includes('%')) {
          return value * 100;
        }
        if (format.includes(',')) {
          return value.toLocaleString();
        }
      }
      return value;
      
    case 'calculate':
      // Simple expression evaluation (in production, use a proper expression parser)
      if (transform.config.expression && typeof transform.config.expression === 'string') {
        try {
          // This is a simplified version - production would need proper expression parsing
          const expr = transform.config.expression.replace('{value}', String(value));
          return Function('"use strict"; return (' + expr + ')')();
        } catch {
          return value;
        }
      }
      return value;
      
    default:
      return value;
  }
};

/**
 * Maps CSV data to template fields using the provided mappings
 */
export const mapCSVData = (
  csvData: CSVParseResult,
  csvSchema: CSVSchema,
  mappings: FieldMapping[]
): MappingResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if all required CSV columns exist
  const mappedColumns = new Set(mappings.map(m => m.csvColumn));
  const missingColumns = mappings
    .filter(m => !csvSchema.columns.find(col => col.name === m.csvColumn))
    .map(m => m.csvColumn);
  
  if (missingColumns.length > 0) {
    errors.push(`Missing CSV columns: ${missingColumns.join(', ')}`);
  }
  
  // Map the data
  const mappedData: Record<string, unknown>[] = csvData.data.map((row, rowIndex) => {
    const mappedRow: Record<string, unknown> = {};
    
    mappings.forEach(mapping => {
      const csvValue = row[mapping.csvColumn];
      const transformedValue = mapping.transform 
        ? applyTransform(csvValue, mapping.transform)
        : csvValue;
      
      mappedRow[mapping.templateField] = transformedValue;
    });
    
    return mappedRow;
  });
  
  // Filter out rows with null values in required fields (if any)
  const validMappedData = mappedData.filter(row => {
    return mappings.every(mapping => {
      const value = row[mapping.templateField];
      return value !== null && value !== undefined && value !== '';
    });
  });
  
  // Calculate unmapped columns
  const allCSVColumns = csvSchema.columns.map(col => col.name);
  const unmappedColumns = allCSVColumns.filter(col => !mappedColumns.has(col));
  
  // Check if all template fields are mapped
  const templateFields = mappings.map(m => m.templateField);
  const requiredFieldsMapped = true; // Simplified - would need template field requirements
  
  const stats = {
    totalRows: csvData.data.length,
    mappedRows: validMappedData.length,
    unmappedColumns,
    requiredFieldsMapped
  };
  
  return {
    mappedData: validMappedData,
    mappings,
    validation: {
      valid: errors.length === 0,
      errors,
      warnings
    },
    stats
  };
};

/**
 * Validates mapping compatibility with template
 */
export const validateMappingCompatibility = (
  template: DenebTemplate,
  mappings: FieldMapping[],
  csvSchema: CSVSchema
): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const templateFields = extractTemplateFields(template);
  const mappedFields = new Set(mappings.map(m => m.templateField));
  
  // Check for unmapped required fields
  templateFields.forEach(field => {
    if (field.required && !mappedFields.has(field.name)) {
      errors.push(`Required template field "${field.name}" is not mapped`);
    }
  });
  
  // Check for type mismatches
  mappings.forEach(mapping => {
    const csvColumn = csvSchema.columns.find(col => col.name === mapping.csvColumn);
    const templateField = templateFields.find(f => f.name === mapping.templateField);
    
    if (csvColumn && templateField && templateField.type) {
      const csvType = csvColumn.type;
      const templateType = templateField.type;
      
      // Check type compatibility
      if (templateType === 'quantitative' && csvType !== 'number') {
        warnings.push(`Template field "${mapping.templateField}" expects quantitative data but CSV column "${mapping.csvColumn}" contains ${csvType} data`);
      }
      
      if (templateType === 'temporal' && csvType !== 'date') {
        warnings.push(`Template field "${mapping.templateField}" expects temporal data but CSV column "${mapping.csvColumn}" contains ${csvType} data`);
      }
      
      if (templateType === 'nominal' && csvType === 'number') {
        warnings.push(`Template field "${mapping.templateField}" expects nominal data but CSV column "${mapping.csvColumn}" contains numeric data`);
      }
    }
  });
  
  // Check for duplicate mappings
  const duplicateTargets = mappings
    .map(m => m.csvColumn)
    .filter((col, index, arr) => arr.indexOf(col) !== index);
  
  if (duplicateTargets.length > 0) {
    errors.push(`CSV columns mapped multiple times: ${[...new Set(duplicateTargets)].join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Generates mapping suggestions based on common patterns
 */
export const generateMappingSuggestions = (
  template: DenebTemplate,
  csvSchema: CSVSchema
): FieldMapping[] => {
  const templateFields = extractTemplateFields(template);
  const suggestions: FieldMapping[] = [];
  
  // Common field name patterns
  const patterns: { [key: string]: string[] } = {
    x: ['x', 'category', 'label', 'name', 'type', 'group'],
    y: ['y', 'value', 'amount', 'count', 'total', 'measure', 'metric'],
    color: ['color', 'category', 'group', 'type', 'segment', 'region'],
    size: ['size', 'count', 'value', 'amount', 'weight'],
    tooltip: ['tooltip', 'description', 'details', 'notes'],
    row: ['row', 'y', 'category'],
    column: ['column', 'x', 'category'],
    text: ['text', 'label', 'name', 'title'],
    href: ['href', 'url', 'link'],
    order: ['order', 'sort', 'rank', 'position']
  };
  
  templateFields.forEach(field => {
    const fieldName = field.name.toLowerCase();
    
    // Try pattern matching
    for (const [pattern, possibleNames] of Object.entries(patterns)) {
      if (fieldName.includes(pattern) || pattern.includes(fieldName)) {
        const match = csvSchema.columns.find(col => 
          possibleNames.some(name => col.name.toLowerCase().includes(name))
        );
        
        if (match && !suggestions.find(s => s.csvColumn === match.name)) {
          suggestions.push({
            templateField: field.name,
            csvColumn: match.name,
            transform: { type: 'identity', config: {} }
          });
          break;
        }
      }
    }
    
    // If no pattern match, try exact name match
    if (!suggestions.find(s => s.templateField === field.name)) {
      const exactMatch = csvSchema.columns.find(col => 
        col.name.toLowerCase() === field.name.toLowerCase()
      );
      
      if (exactMatch) {
        suggestions.push({
          templateField: field.name,
          csvColumn: exactMatch.name,
          transform: { type: 'identity', config: {} }
        });
      }
    }
  });
  
  return suggestions;
};