import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Code2, ExternalLink, Search, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import type { DenebTemplate } from "@/lib/deneb/types";
import { denebTemplates } from "@/data/denebTemplates";
import { createTemplatePreviewHTML, generateIFrameHTML } from "@/lib/deneb/renderer";

type SampleRecord = Record<string, unknown>;

interface Template {
  id: string;
  title: string;
  description: string;
  library: string;
  category: string;
  tags: string[];
  preview?: string;
  type: "code" | "deneb";
  denebTemplate?: DenebTemplate;
  sampleData?: SampleRecord[];
}

const baseTemplates: Template[] = [
  {
    id: "1",
    title: "Interactive Line Chart",
    description: "Beautiful animated line chart with hover effects and zoom functionality",
    library: "Highcharts",
    category: "Line Charts",
    tags: ["interactive", "animated", "responsive"],
    type: "code",
  },
  {
    id: "2",
    title: "Dynamic Bar Chart",
    description: "Real-time updating bar chart with gradient colors and animations",
    library: "ECharts",
    category: "Bar Charts",
    tags: ["real-time", "gradient", "dynamic"],
    type: "code",
  },
  {
    id: "3",
    title: "Advanced Data Grid",
    description: "Feature-rich data table with sorting, filtering, and pagination",
    library: "AG-Grid",
    category: "Data Tables",
    tags: ["sorting", "filtering", "pagination"],
    type: "code",
  },
  {
    id: "4",
    title: "Custom D3 Visualization",
    description: "Interactive network graph with force-directed layout",
    library: "D3.js",
    category: "Custom",
    tags: ["network", "force-layout", "interactive"],
    type: "code",
  },
  {
    id: "5",
    title: "Financial Dashboard",
    description: "Multi-chart dashboard with candlestick and volume charts",
    library: "Highcharts",
    category: "Dashboards",
    tags: ["financial", "candlestick", "multi-chart"],
    type: "code",
  },
  {
    id: "6",
    title: "Geo Heatmap",
    description: "Geographic heatmap with country-level data visualization",
    library: "ECharts",
    category: "Maps",
    tags: ["geographic", "heatmap", "countries"],
    type: "code",
  },
  {
    id: "7",
    title: "Interactive Multi-Series Chart",
    description: "Beautiful interactive chart with multiple data series and advanced hover tooltips",
    library: "Plotly",
    category: "Line Charts",
    tags: ["interactive", "multi-series", "responsive"],
  },
];

const denebTemplateCards: Template[] = denebTemplates.map((entry) => ({
  id: entry.id,
  title: entry.title,
  description: entry.description,
  library: "Deneb",
  category: entry.category,
  tags: entry.tags,
  type: "deneb",
  denebTemplate: entry.template,
  sampleData: entry.sampleData,
}));

const templates: Template[] = [...baseTemplates, ...denebTemplateCards];

const libraries = ["All", ...Array.from(new Set(templates.map((template) => template.library)))];

const DenebPreview: React.FC<{ template: DenebTemplate; data?: SampleRecord[] }> = ({ template, data }) => {
  const previewHtml = useMemo(() => generateIFrameHTML(template, data), [template, data]);

  return (
    <div className="w-full h-40 border border-border rounded-lg overflow-hidden bg-muted/40">
      <iframe
        title={`${template.name} preview`}
        srcDoc={previewHtml}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full bg-white"
      />
    </div>
  );
};

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState<string>("All");

  const filteredTemplates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesSearch =
        term.length === 0 ||
        template.title.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term) ||
        template.category.toLowerCase().includes(term) ||
        template.tags.some((tag) => tag.toLowerCase().includes(term));

      const matchesLibrary = selectedLibrary === "All" || template.library === selectedLibrary;

      return matchesSearch && matchesLibrary;
    });
  }, [searchTerm, selectedLibrary]);

  const handlePreviewClick = useCallback((template: Template) => {
    if (template.type !== "deneb" || !template.denebTemplate) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const previewHtml = createTemplatePreviewHTML(template.denebTemplate, template.sampleData);
    const blob = new Blob([previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Template Gallery
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional chart templates to kickstart your data visualizations.
          Choose from multiple libraries and customize to your needs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {libraries.map((library) => (
            <Button
              key={library}
              variant={selectedLibrary === library ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLibrary(library)}
              className={selectedLibrary === library ? "glow-primary" : ""}
            >
              {library}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="glass hover:shadow-card transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {template.library}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {template.type === "deneb" && template.denebTemplate ? (
                <DenebPreview template={template.denebTemplate} data={template.sampleData} />
              ) : (
                <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-2">
                  <Zap className="w-8 h-8 text-muted-foreground animate-float" />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              <Link
                to={
                  template.type === "deneb"
                    ? `/editor?template=${template.id}&type=deneb`
                    : `/editor?template=${template.id}`
                }
                className="flex-1"
              >
                <Button className="w-full glow-primary">
                  <Code2 className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handlePreviewClick(template)}
                disabled={template.type !== "deneb"}
                title={
                  template.type === "deneb"
                    ? "Open interactive Deneb preview"
                    : "Preview available for Deneb templates"
                }
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No templates found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
