/**
 * Deneb Template Renderer
 * 
 * Provides functionality to render Deneb templates as:
 * - HTML with embedded Vega-Lite visualization
 * - Interactive iframe content
 * - Preview HTML
 */

import { DenebTemplate, VegaLiteSpec, VegaSpec } from './types';
import { getVegaLiteSpec } from './loader';

/**
 * Helper function to inject data into a spec (handles both Vega and Vega-Lite)
 */
const injectDataIntoSpec = (
  spec: VegaLiteSpec | VegaSpec,
  data?: Record<string, unknown>[] | unknown
): VegaLiteSpec | VegaSpec => {
  if (!data) {
    return spec;
  }

  const dataValues = Array.isArray(data) ? data : [data];

  // Check if this is a Vega spec (has data as array) or Vega-Lite (has data as object)
  const isVegaSpec = spec.$schema?.includes('vega/v5') || 
                     (Array.isArray(spec.data) && spec.data.length > 0 && typeof spec.data[0] === 'object' && 'name' in spec.data[0]);

  if (isVegaSpec && Array.isArray(spec.data) && spec.data.length > 0) {
    // For Vega specs: inject data into appropriate data sources
    const dataArray = spec.data.map((dataSource: unknown, index: number) => {
      if (typeof dataSource === 'object' && dataSource !== null && 'name' in dataSource) {
        const ds = dataSource as Record<string, unknown>;
        
        // Inject if data source has a URL (external data) and no values yet
        // Also inject into first source or specifically named sources if they don't have values
        const hasUrl = !!ds.url;
        const isNamedDataSource = ds.name === 'table' || ds.name === 'dataset';
        const isFirstSource = index === 0;
        
        const shouldInject = !ds.values && (hasUrl || isNamedDataSource || isFirstSource);
        
        if (shouldInject) {
          // Remove URL if present and add values, but keep other properties like format, transform
          const { url, ...restProps } = ds;
          return {
            ...restProps,
            values: dataValues,
          };
        }
      }
      return dataSource;
    });
    
    return {
      ...spec,
      data: dataArray,
    } as VegaLiteSpec | VegaSpec;
  } else {
    // For Vega-Lite specs: only replace if no URL is specified
    if (typeof spec.data === 'object' && spec.data !== null && 'url' in spec.data) {
      // Don't inject if spec already has a URL
      return spec;
    }
    
    return {
      ...spec,
      data: {
        values: dataValues,
      },
    } as VegaLiteSpec | VegaSpec;
  }
};

/**
 * Generates HTML for rendering a Deneb template with Vega-Lite
 */
export const generateHTMLFromTemplate = (
  template: DenebTemplate,
  options?: {
    containerId?: string;
    width?: number | string;
    height?: number | string;
    theme?: string;
    actions?: boolean;
  }
): string => {
  const vegaSpec = getVegaLiteSpec(template);
  if (!vegaSpec) {
    return '<div>Error: Invalid template specification</div>';
  }

  const containerId = options?.containerId || 'vega-container';
  const width = options?.width || 'auto';
  const height = options?.height || 400;
  const theme = options?.theme || 'default';
  const showActions = options?.actions !== false;

  // Create Vega or Vega-Lite spec with default settings
  const enhancedSpec: VegaLiteSpec | VegaSpec = {
    ...vegaSpec,
    width: vegaSpec.width || 600,
    height: vegaSpec.height || 400,
    config: {
      ...vegaSpec.config,
      theme,
      mark: {
        ...(vegaSpec.config?.mark as Record<string, unknown>),
      },
    },
  };

  const specJson = JSON.stringify(enhancedSpec);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name || 'Deneb Visualization'}</title>
    <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        #${containerId} {
            width: ${typeof width === 'number' ? width + 'px' : width};
            height: ${typeof height === 'number' ? height + 'px' : height};
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 20px;
            overflow: auto;
        }
        
        .error {
            color: #dc2626;
            padding: 20px;
            text-align: center;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div id="${containerId}"></div>
    <script type="text/javascript">
        const spec = ${specJson};
        const options = {
            actions: ${showActions ? 'true' : 'false'},
            responsive: true
        };
        
        vegaEmbed('#${containerId}', spec, options).catch(error => {
            console.error('Error rendering Vega-Lite visualization:', error);
            document.getElementById('${containerId}').innerHTML = 
                '<div class="error">Error rendering visualization. Check console for details.</div>';
        });
    </script>
</body>
</html>`;
};

/**
 * Generates HTML specifically designed for iframe embedding
 */
export const generateIFrameHTML = (
  template: DenebTemplate,
  data?: Record<string, unknown>[] | unknown
): string => {
  const vegaSpec = getVegaLiteSpec(template);
  if (!vegaSpec) {
    return '<div style="color: red; padding: 20px;">Error: Invalid template</div>';
  }

  // Merge data if provided
  const finalSpec = injectDataIntoSpec(vegaSpec, data);
  const specJson = JSON.stringify(finalSpec);

  return `<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
    <style>
        body {
            margin: 0;
            padding: 10px;
            font-family: sans-serif;
        }
        #vis {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="vis"></div>
    <script type="text/javascript">
        const spec = ${specJson};
        vegaEmbed('#vis', spec, { responsive: true, actions: false }).catch(error => {
            console.error(error);
            document.body.innerHTML = '<div style="color: red; padding: 10px;">Error rendering visualization</div>';
        });
    </script>
</body>
</html>`;
};

/**
 * Creates a preview HTML with template information and visualization
 */
export const createTemplatePreviewHTML = (
  template: DenebTemplate,
  data?: Record<string, unknown>[] | unknown
): string => {
  const vegaSpec = getVegaLiteSpec(template);
  if (!vegaSpec) {
    return '<div>Error: Invalid template</div>';
  }

  const finalSpec = injectDataIntoSpec(vegaSpec, data);
  const specJson = JSON.stringify(finalSpec);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name || 'Template Preview'}</title>
    <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            color: #1f2937;
        }
        
        .header p {
            color: #6b7280;
            margin-bottom: 12px;
            line-height: 1.5;
        }
        
        .metadata {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
        }
        
        .metadata-item {
            font-size: 12px;
            color: #6b7280;
        }
        
        .metadata-label {
            font-weight: 600;
            color: #1f2937;
            display: block;
        }
        
        .metadata-value {
            display: block;
            margin-top: 2px;
            word-break: break-word;
        }
        
        #vis-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            min-height: 400px;
        }
        
        #vis {
            width: 100%;
            height: 100%;
        }
        
        .error {
            color: #dc2626;
            padding: 20px;
            text-align: center;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${template.name || 'Unnamed Template'}</h1>
            ${template.description ? `<p>${escapeHtml(template.description)}</p>` : ''}
            <div class="metadata">
                ${template.version ? `<div class="metadata-item"><span class="metadata-label">Version</span><span class="metadata-value">${template.version}</span></div>` : ''}
                ${template.metadata?.author ? `<div class="metadata-item"><span class="metadata-label">Author</span><span class="metadata-value">${template.metadata.author}</span></div>` : ''}
                ${template.metadata?.license ? `<div class="metadata-item"><span class="metadata-label">License</span><span class="metadata-value">${template.metadata.license}</span></div>` : ''}
                <div class="metadata-item"><span class="metadata-label">Created</span><span class="metadata-value">${new Date().toLocaleDateString()}</span></div>
            </div>
        </div>
        
        <div id="vis-container">
            <div id="vis"></div>
        </div>
    </div>
    
    <script type="text/javascript">
        const spec = ${specJson};
        vegaEmbed('#vis', spec, {
            responsive: true,
            actions: {
                export: true,
                source: false,
                editor: false
            }
        }).catch(error => {
            console.error('Error rendering visualization:', error);
            document.getElementById('vis-container').innerHTML = 
                '<div class="error">Error rendering visualization. Check console for details.</div>';
        });
    </script>
</body>
</html>`;
};

