import { DenebTemplate } from '../deneb/types';

export interface TemplatePlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  tags?: string[];
  template: DenebTemplate;
  created: string;
  updated?: string;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  tags?: string[];
}
