/**
 * Deneb Template Module - Examples and Test Cases
 * 
 * This file contains example templates and test cases demonstrating
 * the functionality of the Deneb template module.
 */

import { DenebTemplate } from './types';

/**
 * Example 1: Basic Bar Chart Template
 */
export const basicBarChartTemplate: DenebTemplate = {
  name: 'Basic Bar Chart',
  description: 'A simple bar chart showing category vs value',
  version: '1.0.0',
  metadata: {
    name: 'Basic Bar Chart',
    author: 'ChartStudio',
    license: 'MIT',
    tags: ['bar', 'basic', 'category'],
  },
  dataConfig: [
    {
      name: 'data',
      description: 'Array of data objects with category and value',
      type: 'array',
      required: true,
      sampleData: [
        { category: 'A', value: 100 },
        { category: 'B', value: 200 },
        { category: 'C', value: 150 },
      ],
    },
  ],
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Sales by Category',
    width: 400,
    height: 300,
    data: {
      values: [
        { category: 'A', value: 100 },
        { category: 'B', value: 200 },
        { category: 'C', value: 150 },
        { category: 'D', value: 180 },
        { category: 'E', value: 140 },
      ],
    },
    mark: 'bar',
    encoding: {
      x: { field: 'category', type: 'nominal', title: 'Category' },
      y: { field: 'value', type: 'quantitative', title: 'Value' },
      color: {
        field: 'value',
        type: 'quantitative',
        scale: { scheme: 'blues' },
      },
    },
  },
};

/**
 * Example 2: Line Chart with Time Series
 */
export const timeSeriesTemplate: DenebTemplate = {
  name: 'Time Series Line Chart',
  description: 'A line chart showing trends over time',
  version: '1.0.0',
  metadata: {
    name: 'Time Series',
    author: 'ChartStudio',
    tags: ['line', 'time-series', 'trend'],
  },
  dataConfig: [
    {
      name: 'data',
      description: 'Time series data with date and value fields',
      type: 'array',
      required: true,
      sampleData: [
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', value: 120 },
        { date: '2024-01-03', value: 110 },
      ],
    },
  ],
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Stock Price Over Time',
    width: 600,
    height: 300,
    data: {
      values: [
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', value: 120 },
        { date: '2024-01-03', value: 110 },
        { date: '2024-01-04', value: 130 },
        { date: '2024-01-05', value: 125 },
      ],
    },
    mark: { type: 'line', point: true },
    encoding: {
      x: { field: 'date', type: 'temporal', title: 'Date' },
      y: { field: 'value', type: 'quantitative', title: 'Price' },
      tooltip: [
        { field: 'date', type: 'temporal' },
        { field: 'value', type: 'quantitative' },
      ],
    },
  },
};

/**
 * Example 3: Scatter Plot with Color Encoding
 */
export const scatterPlotTemplate: DenebTemplate = {
  name: 'Scatter Plot',
  description: 'A scatter plot with color and size encoding',
  version: '1.0.0',
  metadata: {
    name: 'Scatter Plot',
    author: 'ChartStudio',
    tags: ['scatter', 'correlation', 'multi-variable'],
  },
  dataConfig: [
    {
      name: 'data',
      description: 'Data with x, y, and category fields',
      type: 'array',
      required: true,
    },
  ],
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Iris Dataset',
    width: 400,
    height: 300,
    data: {
      values: [
        { x: 5.1, y: 3.5, species: 'setosa' },
        { x: 7.0, y: 3.2, species: 'versicolor' },
        { x: 6.3, y: 3.3, species: 'virginica' },
      ],
    },
    mark: 'circle',
    encoding: {
      x: { field: 'x', type: 'quantitative', title: 'X' },
      y: { field: 'y', type: 'quantitative', title: 'Y' },
      color: { field: 'species', type: 'nominal', title: 'Species' },
      size: { value: 100 },
    },
  },
};

/**
 * Example 4: Multi-layer Dashboard
 */
export const dashboardTemplate: DenebTemplate = {
  name: 'Multi-layer Dashboard',
  description: 'A dashboard with multiple visualization layers',
  version: '1.0.0',
  metadata: {
    name: 'Sales Dashboard',
    author: 'ChartStudio',
    tags: ['dashboard', 'multi-layer', 'sales'],
  },
  dataConfig: [
    {
      name: 'data',
      description: 'Sales data',
      type: 'array',
      required: true,
    },
  ],
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Sales Analysis',
    width: 500,
    height: 350,
    data: {
      values: [
        { month: 'Jan', sales: 1000, target: 1200 },
        { month: 'Feb', sales: 1200, target: 1200 },
        { month: 'Mar', sales: 900, target: 1200 },
        { month: 'Apr', sales: 1500, target: 1200 },
      ],
    },
    layer: [
      {
        mark: 'bar',
        encoding: {
          x: { field: 'month', type: 'nominal' },
          y: { field: 'sales', type: 'quantitative' },
          color: { value: '#1f77b4' },
        },
      },
      {
        mark: { type: 'line', point: true, color: 'red' },
        encoding: {
          x: { field: 'month', type: 'nominal' },
          y: { field: 'target', type: 'quantitative' },
        },
      },
    ],
  },
};

