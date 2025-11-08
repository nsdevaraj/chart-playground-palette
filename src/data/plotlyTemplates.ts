export interface PlotlyTemplate {
  name: string;
  description: string;
  version: string;
  metadata: {
    name: string;
    author: string;
    tags: string[];
    license: string;
  };
  data: Record<string, unknown>[];
  layout: Record<string, unknown>;
}

export interface PlotlyTemplateGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  template: PlotlyTemplate;
}

const basicLineChart: PlotlyTemplate = {
  name: "Basic Line Chart",
  description: "Simple line chart for time series visualization",
  version: "1.0.0",
  metadata: {
    name: "Basic Line Chart",
    author: "ChartStudio",
    tags: ["plotly", "line", "chart"],
    license: "MIT",
  },
  data: [
    {
      x: ["Jan", "Feb", "Mar", "Apr"],
      y: [10, 15, 13, 17],
      type: "scatter",
      mode: "lines",
      name: "Series 1",
    },
  ],
  layout: {
    title: "Line Chart",
    xaxis: { title: "Month" },
    yaxis: { title: "Value" },
  },
};

const basicBoxPlot: PlotlyTemplate = {
  name: "Basic Box Plot",
  description: "Box plot for statistical distribution visualization",
  version: "1.0.0",
  metadata: {
    name: "Basic Box Plot",
    author: "ChartStudio",
    tags: ["plotly", "box", "statistics"],
    license: "MIT",
  },
  data: [
    {
      y: [10, 15, 13, 17, 11, 12, 14, 16, 18, 20],
      type: "box",
      name: "Distribution",
    },
  ],
  layout: {
    title: "Box Plot",
    yaxis: { title: "Value" },
  },
};

export const plotlyTemplates: PlotlyTemplateGalleryItem[] = [
  {
    id: "plotly-line",
    title: "Line Chart",
    description: "Interactive line chart for time series data",
    category: "Time Series",
    tags: ["line", "plotly", "interactive"],
    template: basicLineChart,
  },
  {
    id: "plotly-box",
    title: "Box Plot",
    description: "Statistical box plot for distribution analysis",
    category: "Statistics",
    tags: ["box", "plotly", "statistics"],
    template: basicBoxPlot,
  },
];
