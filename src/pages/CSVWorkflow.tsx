import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  FileSpreadsheet,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { CSVUploader } from "@/components/csv";
import { CSVDataMapper } from "@/components/csv";
import { CSVParseResult, detectSchema } from "@/lib/csv";
import { denebTemplates, type DenebTemplateGalleryItem } from "@/data/denebTemplates";
import { mermaidTemplates, type MermaidTemplateGalleryItem } from "@/data/mermaidTemplates";
import type { DenebTemplate } from "@/lib/deneb/types";
import type { MermaidTemplate } from "@/lib/mermaid/types";

type Step = 'upload' | 'select-provider' | 'select-template' | 'mapping' | 'preview';

interface Provider {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  templates: Array<DenebTemplateGalleryItem | MermaidTemplateGalleryItem>;
}

const providers: Provider[] = [
  {
    id: 'deneb',
    name: 'Deneb (Vega-Lite)',
    description: 'Declarative data visualization for Power BI',
    icon: BarChart3,
    templates: denebTemplates
  },
  {
    id: 'mermaid',
    name: 'Mermaid',
    description: 'Diagram and chart generation from text',
    icon: BarChart3,
    templates: mermaidTemplates
  }
];

const CSVWorkflow = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [csvContent, setCsvContent] = useState('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const currentProvider = providers.find(p => p.id === selectedProvider);
  const currentTemplate = currentProvider?.templates.find(t => t.id === selectedTemplate);

  const handleCSVLoaded = (content: string, result: CSVParseResult) => {
    setCsvContent(content);
    setParseResult(result);
    setErrors([]);
    
    if (result.errors.length === 0) {
      setCurrentStep('select-provider');
      toast.success(`CSV loaded successfully! ${result.rowCount} rows found.`);
    } else {
      setErrors(result.errors);
      toast.error('CSV parsing completed with errors');
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedTemplate('');
    setCurrentStep('select-template');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('mapping');
  };

  const handleMappingComplete = (mappedData: Record<string, unknown>[]) => {
    setCurrentStep('preview');
    toast.success('Data mapping completed successfully!');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'select-provider':
        setCurrentStep('upload');
        break;
      case 'select-template':
        setCurrentStep('select-provider');
        break;
      case 'mapping':
        setCurrentStep('select-template');
        break;
      case 'preview':
        setCurrentStep('mapping');
        break;
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setCsvContent('');
    setParseResult(null);
    setSelectedProvider('');
    setSelectedTemplate('');
    setErrors([]);
  };

  const canProceedToProvider = parseResult && parseResult.errors.length === 0;
  const canProceedToTemplate = selectedProvider !== '';
  const canProceedToMapping = selectedTemplate !== '';
  const canProceedToPreview = currentTemplate !== undefined;

  const getEditorUrl = () => {
    if (!currentTemplate) return '#';
    
    if (selectedProvider === 'deneb') {
      return `/editor?type=deneb&id=${selectedTemplate}`;
    } else if (selectedProvider === 'mermaid') {
      return `/editor?type=mermaid&id=${selectedTemplate}`;
    }
    return '/editor';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Start by uploading your CSV file to begin the visualization process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader
                onCSVLoaded={handleCSVLoaded}
                onError={(error) => toast.error(error)}
              />
            </CardContent>
          </Card>
        );

      case 'select-provider':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Select Visualization Provider
              </CardTitle>
              <CardDescription>
                Choose the visualization library you want to use for your chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {providers.map((provider) => {
                  const Icon = provider.icon;
                  return (
                    <Card
                      key={provider.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedProvider === provider.id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                      onClick={() => handleProviderSelect(provider.id)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {provider.name}
                        </CardTitle>
                        <CardDescription>
                          {provider.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {provider.templates.length} templates
                          </Badge>
                          {selectedProvider === provider.id && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case 'select-template':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Select Template
              </CardTitle>
              <CardDescription>
                Choose a template that best fits your data visualization needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentProvider?.templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {template.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          {selectedTemplate === template.id && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'mapping':
        return currentTemplate && parseResult && selectedProvider === 'deneb' ? (
          <CSVDataMapper
            template={currentTemplate.template as DenebTemplate}
            onDataMapped={handleMappingComplete}
            onError={(error) => toast.error(error)}
          />
        ) : currentTemplate && selectedProvider === 'mermaid' ? (
          <Card>
            <CardHeader>
              <CardTitle>Mermaid Template Selected</CardTitle>
              <CardDescription>
                Mermaid diagrams use text-based syntax and don't require CSV data mapping. 
                You can proceed directly to create your diagram.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Template: {currentTemplate.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{currentTemplate.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {currentTemplate.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={() => handleMappingComplete([])} className="w-full">
                  Continue to Editor
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null;

      case 'preview':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Ready to Create Visualization
              </CardTitle>
              <CardDescription>
                {selectedProvider === 'deneb' 
                  ? 'Your CSV data has been mapped and is ready for visualization'
                  : 'Your Mermaid template is ready for editing'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {selectedProvider === 'deneb' && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Data Summary</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>• {parseResult?.rowCount} rows of data</p>
                      <p>• {parseResult?.columns.length} columns detected</p>
                      <p>• Successfully mapped to template fields</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="font-medium">Template Selected</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Provider: {currentProvider?.name}</p>
                    <p>• Template: {currentTemplate?.title}</p>
                    <p>• Type: {currentTemplate?.category}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center pt-4">
                <Link to={getEditorUrl()}>
                  <Button size="lg" className="glow-primary">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {selectedProvider === 'deneb' ? 'Create Visualization' : 'Edit Diagram'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'upload': return 1;
      case 'select-provider': return 2;
      case 'select-template': return 3;
      case 'mapping': return 4;
      case 'preview': return 5;
      default: return 1;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload': return 'Upload CSV';
      case 'select-provider': return 'Choose Provider';
      case 'select-template': return 'Select Template';
      case 'mapping': return selectedProvider === 'deneb' ? 'Map Fields' : 'Confirm Template';
      case 'preview': return 'Preview & Create';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold">CSV to Visualization Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Transform your CSV data into beautiful visualizations in just a few steps
          </p>
        </div>

        {/* Progress indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === getStepNumber()
                          ? 'bg-primary text-primary-foreground'
                          : step < getStepNumber()
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step < getStepNumber() ? '✓' : step}
                    </div>
                    {step < 5 && (
                      <div
                        className={`w-8 h-0.5 mx-2 ${
                          step < getStepNumber() ? 'bg-green-500' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-primary">
                Step {getStepNumber()}: {getStepTitle()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error display */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {renderStepContent()}

        {/* Navigation controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {currentStep !== 'upload' && (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button variant="outline" onClick={handleReset}>
                  Reset Workflow
                </Button>
              </div>

              <div className="flex gap-2">
                {parseResult && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3" />
                    {parseResult.rowCount} rows
                  </Badge>
                )}
                {currentTemplate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Template selected
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CSVWorkflow;