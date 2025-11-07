/**
 * CSV Uploader Component
 * 
 * Provides drag-and-drop and file selection for CSV uploads,
 * with preview and basic validation.
 */

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { parseCSV, CSVParseOptions, CSVParseResult, validateCSVContent } from '@/lib/csv';

interface CSVUploaderProps {
  onCSVLoaded: (content: string, result: CSVParseResult) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({
  onCSVLoaded,
  onError,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      const error = 'Please select a CSV file';
      onError?.(error);
      toast.error(error);
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);

    try {
      const content = await file.text();
      
      // Validate content before parsing
      const validation = validateCSVContent(content);
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        onError?.(validation.errors.join(', '));
        return;
      }

      // Parse the CSV
      const result = parseCSV(content, {
        hasHeader: true,
        skipEmptyLines: true,
        trimWhitespace: true
      });

      if (result.errors.length > 0) {
        setValidationErrors(result.errors);
        onError?.(result.errors.join(', '));
        return;
      }

      setCsvContent(content);
      setParseResult(result);
      onCSVLoaded(content, result);
      toast.success(`Loaded ${result.rowCount} rows and ${result.columnCount} columns`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read file';
      setValidationErrors([errorMessage]);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onCSVLoaded, onError]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleTextareaChange = useCallback((content: string) => {
    setCsvContent(content);
    
    if (content.trim()) {
      const validation = validateCSVContent(content);
      setValidationErrors(validation.errors);
      
      if (validation.valid) {
        const result = parseCSV(content, {
          hasHeader: true,
          skipEmptyLines: true,
          trimWhitespace: true
        });
        setParseResult(result);
      } else {
        setParseResult(null);
      }
    } else {
      setParseResult(null);
      setValidationErrors([]);
    }
  }, []);

  const handleParseAndLoad = useCallback(() => {
    if (!csvContent.trim()) {
      const error = 'Please enter CSV content';
      onError?.(error);
      toast.error(error);
      return;
    }

    const validation = validateCSVContent(csvContent);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      onError?.(validation.errors.join(', '));
      return;
    }

    const result = parseCSV(csvContent, {
      hasHeader: true,
      skipEmptyLines: true,
      trimWhitespace: true
    });

    if (result.errors.length > 0) {
      setValidationErrors(result.errors);
      onError?.(result.errors.join(', '));
      return;
    }

    setParseResult(result);
    onCSVLoaded(csvContent, result);
    toast.success(`Loaded ${result.rowCount} rows and ${result.columnCount} columns`);
  }, [csvContent, onCSVLoaded, onError]);

  const handleClear = useCallback(() => {
    setCsvContent('');
    setParseResult(null);
    setValidationErrors([]);
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upload CSV Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file or paste CSV content to map to your Deneb template.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {validationErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {parseResult && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully parsed CSV: {parseResult.rowCount} rows, {parseResult.columnCount} columns
              {parseResult.warnings.length > 0 && (
                <span className="ml-2 text-yellow-600">
                  ({parseResult.warnings.length} warnings)
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Content</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-file-input"
                disabled={isLoading}
              />
              <label htmlFor="csv-file-input" className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isLoading ? 'Processing...' : 'Drop CSV file here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports standard CSV format with automatic delimiter detection
                </p>
              </label>
            </div>

            {parseResult && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">File Information</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {parseResult.rowCount} rows
                  </Badge>
                  <Badge variant="outline">
                    {parseResult.columnCount} columns
                  </Badge>
                  <Badge variant="outline">
                    Delimiter: "{parseResult.delimiter}"
                  </Badge>
                </div>
                
                {parseResult.headers.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Headers:</h5>
                    <div className="flex flex-wrap gap-1">
                      {parseResult.headers.slice(0, 10).map((header, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {header}
                        </Badge>
                      ))}
                      {parseResult.headers.length > 10 && (
                        <Badge variant="secondary" className="text-xs">
                          +{parseResult.headers.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">CSV Content</label>
                {csvContent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-6 px-2"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Paste your CSV content here..."
                value={csvContent}
                onChange={(e) => handleTextareaChange(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
                disabled={isLoading}
              />
              <Button
                onClick={handleParseAndLoad}
                disabled={!csvContent.trim() || isLoading || validationErrors.length > 0}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Parse and Load CSV'}
              </Button>
            </div>

            {parseResult && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Parsed Information</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {parseResult.rowCount} rows
                  </Badge>
                  <Badge variant="outline">
                    {parseResult.columnCount} columns
                  </Badge>
                  <Badge variant="outline">
                    Delimiter: "{parseResult.delimiter}"
                  </Badge>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;