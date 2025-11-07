/**
 * CSV Data Mapper Component
 * 
 * A comprehensive component that combines CSV upload, mapping, and preview
 * functionality for integrating CSV data with Deneb templates.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  ArrowRightLeft, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';
import { DenebTemplate } from '@/lib/deneb/types';
import { CSVParseResult, CSVSchema, processCSVForTemplate } from '@/lib/csv';
import { CSVUploader } from './CSVUploader';
import { CSVMapper } from './CSVMapper';
import { CSVPreview } from './CSVPreview';
import { FieldMapping } from '@/lib/csv';

interface CSVDataMapperProps {
  template: DenebTemplate;
  onDataMapped: (mappedData: Record<string, unknown>[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const CSVDataMapper: React.FC<CSVDataMapperProps> = ({
  template,
  onDataMapped,
  onError,
  className
}) => {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [csvContent, setCsvContent] = useState('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [schema, setSchema] = useState<CSVSchema | null>(null);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [mappedData, setMappedData] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCSVLoaded = (content: string, result: CSVParseResult) => {
    setCsvContent(content);
    setParseResult(result);
    setErrors([]);
    
    // Auto-detect schema
    import('@/lib/csv').then(({ detectSchema }) => {
      const detectedSchema = detectSchema(result);
      setSchema(detectedSchema);
      setStep('mapping');
    });
  };

  const handleMappingChanged = (newMappings: FieldMapping[], newData: Record<string, unknown>[]) => {
    setMappings(newMappings);
    setMappedData(newData);
  };

  const handleApplyData = () => {
    if (mappedData.length === 0) {
      const error = 'No data to apply. Please configure field mappings.';
      onError?.(error);
      toast.error(error);
      return;
    }

    onDataMapped(mappedData);
    toast.success(`Applied ${mappedData.length} rows of mapped data to template`);
  };

  const handleReset = () => {
    setCsvContent('');
    setParseResult(null);
    setSchema(null);
    setMappings([]);
    setMappedData([]);
    setErrors([]);
    setStep('upload');
  };

  const handleBack = () => {
    if (step === 'mapping') {
      setStep('upload');
    } else if (step === 'preview') {
      setStep('mapping');
    }
  };

  const canProceedToMapping = parseResult && parseResult.errors.length === 0;
  const canProceedToPreview = mappings.length > 0 && mappedData.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Step indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            CSV Data Mapper
          </CardTitle>
          <CardDescription>
            Map your CSV data to the Deneb template fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'upload' ? 'bg-primary text-primary-foreground' : 
                  canProceedToMapping ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <span className={`text-sm font-medium ${
                  step === 'upload' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Upload CSV
                </span>
              </div>
              
              <div className="w-8 h-0.5 bg-muted" />
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'mapping' ? 'bg-primary text-primary-foreground' : 
                  canProceedToPreview ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <span className={`text-sm font-medium ${
                  step === 'mapping' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Map Fields
                </span>
              </div>
              
              <div className="w-8 h-0.5 bg-muted" />
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  3
                </div>
                <span className={`text-sm font-medium ${
                  step === 'preview' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Preview & Apply
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {parseResult && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileSpreadsheet className="w-3 h-3" />
                  {parseResult.rowCount} rows
                </Badge>
              )}
              {mappedData.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {mappedData.length} mapped
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error display */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Step content */}
      {step === 'upload' && (
        <CSVUploader
          onCSVLoaded={handleCSVLoaded}
          onError={onError}
        />
      )}

      {step === 'mapping' && parseResult && schema && (
        <CSVMapper
          template={template}
          csvParseResult={parseResult}
          csvSchema={schema}
          onMappingChanged={handleMappingChanged}
        />
      )}

      {step === 'preview' && parseResult && schema && (
        <CSVPreview
          csvParseResult={parseResult}
          csvSchema={schema}
          mappedData={mappedData}
        />
      )}

      {/* Navigation controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {step !== 'upload' && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>

            <div className="flex gap-2">
              {step === 'upload' && canProceedToMapping && (
                <Button onClick={() => setStep('mapping')} className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  Map Fields
                </Button>
              )}
              
              {step === 'mapping' && canProceedToPreview && (
                <Button onClick={() => setStep('preview')} className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview Data
                </Button>
              )}
              
              {step === 'preview' && (
                <Button 
                  onClick={handleApplyData} 
                  disabled={mappedData.length === 0}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Apply to Template
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVDataMapper;