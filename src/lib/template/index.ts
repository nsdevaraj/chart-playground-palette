/**
 * Generic Template System
 * 
 * Provides common interfaces and utilities for working with different template types
 * (Deneb, Mermaid, etc.) in a provider-agnostic way.
 */

export * from './registry';

/**
 * Template Field Definition
 * Describes a data field that a template expects
 */
export interface TemplateField {
  name: string;
  type?: string;
  required?: boolean;
  description?: string;
  sampleValue?: unknown;
}

/**
 * Template Metadata
 * Common metadata across all template types
 */
export interface TemplateMetadata {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  license?: string;
  tags?: string[];
  created?: string;
  updated?: string;
}

/**
 * Generic Template Interface
 * All template providers should implement this interface
 */
export interface GenericTemplate {
  name: string;
  description?: string;
  metadata?: TemplateMetadata;
  version?: string;
  sampleData?: Record<string, unknown>[] | Record<string, unknown>;
}

/**
 * Template Data Provider Interface
 * Defines how a template type provides data field information
 */
export interface TemplateDataProvider {
  /**
   * Extract data field requirements from a template
   */
  extractFields(template: GenericTemplate): TemplateField[];
  
  /**
   * Get the provider type identifier
   */
  getProviderType(): string;
  
  /**
   * Check if a template is supported by this provider
   */
  supportsTemplate(template: GenericTemplate): boolean;
}

/**
 * Template Type Discriminator
 * Helps identify the type of template
 */
export type TemplateType = 'deneb' | 'mermaid' | 'generic';

/**
 * Template with type information
 */
export interface TypedTemplate extends GenericTemplate {
  type: TemplateType;
}