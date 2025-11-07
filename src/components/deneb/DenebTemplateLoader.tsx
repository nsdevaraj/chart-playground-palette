/**
 * Deneb Template Loader Component
 * 
 * React component for loading Deneb templates from various sources
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Upload, Link as LinkIcon, Copy, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { DenebTemplate, ValidationResult } from '@/lib/deneb/types';
import {
  loadTemplateFromJSON,
  loadTemplateFromURL,
  loadTemplateFromBase64,
  createSampleTemplate,
} from '@/lib/deneb/loader';
import { validateDenebTemplate } from '@/lib/deneb/validation';
import { parseCSV, CSVParseResult } from '@/lib/csv';
import { CSVUploader } from '@/components/csv';

interface DenebTemplateLoaderProps {
  onTemplateLoaded: (template: DenebTemplate) => void;
  onValidationResult?: (result: ValidationResult) => void;
  onCSVDataLoaded?: (data: Record<string, unknown>[]) => void;
}

/**
 * Component for loading Deneb templates
 */
export const DenebTemplateLoader: React.FC<DenebTemplateLoaderProps> = ({
  onTemplateLoaded,
  onValidationResult,
  onCSVDataLoaded,
}) => {
  const [json, setJson] = useState('');
  const [url, setUrl] = useState('');
  const [base64, setBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const clearMessages = () => {
    setError(null);
    setValidationMessages([]);
  };

  const handleLoadFromJSON = () => {
    clearMessages();
    if (!json.trim()) {
      setError('Please enter JSON');
      return;
    }

    try {
      const template = loadTemplateFromJSON(json);
      if (!template) {
        setError('Failed to parse JSON');
        return;
      }

      const validation = validateDenebTemplate(template);
      onValidationResult?.(validation);

      if (validation.valid) {
        onTemplateLoaded(template);
        toast.success('Template loaded successfully');
        setJson('');
      } else {
        setValidationMessages(validation.errors);
        toast.error('Template validation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to load template');
    }
  };

  const handleLoadFromURL = async () => {
    clearMessages();
    setLoading(true);

    if (!url.trim()) {
      setError('Please enter a URL');
      setLoading(false);
      return;
    }

    try {
      const template = await loadTemplateFromURL(url);
      if (!template) {
        setError('Failed to load template from URL');
        setLoading(false);
        return;
      }

      const validation = validateDenebTemplate(template);
      onValidationResult?.(validation);

      if (validation.valid) {
        onTemplateLoaded(template);
        toast.success('Template loaded from URL');
        setUrl('');
      } else {
        setValidationMessages(validation.errors);
        toast.error('Template validation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URL');
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromBase64 = () => {
    clearMessages();
    if (!base64.trim()) {
      setError('Please enter Base64 string');
      return;
    }

    try {
      const template = loadTemplateFromBase64(base64);
      if (!template) {
        setError('Failed to decode Base64');
        return;
      }

      const validation = validateDenebTemplate(template);
      onValidationResult?.(validation);

      if (validation.valid) {
        onTemplateLoaded(template);
        toast.success('Template loaded from Base64');
        setBase64('');
      } else {
        setValidationMessages(validation.errors);
        toast.error('Template validation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to load template');
    }
  };

  const handleLoadSample = () => {
    clearMessages();
    const sample = createSampleTemplate('Sample Bar Chart');
    const validation = validateDenebTemplate(sample);
    onValidationResult?.(validation);

    onTemplateLoaded(sample);
    toast.success('Sample template loaded');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages();
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const template = loadTemplateFromJSON(content);
        if (!template) {
          setError('Invalid template file');
          return;
        }

        const validation = validateDenebTemplate(template);
        onValidationResult?.(validation);

        if (validation.valid) {
          onTemplateLoaded(template);
          toast.success('Template loaded from file');
        } else {
          setValidationMessages(validation.errors);
          toast.error('Template validation failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read file');
        toast.error('Failed to load template');
      }
    };
    reader.readAsText(file);
  };

  const handleCSVLoaded = (content: string, result: CSVParseResult) => {
    if (onCSVDataLoaded) {
      onCSVDataLoaded(result.data);
      toast.success(`Loaded ${result.rowCount} rows of CSV data`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load Deneb Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {validationMessages.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {validationMessages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="csv">CSV Data</TabsTrigger>
            <TabsTrigger value="base64">Base64</TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-3">
            <Textarea
              placeholder='{"name": "My Template", "vegaLite": {...}}'
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="font-mono text-sm"
              rows={8}
            />
            <div className="flex gap-2">
              <Button onClick={handleLoadFromJSON} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Load from JSON
              </Button>
              <Button
                variant="outline"
                onClick={handleLoadSample}
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Sample
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-3">
            <Input
              placeholder="https://example.com/template.json"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleLoadFromURL} disabled={loading} className="w-full">
              <LinkIcon className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Load from URL'}
            </Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Click to upload JSON file
                </p>
                <p className="text-xs text-muted-foreground">
                  or drag and drop
                </p>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="csv" className="space-y-3">
            {onCSVDataLoaded ? (
              <CSVUploader
                onCSVLoaded={handleCSVLoaded}
                onError={setError}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  CSV data loading is not available in this context.
                </p>
                <p className="text-xs mt-2">
                  Use the CSV Data Mapper component in the template workspace.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="base64" className="space-y-3">
            <Textarea
              placeholder="Base64 encoded template..."
              value={base64}
              onChange={(e) => setBase64(e.target.value)}
              className="font-mono text-sm"
              rows={8}
            />
            <Button onClick={handleLoadFromBase64} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Load from Base64
            </Button>
          </TabsContent>
        </Tabs>

        <div className="text-sm text-muted-foreground pt-4 border-t">
          <p className="font-semibold mb-2">Expected Template Structure:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><code>name</code> - Template name (required)</li>
            <li><code>description</code> - Template description (optional)</li>
            <li><code>vegaLite</code>, <code>vega</code>, or <code>template</code> - Vega or Vega-Lite specification (required)</li>
            <li><code>metadata</code> - Author, license, tags (optional)</li>
            <li><code>dataConfig</code> - Data binding configuration (optional)</li>
            <li><code>parameters</code> - Customizable parameters (optional)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DenebTemplateLoader;
