/**
 * Deneb Template Module
 * 
 * This module provides types and utilities for loading, validating, and rendering
 * Deneb templates (Vega-Lite based visualization specifications).
 * 
 * Deneb is a Power BI visualization tool that uses Vega-Lite specifications.
 * Reference: https://github.com/deneb-viz/deneb
 */

/**
 * Deneb Template Metadata
 * Contains information about a Deneb template
 */
export interface DenebTemplateMetadata {
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
 * Data Configuration for Deneb Templates
 * Specifies how data should be provided to the template
 */
export interface DenebDataConfig {
  name: string;
  description?: string;
  type?: string;
  required?: boolean;
  sampleData?: Record<string, unknown>[] | unknown;
}

/**
 * Parameter Configuration for Deneb Templates
 * Allows customization of template behavior
 */
export interface DenebParameter {
  name: string;
  type: string;
  description?: string;
  default?: unknown;
  required?: boolean;
  options?: unknown[];
}

/**
 * Vega-Lite Specification
 * Complete Vega-Lite visualization specification
 */
export interface VegaLiteSpec {
  $schema?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  data?: unknown;
  mark?: unknown;
  encoding?: unknown;
  transform?: unknown[];
  layer?: unknown[];
  config?: unknown;
  resolve?: unknown;
  [key: string]: unknown;
}

/**
 * Deneb Template Structure
 * Complete Deneb template including metadata, config, and Vega-Lite spec
 */
export interface DenebTemplate {
  $schema?: string;
  name: string;
  description?: string;
  metadata?: DenebTemplateMetadata;
  dataConfig?: DenebDataConfig[];
  parameters?: DenebParameter[];
  config?: Record<string, unknown>;
  vegaLite?: VegaLiteSpec;
  template?: VegaLiteSpec;
  version?: string;
}

/**
 * Deneb Template Validation Result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: Record<string, unknown>;
}

/**
 * Data Binding Configuration
 * Specifies how data fields map to Vega-Lite encoding channels
 */
export interface DataBinding {
  field: string;
  channel: string;
  type?: string;
}

/**
 * Rendered Template Result
 */
export interface RenderedTemplate {
  spec: VegaLiteSpec;
  data: Record<string, unknown>[] | unknown;
  metadata: DenebTemplateMetadata;
  parameters?: Record<string, unknown>;
}
