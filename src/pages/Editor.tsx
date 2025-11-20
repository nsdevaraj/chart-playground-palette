import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Play,
  Download,
  Copy,
  Save,
  RotateCcw,
  Settings,
  FileCode,
  Palette,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import DenebTemplateViewer from "@/components/deneb/DenebTemplateViewer";
import DenebTemplateLoader from "@/components/deneb/DenebTemplateLoader";
import MermaidTemplateViewer from "@/components/mermaid/MermaidTemplateViewer";
import MermaidTemplateLoader from "@/components/mermaid/MermaidTemplateLoader";
import { GenericCSVDataMapper } from "@/components/csv";
import { useDenebTemplate } from "@/hooks/useDenebTemplate";
import { denebTemplateMap, denebTemplates, type DenebTemplateGalleryItem } from "@/data/denebTemplates";
import { mermaidTemplateMap, mermaidTemplates, type MermaidTemplateGalleryItem } from "@/data/mermaidTemplates";
import type { DenebTemplate } from "@/lib/deneb/types";
import type { MermaidTemplate } from "@/lib/mermaid/types";
import { exportTemplateAsPlugin } from "@/lib/plugins/utils";

type DenebDataRow = Record<string, unknown>;

interface DenebTemplateWorkspaceProps {
  entry: DenebTemplateGalleryItem;
  invalidTemplateId: string | null;
}

interface MermaidTemplateWorkspaceProps {
  entry: MermaidTemplateGalleryItem;
  invalidTemplateId: string | null;
}

const formatDataValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toLocaleString() : String(value);
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[object]";
    }
  }

  return String(value);
};

