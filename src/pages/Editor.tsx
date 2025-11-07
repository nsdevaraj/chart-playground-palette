import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

// Template definitions for different chart libraries
const templates = {
  1: { // Highcharts
    name: "Highcharts Line Chart",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Highcharts Visualization</title>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</head>
<body>
    <div id="chart" style="width: 100%; height: 400px;"></div>
</body>
</html>`,
    css: `body {
    margin: 0;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
}

#chart {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    js: `// Highcharts Line Chart
Highcharts.chart('chart', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Monthly Sales Data'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
        title: {
            text: 'Sales ($)'
        }
    },
    series: [{
        name: 'Sales',
        data: [1000, 1200, 800, 1500, 2000, 1800],
        color: '#8b5cf6'
    }],
    credits: {
        enabled: false
    }
});`
  },
  2: { // ECharts
    name: "ECharts Bar Chart",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECharts Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
</head>
<body>
    <div id="chart" style="width: 100%; height: 400px;"></div>
</body>
</html>`,
    css: `body {
    margin: 0;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
}

#chart {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    js: `// ECharts Bar Chart
const chartDom = document.getElementById('chart');
const myChart = echarts.init(chartDom);

const option = {
    title: {
        text: 'Weekly Performance',
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
                { offset: 0, color: '#8b5cf6' },
                { offset: 1, color: '#06b6d4' }
            ])
        }
    }]
};

myChart.setOption(option);

window.addEventListener('resize', () => {
    myChart.resize();
});`
  },
  3: { // AG-Grid
    name: "AG-Grid Data Table",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AG-Grid Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community@30.2.0/dist/ag-grid-community.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@30.2.0/styles/ag-grid.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@30.2.0/styles/ag-theme-alpine.css">
</head>
<body>
    <div id="myGrid" class="ag-theme-alpine" style="height: 400px; width: 100%;"></div>
</body>
</html>`,
    css: `body {
    margin: 0;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
}

#myGrid {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
}`,
    js: `// AG-Grid Data Table
const columnDefs = [
    { field: 'name', headerName: 'Product Name', sortable: true, filter: true },
    { field: 'price', headerName: 'Price', sortable: true, filter: true, valueFormatter: function(params) { return '$' + params.value; } },
    { field: 'category', headerName: 'Category', sortable: true, filter: true },
    { field: 'stock', headerName: 'Stock', sortable: true, filter: true }
];

const rowData = [
    { name: 'iPhone 13', price: 799, category: 'Electronics', stock: 25 },
    { name: 'MacBook Pro', price: 1299, category: 'Electronics', stock: 10 },
    { name: 'AirPods', price: 179, category: 'Electronics', stock: 50 },
    { name: 'iPad Air', price: 599, category: 'Electronics', stock: 30 },
    { name: 'Apple Watch', price: 399, category: 'Electronics', stock: 20 },
    { name: 'Samsung Galaxy', price: 899, category: 'Electronics', stock: 15 },
    { name: 'Dell XPS', price: 1499, category: 'Electronics', stock: 8 },
    { name: 'Sony Headphones', price: 249, category: 'Electronics', stock: 35 }
];

const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    pagination: true,
    paginationPageSize: 5
};

const eGridDiv = document.querySelector('#myGrid');
new agGrid.Grid(eGridDiv, gridOptions);`
  },
  4: { // D3.js
    name: "D3.js Interactive Chart",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D3.js Visualization</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
    <div id="chart"></div>
</body>
</html>`,
    css: `body {
    margin: 0;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
}

#chart {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
}

.bar {
    transition: all 0.3s ease;
}

.bar:hover {
    opacity: 0.8;
}`,
    js: `// D3.js Interactive Bar Chart
const data = [
    { name: 'A', value: 30 },
    { name: 'B', value: 80 },
    { name: 'C', value: 45 },
    { name: 'D', value: 60 },
    { name: 'E', value: 20 },
    { name: 'F', value: 90 }
];

const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 460 - margin.left - margin.right;
const height = 300 - margin.bottom - margin.top;

const svg = d3.select('#chart')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.name))
    .padding(0.2);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", "#8b5cf6");

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svg.append("g")
    .call(d3.axisLeft(y));`
  },
  5: { // Highcharts Financial Dashboard
    name: "Highcharts Financial Dashboard",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Dashboard</title>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
</head>
<body>
    <div id="chart" style="width: 100%; height: 400px;"></div>
</body>
</html>`,
    css: `body {
    margin: 0;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
}

#chart {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    js: `// Highcharts Financial Candlestick Chart
const data = [
    [Date.UTC(2024, 0, 1), 100, 110, 95, 105],
    [Date.UTC(2024, 0, 2), 105, 115, 100, 110],
    [Date.UTC(2024, 0, 3), 110, 120, 105, 115],
    [Date.UTC(2024, 0, 4), 115, 118, 108, 112],
    [Date.UTC(2024, 0, 5), 112, 125, 110, 120]
];

