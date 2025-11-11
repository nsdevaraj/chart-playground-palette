/**
 * Deneb Template Provider
 * 
 * Implements the TemplateDataProvider interface for Deneb templates
 */

import { TemplateDataProvider, TemplateField, GenericTemplate } from '../template';
import { DenebTemplate } from './types';

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

interface SignalObject {
  name?: string;
  [key: string]: unknown;
}

interface DataObject {
  name?: string;
  [key: string]: unknown;
}

interface VegaSpec {
  signals?: SignalObject[];
  data?: DataObject[];
  [key: string]: unknown;
}

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
          if (transform && typeof transform === 'object') {
            const transformObj = transform as TransformObject;
            // Handle aggregate transforms
            if (transformObj.aggregate && transformObj.field) {
              fields.push({
                name: transformObj.field,
                type: 'quantitative', // Aggregates are typically numeric
                required: true,
                description: 'Field used in aggregate transform'
              });
            }
            
            // Handle calculate transforms
            if (transformObj.calculate && transformObj.as) {
              const asField = Array.isArray(transformObj.as) ? transformObj.as[0] : transformObj.as;
              if (asField) {
                fields.push({
                  name: asField,
                  type: 'string', // Calculated fields can be any type
                  required: false,
                  description: 'Calculated field'
                });
              }
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
          if (signal && typeof signal === 'object' && 'name' in signal) {
            const signalObj = signal as SignalObject;
            if (signalObj.name) {
              fields.push({
                name: signalObj.name,
                type: 'string',
                required: false,
                description: 'Signal data field'
              });
            }
          }
        });
      }
      
      // Extract from data transforms
      if (spec.data && Array.isArray(spec.data)) {
        spec.data.forEach(data => {
          if (data && typeof data === 'object' && 'name' in data) {
            const dataObj = data as DataObject;
            if (dataObj.name) {
              fields.push({
                name: dataObj.name,
                type: 'string',
                required: true,
                description: 'Data source'
              });
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
  }
}

/**
 * Create a Deneb template provider instance
 */
export const createDenebTemplateProvider = (): TemplateDataProvider => {
  return new DenebTemplateProvider();
};