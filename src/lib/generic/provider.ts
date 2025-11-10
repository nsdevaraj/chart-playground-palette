/**
 * Generic Template Provider
 * 
 * Implements the TemplateDataProvider interface for generic code templates
 * (HTML/CSS/JS charts like Highcharts, ECharts, D3, etc.)
 */

import { TemplateDataProvider, TemplateField, GenericTemplate } from '../template';

export interface GenericCodeTemplate extends GenericTemplate {
  html?: string;
  css?: string;
  js?: string;
}

/**
 * Generic template field extractor
 */
export class GenericTemplateProvider implements TemplateDataProvider {
  getProviderType(): string {
    return 'generic';
  }

  supportsTemplate(template: GenericTemplate): boolean {
    // Support any template that doesn't match specific providers
    // Or has generic metadata without specific provider fields
    const codeTemplate = template as GenericCodeTemplate;
    
    // If it has html/css/js, it's a code template
    if (codeTemplate.html || codeTemplate.css || codeTemplate.js) {
      return true;
    }
    
    // If it's a basic template with just name/description/metadata, support it
    if (template.name && !('vegaLite' in template) && !('vega' in template) && !('diagram' in template)) {
      return true;
    }
    
    return false;
  }

  extractFields(template: GenericTemplate): TemplateField[] {
    // For generic templates, return empty fields or basic inferred fields
    // The CSV mapper will allow users to create any custom mappings
    const fields: TemplateField[] = [];
    
    // We could potentially parse the JS code to extract variable names,
    // but for simplicity, we'll return an empty array and let users
    // define their own mappings
    
    // Return some common field suggestions
    fields.push(
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Label or category field'
      },
      {
        name: 'value',
        type: 'number',
        required: false,
        description: 'Numeric value field'
      },
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Category grouping field'
      },
      {
        name: 'date',
        type: 'date',
        required: false,
        description: 'Date or time field'
      }
    );
    
    return fields;
  }
}

/**
 * Create a Generic template provider instance
 */
export const createGenericTemplateProvider = (): TemplateDataProvider => {
  return new GenericTemplateProvider();
};
