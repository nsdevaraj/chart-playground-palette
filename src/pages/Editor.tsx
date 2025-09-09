import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Download, 
  Copy, 
  Save, 
  RotateCcw, 
  Settings,
  FileCode,
  Palette,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
</head>
<body>
    <div id="chart" style="width: 100%; height: 400px;"></div>
</body>
</html>`;

const defaultCSS = `body {
    margin: 0;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

#chart {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}`;

const defaultJS = `// ECharts Bar Chart Example
const chartDom = document.getElementById('chart');
const myChart = echarts.init(chartDom);

const option = {
    title: {
        text: 'Sample Bar Chart',
        textStyle: {
            fontSize: 20,
            fontWeight: 'bold'
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
            ])
        }
    }]
};

myChart.setOption(option);

// Resize chart on window resize
window.addEventListener('resize', () => {
    myChart.resize();
});`;

const Editor = () => {
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);
  const [activeTab, setActiveTab] = useState("html");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!document) return;

    const fullCode = html.replace(
      '</head>',
      `<style>${css}</style></head>`
    ).replace(
      '</body>',
      `<script>${js}</script></body>`
    );

    document.open();
    document.write(fullCode);
    document.close();

    toast.success("Code executed successfully!");
  };

  const copyIframeCode = () => {
    const fullCode = html.replace(
      '</head>',
      `<style>${css}</style></head>`
    ).replace(
      '</body>',
      `<script>${js}</script></body>`
    );

    const iframeCode = `<iframe 
  srcdoc="${fullCode.replace(/"/g, '&quot;')}" 
  width="100%" 
  height="400" 
  frameborder="0" 
  sandbox="allow-scripts">
</iframe>`;

    navigator.clipboard.writeText(iframeCode);
    toast.success("Iframe code copied to clipboard!");
  };

  const downloadCode = () => {
    const fullCode = html.replace(
      '</head>',
      `<style>${css}</style></head>`
    ).replace(
      '</body>',
      `<script>${js}</script></body>`
    );

    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-visualization.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Chart downloaded successfully!");
  };

  const resetCode = () => {
    setHtml(defaultHTML);
    setCss(defaultCSS);
    setJs(defaultJS);
    toast.success("Code reset to default template!");
  };

  useEffect(() => {
    // Auto-run code on component mount
    const timer = setTimeout(runCode, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getCurrentCode = () => {
    switch (activeTab) {
      case "html": return html;
      case "css": return css;
      case "js": return js;
      default: return "";
    }
  };

  const setCurrentCode = (value: string) => {
    switch (activeTab) {
      case "html": setHtml(value); break;
      case "css": setCss(value); break;
      case "js": setJs(value); break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
        
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <Card className="glass flex-1 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5" />
                  Code Editor
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" onClick={runCode} className="glow-primary">
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetCode}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="grid w-fit grid-cols-3">
                    <TabsTrigger value="html" className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">HTML</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="css" className="flex items-center gap-2">
                      <Palette className="w-3 h-3" />
                      <Badge variant="outline" className="text-xs">CSS</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="js" className="flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      <Badge variant="outline" className="text-xs">JS</Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1">
                  <Textarea
                    value={getCurrentCode()}
                    onChange={(e) => setCurrentCode(e.target.value)}
                    className="h-full font-mono text-sm code-editor resize-none"
                    placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
                  />
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col">
          <Card className="glass flex-1 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyIframeCode}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Iframe
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadCode}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="w-full h-full border border-border rounded-lg overflow-hidden bg-white">
                <iframe
                  ref={iframeRef}
                  className="w-full h-full"
                  sandbox="allow-scripts"
                  title="Chart Preview"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Editor;