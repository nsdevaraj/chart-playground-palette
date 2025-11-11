/**
 * CSV Preview Component
 * 
 * Provides a preview of CSV data and mapped data with statistics
 * and sample rows.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  EyeOff, 
  Download, 
  BarChart3, 
  Database,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { CSVParseResult, CSVSchema } from '@/lib/csv';
import { getColumnStats } from '@/lib/csv/schema';
import { CSVColumn } from '@/lib/csv/parser';

interface CSVPreviewProps {
  csvParseResult: CSVParseResult;
  csvSchema: CSVSchema;
  mappedData?: Record<string, unknown>[];
  className?: string;
}

const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '—';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value.toLocaleString() : String(value);
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  }
  
  return String(value);
};

const ColumnStats: React.FC<{ column: CSVColumn; data: Record<string, unknown>[] }> = ({ column, data }) => {
  const stats = getColumnStats(column, data);
  
  return (
    <div className="p-3 border rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="font-medium">{column.name}</h5>
        <Badge variant="outline" className="text-xs">{column.type}</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Count:</span>
          <span className="ml-1 font-medium">{stats.count}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Unique:</span>
          <span className="ml-1 font-medium">{stats.unique}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Null:</span>
          <span className="ml-1 font-medium">{stats.nullCount}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Nullable:</span>
          <span className="ml-1 font-medium">{column.nullable ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      {column.type === 'number' && stats.min !== null && (
        <div className="text-xs space-y-1">
          <div>
            <span className="text-muted-foreground">Min:</span>
            <span className="ml-1 font-medium">{formatCellValue(stats.min)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Max:</span>
            <span className="ml-1 font-medium">{formatCellValue(stats.max)}</span>
          </div>
          {stats.mean !== null && (
            <div>
              <span className="text-muted-foreground">Mean:</span>
              <span className="ml-1 font-medium">{stats.mean.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
      
      {column.type === 'date' && stats.min !== null && (
        <div className="text-xs space-y-1">
          <div>
            <span className="text-muted-foreground">From:</span>
            <span className="ml-1 font-medium">{formatCellValue(stats.min)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">To:</span>
            <span className="ml-1 font-medium">{formatCellValue(stats.max)}</span>
          </div>
        </div>
      )}
      
      {column.sampleValues.length > 0 && (
        <div className="text-xs">
          <span className="text-muted-foreground">Samples:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {column.sampleValues.slice(0, 3).map((value, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {formatCellValue(value)}
              </Badge>
            ))}
            {column.sampleValues.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{column.sampleValues.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CSVPreview: React.FC<CSVPreviewProps> = ({
  csvParseResult,
  csvSchema,
  mappedData,
  className
}) => {
  const [showAllRows, setShowAllRows] = useState(false);
  const [activeTab, setActiveTab] = useState('original');

  const maxPreviewRows = 10;
  const originalPreview = csvParseResult.data.slice(0, showAllRows ? csvParseResult.data.length : maxPreviewRows);
  const mappedPreview = mappedData?.slice(0, showAllRows ? mappedData.length : maxPreviewRows) || [];

  const handleDownloadCSV = () => {
    const csvContent = [
      csvParseResult.headers.join(','),
      ...csvParseResult.data.map(row => 
        csvParseResult.headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const strValue = String(value);
          return strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')
            ? `"${strValue.replace(/"/g, '""')}"`
            : strValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('CSV downloaded successfully');
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(csvParseResult.data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('JSON downloaded successfully');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Preview
        </CardTitle>
        <CardDescription>
          Preview your CSV data and mapped results before applying to the template.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{csvParseResult.rowCount}</div>
            <div className="text-xs text-muted-foreground">Total Rows</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{csvParseResult.columnCount}</div>
            <div className="text-xs text-muted-foreground">Columns</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{csvSchema.delimiter}</div>
            <div className="text-xs text-muted-foreground">Delimiter</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{mappedData?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Mapped Rows</div>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="original" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Original Data
              </TabsTrigger>
              <TabsTrigger value="mapped" disabled={!mappedData || mappedData.length === 0} className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Mapped Data
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Column Stats
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllRows(!showAllRows)}
              >
                {showAllRows ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showAllRows ? 'Show Less' : 'Show All'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          <TabsContent value="original" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {csvParseResult.headers.map((header) => (
                      <TableHead key={header} className="whitespace-nowrap">
                        {header}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {csvSchema.columns.find(col => col.name === header)?.type}
                        </Badge>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {originalPreview.map((row, index) => (
                    <TableRow key={index}>
                      {csvParseResult.headers.map((header) => (
                        <TableCell key={header} className="whitespace-nowrap">
                          {formatCellValue(row[header])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {!showAllRows && csvParseResult.data.length > maxPreviewRows && (
              <p className="text-sm text-muted-foreground text-center">
                Showing first {maxPreviewRows} of {csvParseResult.data.length} rows
              </p>
            )}
          </TabsContent>

          <TabsContent value="mapped" className="space-y-4">
            {mappedData && mappedData.length > 0 ? (
              <>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(mappedData[0]).map((key) => (
                          <TableHead key={key} className="whitespace-nowrap">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mappedPreview.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value, i) => (
                            <TableCell key={i} className="whitespace-nowrap">
                              {formatCellValue(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {!showAllRows && mappedData.length > maxPreviewRows && (
                  <p className="text-sm text-muted-foreground text-center">
                    Showing first {maxPreviewRows} of {mappedData.length} rows
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No mapped data available. Configure field mappings to see the transformed data.
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {csvSchema.columns.map((column) => (
                <ColumnStats 
                  key={column.name} 
                  column={column} 
                  data={csvParseResult.data} 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CSVPreview;