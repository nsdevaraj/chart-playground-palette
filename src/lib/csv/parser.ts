/**
 * CSV Parser Utilities
 * 
 * Provides robust CSV parsing with automatic delimiter detection,
 * header handling, and error recovery for various CSV formats.
 */

export interface CSVParseOptions {
  delimiter?: string;
  hasHeader?: boolean;
  skipEmptyLines?: boolean;
  trimWhitespace?: boolean;
  quoteChar?: string;
  escapeChar?: string;
  encoding?: string;
}

export interface CSVParseResult {
  data: Record<string, unknown>[];
  headers: string[];
  delimiter: string;
  rowCount: number;
  columnCount: number;
  errors: string[];
  warnings: string[];
}

export interface CSVSchema {
  columns: CSVColumn[];
  delimiter: string;
  hasHeader: boolean;
  rowCount: number;
}

export interface CSVColumn {
  name: string;
  index: number;
  type: 'string' | 'number' | 'boolean' | 'date' | 'null';
  nullable: boolean;
  unique: boolean;
  sampleValues: unknown[];
  nullCount: number;
}

/**
 * Detects the most likely delimiter in CSV content
 */
export const detectDelimiter = (content: string): string => {
  const delimiters = [',', ';', '\t', '|', ':'];
  const lines = content.split('\n').slice(0, 5); // Check first 5 lines
  
  let bestDelimiter = ',';
  let bestScore = 0;

  delimiters.forEach(delimiter => {
    let score = 0;
    let consistentColumns = true;
    let expectedColumns = -1;

    lines.forEach(line => {
      if (line.trim() === '') return;
      
      // Simple split for counting (don't worry about quotes for detection)
      const columns = line.split(delimiter);
      
      if (expectedColumns === -1) {
        expectedColumns = columns.length;
      } else if (columns.length !== expectedColumns) {
        consistentColumns = false;
      }
      
      score += columns.length;
    });

    // Prefer delimiters that give consistent column counts
    if (consistentColumns && score > bestScore) {
      bestScore = score;
      bestDelimiter = delimiter;
    }
  });

  return bestDelimiter;
};

/**
 * Parses CSV content with automatic delimiter detection
 */
export const parseCSV = (content: string, options: CSVParseOptions = {}): CSVParseResult => {
  const {
    delimiter,
    hasHeader = true,
    skipEmptyLines = true,
    trimWhitespace = true,
    quoteChar = '"',
    escapeChar = '\\'
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];

  // Auto-detect delimiter if not provided
  const detectedDelimiter = delimiter || detectDelimiter(content);
  
  // Split content into lines
  let lines = content.split(/\r?\n/);
  
  if (skipEmptyLines) {
    lines = lines.filter(line => line.trim() !== '');
  }

  if (lines.length === 0) {
    errors.push('CSV file is empty or contains only empty lines');
    return {
      data: [],
      headers: [],
      delimiter: detectedDelimiter,
      rowCount: 0,
      columnCount: 0,
      errors,
      warnings
    };
  }

  // Parse CSV rows
  const rows: string[][] = [];
  
  lines.forEach((line, lineIndex) => {
    try {
      const parsedRow = parseCSVLine(line, detectedDelimiter, quoteChar, escapeChar);
      rows.push(parsedRow);
    } catch (error) {
      errors.push(`Error parsing line ${lineIndex + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  if (rows.length === 0) {
    errors.push('No valid rows could be parsed from CSV');
    return {
      data: [],
      headers: [],
      delimiter: detectedDelimiter,
      rowCount: 0,
      columnCount: 0,
      errors,
      warnings
    };
  }

  // Determine headers
  let headers: string[];
  let dataRows: string[][];
  
  if (hasHeader) {
    headers = rows[0].map((header, index) => {
      let name = trimWhitespace ? header.trim() : header;
      if (!name || name === '') {
        name = `Column_${index + 1}`;
        warnings.push(`Empty header at column ${index + 1}, using "${name}"`);
      }
      return name;
    });
    dataRows = rows.slice(1);
  } else {
    const maxColumns = Math.max(...rows.map(row => row.length));
    headers = Array.from({ length: maxColumns }, (_, i) => `Column_${i + 1}`);
    dataRows = rows;
  }

  // Normalize row lengths
  const columnCount = headers.length;
  dataRows = dataRows.map(row => {
    const normalizedRow = [...row];
    while (normalizedRow.length < columnCount) {
      normalizedRow.push('');
    }
    return normalizedRow.slice(0, columnCount);
  });

  // Convert to objects
  const data: Record<string, unknown>[] = dataRows.map((row, rowIndex) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, colIndex) => {
      let value = row[colIndex] || '';
      
      if (trimWhitespace && typeof value === 'string') {
        value = value.trim();
      }
      
      obj[header] = value === '' ? null : value;
    });
    return obj;
  });

  return {
    data,
    headers,
    delimiter: detectedDelimiter,
    rowCount: data.length,
    columnCount: headers.length,
    errors,
    warnings
  };
};

/**
 * Parses a single CSV line handling quoted fields and escaped characters
 */
const parseCSVLine = (
  line: string,
  delimiter: string,
  quoteChar: string,
  escapeChar: string
): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === escapeChar && nextChar === quoteChar) {
      // Escaped quote
      current += quoteChar;
      i += 2;
    } else if (char === quoteChar) {
      // Quote boundary
      inQuotes = !inQuotes;
      i++;
    } else if (char === delimiter && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
      i++;
    } else {
      // Regular character
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current);

  return result;
};

/**
 * Validates CSV content before parsing
 */
export const validateCSVContent = (content: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content || content.trim() === '') {
    errors.push('CSV content is empty');
    return { valid: false, errors };
  }

  // Check for common formatting issues
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    errors.push('CSV contains no data rows');
    return { valid: false, errors };
  }

  // Check for inconsistent column counts
  const delimiter = detectDelimiter(content);
  const columnCounts = lines.map(line => {
    try {
      return parseCSVLine(line, delimiter, '"', '\\').length;
    } catch {
      return -1;
    }
  });

  const uniqueCounts = new Set(columnCounts);
  if (uniqueCounts.size > 2) { // Allow for header row difference
    errors.push('CSV has inconsistent column counts across rows');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Converts CSV data to different formats
 */
export const convertCSVToJSON = (csvData: CSVParseResult): string => {
  return JSON.stringify(csvData.data, null, 2);
};

export const convertCSVToTSV = (csvData: CSVParseResult): string => {
  const rows = [csvData.headers.join('\t')];
  csvData.data.forEach(row => {
    const values = csvData.headers.map(header => {
      const value = row[header];
      return value === null ? '' : String(value);
    });
    rows.push(values.join('\t'));
  });
  return rows.join('\n');
};