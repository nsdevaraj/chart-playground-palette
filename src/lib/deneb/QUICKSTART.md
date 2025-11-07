# Deneb Template Module - Quick Start Guide

## 5-Minute Setup

### 1. Import the Hook

```typescript
import { useDenebTemplate } from '@/hooks/useDenebTemplate';
```

### 2. Use in Component

```typescript
function MyChart() {
  const { template, setData, getPreviewHTML } = useDenebTemplate();

  return (
    <div>
      {/* Your component */}
    </div>
  );
}
```

### 3. Load a Template

```typescript
import { loadTemplateFromJSON } from '@/lib/deneb/loader';

const templateJSON = `{
  "name": "My Chart",
  "vegaLite": {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "mark": "bar",
    "data": { "values": [] },
    "encoding": {
      "x": { "field": "category", "type": "nominal" },
      "y": { "field": "value", "type": "quantitative" }
    }
  }
}`;

const template = loadTemplateFromJSON(templateJSON);
```

### 4. Bind Data

```typescript
const data = [
  { category: 'A', value: 100 },
  { category: 'B', value: 200 },
  { category: 'C', value: 150 }
];

setData(data);
```

### 5. Render

```typescript
const html = getPreviewHTML();
document.body.innerHTML = html;
```

## Common Use Cases

### Use Sample Template

```typescript
import { createSampleTemplate } from '@/lib/deneb/loader';

const template = createSampleTemplate('My Chart');
```

### Load from URL

```typescript
const { loadFromURL } = useDenebTemplate();
await loadFromURL('https://example.com/template.json');
```

### Validate Template

```typescript
const { validate } = useDenebTemplate();
const result = validate();
if (!result.valid) {
  console.error(result.errors);
}
```

### Use Component

```typescript
import DenebTemplateLoader from '@/components/deneb/DenebTemplateLoader';
import DenebTemplateViewer from '@/components/deneb/DenebTemplateViewer';

export function App() {
  const [template, setTemplate] = useState(null);

  return (
    <>
      <DenebTemplateLoader onTemplateLoaded={setTemplate} />
      {template && <DenebTemplateViewer template={template} />}
    </>
  );
}
```

### Transform Data

```typescript
import { transformDataForTemplate } from '@/lib/deneb/data';

const transformed = transformDataForTemplate(data, [
  { filter: 'value > 50' },
  { aggregate: [{ op: 'sum', field: 'value', as: 'total' }], groupby: ['category'] }
]);
```

## API Quick Reference

### Loading
- `loadTemplateFromJSON(json)` - Load from JSON string
- `loadTemplateFromURL(url)` - Load from URL
- `loadTemplateFromBase64(base64)` - Load from Base64
- `loadTemplateFromObject(obj)` - Load from object

### Validation
- `validateDenebTemplate(template)` - Validate template
- `validateDataAgainstConfig(data, config)` - Validate data

### Data
- `bindDataToTemplate(template, data)` - Bind data
- `transformDataForTemplate(data, transforms)` - Transform data
- `generateSampleData(count)` - Generate sample data

### Rendering
- `generateHTMLFromTemplate(template)` - Generate HTML
- `generateIFrameHTML(template, data)` - iframe HTML
- `createTemplatePreviewHTML(template, data)` - Preview HTML

### React Hook
- `useDenebTemplate(initial)` - Main hook

### Components
- `<DenebTemplateLoader />` - Load component
- `<DenebTemplateViewer />` - View component
- `<DenebDemo />` - Demo component

## Template Structure

```typescript
{
  "name": "Chart Title",                    // Required
  "description": "Chart description",       // Optional
  "version": "1.0.0",                      // Optional
  "metadata": {                            // Optional
    "author": "Author",
    "license": "MIT",
    "tags": ["tag1", "tag2"]
  },
  "dataConfig": [                          // Optional
    {
      "name": "data",
      "description": "Main data",
      "type": "array",
      "required": true
    }
  ],
  "vegaLite": {                            // Required
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "mark": "bar",
    "data": { "values": [] },
    "encoding": { ... }
  }
}
```

## Examples

### Bar Chart

```typescript
const template = {
  name: 'Sales by Region',
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: [] },
    mark: 'bar',
    encoding: {
      x: { field: 'region', type: 'nominal' },
      y: { field: 'sales', type: 'quantitative' }
    }
  }
};
```

### Line Chart

```typescript
const template = {
  name: 'Stock Price',
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: [] },
    mark: { type: 'line', point: true },
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'price', type: 'quantitative' }
    }
  }
};
```

### Scatter Plot

```typescript
const template = {
  name: 'Correlation',
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: [] },
    mark: 'circle',
    encoding: {
      x: { field: 'x_val', type: 'quantitative' },
      y: { field: 'y_val', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  }
};
```

## Troubleshooting

### Template won't load
- Check JSON syntax with `JSON.parse()`
- Validate with `validateDenebTemplate()`
- Check browser console for errors

### Data not appearing
- Verify data field names match encoding
- Check data format (array of objects)
- Use `validateDataAgainstConfig()`

### Chart not rendering
- Check Vega-Lite spec validity
- Ensure `mark` property exists
- Verify data isn't empty
- Check browser console

### TypeScript errors
- Import types: `import { DenebTemplate } from '@/lib/deneb/types'`
- Use proper typing for data

## Next Steps

1. Try the `DenebDemo` component
2. Load an example template
3. Explore the Gallery for more templates
4. Check README.md for full documentation
5. Read INTEGRATION.md for advanced usage

## Resources

- [Vega-Lite Gallery](https://vega.github.io/vega-lite/examples/)
- [Vega-Lite Docs](https://vega.github.io/vega-lite/docs/)
- [Deneb GitHub](https://github.com/deneb-viz/deneb)
