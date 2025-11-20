import { DenebTemplate } from '../deneb/types';
import { TemplatePlugin } from './types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const exportTemplateAsPlugin = (template: DenebTemplate) => {
    try {
        const plugin: TemplatePlugin = {
            id: uuidv4(),
            name: template.name || 'Untitled Template',
            version: template.version || '1.0.0',
            description: template.description || 'Exported template',
            author: template.metadata?.author || 'Unknown',
            tags: template.metadata?.tags || [],
            template: template,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        };

        const json = JSON.stringify(plugin, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', `${plugin.name.replace(/\s+/g, '-').toLowerCase()}-plugin.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);

        toast.success('Template exported as plugin successfully');
    } catch (error) {
        console.error('Failed to export plugin:', error);
        toast.error('Failed to export template as plugin');
    }
};
