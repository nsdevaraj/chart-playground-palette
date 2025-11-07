import type { MermaidTemplate, MermaidConfig } from "./types";

/**
 * Generate HTML for Mermaid diagram preview
 */
export function generateMermaidPreviewHTML(template: MermaidTemplate): string {
  const config = template.config || {};
  const configJson = JSON.stringify({
    startOnLoad: true,
    theme: config.theme || "default",
    securityLevel: config.securityLevel || "loose",
    ...config,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name || "Mermaid Diagram"}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 1000px;
            width: 100%;
            min-height: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .mermaid {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        svg {
            max-width: 100%;
            height: auto;
        }
    </style>
    <script>
        mermaid.initialize(${configJson});
        mermaid.contentLoaded();
    <\/script>
</head>
<body>
    <div class="container">
        <div class="mermaid">
${template.diagram}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate minimal HTML for iframe preview
 */
export function generateMermaidIFrameHTML(template: MermaidTemplate): string {
  const config = template.config || {};
  const configJson = JSON.stringify({
    startOnLoad: true,
    theme: config.theme || "default",
    securityLevel: config.securityLevel || "loose",
    ...config,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name || "Mermaid"}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            background: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100%;
        }
        .mermaid { 
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border-radius: 8px;
            padding: 20px;
        }
        svg { 
            max-width: 100%; 
            height: auto; 
        }
    </style>
    <script>
        mermaid.initialize(${configJson});
        mermaid.contentLoaded();
    <\/script>
</head>
<body>
    <div class="mermaid">
${template.diagram}
    </div>
</body>
</html>`;
}

/**
 * Create template preview HTML that opens in a new window
 */
export function createMermaidTemplatePreviewHTML(template: MermaidTemplate): string {
  return generateMermaidPreviewHTML(template);
}

/**
 * Validate Mermaid diagram syntax
 */
export async function validateMermaidDiagram(diagram: string): Promise<boolean> {
  try {
    // This is a simple validation - in production you might want more robust checking
    if (!diagram || diagram.trim().length === 0) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