Highcharts.stockChart('chart', {
    rangeSelector: {
        selected: 1
    },
    title: {
        text: 'Stock Price Performance'
    },
    series: [{
        type: 'candlestick',
        name: 'Stock Price',
        data: data,
        color: '#ef4444',
        upColor: '#22c55e'
    }],
    credits: {
        enabled: false
    }
});`
  },
  6: { // ECharts Geo Heatmap
    name: "ECharts Geo Heatmap",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECharts Geo Heatmap</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
</head>
<body>
    <div id="chart" style="width: 100%; height: 500px;"></div>
</body>
</html>`,
    css: `body {
    margin: 0;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
}

#chart {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    js: `// ECharts Geographic Heatmap
const chartDom = document.getElementById('chart');
const myChart = echarts.init(chartDom);

// Sample data for countries
const data = [
    { name: 'United States', value: 2890 },
    { name: 'Brazil', value: 1350 },
    { name: 'China', value: 5650 },
    { name: 'India', value: 3200 },
    { name: 'Russia', value: 1890 },
    { name: 'Canada', value: 780 },
    { name: 'Australia', value: 920 },
    { name: 'Germany', value: 1560 },
    { name: 'France', value: 1240 },
    { name: 'United Kingdom', value: 1100 },
    { name: 'Japan', value: 2100 },
    { name: 'South Korea', value: 980 },
    { name: 'Mexico', value: 670 },
    { name: 'Indonesia', value: 890 },
    { name: 'Saudi Arabia', value: 450 },
    { name: 'South Africa', value: 340 },
    { name: 'Egypt', value: 280 },
    { name: 'Nigeria', value: 220 }
];

// Fetch and register world map
fetch('https://raw.githubusercontent.com/apache/echarts/5.4.3/test/data/map/json/world.json')
    .then(response => response.json())
    .then(worldJson => {
        echarts.registerMap('world', worldJson);
        
        const option = {
            title: {
                text: 'Global Data Distribution',
                subtext: 'Geographic Heatmap',
                left: 'center',
                textStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return params.name + '<br/>Value: ' + (params.value || 'No data');
                }
            },
            visualMap: {
                min: 0,
                max: 6000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#e0f2fe', '#7dd3fc', '#38bdf8', '#0284c7', '#0369a1', '#075985']
                },
                textStyle: {
                    color: '#333'
                }
            },
            series: [
                {
                    name: 'World Data',
                    type: 'map',
                    map: 'world',
                    roam: true,
                    emphasis: {
                        label: {
                            show: true
                        },
                        itemStyle: {
                            areaColor: '#8b5cf6',
                            borderColor: '#6d28d9'
                        }
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 0.5
                    },
                    data: data
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', () => {
            myChart.resize();
        });
    })
    .catch(error => {
        console.error('Error loading world map:', error);
        chartDom.innerHTML = '<div style="padding: 20px; text-align: center; color: #ef4444;">Error loading map data. Please check console.</div>';
    });`
  }
};

const defaultTemplate = templates[2]; // Default to ECharts

const Editor = () => {
  const [searchParams] = useSearchParams();
  
  // Initialize with template from URL or default
  const initialTemplate = (() => {
    const templateId = searchParams.get('template');
    return (templateId && templates[templateId]) ? templates[templateId] : defaultTemplate;
  })();
  
  const [html, setHtml] = useState(initialTemplate.html);
  const [css, setCss] = useState(initialTemplate.css);
  const [js, setJs] = useState(initialTemplate.js);
  const [activeTab, setActiveTab] = useState("html");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewCode, setPreviewCode] = useState(() => {
    // Initialize with the full code
    return initialTemplate.html
      .replace('</head>', () => `<style>${initialTemplate.css}</style></head>`)
      .replace('</body>', () => `<script>${initialTemplate.js}<\/script></body>`);
  });
  const [iframeKey, setIframeKey] = useState(0);

  // Load template when URL parameter changes
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && templates[templateId]) {
      const template = templates[templateId];
      setHtml(template.html);
      setCss(template.css);
      setJs(template.js);
      setIframeKey(prev => prev + 1); // Force iframe remount
      toast.success(`Loaded ${template.name} template!`);
    }
  }, [searchParams]);

  const runCode = () => {
    const fullCode = html
      .replace('</head>', () => `<style>${css}</style></head>`)
      .replace('</body>', () => `<script>${js}<\/script></body>`);

    setPreviewCode(fullCode);
    toast.success("Code executed successfully!");
  };

  // Auto-update preview when code changes
  useEffect(() => {
    const fullCode = html
      .replace('</head>', () => `<style>${css}</style></head>`)
      .replace('</body>', () => `<script>${js}<\/script></body>`);
      
    setPreviewCode(fullCode);
  }, [html, css, js]);

  const copyIframeCode = () => {
    const fullCode = html
      .replace('</head>', () => `<style>${css}</style></head>`)
      .replace('</body>', () => `<script>${js}<\/script></body>`);

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
    const fullCode = html
      .replace('</head>', () => `<style>${css}</style></head>`)
      .replace('</body>', () => `<script>${js}<\/script></body>`);

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
    const templateId = searchParams.get('template');
    const template = (templateId && templates[templateId]) 
      ? templates[templateId] 
      : defaultTemplate;
    
    setHtml(template.html);
    setCss(template.css);
    setJs(template.js);
    setIframeKey(prev => prev + 1); // Force iframe remount
    toast.success("Code reset to template!");
  };

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
                  key={iframeKey}
                  ref={iframeRef}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  title="Chart Preview"
                  srcDoc={previewCode}
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
