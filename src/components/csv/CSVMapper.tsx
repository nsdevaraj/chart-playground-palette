/**
 * Generic CSV Mapper Component
 * 
 * Provides an interface for mapping CSV columns to template fields,
 * with suggestions and validation for any template type.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRightLeft, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { GenericTemplate } from '@/lib/template';
import { CSVParseResult, CSVSchema } from '@/lib/csv';
import { 
  FieldMapping, 
  createInitialMappings, 
  mapCSVData,
  validateMappingCompatibility,
  generateMappingSuggestions,
  DataTransform
} from '@/lib/csv/generic-mapper';
import { extractTemplateFields } from '@/lib/template/registry';

interface CSVMapperProps {
  template: GenericTemplate;
  csvParseResult: CSVParseResult;
  csvSchema: CSVSchema;
  onMappingChanged: (mappings: FieldMapping[], mappedData: Record<string, unknown>[]) => void;
  className?: string;
}

interface MappingRowProps {
  templateField: { name: string; type?: string; required?: boolean };
  csvColumns: { name: string; type: string; nullable: boolean }[];
  mapping: FieldMapping | null;
  onMappingChange: (mapping: FieldMapping | null) => void;
  disabled?: boolean;
}

const MappingRow: React.FC<MappingRowProps> = ({
  templateField,
  csvColumns,
  mapping,
  onMappingChange,
  disabled
}) => {
  const [showTransform, setShowTransform] = useState(false);
  const [transform, setTransform] = useState<DataTransform>(
    mapping?.transform || { type: 'identity', config: {} }
  );

  const handleColumnChange = (columnName: string) => {
    if (columnName === '__none__') {
      onMappingChange(null);
      return;
    }

    const newMapping: FieldMapping = {
      templateField: templateField.name,
      csvColumn: columnName,
      transform
    };
    onMappingChange(newMapping);
  };

  const handleTransformChange = (newTransform: DataTransform) => {
    setTransform(newTransform);
    if (mapping) {
      const updatedMapping = { ...mapping, transform: newTransform };
      onMappingChange(updatedMapping);
    }
  };

  const selectedColumn = csvColumns.find(col => col.name === mapping?.csvColumn);
  const typeCompatible = !selectedColumn || !templateField.type || (
    templateField.type === selectedColumn.type ||
    (templateField.type === 'quantitative' && selectedColumn.type === 'number') ||
    (templateField.type === 'nominal' && (selectedColumn.type === 'string' || selectedColumn.type === 'boolean')) ||
    (templateField.type === 'temporal' && selectedColumn.type === 'date') ||
    !templateField.type
  );

  return (
    <div className="flex items-center space-x-4 p-3 border rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Label className="font-medium truncate">{templateField.name}</Label>
          {templateField.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          {templateField.type && (
            <Badge variant="outline" className="text-xs">{templateField.type}</Badge>
          )}
        </div>
      </div>

      <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />

      <div className="flex-1 min-w-0">
        <Select
          value={mapping?.csvColumn || '__none__'}
          onValueChange={handleColumnChange}
          disabled={disabled}
        >
          <SelectTrigger className={!typeCompatible ? 'border-orange-300' : ''}>
            <SelectValue placeholder="Select CSV column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">No mapping</SelectItem>
            {csvColumns.map((column) => (
              <SelectItem key={column.name} value={column.name}>
                <div className="flex items-center gap-2">
                  <span>{column.name}</span>
                  <Badge variant="outline" className="text-xs">{column.type}</Badge>
                  {column.nullable && <Badge variant="secondary" className="text-xs">nullable</Badge>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!typeCompatible && (
          <p className="text-xs text-orange-600 mt-1">
            Type mismatch: expected {templateField.type}, got {selectedColumn?.type}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTransform(!showTransform)}
          disabled={!mapping}
        >
          {showTransform ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {showTransform && mapping && (
        <div className="w-full mt-2 p-3 bg-muted rounded-lg">
          <Label className="text-sm font-medium">Data Transform</Label>
          <Select
            value={transform.type}
            onValueChange={(type) => handleTransformChange({ 
              type: type as DataTransform['type'], 
              config: {} 
            })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="identity">No transformation</SelectItem>
              <SelectItem value="format">Format values</SelectItem>
              <SelectItem value="calculate">Calculate expression</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export const CSVMapper: React.FC<CSVMapperProps> = ({
  template,
  csvParseResult,
  csvSchema,
  onMappingChanged,
  className
}) => {
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[]; warnings: string[] }>({
    valid: true,
    errors: [],
    warnings: []
  });
  const [mappedData, setMappedData] = useState<Record<string, unknown>[]>([]);

  const templateFields = extractTemplateFields(template);
  const csvColumns = csvSchema.columns.map(col => ({
    name: col.name,
    type: col.type,
    nullable: col.nullable
  }));

  // Initialize mappings when component mounts
  useEffect(() => {
    const initialMappings = createInitialMappings(template, csvSchema);
    setMappings(initialMappings);
  }, [template, csvSchema]);

  // Update mapped data when mappings change
  useEffect(() => {
    if (mappings.length === 0) {
      setMappedData([]);
      onMappingChanged([], []);
      return;
    }

    const mappingResult = mapCSVData(csvParseResult, csvSchema, mappings);
    setMappedData(mappingResult.mappedData);
    
    const validation = validateMappingCompatibility(template, mappings, csvSchema);
    setValidation(validation);

    onMappingChanged(mappings, mappingResult.mappedData);
  }, [mappings, template, csvParseResult, csvSchema, onMappingChanged]);

  const handleMappingChange = (templateFieldName: string, newMapping: FieldMapping | null) => {
    setMappings(prev => {
      const filtered = prev.filter(m => m.templateField !== templateFieldName);
      if (newMapping) {
        return [...filtered, newMapping];
      }
      return filtered;
    });
  };

  const applySuggestions = () => {
    const suggestions = generateMappingSuggestions(template, csvSchema);
    setMappings(suggestions);
    toast.success(`Applied ${suggestions.length} mapping suggestions`);
  };

  const clearAllMappings = () => {
    setMappings([]);
    toast.info('Cleared all mappings');
  };

  const autoMapRequired = () => {
    const requiredFields = templateFields.filter(f => f.required);
    const suggestions = generateMappingSuggestions(template, csvSchema);
    const requiredMappings = suggestions.filter(m => 
      requiredFields.some(f => f.name === m.templateField)
    );
    setMappings(requiredMappings);
    toast.success(`Auto-mapped ${requiredMappings.length} required fields`);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Map CSV Columns to Template Fields
        </CardTitle>
        <CardDescription>
          Connect your CSV columns to the fields required by the Deneb template.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation alerts */}
        {!validation.valid && validation.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {validation.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.warnings.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {validation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {mappedData.length > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully mapped {mappedData.length} rows with {mappings.length} field mappings
            </AlertDescription>
          </Alert>
        )}

        {/* Mapping controls */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={applySuggestions} className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Apply Suggestions
          </Button>
          <Button variant="outline" onClick={autoMapRequired} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Auto-Map Required
          </Button>
          <Button variant="outline" onClick={clearAllMappings} className="flex items-center gap-2">
            Clear All
          </Button>
        </div>

        {/* Mapping interface */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Field Mappings</h4>
          {templateFields.map((field) => (
            <MappingRow
              key={field.name}
              templateField={field}
              csvColumns={csvColumns}
              mapping={mappings.find(m => m.templateField === field.name) || null}
              onMappingChange={(newMapping) => handleMappingChange(field.name, newMapping)}
            />
          ))}
        </div>

        {/* Unmapped columns */}
        {csvColumns.length > mappings.length && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Unmapped CSV Columns</h4>
            <div className="flex flex-wrap gap-1">
              {csvColumns
                .filter(col => !mappings.some(m => m.csvColumn === col.name))
                .map((column) => (
                  <Badge key={column.name} variant="secondary" className="text-xs">
                    {column.name} ({column.type})
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CSVMapper;
