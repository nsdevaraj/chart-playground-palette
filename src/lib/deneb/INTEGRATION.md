# Deneb Template Module - Integration Guide

## Integration with Chart-Playground-Palette

This guide explains how to integrate the Deneb Template Module with the existing chart-playground-palette application.

## Quick Integration Steps

### 1. Add Deneb Templates to the Gallery

Modify `src/pages/Gallery.tsx`:

```typescript
import { useDenebTemplate } from '@/hooks/useDenebTemplate';
import { basicBarChartTemplate, timeSeriesTemplate } from '@/lib/deneb/__examples__';

// Add Deneb templates to the templates array
const templates: Template[] = [
  // ... existing templates
  {
    id: "deneb-1",
    title: "Deneb Bar Chart",
    description: "Interactive bar chart using Deneb/Vega-Lite",
    library: "Deneb",
    category: "Charts",
    tags: ["deneb", "bar", "vega-lite"],
    template: basicBarChartTemplate
  },
  {
    id: "deneb-2",
    title: "Deneb Time Series",
    description: "Time series visualization using Deneb",
    library: "Deneb",
    category: "Time Series",
    tags: ["deneb", "time-series", "vega-lite"],
    template: timeSeriesTemplate
  }
];
```

### 2. Add Deneb Editor Component

Add a new editor component for Deneb templates that integrates with the existing Editor:

```typescript
import { useDenebTemplate } from '@/hooks/useDenebTemplate';
import DenebTemplateViewer from '@/components/deneb/DenebTemplateViewer';

function DenebTemplateEditor() {
  const { template, data, getPreviewHTML } = useDenebTemplate();
  
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        {/* Template editor panel */}
      </div>
      <div className="flex-1 overflow-auto">
        {template && (
          <DenebTemplateViewer
            template={template}
            data={data}
            height="100%"
          />
        )}
      </div>
    </div>
  );
}
```

### 3. Add Deneb Tab to Editor

Update `src/pages/Editor.tsx` to include a Deneb tab:

```typescript
import { DenebDemo } from '@/components/deneb/DenebDemo';

// In the TabsContent
<TabsContent value="deneb" className="min-h-screen">
  <DenebDemo />
</TabsContent>
```

### 4. Add Deneb Templates to Template Definitions

You can add Deneb templates alongside existing templates:

```typescript
const denebTemplates = {
  deneb_basic: {
    name: "Deneb Basic Bar Chart",
    type: "deneb",
    template: basicBarChartTemplate
  },
  deneb_advanced: {
    name: "Deneb Advanced Dashboard",
    type: "deneb",
    template: dashboardTemplate
  }
};
```

## Feature Integration

### Data Binding

The Deneb module supports dynamic data binding:

```typescript
const { template, setData } = useDenebTemplate(initialTemplate);

// Bind data to the template
setData([
  { category: 'A', value: 100 },
  { category: 'B', value: 200 }
]);
```

### Validation

Validate templates before rendering:

```typescript
import { validateDenebTemplate } from '@/lib/deneb/validation';

const result = validateDenebTemplate(template);
if (!result.valid) {
  console.error('Template errors:', result.errors);
}
```

### Export Functionality

Export templates and visualizations:

```typescript
import { generateHTMLFromTemplate } from '@/lib/deneb/renderer';

const html = generateHTMLFromTemplate(template);
// Download or save the HTML
```

## Component Composition

### Using Components Independently

```typescript
import DenebTemplateLoader from '@/components/deneb/DenebTemplateLoader';
import DenebTemplateViewer from '@/components/deneb/DenebTemplateViewer';

export function MyComponent() {
  const [template, setTemplate] = useState(null);

  return (
    <div className="space-y-4">
      <DenebTemplateLoader
        onTemplateLoaded={setTemplate}
      />
      {template && (
        <DenebTemplateViewer template={template} />
      )}
    </div>
  );
}
```

## Usage Examples

### Example 1: Basic Template Loading

```typescript
import { loadTemplateFromJSON } from '@/lib/deneb/loader';

const json = `{
  "name": "My Chart",
  "vegaLite": {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "mark": "bar",
    "data": { "values": [...] },
    "encoding": { ... }
  }
}`;

const template = loadTemplateFromJSON(json);
```

