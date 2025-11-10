/**
 * Deneb Template Provider
 * 
 * Implements the TemplateDataProvider interface for Deneb templates
 */

import { TemplateDataProvider, TemplateField, GenericTemplate } from '../template';
import { DenebTemplate } from './types';

/**
 * Deneb template field extractor
 */
export class DenebTemplateProvider implements TemplateDataProvider {
  getProviderType(): string {
    return 'deneb';
  }

  supportsTemplate(template: GenericTemplate): boolean {
    const denebTemplate = template as DenebTemplate;
    return !!(denebTemplate.vegaLite || denebTemplate.vega || denebTemplate.template);
  }

  extractFields(template: GenericTemplate): TemplateField[] {
    const denebTemplate = template as DenebTemplate;
    const fields: TemplateField[] = [];
    
    // Extract from data config
    if (denebTemplate.dataConfig) {
      denebTemplate.dataConfig.forEach(config => {
        fields.push({
          name: config.name,
          type: config.type || 'string',
          required: config.required || false,
          description: config.description,
          sampleValue: config.sampleData
        });
      });
    }
    
    // Extract from Vega-Lite specification
    if (denebTemplate.vegaLite) {
      const spec = denebTemplate.vegaLite;
      
      // Extract from encoding
      if (spec.encoding) {
        Object.entries(spec.encoding).forEach(([channel, encoding]) => {
          if (typeof encoding === 'object' && encoding !== null && 'field' in encoding) {
            const field = (encoding as any).field;
            if (field && typeof field === 'string') {
              const type = (encoding as any).type;
              fields.push({
                name: field,
                type: type === 'quantitative' ? 'quantitative' : 
                      type === 'nominal' ? 'nominal' : 
                      type === 'temporal' ? 'temporal' : 'string',
                required: true, // Fields in encoding are typically required
                description: `Data field for ${channel} channel`
              });
            }
          }
        });
      }
      
      // Extract from transforms
      if (spec.transform && Array.isArray(spec.transform)) {
        spec.transform.forEach(transform => {
          if (typeof transform === 'object' && transform !== null) {
            // Handle aggregate transforms
            if ('aggregate' in transform && 'field' in transform) {
              fields.push({
                name: (transform as any).field,
                type: 'quantitative', // Aggregates are typically numeric
                required: true,
                description: 'Field used in aggregate transform'
              });
            }
            
            // Handle calculate transforms
            if ('calculate' in transform && 'as' in transform) {
              fields.push({
                name: (transform as any).as,
                type: 'string', // Calculated fields can be any type
                required: false,
                description: 'Calculated field'
              });
            }
          }
        });
      }
    }
    
    // Extract from Vega specification
    if (denebTemplate.vega) {
      const spec = denebTemplate.vega;
      
      // Extract from data signals
      if (spec.signals && Array.isArray(spec.signals)) {
        spec.signals.forEach(signal => {
          if (typeof signal === 'object' && signal !== null && 'name' in signal) {
            fields.push({
              name: (signal as any).name,
              type: 'string',
              required: false,
              description: 'Signal data field'
            });
          }
        });
      }
      
      // Extract from data transforms
      if (spec.data && Array.isArray(spec.data)) {
        spec.data.forEach(data => {
          if (typeof data === 'object' && data !== null && 'name' in data) {
            fields.push({
              name: (data as any).name,
              type: 'string',
              required: true,
              description: 'Data source'
            });
          }
        });
      }
    }
    
    // Remove duplicates while preserving order
    const uniqueFields = fields.filter((field, index, self) =>
      index === self.findIndex(f => f.name === field.name)
    );
    
    return uniqueFields;
  }
}

/**
 * Create a Deneb template provider instance
 */
export const createDenebTemplateProvider = (): TemplateDataProvider => {
  return new DenebTemplateProvider();
};