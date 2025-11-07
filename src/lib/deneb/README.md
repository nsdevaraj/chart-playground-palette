# Deneb Template Module

A comprehensive TypeScript/React module for loading, validating, and rendering Deneb templates (Vega-Lite based visualizations) in the ChartStudio application.

## Overview

The Deneb Template Module provides:

- **Template Loading**: Load templates from JSON, URLs, files, or Base64 encoded strings
- **Validation**: Complete schema and data validation with error reporting
- **Data Binding**: Bind and transform data to templates with support for aggregations, filtering, and sorting
- **Rendering**: Generate HTML, iframe content, and preview visualizations
- **React Integration**: Hooks and components for seamless React integration

## Module Structure

```
src/lib/deneb/
├── types.ts           # TypeScript type definitions
├── validation.ts      # Template and data validation
├── loader.ts          # Template loading utilities
├── renderer.ts        # HTML and visualization rendering
├── data.ts            # Data binding and transformation
├── index.ts           # Module exports
└── README.md          # This file

src/components/deneb/
├── DenebTemplateViewer.tsx    # Viewer component
├── DenebTemplateLoader.tsx    # Loader component
└── DenebDemo.tsx              # Complete demo

src/hooks/
└── useDenebTemplate.ts        # React hook for template management
```

## Quick Start

### 1. Load a Template

```typescript
import { loadTemplateFromJSON } from '@/lib/deneb/loader';

const templateJSON = `{
  "name": "My Chart",
  "vegaLite": {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "mark": "bar",
    "encoding": {
      "x": { "field": "category", "type": "nominal" },
      "y": { "field": "value", "type": "quantitative" }
    }
  }
}`;

const template = loadTemplateFromJSON(templateJSON);
```

### 2. Validate Template

```typescript
import { validateDenebTemplate } from '@/lib/deneb/validation';

const result = validateDenebTemplate(template);
if (result.valid) {
  console.log('Template is valid!');
} else {
  console.log('Errors:', result.errors);
}
```

### 3. Bind Data

```typescript
import { bindDataToTemplate } from '@/lib/deneb/data';

const data = [
  { category: 'A', value: 100 },
  { category: 'B', value: 200 },
  { category: 'C', value: 150 }
];

const updatedTemplate = bindDataToTemplate(template, data);
```

### 4. Render Visualization

```typescript
import { generateHTMLFromTemplate } from '@/lib/deneb/renderer';

const html = generateHTMLFromTemplate(updatedTemplate);
```

### 5. Use React Hook

```typescript
import { useDenebTemplate } from '@/hooks/useDenebTemplate';

function MyComponent() {
  const {
    template,
    data,
    error,
    loadFromJSON,
    setData,
    getPreviewHTML
  } = useDenebTemplate();

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## API Reference

### Types

#### DenebTemplate
Complete template structure including metadata, configuration, and Vega-Lite spec.

```typescript
interface DenebTemplate {
  name: string;
  description?: string;
  metadata?: DenebTemplateMetadata;
  dataConfig?: DenebDataConfig[];
  parameters?: DenebParameter[];
  config?: Record<string, unknown>;
  vegaLite?: VegaLiteSpec;
  template?: VegaLiteSpec;
  version?: string;
}
```

#### DenebTemplateMetadata
Template metadata including author, license, and tags.

```typescript
interface DenebTemplateMetadata {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  license?: string;
  tags?: string[];
  created?: string;
  updated?: string;
}
```

#### ValidationResult
Result of template validation.

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: Record<string, unknown>;
}
```

### Loader Functions

#### loadTemplateFromJSON(jsonString: string)
Loads a template from a JSON string.

```typescript
const template = loadTemplateFromJSON(jsonString);
```

#### loadTemplateFromURL(url: string)
Asynchronously loads a template from a URL.

```typescript
const template = await loadTemplateFromURL('https://example.com/template.json');
```

#### loadTemplateFromBase64(base64String: string)
Loads a template from a Base64 encoded string.

```typescript
const template = loadTemplateFromBase64(base64EncodedString);
```

#### loadTemplateFromObject(obj: unknown)
Loads a template from a JavaScript object.

```typescript
const template = loadTemplateFromObject({ name: '...', vegaLite: {...} });
```

#### normalizeTemplate(template: unknown)
Normalizes a template to ensure consistent structure.

#### getVegaLiteSpec(template: DenebTemplate)
Extracts the Vega-Lite specification from a template.

#### createSampleTemplate(name?: string)
Creates a sample template for testing.

```typescript
const sample = createSampleTemplate('My Sample');
```

### Validation Functions

#### validateDenebTemplate(template: unknown)
Validates a template structure and returns validation results.

#### validateDataAgainstConfig(data: unknown, config: DenebDataConfig)
Validates data against a data configuration.

#### validateRequiredFields(template: DenebTemplate)
Validates that all required fields are present.

### Data Functions

#### bindDataToTemplate(template: DenebTemplate, data: any)
Binds data to a template by updating the data field in the Vega-Lite spec.

```typescript
const updatedTemplate = bindDataToTemplate(template, data);
```

#### transformDataForTemplate(data: Record<string, unknown>[], transforms?: unknown[])
Applies Vega-Lite transformations to data.

