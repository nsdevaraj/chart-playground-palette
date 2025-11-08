export interface D3Template {
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

export interface D3TemplateGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  template: D3Template;
}

const basicScatterPlot: D3Template = {
  name: "Basic Scatter Plot",
  description: "Simple scatter plot for analyzing relationships",
  version: "1.0.0",
  metadata: {
    name: "Basic Scatter Plot",
    author: "ChartStudio",
    tags: ["d3", "scatter", "plot"],
    license: "MIT",
  },
  config: {
    width: 800,
    height: 600,
    margin: { top: 20, right: 20, bottom: 30, left: 60 },
    xScale: "linear",
    yScale: "linear",
  },
};

const treeMapTemplate: D3Template = {
  name: "Tree Map",
  description: "Hierarchical tree map for showing hierarchical data",
  version: "1.0.0",
  metadata: {
    name: "Tree Map",
    author: "ChartStudio",
    tags: ["d3", "treemap", "hierarchy"],
    license: "MIT",
  },
  config: {
    width: 800,
    height: 600,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
  },
};

export const d3Templates: D3TemplateGalleryItem[] = [
  {
    id: "d3-scatter",
    title: "Scatter Plot",
    description: "Interactive scatter plot for exploring data relationships",
    category: "Advanced Visualization",
    tags: ["scatter", "d3", "interactive"],
    template: basicScatterPlot,
  },
  {
    id: "d3-treemap",
    title: "Tree Map",
    description: "Hierarchical tree map for visualizing nested structures",
    category: "Hierarchy",
    tags: ["treemap", "d3", "hierarchy"],
    template: treeMapTemplate,
  },
];