/**
 * Example 5: Heatmap
 */
export const heatmapTemplate: DenebTemplate = {
  name: 'Heatmap',
  description: 'A heatmap visualization for matrix data',
  version: '1.0.0',
  metadata: {
    name: 'Correlation Heatmap',
    author: 'ChartStudio',
    tags: ['heatmap', 'correlation', 'matrix'],
  },
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Correlation Matrix',
    width: 300,
    height: 300,
    data: {
      values: [
        { x: 'A', y: 'A', value: 1.0 },
        { x: 'A', y: 'B', value: 0.8 },
        { x: 'B', y: 'A', value: 0.8 },
        { x: 'B', y: 'B', value: 1.0 },
      ],
    },
    mark: 'rect',
    encoding: {
      x: { field: 'x', type: 'nominal' },
      y: { field: 'y', type: 'nominal' },
      color: {
        field: 'value',
        type: 'quantitative',
        scale: { scheme: 'viridis' },
      },
    },
  },
};

/**
 * Example 6: Template with Parameters
 */
export const parameterizedTemplate: DenebTemplate = {
  name: 'Parameterized Chart',
  description: 'A template with customizable parameters',
  version: '1.0.0',
  parameters: [
    {
      name: 'colorScheme',
      type: 'string',
      description: 'Color scheme for the chart',
      default: 'blues',
      options: ['blues', 'reds', 'greens', 'viridis'],
    },
    {
      name: 'width',
      type: 'number',
      description: 'Chart width',
      default: 400,
    },
    {
      name: 'height',
      type: 'number',
      description: 'Chart height',
      default: 300,
    },
  ],
  vegaLite: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Parameterized Chart',
    width: 400,
    height: 300,
    data: {
      values: [
        { category: 'A', value: 100 },
        { category: 'B', value: 200 },
      ],
    },
    mark: 'bar',
    encoding: {
      x: { field: 'category', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' },
      color: { value: '#1f77b4' },
    },
  },
};

/**
 * Test data samples
 */
export const testDataSamples = {
  categories: [
    { category: 'A', value: 100 },
    { category: 'B', value: 200 },
    { category: 'C', value: 150 },
    { category: 'D', value: 180 },
    { category: 'E', value: 140 },
  ],
  timeSeries: [
    { date: '2024-01-01', value: 100 },
    { date: '2024-01-02', value: 120 },
    { date: '2024-01-03', value: 110 },
    { date: '2024-01-04', value: 130 },
    { date: '2024-01-05', value: 125 },
  ],
  scatter: [
    { x: 5.1, y: 3.5, species: 'setosa' },
    { x: 7.0, y: 3.2, species: 'versicolor' },
    { x: 6.3, y: 3.3, species: 'virginica' },
    { x: 6.5, y: 3.0, species: 'versicolor' },
  ],
};

/**
 * Invalid template examples for testing error handling
 */
export const invalidTemplates = {
  missingName: {
    description: 'No name field',
    template: {
      vegaLite: { mark: 'bar' },
    },
  },
  missingVegaLite: {
    description: 'No vegaLite or template field',
    template: {
      name: 'Invalid',
    },
  },
  invalidVegaLite: {
    description: 'Invalid vega-lite spec',
    template: {
      name: 'Invalid',
      vegaLite: 'not an object',
    },
  },
  invalidDataConfig: {
    description: 'Invalid dataConfig',
    template: {
      name: 'Invalid',
      dataConfig: 'not an array',
      vegaLite: { mark: 'bar' },
    },
  },
};

/**
 * Usage examples
 */
export const usageExamples = {
  loadAndValidate: `
import { loadTemplateFromObject } from '@/lib/deneb/loader';
import { validateDenebTemplate } from '@/lib/deneb/validation';

const template = loadTemplateFromObject(basicBarChartTemplate);
const result = validateDenebTemplate(template);

if (result.valid) {
  console.log('Template is valid!');
} else {
  console.log('Errors:', result.errors);
}
  `,

  bindData: `
import { bindDataToTemplate } from '@/lib/deneb/data';

const data = [
  { category: 'A', value: 100 },
  { category: 'B', value: 200 }
];

const updatedTemplate = bindDataToTemplate(template, data);
  `,

  renderHTML: `
import { generateHTMLFromTemplate } from '@/lib/deneb/renderer';

const html = generateHTMLFromTemplate(template);
document.body.innerHTML = html;
  `,

  useHook: `
import { useDenebTemplate } from '@/hooks/useDenebTemplate';

function MyComponent() {
  const { template, loadFromJSON, setData, getPreviewHTML } = useDenebTemplate();

  return (
    <div>
      {template && <p>Loaded: {template.name}</p>}
    </div>
  );
}
  `,
};

export default {
  basicBarChartTemplate,
  timeSeriesTemplate,
  scatterPlotTemplate,
  dashboardTemplate,
  heatmapTemplate,
  parameterizedTemplate,
  testDataSamples,
  invalidTemplates,
  usageExamples,
};
