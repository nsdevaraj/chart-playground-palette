/**
 * Mermaid Template Module
 *
 * This module provides types and utilities for loading, validating, and rendering
 * Mermaid diagrams (text-based diagram specification).
 *
 * Mermaid is a JavaScript-based diagramming and charting tool.
 * Reference: https://mermaid.js.org/
 */

/**
 * Mermaid Diagram Types
 */
export type MermaidDiagramType =
  | "flowchart"
  | "sequence"
  | "class"
  | "state"
  | "er"
  | "journey"
  | "gantt"
  | "pie"
  | "graph"
  | "mindmap"
  | "timeline"
  | "block"
  | "gitGraph"
  | "requirement";

/**
 * Mermaid Template Metadata
 */
export interface MermaidTemplateMetadata {
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
 * Mermaid Configuration
 */
export interface MermaidConfig {
  theme?: string;
  fontFamily?: string;
  fontSize?: number;
  darkMode?: boolean;
  startOnLoad?: boolean;
  securityLevel?: "loose" | "antiscript" | "strict" | "sandbox";
  [key: string]: unknown;
}

/**
 * Mermaid Template Structure
 */
export interface MermaidTemplate {
  name: string;
  description?: string;
  version?: string;
  metadata?: MermaidTemplateMetadata;
  diagramType: MermaidDiagramType;
  diagram: string;
  config?: MermaidConfig;
}

/**
 * Mermaid Diagram Validation Result
 */
export interface MermaidValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Rendered Mermaid Result
 */
export interface RenderedMermaidTemplate {
  diagram: string;
  diagramType: MermaidDiagramType;
  config?: MermaidConfig;
  metadata?: MermaidTemplateMetadata;
}
