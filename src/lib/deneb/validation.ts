/**
 * Deneb Template Validation
 * 
 * Provides validation functionality for Deneb templates including:
 * - JSON structure validation
 * - Required field validation
 * - Data binding validation
 * - Vega-Lite spec validation
 */

import {
  DenebTemplate,
  ValidationResult,
  VegaLiteSpec,
  DenebDataConfig,
} from './types';

/**
 * Validates a Deneb template JSON structure
 * Checks for required fields and proper structure
 */
export const validateDenebTemplate = (template: unknown): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const metadata: Record<string, unknown> = {};

  // Check if template is an object
  if (!template || typeof template !== 'object') {
    return {
      valid: false,
      errors: ['Template must be a valid JSON object'],
      warnings,
      metadata,
    };
  }

  const tmpl = template as Record<string, unknown>;

  // Validate required fields
  if (!tmpl.name || typeof tmpl.name !== 'string') {
    errors.push('Template must have a "name" property (string)');
  } else {
    metadata.name = tmpl.name;
  }

  // Validate optional description
  if (tmpl.description && typeof tmpl.description !== 'string') {
    errors.push('Description must be a string');
  }

  // Validate metadata if present
  if (tmpl.metadata && typeof tmpl.metadata === 'object') {
    validateMetadata(tmpl.metadata as Record<string, unknown>, errors, warnings);
  }

  // Validate data configuration
  if (tmpl.dataConfig && Array.isArray(tmpl.dataConfig)) {
    validateDataConfig(tmpl.dataConfig, errors, warnings);
  }

  // Validate parameters
  if (tmpl.parameters && Array.isArray(tmpl.parameters)) {
    validateParameters(tmpl.parameters, errors, warnings);
  }

  // Validate Vega or Vega-Lite spec (vegaLite, vega, or template field)
  const vegaSpec = (tmpl.vegaLite || tmpl.vega || tmpl.template) as unknown;
  if (!vegaSpec) {
    errors.push('Template must include a "vegaLite", "vega", or "template" field with specification');
  } else if (typeof vegaSpec === 'object') {
    validateSpec(vegaSpec, errors, warnings);
  } else {
    errors.push('Vega/Vega-Lite specification must be an object');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata,
  };
};

/**
 * Validates metadata structure
 */
