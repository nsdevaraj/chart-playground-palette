/**
 * CSV Data Mapper Module
 * 
 * Comprehensive CSV parsing, schema detection, and data mapping utilities
 * for integrating CSV data with any template type (Deneb, Mermaid, etc.).
 */

export * from './parser';
export * from './schema';
export * from './mapper';
export * from './generic-mapper';

/**
 * Main CSV processing pipeline
 */
import { parseCSV, CSVParseOptions, CSVParseResult } from './parser';
import { detectSchema, CSVSchema } from './schema';
import { mapCSVData, createInitialMappings, FieldMapping, validateMappingCompatibility } from './generic-mapper';
import { GenericTemplate } from '../template';

export interface CSVProcessingResult {
  parseResult: CSVParseResult;
  schema: CSVSchema;
  mappings: FieldMapping[];
  mappedData: Record<string, unknown>[];
  validation: {
    parse: { valid: boolean; errors: string[] };
    schema: { valid: boolean; errors: string[] };
    mapping: { valid: boolean; errors: string[]; warnings: string[] };
  };
}

/**
 * Complete CSV processing pipeline for any template type
 */
export const processCSVForTemplate = async (
  csvContent: string,
  template: GenericTemplate,
  options?: CSVParseOptions
): Promise<CSVProcessingResult> => {
  // Step 1: Parse CSV
  const parseResult = parseCSV(csvContent, options);
  
  // Step 2: Detect schema
  const schema = detectSchema(parseResult);
  
  // Step 3: Create initial mappings
  const mappings = createInitialMappings(template, schema);
  
  // Step 4: Map data
  const mappingResult = mapCSVData(parseResult, schema, mappings);
  
  // Step 5: Validate compatibility
  const mappingValidation = validateMappingCompatibility(template, mappings, schema);
  
  return {
    parseResult,
    schema,
    mappings,
    mappedData: mappingResult.mappedData,
    validation: {
      parse: {
        valid: parseResult.errors.length === 0,
        errors: parseResult.errors
      },
      schema: {
        valid: true, // Schema detection always succeeds
        errors: []
      },
      mapping: mappingValidation
    }
  };
};