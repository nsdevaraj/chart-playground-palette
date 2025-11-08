export interface HighchartsTemplate {
  name: string;
  description: string;
  version: string;
  metadata: {
    name: string;
    author: string;
    tags: string[];
    license: string;
  };
  config: Record<string, unknown>;
}

export interface HighchartsTemplateGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  template: HighchartsTemplate;
}

const basicColumnChart: HighchartsTemplate = {
  name: "Basic Column Chart",
  description: "Simple column chart for data visualization",
  version: "1.0.0",
  metadata: {
    name: "Basic Column Chart",
    author: "ChartStudio",
    tags: ["highcharts", "column", "chart"],
    license: "MIT",
  },
  config: {
    chart: { type: "column" },
    title: { text: "Column Chart" },
    xAxis: { categories: ["Jan", "Feb", "Mar"] },
    yAxis: { title: { text: "Values" } },
    series: [
      {
        name: "Series 1",
        data: [10, 20, 15],
      },
    ],
  },
};

const basicLineChart: HighchartsTemplate = {
  name: "Basic Line Chart",
  description: "Simple line chart for time series data",
  version: "1.0.0",
  metadata: {
    name: "Basic Line Chart",
    author: "ChartStudio",
    tags: ["highcharts", "line", "chart"],
    license: "MIT",
  },
  config: {
    chart: { type: "line" },
    title: { text: "Line Chart" },
    xAxis: { categories: ["Jan", "Feb", "Mar"] },
    yAxis: { title: { text: "Values" } },
    series: [
      {
        name: "Series 1",
        data: [10, 20, 15],
      },
    ],
  },
};

export const highchartsTemplates: HighchartsTemplateGalleryItem[] = [
  {
    id: "highcharts-column",
    title: "Column Chart",
    description: "Basic column chart for comparing values across categories",
    category: "Basic Charts",
    tags: ["column", "comparison", "highcharts"],
    template: basicColumnChart,
  },
  {
    id: "highcharts-line",
    title: "Line Chart",
    description: "Line chart for visualizing trends over time",
    category: "Time Series",
    tags: ["line", "trend", "time-series", "highcharts"],
    template: basicLineChart,
  },
];