/**
 * Creates a complete template viewer with data binding controls
 */
export const createTemplateViewer = (
  template: DenebTemplate,
  data?: Record<string, unknown>[] | unknown
): string => {
  const vegaSpec = getVegaLiteSpec(template);
  if (!vegaSpec) {
    return '<div>Error: Invalid template</div>';
  }

  const finalSpec = injectDataIntoSpec(vegaSpec, data);
  const specJson = JSON.stringify(finalSpec);
  const templateJson = JSON.stringify(template);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deneb Template Viewer</title>
    <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f9fafb;
            color: #1f2937;
        }
        
        .viewer-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 100vh;
            gap: 1px;
            background: #e5e7eb;
        }
        
        .panel {
            background: white;
            padding: 20px;
            overflow-y: auto;
        }
        
        .panel-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .section {
            margin-bottom: 24px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .section-content {
            padding: 12px;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            font-size: 13px;
            line-height: 1.6;
            max-height: 200px;
            overflow-y: auto;
        }
        
        #vis {
            width: 100%;
            height: 100%;
            min-height: 500px;
        }
        
        @media (max-width: 768px) {
            .viewer-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="viewer-container">
        <div class="panel">
            <div class="panel-title">Template Information</div>
            
            <div class="section">
                <div class="section-title">Name</div>
                <div class="section-content">${escapeHtml(template.name || 'N/A')}</div>
            </div>
            
            ${template.description ? `<div class="section">
                <div class="section-title">Description</div>
                <div class="section-content">${escapeHtml(template.description)}</div>
            </div>` : ''}
            
            ${template.version ? `<div class="section">
                <div class="section-title">Version</div>
                <div class="section-content">${escapeHtml(template.version)}</div>
            </div>` : ''}
            
            <div class="section">
                <div class="section-title">Specification</div>
                <div class="section-content"><pre style="margin: 0; white-space: pre-wrap; word-break: break-word;">${escapeHtml(JSON.stringify(finalSpec, null, 2).slice(0, 500))}...</pre></div>
            </div>
            
            ${template.dataConfig && template.dataConfig.length > 0 ? `<div class="section">
                <div class="section-title">Data Configuration</div>
                <div class="section-content">
                    ${template.dataConfig.map((dc) => `<div><strong>${escapeHtml(dc.name || 'N/A')}</strong>: ${escapeHtml(dc.description || 'No description')}</div>`).join('')}
                </div>
            </div>` : ''}
        </div>
        
        <div class="panel">
            <div class="panel-title">Visualization</div>
            <div id="vis"></div>
        </div>
    </div>
    
    <script type="text/javascript">
        const spec = ${specJson};
        vegaEmbed('#vis', spec, {
            responsive: true,
            actions: {
                export: true,
                source: true,
                editor: false
            }
        }).catch(error => {
            console.error('Error:', error);
            document.body.innerHTML = '<div style="color: red; padding: 20px;">Error rendering visualization</div>';
        });
    </script>
</body>
</html>`;
};

/**
 * Utility function to escape HTML entities
 */
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};
