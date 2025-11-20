import React, { useEffect, useState } from 'react';
import { PluginCard } from './PluginCard';
import { PluginUploader } from './PluginUploader';
import { pluginRegistry } from '@/lib/plugins/registry';
import { TemplatePlugin } from '@/lib/plugins/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface PluginManagerProps {
    onUseTemplate: (plugin: TemplatePlugin) => void;
    className?: string;
}

export const PluginManager: React.FC<PluginManagerProps> = ({ onUseTemplate, className }) => {
    const [plugins, setPlugins] = useState<TemplatePlugin[]>([]);

    useEffect(() => {
        // Initial load
        setPlugins(pluginRegistry.getAll());

        // Subscribe to changes
        const unsubscribe = pluginRegistry.subscribe((updatedPlugins) => {
            setPlugins(updatedPlugins);
        });

        return unsubscribe;
    }, []);

    const handlePluginLoaded = (plugin: TemplatePlugin) => {
        pluginRegistry.register(plugin);
        toast.success('Plugin added to library');
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this plugin?')) {
            pluginRegistry.unregister(id);
            toast.success('Plugin removed');
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Template Plugins</h2>
                    <p className="text-muted-foreground">
                        Manage portable templates and extend your chart library.
                    </p>
                </div>
                <PluginUploader onPluginLoaded={handlePluginLoaded} />
            </div>

            {plugins.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No plugins installed</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Upload a template JSON file to get started. You can export templates from other projects or create your own.
                        </p>
                        <PluginUploader onPluginLoaded={handlePluginLoaded} />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plugins.map(plugin => (
                        <PluginCard
                            key={plugin.id}
                            plugin={plugin}
                            onDelete={handleDelete}
                            onUse={onUseTemplate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