### Example 2: Data-Driven Visualization

```typescript
import { bindDataToTemplate, mergeDataWithTemplate } from '@/lib/deneb/data';
import { generateHTMLFromTemplate } from '@/lib/deneb/renderer';

const data = [
  { category: 'A', value: 100 },
  { category: 'B', value: 200 }
];

const updatedTemplate = mergeDataWithTemplate(template, data);
const html = generateHTMLFromTemplate(updatedTemplate);
```

### Example 3: Template with Transforms

```typescript
import { transformDataForTemplate } from '@/lib/deneb/data';

const transforms = [
  { filter: 'value > 50' },
  { aggregate: [{ op: 'sum', field: 'value' }], groupby: ['category'] }
];

const transformedData = transformDataForTemplate(data, transforms);
```

## API Endpoints

If integrating with a backend:

```typescript
// Load template from API
const loadTemplateFromAPI = async (templateId: string) => {
  const response = await fetch(`/api/deneb-templates/${templateId}`);
  return response.json();
};

// Save template to API
const saveTemplate = async (template: DenebTemplate) => {
  const response = await fetch('/api/deneb-templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  });
  return response.json();
};
```

## Performance Optimization

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const DenebDemo = lazy(() => import('@/components/deneb/DenebDemo'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DenebDemo />
    </Suspense>
  );
}
```

### Memoization

```typescript
import { useMemo } from 'react';

const memoizedTemplate = useMemo(
  () => loadTemplateFromJSON(jsonString),
  [jsonString]
);
```

## Error Handling

```typescript
import { validateDenebTemplate } from '@/lib/deneb/validation';

try {
  const template = loadTemplateFromJSON(json);
  const result = validateDenebTemplate(template);
  
  if (!result.valid) {
    throw new Error(`Validation failed: ${result.errors.join(', ')}`);
  }
} catch (error) {
  console.error('Template error:', error);
  toast.error('Failed to load template');
}
```

## Customization

### Custom Themes

```typescript
const customTheme = {
  mark: { tooltip: true },
  background: '#f5f5f5',
  title: { fontSize: 16 }
};

const spec = getVegaLiteSpec(template);
spec.config = { ...spec.config, ...customTheme };
```

### Custom Data Transformations

Extend the data transformation utilities:

```typescript
const customTransform = (data: Record<string, unknown>[]) => {
  return data.map(row => ({
    ...row,
    computed: calculateValue(row)
  }));
};
```

## Testing

Example test cases:

```typescript
import { validateDenebTemplate } from '@/lib/deneb/validation';
import { basicBarChartTemplate } from '@/lib/deneb/__examples__';

describe('Deneb Template Module', () => {
  it('should validate a valid template', () => {
    const result = validateDenebTemplate(basicBarChartTemplate);
    expect(result.valid).toBe(true);
  });

  it('should load template from JSON', () => {
    const json = JSON.stringify(basicBarChartTemplate);
    const template = loadTemplateFromJSON(json);
    expect(template).toBeTruthy();
    expect(template?.name).toBe('Basic Bar Chart');
  });
});
```

## Troubleshooting

### Issue: Template not rendering

**Solution**: Check that the template has a valid Vega-Lite specification:

```typescript
const spec = getVegaLiteSpec(template);
if (!spec) {
  console.error('Invalid template spec');
}
```

### Issue: Data not binding

**Solution**: Verify data structure matches template expectations:

```typescript
const result = validateDataAgainstConfig(data, dataConfig);
if (!result.valid) {
  console.error('Data validation errors:', result.errors);
}
```

### Issue: Performance issues with large datasets

**Solution**: Use data transforms to filter/aggregate:

```typescript
const filtered = transformDataForTemplate(data, [
  { filter: 'value > 0' },
  { aggregate: [{ op: 'count', as: 'count' }] }
]);
```

## Next Steps

1. Integrate Deneb components into your pages
2. Add Deneb templates to your template gallery
3. Connect to your backend for template management
4. Customize rendering options for your use case
5. Add custom data sources and transforms

For more information, see:
- [Deneb GitHub](https://github.com/deneb-viz/deneb)
- [Vega-Lite Documentation](https://vega.github.io/vega-lite/)
- [Module README](./README.md)
