/**
 * Deneb Template Module - Demo Component
 * 
 * Comprehensive example demonstrating all features of the Deneb template module
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useDenebTemplate } from '@/hooks/useDenebTemplate';
import { createSampleTemplate } from '@/lib/deneb/loader';
import { generateSampleData } from '@/lib/deneb/data';
import DenebTemplateLoader from './DenebTemplateLoader';
import DenebTemplateViewer from './DenebTemplateViewer';
import { DenebTemplate } from '@/lib/deneb/types';

/**
 * Complete demo of the Deneb template module
 */
export const DenebDemo: React.FC = () => {
  const {
    template,
    data,
    error,
    validationResult,
    loading,
    loadFromJSON,
    setData,
    setTemplate,
    validate,
  } = useDenebTemplate();

  const [sampleData] = useState(generateSampleData(20));

  const handleLoadSample = () => {
    const sampleTemplate = createSampleTemplate('Demo - Sales Data');
    setTemplate(sampleTemplate);
    setData(sampleData);
  };

  const handleValidate = () => {
    const result = validate();
    if (result.valid) {
      alert('Template is valid!');
    } else {
      alert('Validation errors:\n' + result.errors.join('\n'));
    }
  };

  const handleLoadAdvancedExample = async () => {
    const advancedTemplate: DenebTemplate = {
      name: 'Advanced Sales Dashboard',
      description: 'Multi-layer visualization with interactive controls',
      version: '1.0.0',
      metadata: {
        name: 'Sales Dashboard',
        author: 'ChartStudio Demo',
        tags: ['dashboard', 'sales', 'multi-layer'],
      },
      vegaLite: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        title: 'Sales Analysis',
        width: 600,
        height: 400,
        data: {
          values: sampleData as Record<string, unknown>[],
        },
        layer: [
          {
            mark: 'bar',
            encoding: {
              x: { field: 'category', type: 'nominal', title: 'Category' },
              y: { field: 'value', type: 'quantitative', title: 'Value' },
              color: {
                field: 'value',
                type: 'quantitative',
                scale: { scheme: 'viridis' },
              },
            },
          },
          {
            mark: { type: 'line', point: true, color: 'red' },
            transform: [
              {
                calculate: 'mean(data.value)',
                as: 'average',
              },
            ],
            encoding: {
              y: { field: 'average', type: 'quantitative' },
            },
          },
        ],
        config: {
          mark: { tooltip: true },
        },
      },
    };

    setTemplate(advancedTemplate);
    setData(sampleData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Deneb Template Module Demo</h2>
        <p className="text-muted-foreground">
          Comprehensive example showcasing all features of the Deneb template loading,
          validation, and rendering system.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loader">Loader</TabsTrigger>
          <TabsTrigger value="viewer">Viewer</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Module Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Template Loading
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Load from JSON strings</li>
                    <li>• Load from URLs</li>
                    <li>• Load from files</li>
                    <li>• Load from Base64</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Validation
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Schema validation</li>
                    <li>• Data binding validation</li>
                    <li>• Required fields check</li>
                    <li>• Error reporting</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Data Handling
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Data binding to templates</li>
                    <li>• Transform operations</li>
                    <li>• Aggregations</li>
                    <li>• Filtering and sorting</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Rendering
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• HTML generation</li>
                    <li>• iframe embedding</li>
                    <li>• Preview generation</li>
                    <li>• Vega-Lite rendering</li>
                  </ul>
                </div>
              </div>

              {template && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Current Template Status
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Name:</strong> {template.name}
                    </p>
                    {template.description && (
                      <p className="text-sm">
                        <strong>Description:</strong> {template.description}
                      </p>
                    )}
                    {validationResult && (
                      <div className="flex gap-2 mt-2">
                        <Badge variant={validationResult.valid ? 'default' : 'destructive'}>
                          {validationResult.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                        {validationResult.warnings.length > 0 && (
                          <Badge variant="outline">
                            {validationResult.warnings.length} warning(s)
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loader Tab */}
        <TabsContent value="loader" className="space-y-4">
          <DenebTemplateLoader
            onTemplateLoaded={setTemplate}
            onValidationResult={() => {}}
          />
        </TabsContent>

        {/* Viewer Tab */}
        <TabsContent value="viewer" className="space-y-4">
          {template ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Template Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                  <Button onClick={handleValidate}>
                    Validate Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setData(sampleData)}
                  >
                    Bind Sample Data
                  </Button>
                  <Button variant="outline" onClick={() => setData(null)}>
                    Clear Data
                  </Button>
                </CardContent>
              </Card>

              {validationResult && !validationResult.valid && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2">
                      {validationResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <DenebTemplateViewer
                template={template}
                data={data}
                height={500}
                showMetadata={true}
              />
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No template loaded. Use the Loader tab to load a template first.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Example Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Basic Bar Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      A simple bar chart template with sample sales data
                    </p>
                    <Button
                      onClick={handleLoadSample}
                      size="sm"
                      className="w-full"
                    >
                      Load Example
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Advanced Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Multi-layer visualization with aggregations and trends
                    </p>
                    <Button
                      onClick={handleLoadAdvancedExample}
                      size="sm"
                      className="w-full"
                    >
                      Load Example
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Quick Start</h4>
                <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                  <li>Click "Load Example" to load a sample template</li>
                  <li>Go to the "Viewer" tab to see the visualization</li>
                  <li>Use "Bind Sample Data" to attach data to the template</li>
                  <li>Click "Validate Template" to check for errors</li>
                  <li>Copy JSON or download HTML for export</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>Loading template...</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DenebDemo;
