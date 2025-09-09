import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Code2, 
  Database, 
  Zap, 
  Shield, 
  Palette, 
  ArrowRight,
  Play,
  FileText,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Shield,
    title: "Sandboxed Environment",
    description: "Write HTML, CSS, and JavaScript code in a secure, isolated environment"
  },
  {
    icon: Database,
    title: "Dynamic Data Binding", 
    description: "Connect your charts to real-time data sources and APIs"
  },
  {
    icon: BarChart3,
    title: "Multiple Libraries",
    description: "Built-in support for Highcharts, ECharts, AG-Grid, and custom D3.js"
  },
  {
    icon: Zap,
    title: "Real-time Preview",
    description: "See your changes instantly with live preview functionality"
  },
  {
    icon: FileText,
    title: "Chart Templates",
    description: "Start with professional templates and customize to your needs"
  },
  {
    icon: Palette,
    title: "Data Management",
    description: "Import, export, and manage your datasets with ease"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Floating Chart Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-accent flex items-center justify-center glow-accent animate-float">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Visualize Your Data
              <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Create stunning, interactive charts with HTML, CSS, and JavaScript in a secure sandboxed environment. 
              Support for Highcharts, ECharts, AG-Grid, and custom visualizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/editor">
                <Button size="lg" className="glow-primary text-lg px-8 py-6">
                  <Play className="w-5 h-5 mr-2" />
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <FileText className="w-5 h-5 mr-2" />
                  View Templates
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mt-8">
              <Badge variant="secondary" className="text-sm px-3 py-1">Highcharts</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">ECharts</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">AG-Grid</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">D3.js</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Custom HTML/CSS/JS</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create amazing visualizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass hover:shadow-card transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4 group-hover:glow-accent transition-all duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers creating beautiful visualizations with ChartStudio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/editor">
                <Button size="lg" className="glow-primary text-lg px-8 py-6">
                  <Code2 className="w-5 h-5 mr-2" />
                  Start Building Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Globe className="w-5 h-5 mr-2" />
                View Live Examples
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
