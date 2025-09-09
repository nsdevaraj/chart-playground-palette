import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Code2, ExternalLink, Search, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Template {
  id: string;
  title: string;
  description: string;
  library: string;
  category: string;
  tags: string[];
  preview?: string;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Interactive Line Chart",
    description: "Beautiful animated line chart with hover effects and zoom functionality",
    library: "Highcharts",
    category: "Line Charts",
    tags: ["interactive", "animated", "responsive"],
  },
  {
    id: "2",
    title: "Dynamic Bar Chart",
    description: "Real-time updating bar chart with gradient colors and animations",
    library: "ECharts",
    category: "Bar Charts", 
    tags: ["real-time", "gradient", "dynamic"],
  },
  {
    id: "3",
    title: "Advanced Data Grid",
    description: "Feature-rich data table with sorting, filtering, and pagination",
    library: "AG-Grid",
    category: "Data Tables",
    tags: ["sorting", "filtering", "pagination"],
  },
  {
    id: "4",
    title: "Custom D3 Visualization",
    description: "Interactive network graph with force-directed layout",
    library: "D3.js",
    category: "Custom",
    tags: ["network", "force-layout", "interactive"],
  },
  {
    id: "5",
    title: "Financial Dashboard",
    description: "Multi-chart dashboard with candlestick and volume charts",
    library: "Highcharts",
    category: "Dashboards",
    tags: ["financial", "candlestick", "multi-chart"],
  },
  {
    id: "6",
    title: "Geo Heatmap",
    description: "Geographic heatmap with country-level data visualization",
    library: "ECharts",
    category: "Maps",
    tags: ["geographic", "heatmap", "countries"],
  },
];

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState<string>("All");

  const libraries = ["All", "Highcharts", "ECharts", "AG-Grid", "D3.js"];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLibrary = selectedLibrary === "All" || template.library === selectedLibrary;
    return matchesSearch && matchesLibrary;
  });

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
              
              {/* Preview placeholder */}
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-muted-foreground animate-float" />
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              <Link to={`/editor?template=${template.id}`} className="flex-1">
                <Button className="w-full glow-primary">
                  <Code2 className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </Link>
              <Button variant="outline" size="icon">
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