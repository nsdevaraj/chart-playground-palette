import { useCallback, useState } from "react";
import type { MermaidTemplate } from "@/lib/mermaid/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Upload, Zap } from "lucide-react";
import { toast } from "sonner";

interface MermaidTemplateLoaderProps {
  onTemplateLoad: (template: MermaidTemplate) => void;
  initialTemplate?: MermaidTemplate;
}

const MermaidTemplateLoader: React.FC<MermaidTemplateLoaderProps> = ({
  onTemplateLoad,
  initialTemplate,
}) => {
  const [templateJson, setTemplateJson] = useState(
    initialTemplate ? JSON.stringify(initialTemplate, null, 2) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLoadTemplate = useCallback(() => {
    try {
      setError(null);

      if (!templateJson.trim()) {
        setError("Please provide a template JSON");
        return;
      }

      const parsed = JSON.parse(templateJson);

      // Validate required fields
      if (!parsed.name) {
        setError("Template must have a name");
        return;
      }

      if (!parsed.diagramType) {
        setError("Template must specify a diagramType");
        return;
      }

      if (!parsed.diagram) {
        setError("Template must have diagram content");
        return;
      }

      onTemplateLoad(parsed);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      toast.success("Template loaded successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse template";
      setError(message);
      toast.error(message);
    }
  }, [templateJson, onTemplateLoad]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        setTemplateJson(JSON.stringify(parsed, null, 2));
        toast.success("Template file loaded");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to parse file";
        setError(message);
        toast.error(message);
      }
    };
    reader.readAsText(file);
  }, []);

  const handlePasteJson = useCallback(() => {
    navigator.clipboard.read().then(async (items) => {
      for (const item of items) {
        if (item.types.includes("text/plain")) {
          const text = await item.getType("text/plain").then((blob) => blob.text());
          try {
            const parsed = JSON.parse(text);
            setTemplateJson(JSON.stringify(parsed, null, 2));
            toast.success("Template pasted from clipboard");
          } catch (err) {
            toast.error("Clipboard content is not valid JSON");
          }
        }
      }
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load Mermaid Template</CardTitle>
        <CardDescription>
          Import a Mermaid template from JSON or file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              Template loaded successfully
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="paste">Paste</TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template JSON</label>
              <Textarea
                value={templateJson}
                onChange={(e) => setTemplateJson(e.target.value)}
                placeholder="Paste your Mermaid template JSON here..."
                className="font-mono text-sm min-h-96"
              />
            </div>
            <Button onClick={handleLoadTemplate} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Load Template
            </Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="text-sm font-medium text-primary hover:underline">
                  Click to upload
                </span>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                or drag and drop a JSON file
              </p>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <Button onClick={handlePasteJson} className="w-full" variant="outline">
              Paste from Clipboard
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Copy a template JSON to your clipboard and click to paste it here
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MermaidTemplateLoader;
