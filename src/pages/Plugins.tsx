import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PluginManager } from '@/components/plugins';
import { TemplatePlugin } from '@/lib/plugins/types';
import { useToast } from '@/components/ui/use-toast';

const Plugins = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleUseTemplate = (plugin: TemplatePlugin) => {
        // Navigate to the CSV workflow with the selected template
        // We'll pass the template via state or a query param, or we could store it in a global context
        // For now, let's use state
        navigate('/csv-workflow', { state: { template: plugin.template } });
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <PluginManager onUseTemplate={handleUseTemplate} />
        </div>
    );
};

export default Plugins;