// Template definitions for different chart libraries
const templates: Record<string, {
  name: string;
  sampleData?: Record<string, unknown[]>;
  html: string;
  css: string;
  js: string;
}> = {
  1: { // Highcharts
    name: "Highcharts Line Chart",
    sampleData: [
      { month: "Jan", sales: 1000 },
      { month: "Feb", sales: 1200 },
      { month: "Mar", sales: 800 },
      { month: "Apr", sales: 1500 },
      { month: "May", sales: 2000 },
      { month: "Jun", sales: 1800 }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Highcharts Visualization</title>
    <script src="/libs/highcharts/highcharts.js"></script>
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
    sampleData: [
      { day: "Mon", value: 120 },
      { day: "Tue", value: 200 },
      { day: "Wed", value: 150 },
      { day: "Thu", value: 80 },
      { day: "Fri", value: 70 },
      { day: "Sat", value: 110 },
      { day: "Sun", value: 130 }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECharts Visualization</title>
    <script src="/libs/echarts/echarts.min.js"></script>
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
    sampleData: [
      { name: 'iPhone 13', price: 799, category: 'Electronics', stock: 25 },
      { name: 'MacBook Pro', price: 1299, category: 'Electronics', stock: 10 },
      { name: 'AirPods', price: 179, category: 'Electronics', stock: 50 },
      { name: 'iPad Air', price: 599, category: 'Electronics', stock: 30 },
      { name: 'Apple Watch', price: 399, category: 'Electronics', stock: 20 },
      { name: 'Samsung Galaxy', price: 899, category: 'Electronics', stock: 15 },
      { name: 'Dell XPS', price: 1499, category: 'Electronics', stock: 8 },
      { name: 'Sony Headphones', price: 249, category: 'Electronics', stock: 35 }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AG-Grid Visualization</title>
    <script src="/libs/ag-grid/ag-grid-community.min.js"></script>
    <link rel="stylesheet" href="/libs/ag-grid/ag-grid.css">
    <link rel="stylesheet" href="/libs/ag-grid/ag-theme-alpine.css">
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
    sampleData: [
      { name: 'A', value: 30 },
      { name: 'B', value: 80 },
      { name: 'C', value: 45 },
      { name: 'D', value: 60 },
      { name: 'E', value: 20 },
      { name: 'F', value: 90 }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D3.js Visualization</title>
    <script src="/libs/d3/d3.v7.min.js"></script>
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
    sampleData: [
      { date: '2024-01-01', open: 100, high: 110, low: 95, close: 105 },
      { date: '2024-01-02', open: 105, high: 115, low: 100, close: 110 },
      { date: '2024-01-03', open: 110, high: 120, low: 105, close: 115 },
      { date: '2024-01-04', open: 115, high: 118, low: 108, close: 112 },
      { date: '2024-01-05', open: 112, high: 125, low: 110, close: 120 }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Dashboard</title>
    <script src="/libs/highcharts/highstock.js"></script>
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
    sampleData: [
      { name: 'United States', value: 2890, type: 'country' },
      { name: 'Brazil', value: 1350, type: 'country' },
      { name: 'China', value: 5650, type: 'country' },
      { name: 'India', value: 3200, type: 'country' },
      { name: 'Russia', value: 1890, type: 'country' },
      { name: 'Canada', value: 780, type: 'country' },
      { name: 'Australia', value: 920, type: 'country' },
      { name: 'Germany', value: 1560, type: 'country' },
      { name: 'France', value: 1240, type: 'country' },
      { name: 'United Kingdom', value: 1100, type: 'country' }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECharts Geo Heatmap</title>
    <script src="/libs/echarts/echarts.min.js"></script>
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
    js: `// ECharts Geographic Heatmap with Drill-down Support
const chartDom = document.getElementById('chart');
const myChart = echarts.init(chartDom);

// Current view state
let currentView = 'world';
let selectedCountry = null;

// Hierarchical data with countries and states/provinces
const countryData = [
    { name: 'United States', value: 2890, type: 'country' },
    { name: 'Brazil', value: 1350, type: 'country' },
    { name: 'China', value: 5650, type: 'country' },
    { name: 'India', value: 3200, type: 'country' },
    { name: 'Russia', value: 1890, type: 'country' },
    { name: 'Canada', value: 780, type: 'country' },
    { name: 'Australia', value: 920, type: 'country' },
    { name: 'Germany', value: 1560, type: 'country' },
    { name: 'France', value: 1240, type: 'country' },
    { name: 'United Kingdom', value: 1100, type: 'country' },
    { name: 'Japan', value: 2100, type: 'country' },
    { name: 'South Korea', value: 980, type: 'country' },
    { name: 'Mexico', value: 670, type: 'country' },
    { name: 'Indonesia', value: 890, type: 'country' },
    { name: 'Saudi Arabia', value: 450, type: 'country' },
    { name: 'South Africa', value: 340, type: 'country' },
    { name: 'Egypt', value: 280, type: 'country' },
    { name: 'Nigeria', value: 220, type: 'country' }
];

// State/Province level data
const stateData = [
    // United States - States
    { name: 'California', country: 'United States', value: 520, type: 'state' },
    { name: 'Texas', country: 'United States', value: 380, type: 'state' },
    { name: 'New York', country: 'United States', value: 340, type: 'state' },
    { name: 'Florida', country: 'United States', value: 290, type: 'state' },
    { name: 'Illinois', country: 'United States', value: 210, type: 'state' },
    { name: 'Pennsylvania', country: 'United States', value: 195, type: 'state' },
    { name: 'Ohio', country: 'United States', value: 175, type: 'state' },
    { name: 'Georgia', country: 'United States', value: 165, type: 'state' },
    { name: 'North Carolina', country: 'United States', value: 155, type: 'state' },
    { name: 'Michigan', country: 'United States', value: 145, type: 'state' },
    { name: 'Washington', country: 'United States', value: 135, type: 'state' },
    { name: 'Arizona', country: 'United States', value: 120, type: 'state' },
    
    // India - States
    { name: 'Maharashtra', country: 'India', value: 485, type: 'state' },
    { name: 'Karnataka', country: 'India', value: 420, type: 'state' },
    { name: 'Tamil Nadu', country: 'India', value: 390, type: 'state' },
    { name: 'Uttar Pradesh', country: 'India', value: 360, type: 'state' },
    { name: 'Gujarat', country: 'India', value: 340, type: 'state' },
    { name: 'West Bengal', country: 'India', value: 310, type: 'state' },
    { name: 'Telangana', country: 'India', value: 285, type: 'state' },
    { name: 'Rajasthan', country: 'India', value: 240, type: 'state' },
    { name: 'Kerala', country: 'India', value: 195, type: 'state' },
    { name: 'Haryana', country: 'India', value: 175, type: 'state' },
    
    // China - Provinces
    { name: 'Guangdong', country: 'China', value: 820, type: 'state' },
    { name: 'Jiangsu', country: 'China', value: 745, type: 'state' },
    { name: 'Shandong', country: 'China', value: 680, type: 'state' },
    { name: 'Zhejiang', country: 'China', value: 625, type: 'state' },
    { name: 'Henan', country: 'China', value: 570, type: 'state' },
    { name: 'Sichuan', country: 'China', value: 520, type: 'state' },
    { name: 'Hubei', country: 'China', value: 485, type: 'state' },
    { name: 'Fujian', country: 'China', value: 440, type: 'state' },
    { name: 'Shanghai', country: 'China', value: 395, type: 'state' },
    { name: 'Beijing', country: 'China', value: 370, type: 'state' },
    
    // Brazil - States
    { name: 'São Paulo', country: 'Brazil', value: 340, type: 'state' },
    { name: 'Rio de Janeiro', country: 'Brazil', value: 245, type: 'state' },
    { name: 'Minas Gerais', country: 'Brazil', value: 195, type: 'state' },
    { name: 'Rio Grande do Sul', country: 'Brazil', value: 165, type: 'state' },
    { name: 'Paraná', country: 'Brazil', value: 145, type: 'state' },
    { name: 'Bahia', country: 'Brazil', value: 125, type: 'state' },
    { name: 'Pernambuco', country: 'Brazil', value: 85, type: 'state' },
    { name: 'Ceará', country: 'Brazil', value: 50, type: 'state' },
    
    // Canada - Provinces
    { name: 'Ontario', country: 'Canada', value: 245, type: 'state' },
    { name: 'Quebec', country: 'Canada', value: 185, type: 'state' },
    { name: 'British Columbia', country: 'Canada', value: 145, type: 'state' },
    { name: 'Alberta', country: 'Canada', value: 125, type: 'state' },
    { name: 'Manitoba', country: 'Canada', value: 35, type: 'state' },
    { name: 'Saskatchewan', country: 'Canada', value: 25, type: 'state' },
    { name: 'Nova Scotia', country: 'Canada', value: 20, type: 'state' },
    
    // Australia - States
    { name: 'New South Wales', country: 'Australia', value: 285, type: 'state' },
    { name: 'Victoria', country: 'Australia', value: 240, type: 'state' },
    { name: 'Queensland', country: 'Australia', value: 195, type: 'state' },
    { name: 'Western Australia', country: 'Australia', value: 115, type: 'state' },
    { name: 'South Australia', country: 'Australia', value: 55, type: 'state' },
    { name: 'Tasmania', country: 'Australia', value: 20, type: 'state' },
    { name: 'Northern Territory', country: 'Australia', value: 10, type: 'state' },
    
    // Germany - States
    { name: 'Bavaria', country: 'Germany', value: 285, type: 'state' },
    { name: 'North Rhine-Westphalia', country: 'Germany', value: 340, type: 'state' },
    { name: 'Baden-Württemberg', country: 'Germany', value: 245, type: 'state' },
    { name: 'Lower Saxony', country: 'Germany', value: 165, type: 'state' },
    { name: 'Hesse', country: 'Germany', value: 145, type: 'state' },
    { name: 'Saxony', country: 'Germany', value: 95, type: 'state' },
    { name: 'Berlin', country: 'Germany', value: 85, type: 'state' },
    
    // Japan - Prefectures
    { name: 'Tokyo', country: 'Japan', value: 485, type: 'state' },
    { name: 'Osaka', country: 'Japan', value: 340, type: 'state' },
    { name: 'Kanagawa', country: 'Japan', value: 285, type: 'state' },
    { name: 'Aichi', country: 'Japan', value: 245, type: 'state' },
    { name: 'Hokkaido', country: 'Japan', value: 195, type: 'state' },
    { name: 'Fukuoka', country: 'Japan', value: 165, type: 'state' },
    { name: 'Hyogo', country: 'Japan', value: 145, type: 'state' },
    { name: 'Saitama', country: 'Japan', value: 125, type: 'state' },
    { name: 'Chiba', country: 'Japan', value: 115, type: 'state' }
];

// Countries with available state/province data
const countriesWithDrilldown = [
    'United States', 'India', 'China', 'Brazil', 
    'Canada', 'Australia', 'Germany', 'Japan'
];

// Map file paths for each country
// Note: Country GeoJSON files can be obtained from:
// - https://github.com/apache/echarts/tree/master/test/data/map/json
// - https://github.com/deldersveld/topojson (convert TopoJSON to GeoJSON)
// - Natural Earth Data: https://www.naturalearthdata.com/
const countryMapPaths = {
    'United States': '/libs/echarts/data/USA.json',
    'China': '/libs/echarts/data/China.json',
    'India': '/libs/echarts/data/India.json',
    'Brazil': '/libs/echarts/data/Brazil.json',
    'Canada': '/libs/echarts/data/Canada.json',
    'Australia': '/libs/echarts/data/Australia.json',
    'Germany': '/libs/echarts/data/Germany.json',
    'Japan': '/libs/echarts/data/Japan.json'
};

// Helper function to get state data for a country
function getStateDataForCountry(countryName) {
    return stateData.filter(state => state.country === countryName);
}

// Create back button
function createBackButton() {
    const backBtn = document.createElement('button');
    backBtn.id = 'backBtn';
    backBtn.innerHTML = '← Back to World View';
    backBtn.style.cssText = \`
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        padding: 8px 16px;
        background: #8b5cf6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        transition: all 0.2s;
    \`;
    backBtn.onmouseover = () => {
        backBtn.style.background = '#7c3aed';
        backBtn.style.transform = 'translateY(-1px)';
    };
    backBtn.onmouseout = () => {
        backBtn.style.background = '#8b5cf6';
        backBtn.style.transform = 'translateY(0)';
    };
    backBtn.onclick = () => {
        showWorldView();
    };
    document.getElementById('chart').parentElement.style.position = 'relative';
    document.getElementById('chart').parentElement.appendChild(backBtn);
}

// Remove back button
function removeBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.remove();
    }
}

// Show world view
function showWorldView() {
    currentView = 'world';
    selectedCountry = null;
    removeBackButton();
    
    const option = {
        title: {
            text: 'Global Data Distribution',
            subtext: 'Click on a country to drill down',
            left: 'center',
            textStyle: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333'
            },
            subtextStyle: {
                color: '#666',
                fontSize: 12
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const hasData = countriesWithDrilldown.includes(params.name);
                const suffix = hasData ? '<br/><i style="color: #8b5cf6;">Click to drill down</i>' : '';
                return params.name + '<br/>Value: ' + (params.value || 'No data') + suffix;
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
                select: {
                    label: {
                        show: true
                    },
                    itemStyle: {
                        areaColor: '#a78bfa'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 0.5
                },
                data: countryData
            }
        ]
    };
    
    myChart.setOption(option, true);
}

// Show country drill-down view
function showCountryView(countryName) {
    currentView = 'country';
    selectedCountry = countryName;
    createBackButton();
    
    const countryStates = getStateDataForCountry(countryName);
    const maxValue = Math.max(...countryStates.map(s => s.value));
    const mapPath = countryMapPaths[countryName];
    const mapName = countryName.replace(/\s+/g, '');
    
    // Try to load country map, fallback to bar chart if not available
    fetch(mapPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Map not found');
            }
            return response.json();
        })
        .then(mapJson => {
            // Register the country map
            echarts.registerMap(mapName, mapJson);
            
            // Create map visualization
            const option = {
                title: {
                    text: countryName + ' - State/Province Data',
                    subtext: 'Geographic distribution',
                    left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333'
                    },
                    subtextStyle: {
                        color: '#666',
                        fontSize: 12
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
                    max: maxValue,
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
                series: [{
                    name: countryName,
                    type: 'map',
                    map: mapName,
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
                        borderWidth: 1
                    },
                    data: countryStates
                }]
            };
            
            myChart.setOption(option, true);
        })
        .catch(error => {
            console.warn('Country map not available, showing bar chart:', error);
            // Fallback to bar chart
            const option = {
                title: {
                    text: countryName + ' - State/Province Data',
                    subtext: 'Detailed breakdown by region',
                    left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333'
                    },
                    subtextStyle: {
                        color: '#666',
                        fontSize: 12
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        return params[0].name + '<br/>Value: ' + params[0].value;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: countryStates.map(s => s.name),
                    axisLabel: {
                        interval: 0,
                        rotate: 45,
                        fontSize: 10
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'Value'
                },
                visualMap: {
                    min: 0,
                    max: maxValue,
                    text: ['High', 'Low'],
                    calculable: true,
                    inRange: {
                        color: ['#e0f2fe', '#7dd3fc', '#38bdf8', '#0284c7', '#0369a1', '#075985']
                    },
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [{
                    type: 'bar',
                    data: countryStates.map(s => s.value),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(139, 92, 246, 0.5)'
                        }
                    }
                }]
            };
            
            myChart.setOption(option, true);
        });
}

// Initialize world view
fetch('/libs/echarts/data/world.json')
    .then(response => response.json())
    .then(worldJson => {
        echarts.registerMap('world', worldJson);
        showWorldView();
        
        // Add click event for drill-down
        myChart.on('click', function(params) {
            if (currentView === 'world' && params.componentType === 'series') {
                const countryName = params.name;
                if (countriesWithDrilldown.includes(countryName)) {
                    showCountryView(countryName);
                }
            }
        });
        
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    })
    .catch(error => {
        console.error('Error loading world map:', error);
        chartDom.innerHTML = '<div style="padding: 20px; text-align: center; color: #ef4444;">Error loading map data. Please check console.</div>';
    });`
  },
  7: { // Plotly.js
    name: "Plotly.js Interactive Chart",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plotly.js Visualization</title>
    <script src="/libs/plotly/plotly.min.js"></script>
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
    js: `// Plotly.js Interactive Multi-Series Line Chart
const trace1 = {
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [10, 15, 13, 17, 20, 18, 25, 23, 28, 30],
    mode: 'lines+markers',
    name: 'Series A',
    marker: {
        color: '#8b5cf6',
        size: 10,
        line: {
            color: '#6d28d9',
            width: 2
        }
    },
    line: {
        color: '#8b5cf6',
        width: 3
    }
};

const trace2 = {
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [5, 8, 12, 10, 15, 19, 17, 21, 24, 27],
    mode: 'lines+markers',
    name: 'Series B',
    marker: {
        color: '#06b6d4',
        size: 10,
        line: {
            color: '#0891b2',
            width: 2
        }
    },
    line: {
        color: '#06b6d4',
        width: 3
    }
};

const trace3 = {
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [3, 7, 9, 14, 12, 16, 20, 18, 22, 25],
    mode: 'lines+markers',
    name: 'Series C',
    marker: {
        color: '#10b981',
        size: 10,
        line: {
            color: '#059669',
            width: 2
        }
    },
    line: {
        color: '#10b981',
        width: 3
    }
};

const data = [trace1, trace2, trace3];

const layout = {
    title: {
        text: 'Interactive Multi-Series Chart',
        font: {
            size: 24,
            family: 'Segoe UI, sans-serif',
            color: '#1f2937'
        }
    },
    xaxis: {
        title: {
            text: 'Time Period',
            font: {
                size: 14,
                color: '#6b7280'
            }
        },
        showgrid: true,
        gridcolor: '#e5e7eb'
    },
    yaxis: {
        title: {
            text: 'Values',
            font: {
                size: 14,
                color: '#6b7280'
            }
        },
        showgrid: true,
        gridcolor: '#e5e7eb'
    },
    hovermode: 'closest',
    showlegend: true,
    legend: {
        x: 1,
        xanchor: 'right',
        y: 1,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: '#e5e7eb',
        borderwidth: 1
    },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    margin: {
        l: 60,
        r: 40,
        t: 80,
        b: 60
    }
};

const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    toImageButtonOptions: {
        format: 'png',
        filename: 'plotly_chart',
        height: 500,
        width: 800,
        scale: 2
    }
};

Plotly.newPlot('chart', data, layout, config);

// Handle window resize
window.addEventListener('resize', () => {
    Plotly.Plots.resize('chart');
});`
  }
};

const defaultTemplate = templates[2]; // Default to ECharts

const Editor = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const templateType = searchParams.get("type");
  const denebEntry = templateId ? denebTemplateMap[templateId] ?? null : null;
  const mermaidEntry = templateId ? mermaidTemplateMap[templateId] ?? null : null;
  const isDenebTemplate = templateType === "deneb" || Boolean(denebEntry);
  const isMermaidTemplate = templateType === "mermaid" || Boolean(mermaidEntry);

  if (isDenebTemplate) {
    const entry = denebEntry ?? denebTemplates[0];
    const invalidTemplateId = templateId && !denebEntry ? templateId : null;

    return (
      <DenebTemplateWorkspace
        key={entry.id}
        entry={entry}
        invalidTemplateId={invalidTemplateId}
      />
    );
  }

  if (isMermaidTemplate) {
    const entry = mermaidEntry ?? mermaidTemplates[0];
    const invalidTemplateId = templateId && !mermaidEntry ? templateId : null;

    return (
      <MermaidTemplateWorkspace
        key={entry.id}
        entry={entry}
        invalidTemplateId={invalidTemplateId}
      />
    );
  }

  return <CodeTemplateWorkspace key={templateId ?? "default-code"} />;
};

function CodeTemplateWorkspace() {
  const [searchParams] = useSearchParams();

  const initialTemplate = (() => {
    const templateId = searchParams.get("template");
    return templateId && templates[templateId] ? templates[templateId] : defaultTemplate;
  })();

  const [html, setHtml] = useState(initialTemplate.html);
  const [css, setCss] = useState(initialTemplate.css);
  const [js, setJs] = useState(initialTemplate.js);
  const [activeTab, setActiveTab] = useState("html");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewCode, setPreviewCode] = useState(() => {
    return initialTemplate.html
      .replace("</head>", () => `<style>${initialTemplate.css}</style></head>`)
      .replace("</body>", () => `<script>${initialTemplate.js}</script></body>`);
  });
  const [iframeKey, setIframeKey] = useState(0);
  const [showCSVMapper, setShowCSVMapper] = useState(false);
  const [csvData, setCsvData] = useState<Record<string, unknown>[] | null>(null);

  useEffect(() => {
    const templateId = searchParams.get("template");
    if (templateId && templates[templateId]) {
      const template = templates[templateId];
      setHtml(template.html);
      setCss(template.css);
      setJs(template.js);
      setIframeKey((prev) => prev + 1);
      toast.success(`Loaded ${template.name} template!`);
    }
  }, [searchParams]);

  const runCode = () => {
    const fullCode = html
      .replace("</head>", () => `<style>${css}</style></head>`)
      .replace("</body>", () => `<script>${js}</script></body>`);

    setPreviewCode(fullCode);
    toast.success("Code executed successfully!");
  };

  useEffect(() => {
    const fullCode = html
      .replace("</head>", () => `<style>${css}</style></head>`)
      .replace("</body>", () => `<script>${js}</script></body>`);

    setPreviewCode(fullCode);
  }, [html, css, js]);

  const copyIframeCode = () => {
    const fullCode = html
      .replace("</head>", () => `<style>${css}</style></head>`)
      .replace("</body>", () => `<script>${js}</script></body>`);

    const iframeCode = `<iframe 
  srcdoc="${fullCode.replace(/"/g, "&quot;")}" 
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
      .replace("</head>", () => `<style>${css}</style></head>`)
      .replace("</body>", () => `<script>${js}</script></body>`);

    const blob = new Blob([fullCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart-visualization.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Chart downloaded successfully!");
  };

  const resetCode = () => {
    const templateId = searchParams.get("template");
    const template = templateId && templates[templateId] ? templates[templateId] : defaultTemplate;

    setHtml(template.html);
    setCss(template.css);
    setJs(template.js);
    setCsvData(null);
    setIframeKey((prev) => prev + 1);
    toast.success("Code reset to template!");
  };

  const handleClearCSVData = () => {
    setCsvData(null);
    toast.success("CSV data cleared");
  };

  const handleBindSampleData = () => {
    if (initialTemplate.sampleData) {
      setCsvData(initialTemplate.sampleData);

      // Inject the sample data into the JavaScript code
      const dataString = JSON.stringify(initialTemplate.sampleData, null, 2);
      // Remove any existing sampleData or csvData declarations to prevent redeclaration
      const cleanedJs = js
        .replace(/\/\/ (Sample Data|CSV Data) loaded\n(?:const|let) (sampleData|csvData) = [\s\S]*?;\n\n/g, '');

      const newJs = `// Sample Data loaded\nlet sampleData = ${dataString};\n\n${cleanedJs}`;

      toast.success(`Sample data with ${initialTemplate.sampleData.length} rows bound to template`);
    } else {
      toast.error("No sample data available for this template");
    }
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case "html":
        return html;
      case "css":
        return css;
      case "js":
        return js;
      default:
        return "";
    }
  };

  const setCurrentCode = (value: string) => {
    switch (activeTab) {
      case "html":
        setHtml(value);
        break;
      case "css":
        setCss(value);
        break;
      case "js":
        setJs(value);
        break;
      default:
        break;
    }
  };

  // Function to automatically update template JavaScript to use CSV data
  const updateTemplateToUseCSVData = (jsCode: string, csvData: Record<string, unknown>[], columnNames?: string[]) => {
    let updatedJs = jsCode;

    // Get actual column names from the CSV data
    const columns = columnNames || (csvData.length > 0 ? Object.keys(csvData[0]) : []);

    // Helper function to get the first string-like column for categories
    const getCategoryColumn = () => {
      const column = columns.find(col => {
        const sample = csvData[0]?.[col];
        return typeof sample === 'string' || (typeof sample !== 'number' && sample !== null);
      });
      return column || columns[0];
    };

    // Helper function to get the first numeric column for values
    const getValueColumn = () => {
      const column = columns.find(col => {
        const sample = csvData[0]?.[col];
        return typeof sample === 'number' || !isNaN(Number(sample));
      });
      return column || columns[0];
    };

    const categoryCol = getCategoryColumn();
    const valueCol = getValueColumn();

    // Highcharts templates - more targeted replacements
    if (updatedJs.includes('Highcharts.chart')) {
      // Replace hardcoded categories arrays with actual column data
      updatedJs = updatedJs.replace(
        /categories:\s*\[(?:['"](?:[^'"\]]*)['"](?:,\s*)?)+\]/g,
        `categories: csvData.map(item => item['${categoryCol}'])`
      );
      // Replace hardcoded data arrays with actual numeric column
      updatedJs = updatedJs.replace(
        /data:\s*\[(?:\d+(?:\.\d+)?(?:,\s*)?)+\]/g,
        `data: csvData.map(item => parseFloat(String(item['${valueCol}'] || 0)))`
      );
    }

    // ECharts templates - more targeted approach
    if (updatedJs.includes('echarts.init')) {
      // Replace hardcoded string data arrays
      updatedJs = updatedJs.replace(
        /data:\s*\[(?:['"](?:[^'"\]]*)['"](?:,\s*)?)+\]/g,
        `data: csvData.map(item => item['${categoryCol}'])`
      );
      // Replace hardcoded number arrays
      updatedJs = updatedJs.replace(
        /data:\s*\[(?:\d+(?:\.\d+)?(?:,\s*)?)+\]/g,
        `data: csvData.map(item => parseFloat(String(item['${valueCol}'] || 0)))`
      );
    }

    // D3.js templates - direct replacement
    if (updatedJs.includes('d3.select')) {
      // Replace hardcoded data array with CSV data
      updatedJs = updatedJs.replace(
        /const data = \[[^\]]*\];/g,
        `const data = csvData;`
      );
      // Also handle let and var declarations
      updatedJs = updatedJs.replace(
        /(let|var) data = \[[^\]]*\];/g,
        `$1 data = csvData;`
      );
    }

    // AG-Grid templates - direct replacement
    if (updatedJs.includes('agGrid.Grid')) {
      updatedJs = updatedJs.replace(
        /const rowData = \[[^\]]*\];/g,
        `const rowData = csvData;`
      );
      updatedJs = updatedJs.replace(
        /(let|var) rowData = \[[^\]]*\];/g,
        `$1 rowData = csvData;`
      );
    }

    // Plotly templates - targeted replacement
    if (updatedJs.includes('Plotly.newPlot')) {
      // Replace x arrays with actual category column
      updatedJs = updatedJs.replace(
        /x:\s*\[(?:['"](?:[^'"\]]*)['"](?:,\s*)?)+\]/g,
        `x: csvData.map(item => item['${categoryCol}'])`
      );
      updatedJs = updatedJs.replace(
        /x:\s*\[(?:\d+(?:\.\d+)?(?:,\s*)?)+\]/g,
        `x: csvData.map((item, i) => i)`
      );
      // Replace y arrays with actual value column
      updatedJs = updatedJs.replace(
        /y:\s*\[(?:\d+(?:\.\d+)?(?:,\s*)?)+\]/g,
        `y: csvData.map(item => parseFloat(String(item['${valueCol}'] || 0)))`
      );
    }

    // Chart.js templates
    if (updatedJs.includes('Chart(') || updatedJs.includes('new Chart')) {
      // Replace labels arrays
      updatedJs = updatedJs.replace(
        /labels:\s*\[(?:['"](?:[^'"\]]*)['"](?:,\s*)?)+\]/g,
        `labels: csvData.map(item => item['${categoryCol}'])`
      );
      // Replace data arrays in datasets
      updatedJs = updatedJs.replace(
        /data:\s*\[(?:\d+(?:\.\d+)?(?:,\s*)?)+\]/g,
        `data: csvData.map(item => parseFloat(String(item['${valueCol}'] || 0)))`
      );
    }

    return updatedJs;
  };

  const handleCSVDataMapped = (mappedData: Record<string, unknown>[]) => {
    setCsvData(mappedData);
    setShowCSVMapper(false);

    // Inject the CSV data into the JavaScript code
    const dataString = JSON.stringify(mappedData, null, 2);

    // Remove any existing sampleData or csvData declarations to prevent redeclaration
    let cleanedJs = js
      .replace(/\/\/ (Sample Data|CSV Data) loaded\n(?:const|let|var) (sampleData|csvData) = [\s\S]*?;\n\n/g, '');

    // Get column names from the mapped data
    const columnNames = mappedData.length > 0 ? Object.keys(mappedData[0]) : [];

    // Automatically update templates to use csvData with actual column names
    cleanedJs = updateTemplateToUseCSVData(cleanedJs, mappedData, columnNames);

    const newJs = `// CSV Data loaded\nlet csvData = ${dataString};\n\n${cleanedJs}`;
    setJs(newJs);

    // Show which columns are available for reference
    const columnInfo = columnNames.length > 0
      ? `Columns available: ${columnNames.join(', ')}`
      : '';

    toast.success(
      `CSV data with ${mappedData.length} rows mapped successfully!${columnInfo ? ` ${columnInfo}` : ''}`
    );
  };

  // Create a generic template object for CSV mapper
  const currentTemplate = useMemo(() => {
    return {
      name: initialTemplate.name,
      version: '1.0.0',
      description: `${initialTemplate.name} template for data visualization`,
      metadata: {
        name: initialTemplate.name,
        tags: ['chart', 'visualization']
      },
      sampleData: initialTemplate.sampleData
    };
  }, [initialTemplate.name, initialTemplate.sampleData]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
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
                  {initialTemplate.sampleData && (
                    <Button size="sm" variant="outline" onClick={handleBindSampleData}>
                      Bind Sample Data
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setShowCSVMapper(true)}>
                    Map CSV Data
                  </Button>
                  {csvData && (
                    <>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {csvData.length} rows loaded
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={handleClearCSVData} title="Clear CSV Data">
                        ×
                      </Button>
                    </>
                  )}
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
                      <Badge variant="outline" className="text-xs">
                        HTML
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="css" className="flex items-center gap-2">
                      <Palette className="w-3 h-3" />
                      <Badge variant="outline" className="text-xs">
                        CSS
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="js" className="flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      <Badge variant="outline" className="text-xs">
                        JS
                      </Badge>
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

              {/* CSV Data Preview */}
              {csvData && csvData.length > 0 && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">CSV Data Available</p>
                      <p className="text-sm text-muted-foreground">
                        {csvData.length} rows loaded. Access via <code className="bg-muted px-1 py-0.5 rounded">csvData</code> variable in your JavaScript code.
                      </p>
                      <details className="text-sm">
                        <summary className="cursor-pointer hover:underline">View first row</summary>
                        <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                          {JSON.stringify(csvData[0], null, 2)}
                        </pre>
                      </details>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

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

      {/* CSV Data Mapper Modal */}
      {showCSVMapper && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Map CSV Data to Chart Template</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCSVMapper(false)}
                >
                  ×
                </Button>
              </div>

              <GenericCSVDataMapper
                template={currentTemplate}
                onDataMapped={handleCSVDataMapped}
                onError={(error) => toast.error(error)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DenebTemplateWorkspace({ entry, invalidTemplateId }: DenebTemplateWorkspaceProps) {
  const {
    template,
    data,
    error,
    validationResult,
    loading,
    loadFromObject,
    setData,
    clearError,
    validate,
  } = useDenebTemplate(entry.template);

  const [showCSVMapper, setShowCSVMapper] = useState(false);

  useEffect(() => {
    loadFromObject(entry.template);
    if (entry.sampleData && entry.sampleData.length > 0) {
      setData(entry.sampleData);
    } else {
      setData(null);
    }
    clearError();
  }, [entry, loadFromObject, setData, clearError]);

  const activeTemplate = template ?? entry.template;

  const headerTitle = activeTemplate.name || entry.title;
  const headerDescription = activeTemplate.description || entry.description;
  const headerTags =
    activeTemplate.metadata?.tags && activeTemplate.metadata.tags.length > 0
      ? activeTemplate.metadata.tags
      : entry.tags;

  const dataRows = useMemo<DenebDataRow[]>(() => {
    if (Array.isArray(data) && data.every((row) => row && typeof row === "object")) {
      return data as DenebDataRow[];
    }
    return entry.sampleData ?? [];
  }, [data, entry.sampleData]);

  const dataColumns = dataRows.length > 0 ? Object.keys(dataRows[0]) : [];
  const rowCount = dataRows.length;
  const warnings = validationResult?.warnings ?? [];

  const handleBindSample = () => {
    if (entry.sampleData) {
      setData(entry.sampleData);
      clearError();
      toast.success("Sample data bound to template");
    } else {
      toast.error("No sample data available for this template");
    }
  };

  const handleClearData = () => {
    setData(null);
    clearError();
    toast.success("Data cleared from template");
  };

  const handleResetTemplate = () => {
    loadFromObject(entry.template);
    if (entry.sampleData && entry.sampleData.length > 0) {
      setData(entry.sampleData);
    } else {
      setData(null);
    }
    clearError();
    toast.success("Template reset to gallery version");
  };

  const handleValidateTemplate = () => {
    const result = validate();
    if (result.valid) {
      toast.success("Template validated successfully");
    } else {
      toast.error("Template validation failed", {
        description: result.errors.slice(0, 3).join("\n"),
      });
    }
  };

  const handleTemplateLoaded = (loadedTemplate: DenebTemplate) => {
    loadFromObject(loadedTemplate);
    setData(null);
    clearError();
  };

  const handleCSVDataMapped = (mappedData: Record<string, unknown>[]) => {
    setData(mappedData);
    setShowCSVMapper(false);
    toast.success("CSV data mapped and applied to template");
  };

  const resolvedData = Array.isArray(data) ? (data as DenebDataRow[]) : entry.sampleData;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Deneb</Badge>
            <h1 className="text-3xl font-semibold">{headerTitle}</h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-3xl">{headerDescription}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {headerTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {invalidTemplateId && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Template “{invalidTemplateId}” was not found in the gallery. Showing the first Deneb example instead.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Controls</CardTitle>
              <CardDescription>Bind data, validate, or reset the Deneb specification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="glow-primary" onClick={handleBindSample} disabled={!entry.sampleData || loading}>
                  Bind Sample Data
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCSVMapper(true)} disabled={loading}>
                  Map CSV Data
                </Button>
                <Button size="sm" variant="outline" onClick={handleClearData} disabled={loading}>
                  Clear Data
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetTemplate} disabled={loading}>
                  Reset Template
                </Button>
                <Button size="sm" variant="secondary" onClick={handleValidateTemplate} disabled={loading}>
                  Validate Spec
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportTemplateAsPlugin(activeTemplate)} disabled={loading}>
                  <Package className="w-4 h-4 mr-2" />
                  Export Plugin
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {validationResult ? (
                  <Badge
                    variant={validationResult.valid ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {validationResult.valid ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {validationResult.valid ? "Valid template" : "Has validation errors"}
                  </Badge>
                ) : (
                  <Badge variant="outline">Not validated</Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {rowCount} {rowCount === 1 ? "row" : "rows"} bound
                </Badge>
                {loading && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading
                  </Badge>
                )}
              </div>

              <div className="space-y-3 text-sm">
                {activeTemplate.metadata?.author && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Author</p>
                    <p>{activeTemplate.metadata.author}</p>
                  </div>
                )}
                {activeTemplate.metadata?.license && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">License</p>
                    <p>{activeTemplate.metadata.license}</p>
                  </div>
                )}
                {activeTemplate.version && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Version</p>
                    <p>{activeTemplate.version}</p>
                  </div>
                )}
              </div>

              {activeTemplate.dataConfig && activeTemplate.dataConfig.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Data requirements</p>
                  <div className="space-y-2">
                    {activeTemplate.dataConfig.map((config) => (
                      <div key={config.name} className="rounded border border-dashed border-border px-3 py-2">
                        <p className="text-sm font-medium">{config.name}</p>
                        {config.description && (
                          <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Data</CardTitle>
              <CardDescription>Preview of the data currently bound to this template.</CardDescription>
            </CardHeader>
            <CardContent>
              {dataRows.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {dataColumns.map((column) => (
                          <TableHead key={column} className="capitalize">
                            {column.replace(/_/g, " ")}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataRows.slice(0, 8).map((row, index) => (
                        <TableRow key={index}>
                          {dataColumns.map((column) => (
                            <TableCell key={column}>{formatDataValue(row[column])}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {dataRows.length > 8 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Showing first 8 of {dataRows.length} rows.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No data bound to this template yet.</p>
              )}
            </CardContent>
          </Card>

          <DenebTemplateLoader onTemplateLoaded={handleTemplateLoaded} />
        </div>

        <div className="space-y-4">
          {validationResult && !validationResult.valid && validationResult.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {validationResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {warnings.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {warnings.map((warn, idx) => (
                    <li key={idx}>{warn}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <DenebTemplateViewer template={activeTemplate} data={resolvedData} height={540} showMetadata />
        </div>
      </div>

      {/* CSV Data Mapper Modal */}
      {showCSVMapper && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Map CSV Data to Template</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCSVMapper(false)}
                >
                  ×
                </Button>
              </div>

              <GenericCSVDataMapper
                template={activeTemplate}
                onDataMapped={handleCSVDataMapped}
                onError={(error) => toast.error(error)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MermaidTemplateWorkspace({ entry, invalidTemplateId }: MermaidTemplateWorkspaceProps) {
  const [template, setTemplate] = useState(entry.template);
  const [iframeKey, setIframeKey] = useState(0);
  const [showCSVMapper, setShowCSVMapper] = useState(false);
  const [mappedData, setMappedData] = useState<Record<string, unknown>[] | null>(null);

  const headerTitle = template.name;
  const headerDescription = template.description || "Edit this Mermaid diagram";
  const headerTags = template.metadata?.tags || [];

  const handleTemplateSave = () => {
    setIframeKey((prev) => prev + 1);
    toast.success("Diagram saved successfully!");
  };

  const handleDiagramChange = (newDiagram: string) => {
    setTemplate((prev) => ({
      ...prev,
      diagram: newDiagram,
    }));
  };

  const handleTemplateLoaded = (loadedTemplate: MermaidTemplate) => {
    setTemplate(loadedTemplate);
    toast.success("Template loaded successfully!");
  };

  const handleCSVDataMapped = (data: Record<string, unknown>[]) => {
    setMappedData(data);
    setShowCSVMapper(false);

    // For Mermaid templates, we could update the diagram with the mapped data
    // This is a simple implementation that could be enhanced
    toast.success(`CSV data with ${data.length} rows mapped and applied to template`);
  };

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
            max-width: 90%;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
        }
        .mermaid { display: flex; justify-content: center; }
        svg { max-width: 100%; height: auto; }
    </style>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    <\/script>
</head>
<body>
    <div class="container">
        <div class="title">${template.name}</div>
        <div class="mermaid">${template.diagram}</div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Diagram downloaded successfully!");
  };

  const handleCopyDiagram = () => {
    navigator.clipboard.writeText(template.diagram);
    toast.success("Diagram syntax copied to clipboard!");
  };

  const handleResetTemplate = () => {
    setTemplate(entry.template);
    setMappedData(null);
    setIframeKey((prev) => prev + 1);
    toast.success("Template reset to gallery version");
  };

  const handleClearData = () => {
    setMappedData(null);
    toast.success("Data cleared from template");
  };

  const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
    <style>
        body { margin: 0; padding: 20px; background: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100%; }
        .mermaid { display: flex; align-items: center; justify-content: center; background: white; border-radius: 8px; padding: 20px; }
        svg { max-width: 100%; height: auto; }
    </style>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    <\/script>
</head>
<body>
    <div class="mermaid">${template.diagram}</div>
</body>
</html>`;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Mermaid</Badge>
            <h1 className="text-3xl font-semibold">{headerTitle}</h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-3xl">{headerDescription}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {headerTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {invalidTemplateId && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Template "{invalidTemplateId}" was not found in the gallery. Showing the first Mermaid example instead.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagram Controls</CardTitle>
              <CardDescription>Edit, validate, or reset the Mermaid diagram.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="glow-primary" onClick={handleTemplateSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                {entry.sampleData && (
                  <Button size="sm" variant="outline" onClick={() => {
                    setMappedData(Array.isArray(entry.sampleData) ? entry.sampleData : [entry.sampleData]);
                    toast.success("Sample data bound to template");
                  }}>
                    Bind Sample Data
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setShowCSVMapper(true)}>
                  Map CSV Data
                </Button>
                {mappedData && (
                  <Button size="sm" variant="outline" onClick={handleClearData}>
                    Clear Data
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={handleCopyDiagram}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetTemplate}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {mappedData ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {mappedData.length} {mappedData.length === 1 ? "row" : "rows"} bound
                  </Badge>
                ) : entry.sampleData ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Sample data available
                  </Badge>
                ) : (
                  <Badge variant="outline">No data bound</Badge>
                )}
              </div>

              <div className="space-y-3 text-sm">
                {template.metadata?.author && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Author</p>
                    <p>{template.metadata.author}</p>
                  </div>
                )}
                {template.metadata?.license && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">License</p>
                    <p>{template.metadata.license}</p>
                  </div>
                )}
                {template.version && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Version</p>
                    <p>{template.version}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {(mappedData || entry.sampleData) && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Data</CardTitle>
                <CardDescription>Preview of the data currently bound to this template.</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const dataRows = mappedData || (Array.isArray(entry.sampleData) ? entry.sampleData : entry.sampleData ? [entry.sampleData] : []);
                  const dataColumns = dataRows.length > 0 ? Object.keys(dataRows[0]) : [];

                  return dataRows.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {dataColumns.map((column) => (
                              <TableHead key={column} className="capitalize">
                                {column.replace(/_/g, " ")}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataRows.slice(0, 8).map((row, index) => (
                            <TableRow key={index}>
                              {dataColumns.map((column) => (
                                <TableCell key={column}>{formatDataValue(row[column])}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {dataRows.length > 8 && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Showing first 8 of {dataRows.length} rows.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No data bound to this template yet.</p>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <MermaidTemplateLoader onTemplateLoad={handleTemplateLoaded} />
        </div>

        <div className="space-y-4">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Live preview of your Mermaid diagram</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="w-full h-96 border border-border rounded-lg overflow-hidden bg-white">
                <iframe
                  key={iframeKey}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  title="Mermaid Preview"
                  srcDoc={previewHtml}
                />
              </div>
            </CardContent>
          </Card>

          <MermaidTemplateViewer
            template={template}
            onDiagramChange={handleDiagramChange}
            editable={true}
          />
        </div>
      </div>

      {/* CSV Data Mapper Modal */}
      {showCSVMapper && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Map CSV Data to Template</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCSVMapper(false)}
                >
                  ×
                </Button>
              </div>

              <GenericCSVDataMapper
                template={template}
                onDataMapped={handleCSVDataMapped}
                onError={(error) => toast.error(error)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;