```typescript
const transformed = transformDataForTemplate(data, [
  { filter: 'value > 50' },
  { aggregate: [{ op: 'sum', field: 'value', as: 'total' }] }
]);
```

#### mergeDataWithTemplate(template: DenebTemplate, data: Record<string, unknown>[])
Merges data with template, applying all transforms.

#### mapDataColumnsToEncoding(dataColumns: string[], suggestions?: Record<string, string>)
Maps data columns to Vega-Lite encoding channels.

#### generateSampleData(count?: number)
Generates sample data for testing.

```typescript
const sampleData = generateSampleData(20);
```

### Renderer Functions

#### generateHTMLFromTemplate(template: DenebTemplate, options?: RenderOptions)
Generates complete HTML for a template with embedded Vega-Lite visualization.

#### generateIFrameHTML(template: DenebTemplate, data?: any)
Generates HTML designed for iframe embedding.

#### createTemplatePreviewHTML(template: DenebTemplate, data?: any)
Creates a preview HTML with template information and visualization.

#### createTemplateViewer(template: DenebTemplate, data?: any)
Creates a complete viewer with template info panel and visualization side-by-side.

### React Hook: useDenebTemplate

```typescript
const {
  // State
  template,
  data,
  loading,
  error,
  validationResult,

  // Loading methods
  loadFromJSON,
  loadFromURL,
  loadFromBase64,
  loadFromObject,

  // State management
  setTemplate,
  setData,
  clearError,
  reset,

  // Utilities
  validate,
  getSpec,
  getHTML,
  getIFrameHTML,
  getPreviewHTML
} = useDenebTemplate(initialTemplate);
```

## React Components

### DenebTemplateLoader

Component for loading templates from various sources.

```typescript
<DenebTemplateLoader
  onTemplateLoaded={(template) => {...}}
  onValidationResult={(result) => {...}}
/>
```

### DenebTemplateViewer

Component for viewing and interacting with templates.

```typescript
<DenebTemplateViewer
  template={template}
  data={data}
  height={500}
  width="100%"
  showMetadata={true}
/>
```

### DenebDemo

Complete demo showcasing all module features.

```typescript
import { DenebDemo } from '@/components/deneb/DenebDemo';

<DenebDemo />
```

## Template Structure

A complete Deneb template follows this structure:

```typescript
{
  // Required
  "name": "Template Name",
  
  // Optional
  "description": "Template description",
  "version": "1.0.0",
  
  // Optional metadata
  "metadata": {
    "author": "Author Name",
    "license": "MIT",
    "tags": ["chart", "interactive"],
    "created": "2024-01-01"
  },
  
  // Optional data configuration
  "dataConfig": [
    {
      "name": "data",
      "description": "Main data",
      "type": "array",
      "required": true,
      "sampleData": [
        { "category": "A", "value": 100 }
      ]
    }
  ],
  
  // Optional parameters for customization
  "parameters": [
    {
      "name": "color_scheme",
      "type": "string",
      "description": "Color scheme",
      "default": "viridis"
    }
  ],
  
  // Required: Vega-Lite specification
  "vegaLite": {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "My Chart",
    "width": 400,
    "height": 300,
    "data": {
      "values": [
        { "category": "A", "value": 100 }
      ]
    },
    "mark": "bar",
    "encoding": {
      "x": { "field": "category", "type": "nominal" },
      "y": { "field": "value", "type": "quantitative" }
    }
  }
}
```

## Data Transformation

The module supports Vega-Lite transformations:

### Filter Transform

```typescript
{
  "filter": "value > 50"
}
```

### Aggregate Transform

```typescript
{
  "aggregate": [
    { "op": "sum", "field": "value", "as": "total" }
  ],
  "groupby": ["category"]
}
```

### Calculate Transform

```typescript
{
  "calculate": "datum.value * 2",
  "as": "doubled_value"
}
```

### Sort Transform

```typescript
{
  "sort": {
    "field": "value",
    "order": "descending"
  }
}
```

## Error Handling

Templates are validated at load time and during rendering. Validation errors are reported with specific error messages:

```typescript
const result = validateDenebTemplate(template);
if (!result.valid) {
  result.errors.forEach(error => {
    console.error(error);
  });
}
```

## Examples

See `src/components/deneb/DenebDemo.tsx` for comprehensive examples including:
- Basic bar chart template
- Advanced multi-layer dashboard
- Data binding and transformation
- Template validation
- Export and download functionality

## Integration with Editor

The module integrates seamlessly with the chart-playground-palette editor:

1. **Template Gallery**: Templates can be stored in the gallery
2. **Editor**: Templates can be loaded and edited in the editor
3. **Preview**: Live preview updates as templates or data change
4. **Export**: Download templates and visualizations as HTML

## Performance Considerations

- Templates are validated once on load
- Data transformations are applied lazily
- Vega-Lite rendering is handled by vega-embed library
- Large datasets (1000+ records) may need pagination

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 and below not supported
- Requires ES6+ support

## References

- [Deneb GitHub](https://github.com/deneb-viz/deneb)
- [Vega-Lite Documentation](https://vega.github.io/vega-lite/)
- [Vega-Embed](https://github.com/vega/vega-embed)

## License

Same as chart-playground-palette project.
