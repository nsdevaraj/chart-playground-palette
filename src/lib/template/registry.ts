/**
 * Template Provider Registry
 * 
 * Manages template providers and provides a unified interface for working with
 * different template types.
 */

import { TemplateDataProvider, TemplateField, GenericTemplate, TypedTemplate } from './template';
import { createDenebTemplateProvider } from '../deneb/provider';
import { createMermaidTemplateProvider } from '../mermaid/provider';
import { DenebTemplate } from '../deneb/types';
import { MermaidTemplate } from '../mermaid/types';

// Export providers for direct use
export { createDenebTemplateProvider, createMermaidTemplateProvider };
export type { DenebTemplate, MermaidTemplate };

/**
 * Template Provider Registry
 */
export class TemplateProviderRegistry {
  private providers: Map<string, TemplateDataProvider> = new Map();

  constructor() {
    // Register built-in providers
    this.registerProvider('deneb', createDenebTemplateProvider());
    this.registerProvider('mermaid', createMermaidTemplateProvider());
  }

  /**
   * Register a new template provider
   */
  registerProvider(type: string, provider: TemplateDataProvider): void {
    this.providers.set(type, provider);
  }

  /**
   * Get a provider by type
   */
  getProvider(type: string): TemplateDataProvider | undefined {
    return this.providers.get(type);
  }

  /**
   * Get all registered provider types
   */
  getProviderTypes(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Detect the type of a template
   */
  detectTemplateType(template: GenericTemplate): string | null {
    for (const [type, provider] of this.providers) {
      if (provider.supportsTemplate(template)) {
        return type;
      }
    }
    return null;
  }

  /**
   * Extract fields from any template
   */
  extractFields(template: GenericTemplate): TemplateField[] {
    const type = this.detectTemplateType(template);
    
    if (!type) {
      throw new Error('Unable to detect template type');
    }

    const provider = this.getProvider(type);
    if (!provider) {
      throw new Error(`No provider found for template type: ${type}`);
    }

    return provider.extractFields(template);
  }

  /**
   * Create a typed template
   */
  createTypedTemplate(template: DenebTemplate): TypedTemplate & { template: DenebTemplate };
  createTypedTemplate(template: MermaidTemplate): TypedTemplate & { template: MermaidTemplate };
  createTypedTemplate(template: GenericTemplate): TypedTemplate;
  createTypedTemplate(template: GenericTemplate): TypedTemplate {
    const type = this.detectTemplateType(template);
    
    if (!type) {
      throw new Error('Unable to detect template type');
    }

    return {
      ...template,
      type: type as any,
      template
    };
  }
}

/**
 * Global template provider registry instance
 */
export const templateRegistry = new TemplateProviderRegistry();

/**
 * Convenience function to extract fields from any template
 */
export const extractTemplateFields = (template: GenericTemplate): TemplateField[] => {
  return templateRegistry.extractFields(template);
};

/**
 * Convenience function to detect template type
 */
export const detectTemplateType = (template: GenericTemplate): string | null => {
  return templateRegistry.detectTemplateType(template);
};

/**
 * Convenience function to create a typed template
 */
export const createTypedTemplate = (template: GenericTemplate): TypedTemplate => {
  return templateRegistry.createTypedTemplate(template);
};