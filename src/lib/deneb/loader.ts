/**
 * Deneb Template Loader
 * 
 * Provides functionality to load and parse Deneb templates from various sources:
 * - JSON strings
 * - Objects
 * - URLs/files
 * - Base64 encoded templates
 */

import { DenebTemplate, VegaLiteSpec } from './types';
import { validateDenebTemplate } from './validation';

/**
 * Loads a Deneb template from a JSON string
 */
export const loadTemplateFromJSON = (jsonString: string): DenebTemplate | null => {
  try {
    const parsed = JSON.parse(jsonString);
    return normalizeTemplate(parsed);
  } catch (error) {
    console.error('Failed to parse template JSON:', error);
    return null;
  }
};

/**
 * Loads a Deneb template from an object
 */
export const loadTemplateFromObject = (obj: unknown): DenebTemplate | null => {
  try {
    if (!obj || typeof obj !== 'object') {
      console.error('Template object must be a valid object');
      return null;
    }

    const normalized = normalizeTemplate(obj);
    return normalized;
  } catch (error) {
    console.error('Failed to load template object:', error);
    return null;
  }
};

/**
 * Loads a Deneb template from a URL
 */
export const loadTemplateFromURL = async (url: string): Promise<DenebTemplate | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeTemplate(data);
  } catch (error) {
    console.error('Failed to load template from URL:', error);
    return null;
  }
};

/**
 * Loads a Deneb template from Base64 encoded JSON
 */
export const loadTemplateFromBase64 = (base64String: string): DenebTemplate | null => {
  try {
    const jsonString = atob(base64String);
    return loadTemplateFromJSON(jsonString);
  } catch (error) {
    console.error('Failed to decode Base64 template:', error);
    return null;
  }
};

/**
 * Normalizes a template object to ensure consistent structure
 * Handles both old and new Deneb template formats
 */
export const normalizeTemplate = (template: unknown): DenebTemplate | null => {
  if (!template || typeof template !== 'object') {
    return null;
  }

  const tmpl = template as Record<string, unknown>;

  // If template only contains vegaLite or template (Vega-Lite spec),
  // wrap it in the Deneb template structure
  if (!tmpl.name && (tmpl.mark || tmpl.data)) {
    const vegaSpec = tmpl as VegaLiteSpec;
    return {
      name: tmpl.$schema ? (tmpl.$schema as string).split('/').pop() || 'Unnamed' : 'Unnamed Visualization',
      template: vegaSpec,
      metadata: {
        name: 'Imported Vega-Lite Specification',
        description: vegaSpec.description,
      },
    };
  }

  // Handle different template field names
  const vegaLiteSpec = (tmpl.vegaLite || tmpl.template) as VegaLiteSpec | undefined;

  return {
    name: (tmpl.name as string) || 'Unnamed Template',
    description: (tmpl.description as string) || undefined,
    version: (tmpl.version as string) || undefined,
    metadata: (tmpl.metadata as Record<string, unknown>) || undefined,
    dataConfig: (tmpl.dataConfig as unknown[]) || undefined,
    parameters: (tmpl.parameters as unknown[]) || undefined,
    config: (tmpl.config as Record<string, unknown>) || undefined,
    vegaLite: vegaLiteSpec,
    template: !vegaLiteSpec && (tmpl.template as VegaLiteSpec) ? (tmpl.template as VegaLiteSpec) : undefined,
  };
};

/**
 * Validates that a template can be loaded
 */
export const canLoadTemplate = (template: unknown): boolean => {
  const result = validateDenebTemplate(template);
  return result.valid;
};

/**
 * Gets the Vega-Lite specification from a Deneb template
 */
export const getVegaLiteSpec = (template: DenebTemplate): VegaLiteSpec | null => {
  if (!template) return null;

  // Try vegaLite field first, then template field
  const spec = template.vegaLite || template.template;

  if (!spec) {
    console.warn('No Vega-Lite specification found in template');
    return null;
  }

  return spec;
};

/**
 * Merges template parameters with Vega-Lite spec
 * This allows runtime parameter customization
 */
export const applyParametersToTemplate = (
  template: DenebTemplate,
  parameters: Record<string, unknown>
): VegaLiteSpec | null => {
  const vegaSpec = getVegaLiteSpec(template);
  if (!vegaSpec) return null;

  // Deep clone the spec
  const mergedSpec = JSON.parse(JSON.stringify(vegaSpec)) as VegaLiteSpec;

  // Apply parameters to config if present
  if (parameters && Object.keys(parameters).length > 0) {
    if (!mergedSpec.config) {
      mergedSpec.config = {};
    }

    // Merge parameter values into config
    Object.assign(mergedSpec.config as Record<string, unknown>, parameters);
  }

  return mergedSpec;
};

/**
 * Extracts data from a template specification
 */
export const extractDataFromTemplate = (
  template: DenebTemplate
): Record<string, unknown>[] | unknown | null => {
  const vegaSpec = getVegaLiteSpec(template);
  if (!vegaSpec) return null;

  if (vegaSpec.data) {
    const data = vegaSpec.data as Record<string, unknown>;

    // If data has values, return them
    if ('values' in data && Array.isArray(data.values)) {
      return data.values;
    }

    // If data has url, it needs to be fetched externally
    if ('url' in data) {
      console.warn('Template uses external data URL:', data.url);
      return null;
    }

    return data;
  }

  return null;
};

/**
 * Creates a sample Deneb template for reference
 */
export const createSampleTemplate = (name: string = 'Sample Chart'): DenebTemplate => {
  return {
    name,
    description: 'A sample Deneb template with basic bar chart',
    version: '1.0.0',
    metadata: {
      name,
      author: 'ChartStudio',
      tags: ['sample', 'bar-chart'],
    },
    dataConfig: [
      {
        name: 'data',
        description: 'Main data for the visualization',
        type: 'array',
        required: true,
        sampleData: [
          { category: 'A', value: 100 },
          { category: 'B', value: 200 },
          { category: 'C', value: 150 },
        ],
      },
    ],
    vegaLite: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      title: name,
      width: 400,
      height: 300,
      data: {
        values: [
          { category: 'A', value: 100 },
          { category: 'B', value: 200 },
          { category: 'C', value: 150 },
          { category: 'D', value: 180 },
          { category: 'E', value: 140 },
        ],
      },
      mark: 'bar',
      encoding: {
        x: { field: 'category', type: 'nominal' },
        y: { field: 'value', type: 'quantitative' },
        color: { field: 'value', type: 'quantitative' },
      },
    },
  };
};
