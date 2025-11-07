import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import type { MermaidTemplate } from "@/lib/mermaid/types";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle } from "lucide-react";

interface MermaidTemplateViewerProps {
  template: MermaidTemplate;
  onDiagramChange?: (diagram: string) => void;
  editable?: boolean;
}

const MermaidTemplateViewer: React.FC<MermaidTemplateViewerProps> = ({
  template,
  onDiagramChange,
  editable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [diagram, setDiagram] = useState(template.diagram);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: template.config?.theme || "default",
      securityLevel: template.config?.securityLevel || "loose",
      ...template.config,
    });
  }, [template.config]);

  // Render diagram
  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !diagram.trim()) {
        setError("Diagram is empty");
        return;
      }

      try {
        // Clear previous content
        containerRef.current.innerHTML = "";

        // Create a unique id for this diagram
        const id = `mermaid-${Date.now()}`;

        // Create container
        const mermaidDiv = document.createElement("div");
        mermaidDiv.id = id;
        mermaidDiv.className = "mermaid";
        mermaidDiv.textContent = diagram;
        containerRef.current.appendChild(mermaidDiv);

        // Render with mermaid
        await mermaid.contentLoaded();

        setError(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to render diagram";
        setError(message);
      }
    };

    renderDiagram();
  }, [diagram]);

  const handleDiagramChange = (newDiagram: string) => {
    setDiagram(newDiagram);
    onDiagramChange?.(newDiagram);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{template.name}</h3>
        <Badge variant="secondary">{template.diagramType}</Badge>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-600 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Diagram rendered successfully
              </AlertDescription>
            </Alert>
          )}

          <div
            ref={containerRef}
            className="w-full min-h-80 border border-border rounded-lg p-4 bg-muted/40 overflow-auto flex items-center justify-center"
          />
        </TabsContent>

        <TabsContent value="source" className="space-y-4">
          {editable ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Edit Diagram</label>
              <Textarea
                value={diagram}
                onChange={(e) => handleDiagramChange(e.target.value)}
                className="font-mono text-sm min-h-96"
                placeholder="Enter mermaid diagram syntax..."
              />
              <p className="text-xs text-muted-foreground">
                Edit the mermaid diagram syntax. Changes are reflected in the preview immediately.
              </p>
            </div>
          ) : (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{diagram}</code>
            </pre>
          )}
        </TabsContent>
      </Tabs>

      {template.description && (
        <p className="text-sm text-muted-foreground">{template.description}</p>
      )}
    </div>
  );
};

// Badge component for diagram type
const Badge: React.FC<{
  variant?: "default" | "secondary" | "outline";
  children: React.ReactNode;
}> = ({ variant = "default", children }) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default MermaidTemplateViewer;
