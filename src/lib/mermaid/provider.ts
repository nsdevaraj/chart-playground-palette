/**
 * Mermaid Template Provider
 * 
 * Implements the TemplateDataProvider interface for Mermaid templates
 */

import { TemplateDataProvider, TemplateField, GenericTemplate } from '../template';
import { MermaidTemplate, MermaidDiagramType } from './types';

/**
 * Mermaid template field extractor
 */
export class MermaidTemplateProvider implements TemplateDataProvider {
  getProviderType(): string {
    return 'mermaid';
  }

  supportsTemplate(template: GenericTemplate): boolean {
    const mermaidTemplate = template as MermaidTemplate;
    return !!(mermaidTemplate.diagram && mermaidTemplate.diagramType);
  }

  extractFields(template: GenericTemplate): TemplateField[] {
    const mermaidTemplate = template as MermaidTemplate;
    const fields: TemplateField[] = [];
    
    // Extract fields based on diagram type and content
    const diagramType = mermaidTemplate.diagramType;
    const diagram = mermaidTemplate.diagram;
    
    switch (diagramType) {
      case 'flowchart':
        fields.push(...this.extractFlowchartFields(diagram));
        break;
      case 'sequence':
        fields.push(...this.extractSequenceFields(diagram));
        break;
      case 'gantt':
        fields.push(...this.extractGanttFields(diagram));
        break;
      case 'pie':
        fields.push(...this.extractPieFields(diagram));
        break;
      case 'timeline':
        fields.push(...this.extractTimelineFields(diagram));
        break;
      case 'mindmap':
        fields.push(...this.extractMindmapFields(diagram));
        break;
      default:
        fields.push(...this.extractGenericFields(diagram));
    }
    
    return fields;
  }

  private extractFlowchartFields(diagram: string): TemplateField[] {
    const fields: TemplateField[] = [];
    
    // Look for node definitions with data
    const nodeRegex = /(\w+)\[([^\]]+)\]/g;
    const matches = diagram.matchAll(nodeRegex);
    
    for (const match of matches) {
      const nodeId = match[1];
      const nodeText = match[2];
      
      fields.push({
        name: `node_${nodeId}`,
        type: 'string',
        required: false,
        description: `Data for node ${nodeId}`,
        sampleValue: nodeText
      });
    }
    
    // Look for variable patterns that might need data
    const varRegex = /\{(\w+)\}/g;
    const varMatches = diagram.matchAll(varRegex);
    
    for (const match of varMatches) {
      const varName = match[1];
      
      if (!fields.find(f => f.name === varName)) {
        fields.push({
          name: varName,
          type: 'string',
          required: true,
          description: `Variable data for ${varName}`
        });
      }
    }
    