const validateMetadata = (
  metadata: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void => {
  if (metadata.version && typeof metadata.version !== 'string') {
    errors.push('Metadata.version must be a string');
  }

  if (metadata.author && typeof metadata.author !== 'string') {
    errors.push('Metadata.author must be a string');
  }

  if (metadata.license && typeof metadata.license !== 'string') {
    errors.push('Metadata.license must be a string');
  }

  if (metadata.tags && !Array.isArray(metadata.tags)) {
    errors.push('Metadata.tags must be an array');
  }
};

/**
 * Validates data configuration
 */
const validateDataConfig = (
  dataConfig: unknown[],
  errors: string[],
  warnings: string[]
): void => {
  dataConfig.forEach((config, index) => {
    if (!config || typeof config !== 'object') {
      errors.push(`dataConfig[${index}] must be an object`);
      return;
    }

    const cfg = config as Record<string, unknown>;
    if (!cfg.name || typeof cfg.name !== 'string') {
      errors.push(`dataConfig[${index}].name is required and must be a string`);
    }

    if (cfg.type && typeof cfg.type !== 'string') {
      errors.push(`dataConfig[${index}].type must be a string`);
    }

    if (cfg.required && typeof cfg.required !== 'boolean') {
      warnings.push(`dataConfig[${index}].required should be a boolean`);
    }
  });
};

/**
 * Validates template parameters
 */
const validateParameters = (
  parameters: unknown[],
  errors: string[],
  warnings: string[]
): void => {
  parameters.forEach((param, index) => {
    if (!param || typeof param !== 'object') {
      errors.push(`parameters[${index}] must be an object`);
      return;
    }

    const p = param as Record<string, unknown>;
    if (!p.name || typeof p.name !== 'string') {
      errors.push(`parameters[${index}].name is required and must be a string`);
    }

    if (!p.type || typeof p.type !== 'string') {
      errors.push(`parameters[${index}].type is required and must be a string`);
    }
  });
};

/**
 * Validates Vega or Vega-Lite specification structure
 */
const validateSpec = (
  spec: unknown,
  errors: string[],
  warnings: string[]
): void => {
  if (typeof spec !== 'object' || spec === null) {
    errors.push('Specification must be a valid object');
    return;
  }

  const s = spec as Record<string, unknown>;

  // Detect if this is a Vega (v5) or Vega-Lite spec
  const isVegaSpec = s.$schema?.toString().includes('vega/v5') || 
                     ('marks' in s && Array.isArray(s.marks));

  if (isVegaSpec) {
    // Validate Vega spec
    validateVegaSpec(s, errors, warnings);
  } else {
    // Validate Vega-Lite spec
    validateVegaLiteSpec(s, errors, warnings);
  }
};

/**
 * Validates Vega specification structure
 */
const validateVegaSpec = (
  s: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void => {
  // Check for basic Vega structure
  const hasData = 'data' in s;
  const hasMarks = 'marks' in s;

  if (!hasMarks) {
    errors.push('Vega spec should have "marks" property');
  }

  // Validate data structure if present
  if (hasData && Array.isArray(s.data)) {
    const dataArray = s.data as unknown[];
    dataArray.forEach((dataSource, index) => {
      if (typeof dataSource === 'object' && dataSource !== null) {
        const ds = dataSource as Record<string, unknown>;
        if (!ds.name) {
          warnings.push(`Vega data[${index}] should have a "name" property`);
        }
      }
    });
  } else if (hasData && !Array.isArray(s.data)) {
    errors.push('Vega spec data must be an array of data sources');
  }
};

/**
 * Validates Vega-Lite specification structure
 */
const validateVegaLiteSpec = (
  s: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void => {
  // Check for basic Vega-Lite structure
  const hasData = 'data' in s;
  const hasMark = 'mark' in s;
  const hasEncoding = 'encoding' in s;
  const hasLayer = 'layer' in s;

  // At minimum, should have mark and either data or encoding
  if (!hasMark && !hasLayer) {
    errors.push('Vega-Lite spec must have "mark" or "layer" property');
  }

  if (!hasData && !hasEncoding && !hasLayer) {
    warnings.push('Vega-Lite spec should have "data", "encoding", or "layer" property');
  }

  // Validate data structure if present
  if (hasData && s.data !== null && typeof s.data === 'object') {
    const data = s.data as Record<string, unknown>;
    if ('url' in data && typeof data.url !== 'string') {
      errors.push('Vega-Lite data.url must be a string');
    }
    if ('values' in data && !Array.isArray(data.values) && typeof data.values !== 'object') {
      errors.push('Vega-Lite data.values must be an array or object');
    }
  }
};

/**
 * Validates data against a data configuration
 */
export const validateDataAgainstConfig = (
  data: unknown,
  config: DenebDataConfig
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config) {
    return {
      valid: false,
      errors: ['Data configuration is required'],
      warnings,
      metadata: {},
    };
  }

  // Check if data matches required type
  if (!data && config.required) {
    errors.push(`Data for "${config.name}" is required but missing`);
  }

  // If data exists, validate it
  if (data) {
    // If expecting array of objects
    if (Array.isArray(data)) {
      if (data.length === 0) {
        warnings.push(`Data array for "${config.name}" is empty`);
      }
      // Validate first record structure
      if (data.length > 0 && typeof data[0] === 'object') {
        validateObjectStructure(data[0], config, errors);
      }
    } else if (typeof data === 'object') {
      validateObjectStructure(data, config, errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata: { dataName: config.name },
  };
};

/**
 * Validates object structure against data config
 */
const validateObjectStructure = (
  obj: unknown,
  config: DenebDataConfig,
  errors: string[]
): void => {
  if (!obj || typeof obj !== 'object') {
    errors.push(`Data for "${config.name}" must be an object`);
    return;
  }

  // If sampleData exists, validate structure matches
  if (config.sampleData) {
    const sampleRecord = Array.isArray(config.sampleData)
      ? config.sampleData[0]
      : config.sampleData;

    if (typeof sampleRecord === 'object' && sampleRecord !== null) {
      const sampleKeys = Object.keys(sampleRecord);
      const dataKeys = Object.keys(obj);

      sampleKeys.forEach((key) => {
        if (!dataKeys.includes(key)) {
          errors.push(
            `Data for "${config.name}" is missing required field: "${key}"`
          );
        }
      });
    }
  }
};

/**
 * Validates that all required fields in a template are present
 */
export const validateRequiredFields = (template: DenebTemplate): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!template.name) {
    errors.push('Template name is required');
  }

  const vegaSpec = template.vegaLite || template.vega || template.template;
  if (!vegaSpec) {
    errors.push('Template must include Vega or Vega-Lite specification');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata: { name: template.name },
  };
};
