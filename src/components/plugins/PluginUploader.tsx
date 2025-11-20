import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { TemplatePlugin } from '@/lib/plugins/types';
import { v4 as uuidv4 } from 'uuid';
import { DenebTemplate } from '@/lib/deneb/types';

interface PluginUploaderProps {
    onPluginLoaded: (plugin: TemplatePlugin) => void;
}

export const PluginUploader: React.FC<PluginUploaderProps> = ({ onPluginLoaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const json = JSON.parse(content);

                // Basic validation
                // It could be a direct DenebTemplate or a wrapped TemplatePlugin
                let plugin: TemplatePlugin;

                if (json.template && json.id) {
                    // It's likely already a TemplatePlugin structure
                    plugin = json as TemplatePlugin;
                } else if (json.vegaLite || json.vega || json.specification) {
                    // It's a raw DenebTemplate, wrap it
                    const template = json as DenebTemplate;
                    plugin = {
                        id: uuidv4(),
                        name: template.name || 'Untitled Template',
                        version: template.version || '1.0.0',
                        description: template.description || 'Imported template',
                        author: template.metadata?.author,
                        tags: template.metadata?.tags,
                        template: template,
                        created: new Date().toISOString()
                    };
                } else {
                    throw new Error('Invalid template format');
                }

                onPluginLoaded(plugin);
                toast.success(`Loaded plugin: ${plugin.name}`);

                // Reset input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to parse plugin file');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                <Upload className="w-4 h-4 mr-2" />
                Import Plugin
            </Button>
        </div>
    );
};