    return fields;
  }

  private extractSequenceFields(diagram: string): TemplateField[] {
    const fields: TemplateField[] = [];
    
    // Extract participant names
    const participantRegex = /participant\s+(\w+)/g;
    const matches = diagram.matchAll(participantRegex);
    
    for (const match of matches) {
      const participant = match[1];
      fields.push({
        name: `participant_${participant}`,
        type: 'string',
        required: false,
        description: `Data for participant ${participant}`
      });
    }
    
    // Look for message patterns with data
    const messageRegex = /(\w+)\s*->>\s*(\w+)\s*:\s*([^\n]+)/g;
    const messageMatches = diagram.matchAll(messageRegex);
    
    for (const match of messageMatches) {
      const from = match[1];
      const to = match[2];
      const message = match[3];
      
      // Check if message contains variables
      const vars = message.match(/\{(\w+)\}/g);
      if (vars) {
        vars.forEach(v => {
          const varName = v.slice(1, -1); // Remove { }
          if (!fields.find(f => f.name === varName)) {
            fields.push({
              name: varName,
              type: 'string',
              required: true,
              description: `Message data for ${varName}`
            });
          }
        });
      }
    }
    
    return fields;
  }

  private extractGanttFields(diagram: string): TemplateField[] {
    const fields: TemplateField[] = [];
    
    // Extract task definitions
    const taskRegex = /(\w+)\s*:\s*([^\n,]+)/g;
    const matches = diagram.matchAll(taskRegex);
    
    for (const match of matches) {
      const taskId = match[1];
      const taskDef = match[2];
      
      fields.push({
        name: `task_${taskId}`,
        type: 'string',
        required: false,
        description: `Task data for ${taskId}`,
        sampleValue: taskDef
      });
      
      // Look for date patterns
      const dateRegex = /(\d{4}-\d{2}-\d{2})/g;
      const dateMatches = taskDef.matchAll(dateRegex);
      
      for (const dateMatch of dateMatches) {
        const date = dateMatch[1];
        fields.push({
          name: `${taskId}_date`,
          type: 'date',
          required: false,
          description: `Date for task ${taskId}`,
          sampleValue: date
        });
      }
    }
    
    return fields;
  }

  private extractPieFields(diagram: string): TemplateField[] {
    const fields: TemplateField[] = [];
    
    // Extract data from pie chart definitions
    const dataRegex = /"([^"]+)"\s*:\s*(\d+)/g;
    const matches = diagram.matchAll(dataRegex);
    
    for (const match of matches) {
      const label = match[1];
      const value = match[2];
      
      fields.push({
        name: `pie_${label.toLowerCase().replace(/\s+/g, '_')}`,
        type: 'number',
        required: false,
        description: `Pie chart value for ${label}`,
        sampleValue: parseInt(value)
      });
    }
    
    // If no structured data found, add generic fields
    if (fields.length === 0) {
      fields.push({
        name: 'pie_label',
        type: 'string',
        required: true,
        description: 'Label for pie chart slice'
      });
      
      fields.push({
        name: 'pie_value',
        type: 'number',
        required: true,
        description: 'Value for pie chart slice'
      });
    }
    
    return fields;
  }

  private extractTimelineFields(diagram: string): TemplateField[] {
    const fields: TemplateField[] = [];
    
    // Extract timeline events
    const eventRegex = /(\d{4}-\d{2}-\d{2})\s*:\s*([^\n]+)/g;
    const matches = diagram.matchAll(eventRegex);
    
    for (const match of matches) {
      const date = match[1];
      const event = match[2];
      
      fields.push({
        name: `timeline_event_${date.replace(/-/g, '')}`,
        type: 'string',
        required: false,
        description: `Timeline event data`,
        sampleValue: event
      });
      
      fields.push({
        name: `timeline_date`,
        type: 'date',
        required: false,
        description: 'Timeline event date',
        sampleValue: date
      });
    }
    
    return fields;
  }

  private extractMindmapFields(diagram: string): TemplateField[] {
    const fields: TemplateField[] = [];
    
    // Extract mindmap nodes
    const nodeRegex = /^\s*([+*])\s+(.+)$/gm;
    const matches = diagram.matchAll(nodeRegex);
    
    for (const match of matches) {
      const level = match[1];
      const text = match[2];
      
      fields.push({
        name: `mindmap_${text.toLowerCase().replace(/\s+/g, '_')}`,
        type: 'string',
        required: false,
        description: `Mindmap node data`,
        sampleValue: text
      });
    }
    
    return fields;
  }

  private extractGenericFields(diagram: string): TemplateField[] {
    const fields: TemplateField[] = [];
    
    // Look for variable patterns that might need data
    const varRegex = /\{(\w+)\}/g;
    const matches = diagram.matchAll(varRegex);
    
    for (const match of matches) {
      const varName = match[1];
      
      fields.push({
        name: varName,
        type: 'string',
        required: true,
        description: `Variable data for ${varName}`
      });
    }
    
    // If no variables found, add generic data field
    if (fields.length === 0) {
      fields.push({
        name: 'data',
        type: 'string',
        required: false,
        description: 'Generic data field for the diagram'
      });
    }
    
    return fields;
  }
}

/**
 * Create a Mermaid template provider instance
 */
export const createMermaidTemplateProvider = (): TemplateDataProvider => {
  return new MermaidTemplateProvider();
};