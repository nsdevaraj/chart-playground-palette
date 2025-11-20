import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Play, FileJson } from 'lucide-react';
import { TemplatePlugin } from '@/lib/plugins/types';

interface PluginCardProps {
    plugin: TemplatePlugin;
    onDelete: (id: string) => void;
    onUse: (plugin: TemplatePlugin) => void;
}

export const PluginCard: React.FC<PluginCardProps> = ({ plugin, onDelete, onUse }) => {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        <CardDescription className="text-xs">v{plugin.version}</CardDescription>
                    </div>
                    <Badge variant="outline">{plugin.template.metadata?.author || 'Unknown'}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {plugin.description}
                </p>
                <div className="flex flex-wrap gap-1">
                    {plugin.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={() => onDelete(plugin.id)} className="text-destructive hover:text-destructive/90">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                </Button>
                <Button size="sm" onClick={() => onUse(plugin)}>
                    <Play className="w-4 h-4 mr-2" />
                    Use Template
                </Button>
            </CardFooter>
        </Card>
    );
};
