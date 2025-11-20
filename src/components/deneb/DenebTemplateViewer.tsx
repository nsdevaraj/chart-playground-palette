/**
 * Deneb Template Viewer Component
 * 
 * React component for displaying and interacting with Deneb templates
 */

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, AlertCircle, Package } from 'lucide-react';
import { toast } from 'sonner';
import { DenebTemplate } from '@/lib/deneb/types';
import {
  generateIFrameHTML,
  createTemplatePreviewHTML,
} from '@/lib/deneb/renderer';
import { exportTemplateAsPlugin } from '@/lib/plugins/utils';

interface DenebTemplateViewerProps {
  template: DenebTemplate;
  data?: Record<string, unknown>[] | unknown;
  height?: number | string;
  width?: number | string;
  showMetadata?: boolean;
}

/**
 * Component for viewing Deneb templates with live preview
 */
export const DenebTemplateViewer: React.FC<DenebTemplateViewerProps> = ({
  template,
  data,
  height = 500,
  width = '100%',
  showMetadata = true,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHtml, setIframeHtml] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [showSpecs, setShowSpecs] = useState(false);

  useEffect(() => {
    const html = generateIFrameHTML(template, data);
    setIframeHtml(html);
    const preview = createTemplatePreviewHTML(template, data);
    setPreviewHtml(preview);
  }, [template, data]);

  useEffect(() => {
    if (!iframeRef.current || !iframeHtml) return;

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(iframeHtml);
      doc.close();
    }
  }, [iframeHtml]);

  const handleDownloadHTML = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml));
    element.setAttribute('download', `${template.name || 'template'}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Template downloaded as HTML');
  };

  const handleCopyJSON = () => {
    const json = JSON.stringify(template, null, 2);
    navigator.clipboard.writeText(json);
    toast.success('Template JSON copied to clipboard');
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Visualization Preview</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJSON}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadHTML}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportTemplateAsPlugin(template)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Export Plugin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  width,
                  height,
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'auto',
                }}
              >
                <iframe
                  ref={iframeRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title={`${template.name} preview`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs">
          <Card>
            <CardHeader>
              <CardTitle>Vega-Lite Specification</CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                className="bg-muted p-4 rounded overflow-auto max-h-96 text-xs"
                style={{ fontFamily: 'monospace' }}
              >
                {JSON.stringify(template.vegaLite || template.vega || template.template, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showMetadata && template.metadata && (
                <div className="space-y-3">
                  {template.metadata.name && (
                    <div>
                      <label className="text-sm font-semibold">Name</label>
                      <p className="text-sm text-muted-foreground">
                        {template.metadata.name}
                      </p>
                    </div>
                  )}

                  {template.metadata.description && (
                    <div>
                      <label className="text-sm font-semibold">Description</label>
                      <p className="text-sm text-muted-foreground">
                        {template.metadata.description}
                      </p>
                    </div>
                  )}

                  {template.metadata.author && (
                    <div>
                      <label className="text-sm font-semibold">Author</label>
                      <p className="text-sm text-muted-foreground">
                        {template.metadata.author}
                      </p>
                    </div>
                  )}

                  {template.metadata.license && (
                    <div>
                      <label className="text-sm font-semibold">License</label>
                      <p className="text-sm text-muted-foreground">
                        {template.metadata.license}
                      </p>
                    </div>
                  )}

                  {template.metadata.tags && template.metadata.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {template.metadata.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {template.dataConfig && template.dataConfig.length > 0 && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Data Configuration
                  </label>
                  <div className="space-y-2">
                    {template.dataConfig.map((config) => (
                      <div
                        key={config.name}
                        className="p-3 bg-muted rounded text-sm"
                      >
                        <p className="font-medium">{config.name}</p>
                        {config.description && (
                          <p className="text-muted-foreground text-xs">
                            {config.description}
                          </p>
                        )}
                        {config.type && (
                          <p className="text-muted-foreground text-xs">
                            Type: {config.type}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {template.parameters && template.parameters.length > 0 && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Parameters
                  </label>
                  <div className="space-y-2">
                    {template.parameters.map((param) => (
                      <div
                        key={param.name}
                        className="p-3 bg-muted rounded text-sm"
                      >
                        <p className="font-medium">{param.name}</p>
                        {param.description && (
                          <p className="text-muted-foreground text-xs">
                            {param.description}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          Type: {param.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DenebTemplateViewer;
