export interface EchartsTemplate {
  name: string;
  description: string;
  version: string;
  metadata: {
    name: string;
    author: string;
    tags: string[];
    license: string;
  };
  option: Record<string, unknown>;
}

export interface EchartsTemplateGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  template: EchartsTemplate;
}

const basicBarChart: EchartsTemplate = {
  name: "Basic Bar Chart",
  description: "Simple bar chart for data comparison",
  version: "1.0.0",
  metadata: {
    name: "Basic Bar Chart",
    author: "ChartStudio",
    tags: ["echarts", "bar", "chart"],
    license: "MIT",
  },
  option: {
    title: { text: "Bar Chart" },
    tooltip: {},
    legend: { data: ["Series 1"] },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr"],
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Series 1",
        data: [120, 200, 150, 80],
        type: "bar",
      },
    ],
  },
};

const basicScatterChart: EchartsTemplate = {
  name: "Basic Scatter Chart",
  description: "Scatter chart for correlation analysis",
  version: "1.0.0",
  metadata: {
    name: "Basic Scatter Chart",
    author: "ChartStudio",
    tags: ["echarts", "scatter", "chart"],
    license: "MIT",
  },
  option: {
    title: { text: "Scatter Chart" },
    tooltip: {},
    grid: {},
    xAxis: {},
    yAxis: {},
    series: [
      {
        name: "Series 1",
        data: [[10, 20], [15, 30], [20, 25]],
        type: "scatter",
      },
    ],
  },
};

export const echartsTemplates: EchartsTemplateGalleryItem[] = [
  {
    id: "echarts-bar",
    title: "Bar Chart",
    description: "Basic bar chart for comparing values across categories",
    category: "Basic Charts",
    tags: ["bar", "comparison", "echarts"],
    template: basicBarChart,
  },
  {
    id: "echarts-scatter",
    title: "Scatter Chart",
    description: "Scatter plot for visualizing correlations between variables",
    category: "Analysis",
    tags: ["scatter", "correlation", "echarts"],
    template: basicScatterChart,
  },
];
