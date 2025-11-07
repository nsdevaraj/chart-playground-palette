import type { DenebTemplate } from "@/lib/deneb/types";

export interface DenebTemplateGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  template: DenebTemplate;
  sampleData?: Record<string, unknown>[] | Record<string, unknown>;
}

const regionalSalesData = [
  { region: "North America", quarter: "Q1", revenue: 320 },
  { region: "North America", quarter: "Q2", revenue: 360 },
  { region: "North America", quarter: "Q3", revenue: 410 },
  { region: "North America", quarter: "Q4", revenue: 470 },
  { region: "Europe", quarter: "Q1", revenue: 280 },
  { region: "Europe", quarter: "Q2", revenue: 300 },
  { region: "Europe", quarter: "Q3", revenue: 330 },
  { region: "Europe", quarter: "Q4", revenue: 390 },
  { region: "Asia Pacific", quarter: "Q1", revenue: 250 },
  { region: "Asia Pacific", quarter: "Q2", revenue: 310 },
  { region: "Asia Pacific", quarter: "Q3", revenue: 360 },
  { region: "Asia Pacific", quarter: "Q4", revenue: 410 },
  { region: "Latin America", quarter: "Q1", revenue: 150 },
  { region: "Latin America", quarter: "Q2", revenue: 170 },
  { region: "Latin America", quarter: "Q3", revenue: 190 },
  { region: "Latin America", quarter: "Q4", revenue: 220 },
];

const regionalSalesTemplate: DenebTemplate = {
  name: "Regional Sales Breakdown",
  description: "Grouped bar comparison of quarterly revenue across global regions.",
  version: "1.0.0",
  metadata: {
    name: "Regional Sales Breakdown",
    author: "ChartStudio Palette",
    tags: ["deneb", "bar", "grouped", "vega-lite", "business"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Quarterly revenue in thousands of USD by region.",
      type: "array",
      required: true,
      sampleData: regionalSalesData,
    },
  ],
  vegaLite: {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: {
      text: "Quarterly Revenue by Region",
      subtitle: "FY2024 (USD thousands)",
    },
    description: "Grouped bar chart comparing how each region performed across quarters.",
    width: 420,
    height: 320,
    data: {
      values: regionalSalesData,
    },
    mark: {
      type: "bar",
      cornerRadiusEnd: 4,
      tooltip: true,
    },
    encoding: {
      x: {
        field: "quarter",
        type: "ordinal",
        sort: ["Q1", "Q2", "Q3", "Q4"],
        title: "Quarter",
      },
      y: {
        field: "revenue",
        type: "quantitative",
        title: "Revenue (USD thousands)",
      },
      xOffset: {
        field: "region",
      },
      color: {
        field: "region",
        type: "nominal",
        legend: {
          title: "Region",
          orient: "bottom",
        },
        scale: {
          scheme: "tableau10",
        },
      },
      tooltip: [
        { field: "region", type: "nominal", title: "Region" },
        { field: "quarter", type: "ordinal", title: "Quarter" },
        {
          field: "revenue",
          type: "quantitative",
          title: "Revenue",
          format: "~s",
        },
      ],
    },
    config: {
      mark: {
        tooltip: true,
      },
      axis: {
        labelFontSize: 12,
        titleFontSize: 12,
      },
      view: {
        stroke: null,
      },
    },
  },
};

const revenueTrendData = [
  { date: "2024-01-01", metric: "Actual", value: 38 },
  { date: "2024-02-01", metric: "Actual", value: 42 },
  { date: "2024-03-01", metric: "Actual", value: 48 },
  { date: "2024-04-01", metric: "Actual", value: 53 },
  { date: "2024-05-01", metric: "Actual", value: 57 },
  { date: "2024-06-01", metric: "Actual", value: 60 },
  { date: "2024-07-01", metric: "Actual", value: 63 },
  { date: "2024-08-01", metric: "Actual", value: 66 },
  { date: "2024-09-01", metric: "Actual", value: 68 },
  { date: "2024-10-01", metric: "Actual", value: 70 },
  { date: "2024-11-01", metric: "Actual", value: 72 },
  { date: "2024-12-01", metric: "Actual", value: 74 },
  { date: "2024-01-01", metric: "Forecast", value: 36 },
  { date: "2024-02-01", metric: "Forecast", value: 39 },
  { date: "2024-03-01", metric: "Forecast", value: 44 },
  { date: "2024-04-01", metric: "Forecast", value: 49 },
  { date: "2024-05-01", metric: "Forecast", value: 53 },
  { date: "2024-06-01", metric: "Forecast", value: 57 },
  { date: "2024-07-01", metric: "Forecast", value: 60 },
  { date: "2024-08-01", metric: "Forecast", value: 63 },
  { date: "2024-09-01", metric: "Forecast", value: 65 },
  { date: "2024-10-01", metric: "Forecast", value: 67 },
  { date: "2024-11-01", metric: "Forecast", value: 69 },
  { date: "2024-12-01", metric: "Forecast", value: 70 },
];

const revenueTrendTemplate: DenebTemplate = {
  name: "Revenue vs Forecast Trend",
  description: "Dual-series line chart comparing actual revenue versus forecast targets.",
  version: "1.0.0",
  metadata: {
    name: "Revenue vs Forecast Trend",
    author: "ChartStudio Palette",
    tags: ["deneb", "line", "time-series", "forecast"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Monthly revenue and forecast values in millions of USD.",
      type: "array",
      required: true,
      sampleData: revenueTrendData,
    },
  ],
  vegaLite: {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: {
      text: "Revenue vs Forecast Trend",
      subtitle: "Rolling 12 months (USD millions)",
    },
    description: "Interactive comparison between actuals and forecast with legend highlight.",
    width: 520,
    height: 320,
    data: {
      values: revenueTrendData,
    },
    layer: [
      {
        params: [
          {
            name: "highlight",
            select: {
              type: "point",
              fields: ["metric"],
            },
            bind: "legend",
          },
        ],
        mark: {
          type: "line",
          interpolate: "monotone",
          point: true,
          tooltip: true,
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal",
            title: "Month",
            axis: {
              format: "%b",
            },
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Revenue (USD millions)",
            scale: {
              nice: true,
            },
          },
          color: {
            field: "metric",
            type: "nominal",
            legend: {
              title: "Series",
              orient: "bottom",
            },
            scale: {
              range: ["#2563eb", "#f97316"],
            },
          },
          strokeWidth: {
            condition: {
              param: "highlight",
              empty: false,
              value: 4,
            },
            value: 2,
          },
          opacity: {
            condition: {
              param: "highlight",
              value: 1,
              empty: false,
            },
            value: 0.4,
          },
          tooltip: [
            { field: "metric", type: "nominal", title: "Series" },
            { field: "date", type: "temporal", title: "Month", format: "%b %Y" },
            {
              field: "value",
              type: "quantitative",
              title: "Value",
              format: "~s",
            },
          ],
        },
      },
    ],
    config: {
      mark: {
        tooltip: true,
      },
      axis: {
        labelFontSize: 12,
        titleFontSize: 12,
      },
      view: {
        stroke: null,
      },
    },
  },
};

const segmentationData = [
  { segment: "Enterprise", satisfaction: 88, spend: 420, customers: 120, region: "Americas" },
  { segment: "Enterprise", satisfaction: 86, spend: 370, customers: 110, region: "EMEA" },
  { segment: "Enterprise", satisfaction: 82, spend: 390, customers: 95, region: "APAC" },
  { segment: "Growth", satisfaction: 75, spend: 210, customers: 340, region: "Americas" },
  { segment: "Growth", satisfaction: 78, spend: 240, customers: 280, region: "EMEA" },
  { segment: "Growth", satisfaction: 73, spend: 220, customers: 260, region: "APAC" },
  { segment: "SMB", satisfaction: 68, spend: 140, customers: 510, region: "Americas" },
  { segment: "SMB", satisfaction: 70, spend: 150, customers: 430, region: "EMEA" },
  { segment: "SMB", satisfaction: 65, spend: 130, customers: 460, region: "APAC" },
  { segment: "Startup", satisfaction: 74, spend: 90, customers: 620, region: "Americas" },
  { segment: "Startup", satisfaction: 76, spend: 95, customers: 560, region: "EMEA" },
  { segment: "Startup", satisfaction: 72, spend: 88, customers: 540, region: "APAC" },
];

const segmentationTemplate: DenebTemplate = {
  name: "Customer Segmentation Insights",
  description: "Scatter plot showing spend versus satisfaction by segment with regional filtering.",
  version: "1.0.0",
  metadata: {
    name: "Customer Segmentation Insights",
    author: "ChartStudio Palette",
    tags: ["deneb", "scatter", "segmentation", "analytics"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Customer segment performance with satisfaction and spend.",
      type: "array",
      required: true,
      sampleData: segmentationData,
    },
  ],
  vegaLite: {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: {
      text: "Customer Segmentation Insights",
      subtitle: "Average satisfaction vs quarterly spend",
    },
    description: "Interactive scatter plot highlighting customer segments by region.",
    width: 520,
    height: 320,
    data: {
      values: segmentationData,
    },
    params: [
      {
        name: "segmentHover",
        select: {
          type: "point",
          fields: ["segment"],
          on: "pointerover",
          clear: "pointerout",
        },
      },
      {
        name: "regionFilter",
        select: {
          type: "point",
          fields: ["region"],
        },
        bind: "legend",
      },
    ],
    mark: {
      type: "circle",
      filled: true,
      tooltip: true,
    },
    encoding: {
      x: {
        field: "satisfaction",
        type: "quantitative",
        title: "Satisfaction (%)",
        scale: {
          domain: [60, 95],
        },
      },
      y: {
        field: "spend",
        type: "quantitative",
        title: "Average Quarterly Spend (USD thousands)",
        scale: {
          nice: true,
        },
      },
      color: {
        field: "region",
        type: "nominal",
        legend: {
          title: "Region",
          orient: "bottom",
        },
        scale: {
          scheme: "set2",
        },
      },
      size: {
        field: "customers",
        type: "quantitative",
        title: "Customers",
        scale: {
          range: [80, 800],
        },
      },
      opacity: {
        condition: [
          {
            param: "segmentHover",
            value: 1,
          },
          {
            param: "regionFilter",
            value: 1,
            empty: false,
          },
        ],
        value: 0.3,
      },
      tooltip: [
        { field: "segment", type: "nominal", title: "Segment" },
        { field: "region", type: "nominal", title: "Region" },
        {
          field: "satisfaction",
          type: "quantitative",
          title: "Satisfaction",
          format: ".0f",
        },
        {
          field: "spend",
          type: "quantitative",
          title: "Spend",
          format: "~s",
        },
        {
          field: "customers",
          type: "quantitative",
          title: "Customers",
          format: "~s",
        },
      ],
    },
    config: {
      mark: {
        tooltip: true,
      },
      axis: {
        labelFontSize: 12,
        titleFontSize: 12,
      },
      view: {
        stroke: null,
      },
    },
  },
};

const performanceHeatmapData = [
  { team: "Alpha", metric: "Velocity", score: 86 },
  { team: "Alpha", metric: "Quality", score: 92 },
  { team: "Alpha", metric: "Predictability", score: 78 },
  { team: "Alpha", metric: "Collaboration", score: 84 },
  { team: "Beta", metric: "Velocity", score: 74 },
  { team: "Beta", metric: "Quality", score: 88 },
  { team: "Beta", metric: "Predictability", score: 83 },
  { team: "Beta", metric: "Collaboration", score: 76 },
  { team: "Gamma", metric: "Velocity", score: 90 },
  { team: "Gamma", metric: "Quality", score: 96 },
  { team: "Gamma", metric: "Predictability", score: 88 },
  { team: "Gamma", metric: "Collaboration", score: 92 },
  { team: "Delta", metric: "Velocity", score: 68 },
  { team: "Delta", metric: "Quality", score: 81 },
  { team: "Delta", metric: "Predictability", score: 72 },
  { team: "Delta", metric: "Collaboration", score: 74 },
];

const performanceHeatmapTemplate: DenebTemplate = {
  name: "Team Performance Heatmap",
  description: "Correlation heatmap highlighting team performance across agile metrics.",
  version: "1.0.0",
  metadata: {
    name: "Team Performance Heatmap",
    author: "ChartStudio Palette",
    tags: ["deneb", "heatmap", "agile", "operations"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Team scores for agile delivery metrics.",
      type: "array",
      required: true,
      sampleData: performanceHeatmapData,
    },
  ],
  vegaLite: {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: {
      text: "Team Performance Heatmap",
      subtitle: "Scores across delivery metrics (0-100)",
    },
    description: "Heatmap showing how each team performs across key agile metrics.",
    width: 420,
    height: 320,
    data: {
      values: performanceHeatmapData,
    },
    mark: "rect",
    encoding: {
      x: {
        field: "team",
        type: "nominal",
        title: "Team",
        sort: ["Alpha", "Beta", "Gamma", "Delta"],
      },
      y: {
        field: "metric",
        type: "nominal",
        title: "Metric",
        sort: ["Velocity", "Quality", "Predictability", "Collaboration"],
      },
      color: {
        field: "score",
        type: "quantitative",
        legend: {
          title: "Score",
          orient: "bottom",
        },
        scale: {
          scheme: "turbo",
        },
      },
      tooltip: [
        { field: "team", type: "nominal", title: "Team" },
        { field: "metric", type: "nominal", title: "Metric" },
        {
          field: "score",
          type: "quantitative",
          title: "Score",
          format: ".0f",
        },
      ],
    },
    params: [
      {
        name: "heatHover",
        select: {
          type: "point",
          on: "pointerover",
          clear: "pointerout",
          fields: ["team", "metric"],
        },
      },
    ],
    config: {
      view: {
        stroke: null,
      },
      axis: {
        labelFontSize: 12,
        titleFontSize: 12,
      },
      mark: {
        tooltip: true,
      },
    },
  },
};

const forecastBandData = [
  { date: "2024-01-01", actual: 22, lower: 20, upper: 25 },
  { date: "2024-02-01", actual: 24, lower: 21, upper: 27 },
  { date: "2024-03-01", actual: 26, lower: 23, upper: 29 },
  { date: "2024-04-01", actual: 29, lower: 26, upper: 32 },
  { date: "2024-05-01", actual: 31, lower: 28, upper: 34 },
  { date: "2024-06-01", actual: 33, lower: 30, upper: 36 },
  { date: "2024-07-01", actual: 35, lower: 32, upper: 38 },
  { date: "2024-08-01", actual: 36, lower: 33, upper: 39 },
  { date: "2024-09-01", actual: 37, lower: 34, upper: 40 },
  { date: "2024-10-01", actual: 39, lower: 36, upper: 42 },
  { date: "2024-11-01", actual: 41, lower: 38, upper: 44 },
  { date: "2024-12-01", actual: 43, lower: 40, upper: 46 },
];

const forecastBandTemplate: DenebTemplate = {
  name: "Revenue Forecast Band",
  description: "Forecast cone showing lower and upper bounds around the actual series.",
  version: "1.0.0",
  metadata: {
    name: "Revenue Forecast Band",
    author: "ChartStudio Palette",
    tags: ["deneb", "forecast", "area", "band"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Monthly actual revenue with confidence interval bounds in millions of USD.",
      type: "array",
      required: true,
      sampleData: forecastBandData,
    },
  ],
  vegaLite: {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: {
      text: "Revenue Forecast Band",
      subtitle: "Actual results with 80% confidence interval",
    },
    description: "Layered chart combining forecast interval band with the actual trend line.",
    width: 520,
    height: 320,
    data: {
      values: forecastBandData,
    },
    layer: [
      {
        mark: {
          type: "area",
          color: "#bfdbfe",
          opacity: 0.6,
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal",
            title: "Month",
            axis: {
              format: "%b",
            },
          },
          y: {
            field: "upper",
            type: "quantitative",
            title: "Revenue (USD millions)",
          },
          y2: {
            field: "lower",
          },
          tooltip: [
            { field: "date", type: "temporal", title: "Month", format: "%b %Y" },
            {
              field: "lower",
              type: "quantitative",
              title: "Lower",
              format: "~s",
            },
            {
              field: "upper",
              type: "quantitative",
              title: "Upper",
              format: "~s",
            },
          ],
        },
      },
      {
        mark: {
          type: "line",
          color: "#1d4ed8",
          strokeWidth: 3,
          interpolate: "monotone",
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal",
            title: "Month",
          },
          y: {
            field: "actual",
            type: "quantitative",
            title: "Revenue (USD millions)",
          },
        },
      },
      {
        mark: {
          type: "point",
          color: "#1d4ed8",
          filled: true,
          size: 60,
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal",
          },
          y: {
            field: "actual",
            type: "quantitative",
          },
          tooltip: [
            { field: "date", type: "temporal", title: "Month", format: "%b %Y" },
            {
              field: "actual",
              type: "quantitative",
              title: "Actual",
              format: "~s",
            },
          ],
        },
      },
    ],
    config: {
      axis: {
        labelFontSize: 12,
        titleFontSize: 12,
      },
      view: {
        stroke: null,
      },
      mark: {
        tooltip: true,
      },
    },
  },
};

const ganttChartData = [
  {
    "id": 1,
    "phase": "Initiation",
    "task": "Requirements gathering",
    "milestone": null,
    "start": "01/03/2023",
    "end": "03/03/2023",
    "completion": 50,
    "dependencies": null
  },
  {
    "id": 2,
    "phase": "Initiation",
    "task": "Stakeholder workshop",
    "milestone": null,
    "start": "05/03/2023",
    "end": "06/03/2023",
    "completion": 75,
    "dependencies": null
  },
  {
    "id": 3,
    "phase": "Initiation",
    "task": "Story boarding",
    "milestone": null,
    "start": "05/03/2023",
    "end": "12/03/2023",
    "completion": 80,
    "dependencies": "1"
  },
  {
    "id": 4,
    "phase": "Initiation",
    "task": "Initiation complete",
    "milestone": true,
    "start": "13/03/2023",
    "end": "13/03/2023",
    "completion": 100,
    "dependencies": 3
  },
  {
    "id": 5,
    "phase": "Design",
    "task": "E2E data solution design",
    "milestone": null,
    "start": "07/03/2023",
    "end": "15/03/2023",
    "completion": 35,
    "dependencies": null
  },
  {
    "id": 6,
    "phase": "Design",
    "task": "Wireframes",
    "milestone": null,
    "start": "12/03/2023",
    "end": "16/03/2023",
    "completion": 80,
    "dependencies": "5"
  },
  {
    "id": 7,
    "phase": "Design",
    "task": "Prototyping",
    "milestone": null,
    "start": "13/03/2023",
    "end": "22/03/2023",
    "completion": 40,
    "dependencies": 6
  },
  {
    "id": 8,
    "phase": "Design",
    "task": "Design complete",
    "milestone": true,
    "start": "22/03/2023",
    "end": "22/03/2023",
    "completion": 0,
    "dependencies": 7
  },
  {
    "id": 9,
    "phase": "Implementation",
    "task": "ETL",
    "milestone": null,
    "start": "09/03/2023",
    "end": "19/03/2023",
    "completion": 15,
    "dependencies": null
  },
  {
    "id": 10,
    "phase": "Implementation",
    "task": "Data modelling",
    "milestone": null,
    "start": "15/03/2023",
    "end": "21/03/2023",
    "completion": 40,
    "dependencies": null
  }
];

const ganttChartTemplate: DenebTemplate = {
  name: "Gantt Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Gantt Chart",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Gantt Chart data",
      type: "array",
      required: true,
      sampleData: ganttChartData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Dataviz by David Bacci: https://www.linkedin.com/in/davbacci/",
  "autosize": "pad",
  "width": 1200,
  "height": 500,
  "padding": {
    "left": 5,
    "right": 0,
    "top": 5,
    "bottom": 0
  },
  "signals": [
    {
      "name": "showTooltips",
      "value": true
    },
    {
      "name": "initDate",
      "value": "project",
      "description": "The initial date shown in the Gantt. Can be either 'today' or 'project'"
    },
    {
      "name": "showButtons",
      "value": true
    },
    {
      "name": "showDomainSpanLabel",
      "value": false
    },
    {
      "name": "startGrain",
      "value": "Days",
      "description": "Days, Months, Years or All"
    },
    {
      "name": "initPhaseState",
      "value": "openRows",
      "description": "openRows or closeRows"
    },
    {
      "name": "initColumnState",
      "value": "openColumns",
      "description": "openColumns or closeColumns"
    },
    {
      "name": "textColour",
      "value": "#666666"
    },
    {
      "name": "colours",
      "value": {
        "dark": [
          "#377eb9",
          "#4db04a",
          "#974ea2",
          "#ff8000",
          "#e61a1d"
        ],
        "light": [
          "#a5c8e4",
          "#b5dfb3",
          "#d3b0d9",
          "#ffcc99",
          "#f5a3a5"
        ]
      }
    },
    {
      "name": "statusColumn",
      "value": {
        "domain": [
          "Low",
          "Medium",
          "High",
          "Very High"
        ],
        "range": [
          "L",
          "M",
          "H",
          "VH"
        ],
        "font": [
          "#43864d",
          "#af7a37",
          "#ad622c",
          "#b73133"
        ],
        "background": [
          "#c6efce",
          "#ffeb9c",
          "#f8cbad",
          "#ffbfc1"
        ]
      }
    },
    {
      "name": "yRowHeight",
      "value": 33,
      "description": "Height in pixels"
    },
    {
      "name": "yRowPadding",
      "value": 0.22,
      "description": "Row padding as % of yRowHeight (each side)"
    },
    {
      "name": "yPaddingInner",
      "init": "yRowPadding * yRowHeight"
    },
    {
      "name": "taskColumnWidth",
      "init": "155+columnPadding"
    },
    {
      "name": "startColumnWidth",
      "init": "45+columnPadding"
    },
    {
      "name": "endColumnWidth",
      "init": "45+columnPadding"
    },
    {
      "name": "daysColumnWidth",
      "init": "35+columnPadding"
    },
    {
      "name": "statusColumnWidth",
      "init": "statusColumnPresent?47+columnPadding:0"
    },
    {
      "name": "progressColumnWidth",
      "init": "55+columnPadding"
    },
    {
      "name": "columnPadding",
      "value": 15
    },
    {
      "name": "statusColumnPresent",
      "init": "data('dataset')[0]['status']!=null"
    },
    {
      "name": "oneDay",
      "init": "1000*60*60*24"
    },
    {
      "name": "timeoffset",
      "init": "timezoneoffset(data('dataset')[0]['start']) * 60 *1000"
    },
    {
      "name": "dayBandwidth",
      "update": "scale('x', timeOffset('day', datetime(2000,1,1),1)) - scale('x', datetime(2000,1,1))"
    },
    {
      "name": "dayBandwidthRound",
      "update": "(round(dayBandwidth *100)/100)"
    },
    {
      "name": "minDayBandwidth",
      "value": 20
    },
    {
      "name": "minMonthBandwidth",
      "value": 3
    },
    {
      "name": "minYearBandwidth",
      "value": 0.95
    },
    {
      "name": "milestoneSymbolSize",
      "value": 400
    },
    {
      "name": "arrowSymbolSize",
      "value": 70
    },
    {
      "name": "phaseSymbolHeight",
      "init": "bandwidth('y')-yPaddingInner-5"
    },
    {
      "name": "phaseSymbolWidth",
      "value": 10
    },
    {
      "name": "columnsWidth",
      "update": "!showColumns?taskColumnWidth: taskColumnWidth+startColumnWidth+endColumnWidth+daysColumnWidth+statusColumnWidth+progressColumnWidth"
    },
    {
      "name": "ganttWidth",
      "update": "width-columnsWidth-minDayBandwidth"
    },
    {
      "name": "dayExt",
      "init": "initDate=='project'? [data('xExt')[0]['s']-oneDay,data('xExt')[0]['s']+ ((ganttWidth-minDayBandwidth)/minDayBandwidth)*oneDay]:[today-oneDay,today+ ((ganttWidth-minDayBandwidth)/minDayBandwidth)*oneDay]"
    },
    {
      "name": "monthExt",
      "init": "initDate=='project'? [data('xExt')[0]['s']-oneDay ,data('xExt')[0]['s'] + ganttWidth/2*oneDay]:[today-(oneDay*15) ,today + ganttWidth/2*oneDay]"
    },
    {
      "name": "yearExt",
      "init": "initDate=='project'? [data('xExt')[0]['s']-oneDay,data('xExt')[0]['s'] + ganttWidth/0.35*oneDay]:[today-(oneDay*180),today + ganttWidth/0.35*oneDay]"
    },
    {
      "name": "allExt",
      "init": "[data('xExt')[0]['s']-oneDay,data('xExt')[0]['e']+oneDay*9]"
    },
    {
      "name": "xExt",
      "update": "startGrain=='All'?allExt:startGrain=='Years'?yearExt:startGrain=='Months'?monthExt:dayExt"
    },
    {
      "name": "today",
      "init": "+datetime(year(now()),month(now()),date(now()))"
    },
    {
      "name": "todayRule",
      "init": "timeFormat(today,'%d/%m/%y')"
    },
    {
      "name": "zoom",
      "value": 1,
      "on": [
        {
          "events": "wheel!",
          "force": true,
          "update": "x()>columnsWidth?pow(1.001, (event.deltaY) * pow(16, event.deltaMode)):1"
        }
      ]
    },
    {
      "name": "xDomMinSpan",
      "update": "span(dayExt)"
    },
    {
      "name": "xDomMaxSpan",
      "update": "round((ganttWidth/0.13)*oneDay)"
    },
    {
      "name": "xDom",
      "init": "xExt",
      "on": [
        {
          "events": {
            "signal": "xDomPre"
          },
          "update": "span(xDomPre)<xDomMinSpan?[anchor + (xDom[0] - anchor) * (zoom*(xDomMinSpan/span(xDomPre))), anchor + (xDom[1] - anchor) * (zoom*(xDomMinSpan/span(xDomPre)))]:span(xDomPre)>xDomMaxSpan?[anchor + (xDom[0] - anchor) * (zoom*(xDomMaxSpan/span(xDomPre))), anchor + (xDom[1] - anchor) * (zoom*(xDomMaxSpan/span(xDomPre)))] :xDomPre"
        },
        {
          "events": {
            "signal": "delta"
          },
          "update": "[xCur[0] + span(xCur) * delta[0] / width, xCur[1] + span(xCur) * delta[0] / width]"
        },
        {
          "events": "dblclick",
          "update": "xExt"
        },
        {
          "events": "@buttonMarks:click",
          "update": "datum.name=='All'?allExt:datum.name=='Years'?yearExt:datum.name=='Months'?monthExt:datum.name=='Days'?dayExt:xDom"
        },
        {
          "events": {
            "signal": "ganttWidth"
          },
          "update": "[xDom[0],xDom[0]+((ganttWidth/ganttWidthOld)*span(xDom))]"
        }
      ]
    },
    {
      "name": "ganttWidthOld",
      "init": "ganttWidth",
      "on": [
        {
          "events": {
            "signal": "showColumns"
          },
          "update": "ganttWidth==ganttWidthOld?ganttWidthOld:ganttWidth"
        }
      ]
    },
    {
      "name": "scaledHeight",
      "update": "data('yScale').length * yRowHeight"
    },
    {
      "name": "yRange",
      "update": "[yRange!=null?yRange[0]:0,yRange!=null?yRange[0]+scaledHeight:scaledHeight]",
      "on": [
        {
          "events": [
            {
              "signal": "delta"
            }
          ],
          "update": "clampRange( [yCur[0] + span(yCur) * delta[1] / scaledHeight, yCur[1] + span(yCur) * delta[1] / scaledHeight],height>=scaledHeight?0: height-scaledHeight,height>=scaledHeight?height:scaledHeight)"
        },
        {
          "events": "dblclick",
          "update": "[0,scaledHeight]"
        },
        {
          "events": {
            "signal": "closeRowsAll"
          },
          "update": "closeRowsAll?[0, scaledHeight]:yRange"
        }
      ]
    },
    {
      "name": "xDomPre",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": {
            "signal": "zoom"
          },
          "update": "[anchor + (xDom[0] - anchor) * zoom, anchor + (xDom[1] - anchor) * zoom]"
        }
      ]
    },
    {
      "name": "anchor",
      "value": 0,
      "on": [
        {
          "events": "wheel",
          "update": "+invert('x', x()-columnsWidth)"
        }
      ]
    },
    {
      "name": "xCur",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": "pointerdown",
          "update": "slice(xDom)"
        }
      ]
    },
    {
      "name": "yCur",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": "pointerdown",
          "update": "slice(yRange)"
        }
      ]
    },
    {
      "name": "delta",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": [
            {
              "source": "window",
              "type": "pointermove",
              "consume": true,
              "between": [
                {
                  "type": "pointerdown"
                },
                {
                  "source": "window",
                  "type": "pointerup"
                }
              ]
            }
          ],
          "update": "down ? [down[0]-x(), y()-down[1]] : [0,0]"
        }
      ]
    },
    {
      "name": "down",
      "value": null,
      "on": [
        {
          "events": "pointerdown",
          "update": "xy()"
        },
        {
          "events": "pointerup",
          "update": "null"
        }
      ]
    },
    {
      "name": "phaseClicked",
      "value": null,
      "on": [
        {
          "events": "@taskSelector:click,@phaseOutline:click",
          "update": " yCur[0]==yRange[0] && yCur[1]==yRange[1]&& xCur[0]===xDom[0]&& xCur[1]===xDom[1] && datum.phase==datum.task?  {phase: datum.phase}:null",
          "force": true
        },
        {
          "events": "@taskTooltips:click",
          "update": " yCur[0]==yRange[0] && yCur[1]==yRange[1]&& xCur[0]===xDom[0]&& xCur[1]===xDom[1] && datum.datum.phase==datum.datum.task?  {phase: datum.datum.phase}:null",
          "force": true
        }
      ]
    },
    {
      "name": "itemHovered",
      "value": {
        "id": "",
        "dependencies": []
      },
      "on": [
        {
          "events": "@taskSelector:mouseover,@phaseOutline:mouseover,@milestoneSymbols:mouseover,@taskBars:mouseover,@taskNames:mouseover,@taskLabels:mouseover",
          "update": "{'id': datum.id, 'dependencies':split(datum.dependencies,',')}"
        },
        {
          "events": "@taskTooltips:mouseover",
          "update": "{'id': toString(datum.datum.id), 'dependencies':split(datum.datum.dependencies,',')}"
        },
        {
          "events": "@taskSelector:mouseout,@phaseOutline:mouseout,@milestoneSymbols:mouseout,@taskBars:mouseout,@taskNames:mouseout,@taskLabels:mouseout,@taskTooltips:mouseout",
          "update": "{'id': '', 'dependencies':[]}"
        }
      ]
    },
    {
      "name": "hover",
      "value": "",
      "on": [
        {
          "events": "@buttonMarks:pointerover",
          "update": "datum.name?datum.name:''",
          "force": true
        },
        {
          "events": "@buttonMarks:pointerout",
          "update": "''",
          "force": true
        }
      ]
    },
    {
      "name": "showColumns",
      "update": "initColumnState=='openColumns'?true:false",
      "on": [
        {
          "events": "@buttonMarks:click",
          "update": "datum.name=='closeColumns'?false:datum.name=='openColumns'?true:showColumns",
          "force": true
        }
      ]
    },
    {
      "name": "closeRowsAll",
      "on": [
        {
          "events": "@buttonMarks:click",
          "update": "datum.name=='closeRows'?true:false",
          "force": true
        }
      ]
    },
    {
      "name": "openRowsAll",
      "on": [
        {
          "events": "@buttonMarks:click",
          "update": "datum.name=='openRows'?true:false",
          "force": true
        }
      ]
    }
  ],
  "data": [
    {
      "name": "dataset",
      "values": [
        {
          "id": 1,
          "phase": "Initiation",
          "task": "Requirements gathering",
          "milestone": null,
          "start": "03/09/2025",
          "end": "05/09/2025",
          "completion": 50,
          "dependencies": "",
          "assignee": "",
          "status": "Medium",
          "hyperlink": ""
        },
        {
          "id": 99,
          "phase": "Initiation",
          "task": "Requirements gathering",
          "milestone": null,
          "start": "06/09/2025",
          "end": "07/09/2025",
          "completion": 55,
          "dependencies": "",
          "assignee": "Dav Bacci",
          "status": "Medium",
          "hyperlink": ""
        },
        {
          "id": 2,
          "phase": "Initiation",
          "task": "Stakeholder workshop excluding Execs",
          "milestone": null,
          "start": "07/09/2025",
          "end": "08/09/2025",
          "completion": 75,
          "dependencies": "",
          "assignee": "",
          "status": "High",
          "hyperlink": ""
        },
        {
          "id": 3,
          "phase": "Initiation",
          "task": "Story boarding",
          "milestone": null,
          "start": "07/09/2025",
          "end": "14/09/2025",
          "completion": 80,
          "dependencies": "99,2",
          "assignee": "",
          "status": "Low",
          "hyperlink": ""
        },
        {
          "id": 4,
          "phase": "Initiation",
          "task": "Initiation complete",
          "milestone": true,
          "start": "15/09/2025",
          "end": "15/09/2025",
          "completion": 100,
          "dependencies": "3,3",
          "assignee": "",
          "status": "",
          "hyperlink": ""
        },
        {
          "id": 5,
          "phase": "Design",
          "task": "E2E data solution design",
          "milestone": null,
          "start": "09/09/2025",
          "end": "10/09/2025",
          "completion": 35,
          "dependencies": "",
          "assignee": "",
          "status": "Medium",
          "hyperlink": ""
        },
        {
          "id": 6,
          "phase": "Design",
          "task": "Wireframes",
          "milestone": null,
          "start": "14/09/2025",
          "end": "18/09/2025",
          "completion": 80,
          "dependencies": "",
          "assignee": "",
          "status": "Medium",
          "hyperlink": ""
        },
        {
          "id": 7,
          "phase": "Design",
          "task": "Prototyping",
          "milestone": null,
          "start": "15/09/2025",
          "end": "24/09/2025",
          "completion": 40,
          "dependencies": "6",
          "assignee": "",
          "status": "High",
          "hyperlink": ""
        },
        {
          "id": 8,
          "phase": "Design",
          "task": "Design complete",
          "milestone": true,
          "start": "24/09/2025",
          "end": "24/09/2025",
          "completion": 0,
          "dependencies": "4",
          "assignee": "",
          "status": "",
          "hyperlink": ""
        },
        {
          "id": 9,
          "phase": "Implementation",
          "task": "ETL",
          "milestone": null,
          "start": "11/09/2025",
          "end": "21/09/2025",
          "completion": 15,
          "dependencies": "",
          "assignee": "",
          "status": "Very High",
          "hyperlink": ""
        },
        {
          "id": 10,
          "phase": "Implementation",
          "task": "Data modelling",
          "milestone": null,
          "start": "17/09/2025",
          "end": "23/09/2025",
          "completion": 40,
          "dependencies": "",
          "assignee": "",
          "status": "High",
          "hyperlink": ""
        },
        {
          "id": 11,
          "phase": "Implementation",
          "task": "Measures & KPIs",
          "milestone": null,
          "start": "17/09/2025",
          "end": "19/09/2025",
          "completion": 50,
          "dependencies": "",
          "assignee": "",
          "status": "Very High",
          "hyperlink": ""
        },
        {
          "id": 12,
          "phase": "Implementation",
          "task": "Dataviz",
          "milestone": null,
          "start": "22/09/2025",
          "end": "25/09/2025",
          "completion": 15,
          "dependencies": "11",
          "assignee": "",
          "status": "Medium",
          "hyperlink": ""
        },
        {
          "id": 13,
          "phase": "Implementation",
          "task": "Performance testing",
          "milestone": null,
          "start": "25/09/2025",
          "end": "30/09/2025",
          "completion": 20,
          "dependencies": "",
          "assignee": "",
          "status": "Low",
          "hyperlink": ""
        },
        {
          "id": 14,
          "phase": "Implementation",
          "task": "Implementation complete",
          "milestone": true,
          "start": "01/10/2025",
          "end": "01/10/2025",
          "completion": 0,
          "dependencies": "13",
          "assignee": "",
          "status": "",
          "hyperlink": ""
        },
        {
          "id": 15,
          "phase": "Deployment",
          "task": "User training",
          "milestone": null,
          "start": "01/10/2025",
          "end": "06/10/2025",
          "completion": 65,
          "dependencies": "17",
          "assignee": "",
          "status": "Medium",
          "hyperlink": ""
        },
        {
          "id": 16,
          "phase": "Deployment",
          "task": "Refresh schedule & alerts",
          "milestone": null,
          "start": "29/09/2025",
          "end": "30/09/2025",
          "completion": 50,
          "dependencies": "",
          "assignee": "",
          "status": "Low",
          "hyperlink": ""
        },
        {
          "id": 17,
          "phase": "Deployment",
          "task": "Executive presentation",
          "milestone": null,
          "start": "30/09/2025",
          "end": "02/10/2025",
          "completion": 0,
          "dependencies": "16",
          "assignee": "",
          "status": "Very High",
          "hyperlink": ""
        },
        {
          "id": 18,
          "phase": "Deployment",
          "task": "Deployment complete",
          "milestone": true,
          "start": "09/10/2025",
          "end": "09/10/2025",
          "completion": 0,
          "dependencies": "15",
          "assignee": "",
          "status": "",
          "hyperlink": ""
        }
      ],
      "format": {
        "parse": {
          "start": "date:'%d/%m/%Y'",
          "end": "date:'%d/%m/%Y'"
        }
      }
    },
    {
      "name": "input",
      "source": "dataset",
      "transform": [
        {
          "type": "formula",
          "as": "start",
          "expr": "+datetime(year(datum.start),month(datum.start),date(datum.start),hours(datum.start),minutes(datum.start))"
        },
        {
          "type": "formula",
          "as": "end",
          "expr": "+datetime(year(datum.end),month(datum.end),date(datum.end),hours(datum.end),minutes(datum.end))"
        },
        {
          "type": "formula",
          "as": "labelEnd",
          "expr": "datum.end"
        },
        {
          "type": "formula",
          "as": "end",
          "expr": "datetime(+datum.end+oneDay)"
        },
        {
          "type": "formula",
          "as": "days",
          "expr": "round(((datum.end-datum.start)/oneDay)*10)/10"
        },
        {
          "type": "formula",
          "as": "completionLabel",
          "expr": "datum.completion+'%'"
        },
        {
          "type": "window",
          "sort": {
            "field": "start",
            "order": "ascending"
          },
          "ops": [
            "rank"
          ],
          "as": [
            "taskSort"
          ],
          "groupby": [
            "phase"
          ]
        },
        {
          "type": "formula",
          "as": "start",
          "expr": "+datum.start"
        },
        {
          "type": "formula",
          "as": "end",
          "expr": "+datum.end"
        }
      ]
    },
    {
      "name": "phases",
      "source": "input",
      "transform": [
        {
          "type": "aggregate",
          "fields": [
            "start",
            "end",
            "completion",
            "task",
            "completion",
            "labelEnd"
          ],
          "ops": [
            "min",
            "max",
            "sum",
            "count",
            "mean",
            "max"
          ],
          "as": [
            "start",
            "end",
            "sum",
            "count",
            "completion",
            "labelEnd"
          ],
          "groupby": [
            "phase"
          ]
        },
        {
          "type": "formula",
          "as": "task",
          "expr": "datum.phase"
        },
        {
          "type": "formula",
          "as": "taskSort",
          "expr": "0"
        },
        {
          "type": "formula",
          "as": "completion",
          "expr": "round(datum.completion)"
        },
        {
          "type": "formula",
          "as": "days",
          "expr": "round(((datum.end-datum.start)/oneDay)*10)/10"
        },
        {
          "type": "window",
          "sort": {
            "field": "start",
            "order": "ascending"
          },
          "ops": [
            "row_number",
            "row_number"
          ],
          "as": [
            "phaseSort",
            "id"
          ]
        },
        {
          "type": "formula",
          "as": "id",
          "expr": "length(data('input'))+datum.id+'^^^^^'"
        }
      ]
    },
    {
      "name": "collapsedPhases",
      "on": [
        {
          "trigger": "phaseClicked",
          "toggle": "phaseClicked"
        },
        {
          "trigger": "initPhaseState",
          "insert": "initPhaseState=='closeRows'? data('phases'):null"
        },
        {
          "trigger": "closeRowsAll",
          "remove": true
        },
        {
          "trigger": "closeRowsAll",
          "insert": "data('phases')"
        },
        {
          "trigger": "openRowsAll",
          "remove": true
        }
      ]
    },
    {
      "name": "phasePaths",
      "source": "phases",
      "transform": [
        {
          "type": "formula",
          "as": "phasePath",
          "expr": "'M ' + scale('x', datum.start)+' '  +   (scale('y', datum.id)+yPaddingInner) + ' H ' +  scale('x', datum.end)+' '   + ' v ' +  phaseSymbolHeight + ' L ' +  (scale('x', datum.end) - phaseSymbolWidth) +' '  +   (scale('y', datum.id)+yPaddingInner+phaseSymbolHeight/2 ) + ' L ' +  (scale('x', datum.start)+phaseSymbolWidth) + ' '  +   (scale('y', datum.id)+yPaddingInner+phaseSymbolHeight/2) + ' L ' +  (scale('x', datum.start)) + ' '  +   (scale('y', datum.id)+ yPaddingInner+phaseSymbolHeight) + ' z'"
        }
      ]
    },
    {
      "name": "tasks",
      "source": "input",
      "transform": [
        {
          "type": "filter",
          "expr": "datum.milestone != true"
        },
        {
          "type": "filter",
          "expr": "!indata('collapsedPhases', 'phase', datum.phase)"
        }
      ]
    },
    {
      "name": "milestones",
      "source": "input",
      "transform": [
        {
          "type": "filter",
          "expr": "datum.milestone == true"
        },
        {
          "type": "filter",
          "expr": "!indata('collapsedPhases', 'phase', datum.phase)"
        }
      ]
    },
    {
      "name": "yScale",
      "source": [
        "tasks",
        "phases",
        "milestones"
      ],
      "transform": [
        {
          "type": "lookup",
          "from": "phases",
          "key": "phase",
          "values": [
            "phaseSort"
          ],
          "fields": [
            "phase"
          ]
        },
        {
          "type": "window",
          "sort": {
            "field": [
              "phaseSort",
              "taskSort"
            ],
            "order": [
              "ascending",
              "ascending"
            ]
          },
          "ops": [
            "row_number"
          ],
          "as": [
            "finalSort"
          ]
        }
      ]
    },
    {
      "name": "xExt",
      "source": "input",
      "transform": [
        {
          "type": "aggregate",
          "fields": [
            "start",
            "end"
          ],
          "ops": [
            "min",
            "max"
          ],
          "as": [
            "s",
            "e"
          ]
        },
        {
          "type": "formula",
          "as": "days",
          "expr": "(datum.e-datum.s)/oneDay"
        }
      ]
    },
    {
      "name": "weekends",
      "transform": [
        {
          "type": "sequence",
          "start": 0,
          "stop": {
            "signal": "dayBandwidthRound>=minMonthBandwidth? span(xDom)/oneDay:0"
          },
          "as": "sequence"
        },
        {
          "type": "formula",
          "as": "start",
          "expr": "(+datetime(year(xDom[0]),month(xDom[0]),date(xDom[0]))-timeoffset)   +(oneDay*datum.sequence)"
        },
        {
          "type": "filter",
          "expr": "day(datum.start) == 6 || day(datum.start) == 0"
        },
        {
          "type": "formula",
          "as": "end",
          "expr": "datetime(+datum.start+(oneDay))"
        }
      ]
    },
    {
      "name": "taskDependencyArrows",
      "source": "yScale",
      "transform": [
        {
          "type": "filter",
          "expr": "isValid(datum.dependencies) && datum.dependencies!=''"
        }
      ]
    },
    {
      "name": "phaseDependencyArrows",
      "source": "input",
      "transform": [
        {
          "type": "filter",
          "expr": "indata('collapsedPhases', 'phase', datum.phase)"
        },
        {
          "type": "joinaggregate",
          "fields": [
            "id",
            "start"
          ],
          "ops": [
            "values",
            "min"
          ],
          "as": [
            "allPhaseIds",
            "start"
          ],
          "groupby": [
            "phase"
          ]
        },
        {
          "type": "formula",
          "as": "id",
          "expr": "toString(datum.id)"
        },
        {
          "type": "formula",
          "as": "allPhaseIds",
          "expr": "pluck(datum.allPhaseIds, 'id')"
        },
        {
          "type": "formula",
          "as": "dependencies",
          "expr": "split(datum.dependencies,',')"
        },
        {
          "type": "flatten",
          "fields": [
            "dependencies"
          ]
        },
        {
          "type": "formula",
          "as": "internalDependenciesIndex",
          "expr": "indexof(datum.allPhaseIds,datum.dependencies)"
        },
        {
          "type": "formula",
          "as": "milestone",
          "expr": "null"
        },
        {
          "type": "filter",
          "expr": "datum.dependencies!='null' && datum.dependencies!='' && datum.dependencies!='undefined' && datum.internalDependenciesIndex == -1"
        },
        {
          "type": "lookup",
          "from": "phases",
          "key": "phase",
          "values": [
            "id"
          ],
          "fields": [
            "phase"
          ],
          "as": [
            "id"
          ]
        }
      ]
    },
    {
      "name": "dependencyArrows",
      "source": [
        "taskDependencyArrows",
        "phaseDependencyArrows"
      ]
    },
    {
      "name": "dependencyLines",
      "source": [
        "yScale",
        "phaseDependencyArrows"
      ],
      "transform": [
        {
          "type": "filter",
          "expr": "isValid(datum.dependencies) && datum.dependencies!=''"
        },
        {
          "type": "formula",
          "as": "dependencies",
          "expr": "split(datum.dependencies,',')"
        },
        {
          "type": "flatten",
          "fields": [
            "dependencies"
          ]
        },
        {
          "type": "lookup",
          "from": "input",
          "key": "id",
          "values": [
            "id",
            "end",
            "phase",
            "milestone"
          ],
          "fields": [
            "dependencies"
          ],
          "as": [
            "sourceId",
            "sourceEnd",
            "sourcePhase",
            "sourceMilestone"
          ]
        },
        {
          "type": "lookup",
          "from": "phases",
          "key": "phase",
          "values": [
            "id",
            "end"
          ],
          "fields": [
            "sourcePhase"
          ],
          "as": [
            "sourcePhaseId",
            "sourcePhaseEnd"
          ]
        },
        {
          "type": "formula",
          "as": "sourceId",
          "expr": "indata('collapsedPhases', 'phase', datum.sourcePhase) == true?datum.sourcePhaseId:datum.sourceId"
        },
        {
          "type": "formula",
          "as": "sourceEnd",
          "expr": "indata('collapsedPhases', 'phase', datum.sourcePhase) == true?datum.sourcePhaseEnd:datum.sourceEnd"
        },
        {
          "type": "formula",
          "as": "plottedStart",
          "expr": "datum.milestone == null || datum.milestone == false?scale('x',datum.start)- sqrt(arrowSymbolSize) - 1:(scale('x',datum.start) +(dayBandwidth/2) - (sqrt(milestoneSymbolSize)/2) - sqrt(arrowSymbolSize)) - 1"
        },
        {
          "type": "formula",
          "as": "plottedSourceEnd",
          "expr": "scale('x',datum.sourceEnd) - (dayBandwidth/2)"
        },
        {
          "type": "formula",
          "as": "a",
          "expr": "[datum.milestone == null || datum.milestone == false?scale('x',datum.start):scale('x',datum.start) +(dayBandwidth/2) - (sqrt(milestoneSymbolSize)/2)  ,scale('y', datum.id)+bandwidth('y')/2 ]"
        },
        {
          "type": "formula",
          "as": "b",
          "expr": "[datum.plottedStart >= datum.plottedSourceEnd?datum.plottedSourceEnd :datum.plottedStart ,scale('y', datum.id)+bandwidth('y')/2]"
        },
        {
          "type": "formula",
          "as": "c",
          "expr": "[datum.plottedSourceEnd,scale('y',datum.sourceId)+bandwidth('y')/2]"
        },
        {
          "type": "formula",
          "as": "d",
          "expr": "[datum.plottedStart > datum.plottedSourceEnd?null:datum.plottedStart ,datum.plottedStart > datum.plottedSourceEnd?null:scale('y',datum.sourceId)+(bandwidth('y'))]"
        },
        {
          "type": "formula",
          "as": "e",
          "expr": "[datum.plottedStart > datum.plottedSourceEnd?null:datum.plottedSourceEnd,datum.plottedStart > datum.plottedSourceEnd?null:scale('y',datum.sourceId)+(bandwidth('y'))]"
        },
        {
          "type": "fold",
          "fields": [
            "a",
            "b",
            "d",
            "e",
            "c"
          ]
        },
        {
          "type": "filter",
          "expr": "datum.value[0] != null"
        },
        {
          "type": "formula",
          "as": "value0",
          "expr": "datum.value[0]"
        },
        {
          "type": "formula",
          "as": "value1",
          "expr": "datum.value[1]"
        },
        {
          "type": "window",
          "ops": [
            "row_number"
          ],
          "as": [
            "duplicates"
          ],
          "groupby": [
            "id",
            "sourceId",
            "value0",
            "value1"
          ]
        },
        {
          "type": "filter",
          "expr": "datum.duplicates == 1"
        }
      ]
    },
    {
      "name": "buttons",
      "values": [
        {
          "side": "left",
          "text": "",
          "name": "closeRows",
          "x": 15,
          "leftRadius": 4,
          "icon": "m0 0-3.6294 3.6294q-.0706.0706-.1206.0806-.05.01-.14-.08t-.095-.13q-.005-.04.0966-.1416l3.5466-3.5466q.1518-.1518.3428-.1518.1908 0 .349.15l3.55 3.55q.07.08.075.12t-.085.13q-.09.09-.13.09t-.1306-.0906l-3.6294-3.6094z"
        },
        {
          "side": "left",
          "text": "",
          "name": "openRows",
          "x": 45,
          "rightRadius": 4,
          "icon": "m0 6 3.63-3.65q.07-.07.135-.07t.135.07q.09.09.09.135t-.09.135l-3.55 3.55q-.08.07-.165.115t-.185.045q-.1 0-.185-.045t-.155-.115l-3.55-3.55q-.08-.07-.065-.135t.085-.135q.09-.09.13-.09t.14.09l3.6 3.65zm0-5.51 3.63-3.65q.07-.07.135-.07t.135.07q.09.09.09.135t-.09.135l-3.55 3.55q-.08.07-.165.115t-.185.045q-.1 0-.185-.045t-.155-.115l-3.55-3.55q-.08-.07-.065-.135t.085-.135q.09-.09.13-.09t.14.09l3.6 3.65z"
        },
        {
          "side": "left",
          "text": "",
          "name": "closeColumns",
          "x": 105,
          "leftRadius": 4,
          "icon": "m-1 1 3.63 3.63q.07.07.08.12t-.08.14q-.09.09-.13.095t-.1368-.1018l-3.5432-3.5432q-.08-.078-.12-.159-.04-.081-.04-.185t.04-.185q.04-.081.12-.161l3.5432-3.5432q.0768-.0768.1268-.0818t.14.085q.09.09.09.13t-.09.13l-3.63 3.63z"
        },
        {
          "side": "left",
          "text": "",
          "name": "openColumns",
          "x": 135,
          "rightRadius": 4,
          "icon": "m0 1-3.65-3.63q-.08-.07-.075-.135t.075-.135q.09-.09.13-.09t.14.09l3.55 3.55q.07.08.115.165t.045.185q0 .1-.045.185t-.115.155l-3.55 3.55q-.08.08-.135.065t-.115-.085q-.1-.09-.1-.13t.1-.14l3.63-3.6zm4.91 0-3.65-3.63q-.08-.07-.075-.135t.075-.135q.09-.09.13-.09t.14.09l3.55 3.55q.07.08.115.165t.045.185q0 .1-.045.185t-.115.155l-3.55 3.55q-.08.08-.135.065t-.115-.085q-.1-.09-.1-.13t.1-.14l3.63-3.6z"
        },
        {
          "side": "right",
          "text": "All",
          "name": "All",
          "x": 50,
          "rightRadius": 4
        },
        {
          "side": "right",
          "text": "Years",
          "name": "Years",
          "x": 100
        },
        {
          "side": "right",
          "text": "Months",
          "name": "Months",
          "x": 150
        },
        {
          "side": "right",
          "text": "Days",
          "name": "Days",
          "x": 200,
          "leftRadius": 4
        }
      ]
    }
  ],
  "marks": [
    {
      "name": "buttonMarks",
      "description": "All buttons",
      "type": "group",
      "from": {
        "data": "buttons"
      },
      "clip": {
        "signal": "!showButtons"
      },
      "encode": {
        "update": {
          "x": {
            "signal": "datum.side=='left'?datum.x:columnsWidth+ganttWidth-datum.x"
          },
          "width": {
            "signal": "datum.side=='left'?30:50"
          },
          "y": {
            "value": -60
          },
          "height": {
            "signal": "18"
          },
          "stroke": {
            "signal": "'#7f7f7f'"
          },
          "strokeWidth": {
            "value": 1
          },
          "cornerRadiusTopLeft": {
            "field": "leftRadius"
          },
          "cornerRadiusBottomLeft": {
            "field": "leftRadius"
          },
          "cornerRadiusTopRight": {
            "field": "rightRadius"
          },
          "cornerRadiusBottomRight": {
            "field": "rightRadius"
          },
          "cursor": {
            "value": "pointer"
          },
          "fill": [
            {
              "test": "indexof( hover,datum.name)>-1",
              "value": "#4e95d9"
            },
            {
              "test": "datum.name=='closeRows' && data('collapsedPhases').length == data('phases').length",
              "value": "#4e95d9"
            },
            {
              "test": "datum.name=='closeColumns' && !showColumns",
              "value": "#4e95d9"
            },
            {
              "test": "datum.name=='openColumns' && showColumns",
              "value": "#4e95d9"
            },
            {
              "test": "datum.name=='openRows' && data('collapsedPhases').length == 0",
              "value": "#4e95d9"
            },
            {
              "test": "datum.name=='Days' && dayBandwidthRound == minDayBandwidth",
              "value": "#4e95d9"
            },
            {
              "test": "datum.name=='Months' && dayBandwidthRound>=minYearBandwidth && dayBandwidthRound<minDayBandwidth",
              "value": "#4e95d9"
            },
            {
              "test": "datum.name=='Years' && dayBandwidthRound<minYearBandwidth",
              "value": "#4e95d9"
            },
            {
              "value": "white"
            }
          ]
        }
      },
      "marks": [
        {
          "name": "buttonText",
          "interactive": false,
          "type": "text",
          "encode": {
            "update": {
              "text": {
                "signal": "parent.text"
              },
              "baseline": {
                "value": "middle"
              },
              "align": {
                "value": "center"
              },
              "x": {
                "signal": "item.mark.group.width/2"
              },
              "y": {
                "signal": "10"
              },
              "fill": [
                {
                  "test": "indexof( hover,parent.text)>-1",
                  "value": "white"
                },
                {
                  "test": "parent.text=='closeRows' && data('collapsedPhases').length == data('phases').length",
                  "value": "white"
                },
                {
                  "test": "parent.text=='openRows' && data('collapsedPhases').length == 0",
                  "value": "white"
                },
                {
                  "test": "parent.text=='Days' && dayBandwidthRound == minDayBandwidth",
                  "value": "white"
                },
                {
                  "test": "parent.text=='Months' && dayBandwidthRound>=minYearBandwidth && dayBandwidthRound<minDayBandwidth",
                  "value": "white"
                },
                {
                  "test": "parent.text=='Years' && dayBandwidthRound<minYearBandwidth",
                  "value": "white"
                },
                {
                  "value": "#7f7f7f"
                }
              ]
            }
          }
        },
        {
          "name": "buttonIcons",
          "interactive": false,
          "type": "path",
          "encode": {
            "update": {
              "path": {
                "signal": "parent.icon"
              },
              "x": {
                "signal": "item.mark.group.width/2"
              },
              "y": {
                "signal": "8"
              },
              "stroke": [
                {
                  "test": "indexof( hover,parent.name)>-1",
                  "value": "white"
                },
                {
                  "test": "parent.name=='closeColumns' && !showColumns",
                  "value": "white"
                },
                {
                  "test": "parent.name=='openColumns' && showColumns",
                  "value": "white"
                },
                {
                  "test": "parent.name=='closeRows' && data('collapsedPhases').length == data('phases').length",
                  "value": "white"
                },
                {
                  "test": "parent.name=='openRows' && data('collapsedPhases').length == 0",
                  "value": "white"
                },
                {
                  "value": "#7f7f7f"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "xDomainText",
      "data": [
        {}
      ],
      "interactive": false,
      "type": "text",
      "encode": {
        "update": {
          "text": {
            "signal": "showDomainSpanLabel?timeFormat(xDom[0],'%d/%m/%y') +' - ' + timeFormat(xDom[1],'%d/%m/%y'):null"
          },
          "baseline": {
            "value": "bottom"
          },
          "align": {
            "value": "right"
          },
          "x": {
            "signal": "columnsWidth+ganttWidth-220"
          },
          "y": {
            "signal": "-45"
          },
          "fill": {
            "signal": "textColour"
          }
        }
      }
    },
    {
      "name": "phaseBackgrounds",
      "description": "Background rect for phases",
      "type": "rect",
      "clip": true,
      "zindex": 0,
      "from": {
        "data": "phases"
      },
      "encode": {
        "update": {
          "x": {
            "value": 0
          },
          "x2": {
            "signal": "columnsWidth"
          },
          "y": {
            "signal": "scale('y', datum.id)"
          },
          "height": {
            "signal": "bandwidth('y')"
          },
          "fill": {
            "value": "#dceaf7"
          },
          "opacity": {
            "value": 0.3
          }
        }
      }
    },
    {
      "name": "taskLabelSizes",
      "description": "Hidden label sizes to support tooltips when the task name doesn't completely fit",
      "type": "text",
      "clip": true,
      "from": {
        "data": "yScale"
      },
      "encode": {
        "enter": {
          "x": {
            "value": -100
          },
          "y": {
            "value": -100
          },
          "fill": {
            "value": "transparent"
          },
          "fontSize": {
            "value": 11
          },
          "text": {
            "signal": "datum.phase == datum.task?upper(datum.task):datum.task"
          },
          "font": {
            "signal": "datum.phase == datum.task?'Arial':'Segoe UI'"
          },
          "fontWeight": {
            "signal": "datum.phase == datum.task?'bold':'normal'"
          }
        }
      }
    },
    {
      "type": "rect",
      "name": "taskTooltips",
      "description": "Hidden rect to support tooltips when the task name doesn't completely fit",
      "from": {
        "data": "taskLabelSizes"
      },
      "clip": true,
      "zindex": 101,
      "encode": {
        "update": {
          "x": {
            "value": -15
          },
          "x2": {
            "signal": "taskColumnWidth"
          },
          "y": {
            "signal": "scale('y', datum.datum.id)"
          },
          "height": {
            "signal": "bandwidth('y')"
          },
          "fill": {
            "value": "transparent"
          },
          "tooltip": {
            "signal": "datum.bounds.x2 - datum.bounds.x1>=taskColumnWidth-columnPadding-16? datum.datum.task:null"
          },
          "cursor": {
            "signal": "datum.datum.phase == datum.datum.task?'pointer':'auto'"
          },
          "href": {
            "field": "datum.hyperlink"
          }
        }
      }
    },
    {
      "type": "group",
      "name": "columnHolder",
      "style": "cell",
      "layout": {
        "bounds": "flush",
        "align": "each"
      },
      "encode": {
        "update": {
          "x": {
            "signal": "0"
          },
          "stroke": {
            "value": "transparent"
          },
          "width": {
            "signal": "columnsWidth"
          },
          "height": {
            "signal": "height"
          }
        }
      },
      "marks": [
        {
          "type": "group",
          "name": "taskColumnWidth",
          "title": {
            "text": "Task",
            "anchor": "start",
            "frame": "group",
            "align": "left",
            "dx": 16
          },
          "encode": {
            "enter": {
              "stroke": {
                "value": ""
              },
              "width": {
                "signal": "taskColumnWidth"
              },
              "height": {
                "signal": "height"
              }
            }
          },
          "marks": [
            {
              "type": "text",
              "style": "col",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "align": {
                    "value": "left"
                  },
                  "dx": {
                    "value": 16
                  },
                  "y": {
                    "signal": "scale('y', datum.id)+bandwidth('y')/2"
                  },
                  "text": {
                    "signal": "datum.phase == datum.task?upper(datum.task):datum.task"
                  },
                  "font": {
                    "signal": "datum.phase == datum.task?'Arial':'Segoe UI'"
                  },
                  "fontWeight": {
                    "signal": "datum.phase == datum.task?'bold':'normal'"
                  },
                  "limit": {
                    "signal": "taskColumnWidth-16-columnPadding"
                  },
                  "fill": {
                    "signal": "datum.id == itemHovered.id  ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):textColour"
                  }
                }
              }
            },
            {
              "type": "symbol",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "fill": {
                    "signal": "datum.id == itemHovered.id && datum.phase == datum.task ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):datum.phase == datum.task ?scale('cDark', datum.phase):'transparent'"
                  },
                  "x": {
                    "signal": "sqrt(90)/2"
                  },
                  "size": {
                    "value": 90
                  },
                  "yc": {
                    "signal": "(scale('y', datum.id)+bandwidth('y')/2)-1"
                  },
                  "shape": {
                    "signal": "datum.phase == datum.task && !indata('collapsedPhases', 'phase', datum.phase)?'triangle-down':datum.phase == datum.task && indata('collapsedPhases', 'phase', datum.phase)?'triangle-right':''"
                  }
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "startColumnWidth",
          "clip": {
            "signal": "!showColumns"
          },
          "title": {
            "text": {
              "signal": "'Start'"
            },
            "anchor": "middle",
            "dx": {
              "signal": "-(columnPadding/2)"
            },
            "frame": "group",
            "align": "center"
          },
          "encode": {
            "update": {
              "width": {
                "signal": "startColumnWidth"
              },
              "height": {
                "signal": "height"
              },
              "stroke": {
                "value": ""
              }
            }
          },
          "marks": [
            {
              "type": "text",
              "style": "col",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "align": {
                    "value": "center"
                  },
                  "x": {
                    "signal": "(startColumnWidth-columnPadding)/2"
                  },
                  "y": {
                    "signal": "scale('y', datum.id)+bandwidth('y')/2"
                  },
                  "text": {
                    "signal": "timeFormat(datum.start,' %d/%m/%y')"
                  },
                  "font": {
                    "signal": "datum.phase == datum.task?'Arial':'Segoe UI'"
                  },
                  "fontWeight": {
                    "signal": "datum.phase == datum.task?'bold':'normal'"
                  },
                  "fill": {
                    "signal": "datum.id == itemHovered.id  ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):textColour"
                  }
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "endColumnWidth",
          "clip": {
            "signal": "!showColumns"
          },
          "title": {
            "text": {
              "signal": "'End'"
            },
            "anchor": "middle",
            "dx": {
              "signal": "-(columnPadding/2)"
            },
            "frame": "group",
            "align": "center"
          },
          "encode": {
            "update": {
              "width": {
                "signal": "endColumnWidth"
              },
              "stroke": {
                "value": "transparent"
              },
              "height": {
                "signal": "height"
              }
            }
          },
          "marks": [
            {
              "type": "text",
              "style": "col",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "align": {
                    "value": "center"
                  },
                  "x": {
                    "signal": "(startColumnWidth-columnPadding)/2"
                  },
                  "y": {
                    "signal": "scale('y', datum.id)+bandwidth('y')/2"
                  },
                  "text": {
                    "signal": "timeFormat(datum.labelEnd,' %d/%m/%y')"
                  },
                  "font": {
                    "signal": "datum.phase == datum.task?'Arial':'Segoe UI'"
                  },
                  "fontWeight": {
                    "signal": "datum.phase == datum.task?'bold':'normal'"
                  },
                  "fill": {
                    "signal": "datum.id == itemHovered.id  ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):textColour"
                  }
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "daysColumnWidth",
          "clip": {
            "signal": "!showColumns"
          },
          "title": {
            "text": {
              "signal": "'Days'"
            },
            "anchor": "end",
            "dx": {
              "signal": "-columnPadding"
            },
            "frame": "group",
            "align": "right"
          },
          "encode": {
            "update": {
              "width": {
                "signal": "daysColumnWidth"
              },
              "stroke": {
                "value": "transparent"
              },
              "height": {
                "signal": "height"
              }
            }
          },
          "marks": [
            {
              "type": "text",
              "style": "col",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "align": {
                    "value": "right"
                  },
                  "x": {
                    "signal": "daysColumnWidth-columnPadding"
                  },
                  "y": {
                    "signal": "scale('y', datum.id)+bandwidth('y')/2"
                  },
                  "text": {
                    "signal": "format(datum.days,',')+' d'"
                  },
                  "fontWeight": {
                    "signal": "datum.phase == datum.task?'bold':'normal'"
                  },
                  "font": {
                    "signal": "datum.phase == datum.task?'Arial':'Segoe UI'"
                  },
                  "fill": {
                    "signal": "datum.id == itemHovered.id  ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):textColour"
                  }
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "statusColumn",
          "clip": {
            "signal": "!showColumns"
          },
          "title": {
            "text": {
              "signal": "statusColumnPresent?'Status':''"
            },
            "anchor": "middle",
            "frame": "group",
            "align": "center"
          },
          "encode": {
            "update": {
              "width": {
                "signal": "statusColumnWidth"
              },
              "stroke": {
                "value": "transparent"
              },
              "height": {
                "signal": "height"
              }
            }
          },
          "marks": [
            {
              "type": "symbol",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "x": {
                    "signal": "statusColumnWidth/2"
                  },
                  "size": {
                    "signal": "550"
                  },
                  "fill": {
                    "signal": "datum.id == itemHovered.id && isValid(datum.status) && datum.status!='' ?merge(hsl(scale('statusBackground',datum.status)), {l:0.72}):scale('statusBackground',datum.status)"
                  },
                  "yc": {
                    "signal": "(scale('y',datum.id)+bandwidth('y')/2)"
                  }
                }
              }
            },
            {
              "type": "text",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "baseline": {
                    "value": "middle"
                  },
                  "align": {
                    "value": "center"
                  },
                  "x": {
                    "signal": "statusColumnWidth/2"
                  },
                  "fill": {
                    "signal": "datum.id == itemHovered.id && isValid(datum.status) && datum.status!='' ?merge(hsl(scale('statusFont',datum.status)), {l:0.20}):scale('statusFont',datum.status)"
                  },
                  "y": {
                    "signal": "(scale('y',datum.id)+bandwidth('y')/2)+1"
                  },
                  "text": {
                    "signal": "scale('statusText',datum.status)"
                  }
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "completionColumn",
          "clip": {
            "signal": "!showColumns"
          },
          "title": {
            "text": {
              "signal": "'Progress'"
            },
            "anchor": "start",
            "frame": "group",
            "align": "left"
          },
          "encode": {
            "update": {
              "width": {
                "signal": "progressColumnWidth"
              },
              "stroke": {
                "value": "transparent"
              },
              "height": {
                "signal": "height"
              }
            }
          },
          "marks": [
            {
              "type": "rect",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "x": {
                    "signal": "1"
                  },
                  "width": {
                    "signal": "item.mark.group.width-2-columnPadding"
                  },
                  "stroke": {
                    "signal": "'#a0d786'"
                  },
                  "yc": {
                    "signal": "(scale('y',datum.id)+bandwidth('y')/2)"
                  },
                  "fill": {
                    "value": "white"
                  },
                  "height": {
                    "signal": "bandwidth('y')-yPaddingInner*2"
                  },
                  "strokeWidth": {
                    "signal": "datum.id == itemHovered.id?2:1"
                  }
                }
              }
            },
            {
              "type": "rect",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "x": {
                    "signal": "1"
                  },
                  "width": {
                    "signal": "((item.mark.group.width-columnPadding)/100)*datum.completion"
                  },
                  "fill": {
                    "signal": "'#c6ecb5'"
                  },
                  "yc": {
                    "signal": "(scale('y',datum.id)+bandwidth('y')/2)"
                  },
                  "strokeWidth": {
                    "value": 1
                  },
                  "height": {
                    "signal": "bandwidth('y')-yPaddingInner*2"
                  }
                }
              }
            },
            {
              "type": "text",
              "clip": true,
              "from": {
                "data": "yScale"
              },
              "encode": {
                "update": {
                  "align": {
                    "value": "left"
                  },
                  "dx": {
                    "value": 3
                  },
                  "fill": {
                    "signal": "textColour"
                  },
                  "y": {
                    "signal": "scale('y',datum.id)+bandwidth('y')/2"
                  },
                  "text": {
                    "signal": "datum.completion+'%'"
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      "type": "group",
      "name": "weekendContainer",
      "encode": {
        "update": {
          "x": {
            "signal": "columnsWidth"
          },
          "y": {
            "signal": "-15"
          },
          "clip": {
            "signal": "true"
          },
          "height": {
            "signal": "height+15"
          },
          "width": {
            "signal": "ganttWidth"
          },
          "fill": {
            "value": "transparent"
          }
        }
      },
      "marks": [
        {
          "type": "rect",
          "description": "Weekend shading",
          "name": "weekendShading",
          "from": {
            "data": "weekends"
          },
          "encode": {
            "update": {
              "x": {
                "signal": "scale('x',datum.start)"
              },
              "x2": {
                "signal": "scale('x',datum.end)"
              },
              "y": {
                "signal": "dayBandwidthRound>=minDayBandwidth?0:15"
              },
              "y2": {
                "signal": "scaledHeight<height?yRange[1]+15:height+15"
              },
              "strokeWidth": {
                "signal": "1"
              },
              "stroke": {
                "value": "#f1f1f1"
              },
              "fill": {
                "value": "#f1f1f1"
              }
            }
          }
        },
        {
          "name": "todayHighlight",
          "description": "Today highlight",
          "type": "rect",
          "data": [
            {}
          ],
          "encode": {
            "update": {
              "x": {
                "signal": "scale('x',today)"
              },
              "width": {
                "signal": "dayBandwidth"
              },
              "y": {
                "value": 0
              },
              "height": {
                "signal": "15"
              },
              "fill": {
                "value": "#a5c8e4"
              }
            }
          }
        }
      ]
    },
    {
      "type": "group",
      "name": "ganttContainer",
      "encode": {
        "update": {
          "x": {
            "signal": "columnsWidth"
          },
          "y": {
            "signal": "0"
          },
          "clip": {
            "signal": "true"
          },
          "height": {
            "signal": "height"
          },
          "width": {
            "signal": "ganttWidth"
          },
          "fill": {
            "value": "transparent"
          }
        }
      },
      "marks": [
        {
          "name": "completionLabelSizes",
          "type": "text",
          "from": {
            "data": "tasks"
          },
          "encode": {
            "enter": {
              "fill": {
                "value": "transparent"
              },
              "text": {
                "signal": "datum.completionLabel"
              }
            }
          }
        },
        {
          "name": "taskLabels",
          "description": "Task, milestone and phase names",
          "from": {
            "data": "yScale"
          },
          "type": "text",
          "encode": {
            "update": {
              "x": {
                "scale": "x",
                "field": "end"
              },
              "align": {
                "signal": "'left'"
              },
              "dx": {
                "signal": "datum.milestone?sqrt(milestoneSymbolSize)/2 - dayBandwidth/2 + 5:5"
              },
              "y": {
                "signal": "datum.phase == datum.task?scale('y', datum.id)-2:scale('y', datum.id)"
              },
              "dy": {
                "signal": "bandwidth('y')/2"
              },
              "fill": {
                "signal": "datum.id == itemHovered.id  ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):textColour"
              },
              "text": {
                "signal": "datum.milestone?datum.task:datum.task && datum.assignee? datum.task + ' ('+ datum.days+' d'+')' +' - ' + datum.assignee:datum.task + ' ('+ datum.days+' d'+')'"
              }
            }
          }
        },
        {
          "type": "group",
          "from": {
            "facet": {
              "name": "dependencyLinesFacet",
              "data": "dependencyLines",
              "groupby": [
                "id",
                "sourceId"
              ]
            }
          },
          "marks": [
            {
              "type": "line",
              "from": {
                "data": "dependencyLinesFacet"
              },
              "encode": {
                "enter": {
                  "x": {
                    "signal": "datum.value[0]"
                  },
                  "y": {
                    "signal": "datum.value[1]"
                  },
                  "stroke": {
                    "value": "#888888"
                  },
                  "strokeWidth": {
                    "value": 1
                  },
                  "interpolate": {
                    "value": "linear"
                  },
                  "strokeJoin": {
                    "value": "bevel"
                  },
                  "strokeCap": {
                    "value": "round"
                  },
                  "defined": {
                    "value": true
                  }
                },
                "update": {
                  "stroke": {
                    "signal": "datum.id == itemHovered.id  ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):'#888888'"
                  },
                  "strokeWidth": {
                    "signal": "datum.id == itemHovered.id?1.5:1"
                  }
                }
              }
            }
          ]
        },
        {
          "name": "todayRule",
          "description": "Today rule",
          "type": "rule",
          "data": [
            {}
          ],
          "encode": {
            "update": {
              "x": {
                "signal": "scale('x',today+oneDay/2)"
              },
              "y2": {
                "signal": "scaledHeight<height?yRange[1]:height"
              },
              "strokeWidth": {
                "value": 1
              },
              "stroke": {
                "value": "#377eb9"
              },
              "strokeDash": {
                "value": [
                  2,
                  2
                ]
              },
              "opacity": {
                "value": 0.8
              }
            }
          }
        },
        {
          "name": "todayText",
          "description": "Today text",
          "type": "text",
          "data": [
            {}
          ],
          "encode": {
            "update": {
              "x": {
                "signal": "scale('x',today+oneDay/2)"
              },
              "fill": {
                "value": "#377eb9"
              },
              "text": {
                "value": "Today"
              },
              "angle": {
                "signal": "90"
              },
              "baseline": {
                "value": "bottom"
              },
              "dx": {
                "value": 10
              },
              "dy": {
                "value": -4
              },
              "opacity": {
                "value": 0.7
              }
            }
          }
        },
        {
          "name": "taskBars",
          "description": "The task bars (serve as an outline for percent complete)",
          "type": "group",
          "from": {
            "data": "tasks"
          },
          "encode": {
            "update": {
              "clip": {
                "signal": "true"
              },
              "x": {
                "scale": "x",
                "field": "start"
              },
              "x2": {
                "scale": "x",
                "field": "end"
              },
              "yc": {
                "signal": "(scale('y',datum.id)+bandwidth('y')/2)"
              },
              "height": {
                "signal": "bandwidth('y')-yPaddingInner*2"
              },
              "tooltip": {
                "signal": "showTooltips&&down==null?{'Phase':datum.phase ,'Task':datum.task , 'Start':timeFormat(datum.start,'%a, %d %B %Y' ),'End':timeFormat(datum.labelEnd,'%a, %d %B %Y' ), 'Days':datum.days, 'Assignee':datum.assignee ,'Progress':datum.completionLabel }:null"
              },
              "fill": {
                "signal": "datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1 ?merge(hsl(scale('cLight', datum.phase)), {l:0.65}):scale('cLight', datum.phase)"
              },
              "stroke": {
                "signal": "datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1 ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):scale('cDark', datum.phase)"
              },
              "cornerRadius": {
                "value": 5
              },
              "zindex": {
                "value": 101
              },
              "strokeWidth": {
                "signal": "datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1 ?1.5:1"
              },
              "href": {
                "field": "hyperlink"
              }
            }
          },
          "transform": [
            {
              "type": "lookup",
              "from": "completionLabelSizes",
              "key": "datum.id",
              "fields": [
                "datum.id"
              ],
              "values": [
                "bounds.x1",
                "bounds.x2"
              ],
              "as": [
                "a",
                "b"
              ]
            }
          ],
          "marks": [
            {
              "name": "taskFills",
              "description": "Percent complete for each task",
              "type": "rect",
              "interactive": false,
              "encode": {
                "update": {
                  "x": {
                    "signal": "0"
                  },
                  "y": {
                    "signal": "0"
                  },
                  "height": {
                    "signal": "item.mark.group.height"
                  },
                  "width": {
                    "signal": "(item.mark.group.width/100)* item.mark.group.datum.completion"
                  },
                  "fill": {
                    "signal": "toString(item.mark.group.datum.id) == itemHovered.id  || indexof(itemHovered.dependencies,toString(item.mark.group.datum.id) )> -1 ?merge(hsl(scale('cDark', item.mark.group.datum.phase)), {l:0.40}):scale('cDark', item.mark.group.datum.phase)"
                  },
                  "strokeWidth": {
                    "value": 0
                  },
                  "cornerRadiusBottomLeft": {
                    "value": 5
                  },
                  "cornerRadiusTopLeft": {
                    "value": 5
                  }
                }
              }
            },
            {
              "name": "completeText",
              "description": "Completion Text",
              "type": "text",
              "interactive": false,
              "encode": {
                "update": {
                  "x": {
                    "signal": "(item.mark.group.width/100)* parent.completion"
                  },
                  "align": {
                    "signal": "'right'"
                  },
                  "dx": {
                    "signal": "-2"
                  },
                  "baseline": {
                    "value": "middle"
                  },
                  "y": {
                    "signal": "item.mark.group.height/2+1"
                  },
                  "text": {
                    "signal": "round(((item.mark.group.width/100)* parent.completion))>=(item.mark.group.b+4) && parent.completion>0?parent.completionLabel:''"
                  },
                  "fill": {
                    "signal": "luminance(item.mark.group.stroke) >=0.45?'black':'white'"
                  }
                }
              }
            }
          ]
        },
        {
          "name": "phaseOutline",
          "description": "The phase bar outlines",
          "type": "path",
          "from": {
            "data": "phasePaths"
          },
          "encode": {
            "update": {
              "path": {
                "signal": "datum.phasePath"
              },
              "fill": {
                "signal": "datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1 ?merge(hsl(scale('cLight', datum.phase)), {l:0.65}):scale('cLight', datum.phase)"
              },
              "stroke": {
                "signal": "datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1 ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):scale('cDark', datum.phase)"
              },
              "strokeWidth": {
                "signal": "datum.id == itemHovered.id?1.5:1"
              },
              "tooltip": {
                "signal": "showTooltips&&down==null?{'Phase':datum.phase , 'Start':timeFormat(datum.start,'%a, %d %B %Y' ),'End':timeFormat(datum.labelEnd,'%a, %d %B %Y' ), 'Days':datum.days,'Progress':datum.completion+'%' }:null"
              },
              "cursor": {
                "value": "pointer"
              }
            }
          }
        },
        {
          "name": "phaseGroup",
          "description": "Group to hold the x y coordinates for the SVG clipping fills",
          "type": "group",
          "clip": true,
          "from": {
            "data": "phasePaths"
          },
          "encode": {
            "update": {
              "strokeWidth": {
                "value": 0
              },
              "stroke": {
                "value": "red"
              },
              "x": {
                "scale": "x",
                "field": "start",
                "offset": 0
              },
              "x2": {
                "scale": "x",
                "field": "end",
                "offset": 0
              },
              "yc": {
                "signal": "scale('y',datum.id)+bandwidth('y')/2"
              },
              "height": {
                "signal": "bandwidth('y')-yPaddingInner*2"
              }
            }
          },
          "marks": [
            {
              "name": "phaseFills",
              "description": "Percent complete for each phase. Clipping path signal has to be here as it fails to update on zoom when coming from a dataset. The only value available in the clipping path signal is parent!",
              "type": "rect",
              "interactive": false,
              "clip": {
                "path": {
                  "signal": "'M 0 0'  + ' L ' +   (scale('x', parent.end) - scale('x', parent.start)) +' 0'    + ' v ' +  phaseSymbolHeight + ' L ' + (scale('x', parent.end) - scale('x', parent.start) - phaseSymbolWidth) +' '  +   (phaseSymbolHeight/2) + ' H ' +  phaseSymbolWidth + ' L 0 '   +   phaseSymbolHeight + ' z'"
                }
              },
              "encode": {
                "update": {
                  "height": {
                    "signal": "phaseSymbolHeight"
                  },
                  "width": {
                    "signal": "(item.mark.group.width/100)* item.mark.group.datum.completion"
                  },
                  "fill": {
                    "signal": "toString(item.mark.group.datum.id) == itemHovered.id  || indexof(itemHovered.dependencies,toString(item.mark.group.datum.id) )> -1 ?merge(hsl(scale('cDark', item.mark.group.datum.phase)), {l:0.40}):scale('cDark', item.mark.group.datum.phase)"
                  },
                  "strokeWidth": {
                    "value": 0
                  },
                  "stroke": {
                    "value": "red"
                  }
                }
              }
            }
          ]
        },
        {
          "name": "milestoneSymbols",
          "description": "Milestones",
          "type": "symbol",
          "from": {
            "data": "milestones"
          },
          "encode": {
            "update": {
              "x": {
                "signal": "scale('x',datum.start)+dayBandwidth/2"
              },
              "y": {
                "signal": "scale('y', datum.id)+bandwidth('y')/2"
              },
              "size": {
                "signal": "milestoneSymbolSize"
              },
              "shape": {
                "value": "diamond"
              },
              "fill": {
                "signal": "(datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1)  && datum.completion > 0 ?merge(hsl(scale( 'cDark', datum.phase)), {l:0.40}):datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1   ?merge(hsl(scale( 'cLight', datum.phase)), {l:0.65}):datum.completion > 0?  scale('cDark', datum.phase):scale('cLight', datum.phase)"
              },
              "stroke": {
                "signal": "datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1 ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):scale('cDark', datum.phase)"
              },
              "strokeWidth": {
                "signal": "datum.id == itemHovered.id  || indexof(itemHovered.dependencies,datum.id )> -1  ?1.5:1"
              },
              "tooltip": {
                "signal": "showTooltips&&down==null?{'Phase':datum.phase ,'Task':datum.task , 'Start':timeFormat(datum.start,'%a, %d %B %Y' ),'End':timeFormat(datum.labelEnd,'%a, %d %B %Y' ), 'Days':datum.days,'Assignee':datum.assignee ,'Progress':datum.completionLabel }:null"
              }
            }
          }
        },
        {
          "name": "taskDependencyArrowsymbol",
          "description": "Dependency arrows",
          "type": "symbol",
          "from": {
            "data": "dependencyArrows"
          },
          "encode": {
            "update": {
              "shape": {
                "value": "triangle-right"
              },
              "x": {
                "signal": "scale('x',datum.start)",
                "offset": {
                  "signal": "datum.milestone!=null && datum.milestone != false? -(sqrt(arrowSymbolSize))/2 + dayBandwidth/2 - (sqrt(milestoneSymbolSize))/2 +1:-(sqrt(arrowSymbolSize)/2) +1"
                }
              },
              "y": {
                "signal": "scale('y', datum.id)+bandwidth('y')/2"
              },
              "fill": {
                "signal": "datum.id == itemHovered.id  ?merge(hsl(scale('cDark', datum.phase)), {l:0.40}):'#6a6a6a'"
              },
              "size": {
                "signal": "arrowSymbolSize"
              }
            }
          }
        }
      ]
    },
    {
      "name": "taskSelector",
      "description": "Hidden rect to support phase expand and collapse",
      "type": "rect",
      "clip": true,
      "zindex": 99,
      "from": {
        "data": "yScale"
      },
      "encode": {
        "update": {
          "x": {
            "value": -15
          },
          "x2": {
            "signal": "columnsWidth"
          },
          "y": {
            "signal": "scale('y', datum.id)"
          },
          "height": {
            "signal": "bandwidth('y')"
          },
          "fill": {
            "value": "transparent"
          },
          "cursor": {
            "signal": "datum.phase == datum.task?'pointer':'auto'"
          },
          "href": {
            "field": "hyperlink"
          }
        }
      }
    },
    {
      "type": "group",
      "name": "axisClipper",
      "clip": true,
      "encode": {
        "update": {
          "width": {
            "signal": "columnsWidth"
          },
          "stroke": {
            "value": "transparent"
          },
          "height": {
            "signal": "height"
          }
        }
      },
      "axes": [
        {
          "scale": "y",
          "orient": "right",
          "encode": {
            "ticks": {
              "update": {
                "x2": {
                  "signal": "-columnsWidth"
                }
              }
            }
          },
          "tickColor": "#f1f1f1",
          "labels": false,
          "title": "",
          "grid": false,
          "ticks": true,
          "bandPosition": {
            "signal": "0"
          }
        }
      ]
    }
  ],
  "axes": [
    {
      "description": "Bottom date axis",
      "ticks": true,
      "labelPadding": -12,
      "scale": "x",
      "position": {
        "signal": "columnsWidth"
      },
      "orient": "top",
      "tickSize": 15,
      "grid": false,
      "zindex": 1,
      "labelOverlap": false,
      "formatType": "time",
      "tickCount": {
        "signal": "dayBandwidthRound>=minYearBandwidth?'day':'month'"
      },
      "encode": {
        "ticks": {
          "update": {
            "strokeWidth": [
              {
                "test": "dayBandwidthRound>=minDayBandwidth",
                "value": 1
              },
              {
                "test": "dayBandwidthRound>=minMonthBandwidth && dayBandwidthRound<minDayBandwidth && date(datum.value) == 1",
                "value": 1
              },
              {
                "test": "dayBandwidthRound>=minYearBandwidth && dayBandwidthRound<minMonthBandwidth && date(datum.value) == 1",
                "value": 1
              },
              {
                "test": "dayBandwidthRound<minYearBandwidth && dayofyear(datum.value) == 1",
                "value": 1
              },
              {
                "value": 0
              }
            ]
          }
        },
        "labels": {
          "update": {
            "text": [
              {
                "test": "dayBandwidthRound>=minDayBandwidth",
                "signal": "timeFormat(datum.value,'%d')"
              },
              {
                "test": "dayBandwidthRound>=minMonthBandwidth && dayBandwidthRound<minDayBandwidth && date(datum.value) == 15",
                "signal": "timeFormat(datum.value,'%B %y')"
              },
              {
                "test": "dayBandwidthRound>=minYearBandwidth && dayBandwidthRound<minMonthBandwidth && date(datum.value) == 15",
                "signal": "timeFormat(datum.value,'%b')"
              },
              {
                "test": "dayBandwidthRound<minYearBandwidth && month(datum.value) == 6",
                "signal": "timeFormat(datum.value,'%Y')"
              },
              {
                "value": ""
              }
            ],
            "dx": {
              "signal": "dayBandwidthRound/2"
            }
          }
        }
      }
    },
    {
      "description": "Top date axis",
      "scale": "x",
      "position": {
        "signal": "columnsWidth"
      },
      "domain": false,
      "orient": "top",
      "offset": 0,
      "tickSize": 22,
      "labelBaseline": "middle",
      "grid": false,
      "zindex": 0,
      "tickCount": {
        "signal": "dayBandwidthRound>=minYearBandwidth?'day':'month'"
      },
      "encode": {
        "ticks": {
          "update": {
            "strokeWidth": [
              {
                "test": "dayBandwidthRound>=minDayBandwidth && date(datum.value) == 1",
                "value": 1
              },
              {
                "test": "dayBandwidthRound>=minYearBandwidth && dayBandwidthRound<minDayBandwidth && dayofyear(datum.value) == 1",
                "value": 1
              },
              {
                "value": 0
              }
            ]
          }
        },
        "labels": {
          "update": {
            "text": [
              {
                "test": "dayBandwidthRound>=minDayBandwidth && date(datum.value) == 15",
                "signal": "timeFormat(datum.value,'%B %y')"
              },
              {
                "test": "dayBandwidthRound>=minYearBandwidth && dayBandwidthRound<minMonthBandwidth && month(datum.value) == 5 && date(datum.value) == 15",
                "signal": "timeFormat(datum.value,'%Y')"
              },
              {
                "value": ""
              }
            ],
            "dx": {
              "signal": "dayBandwidthRound/2"
            }
          }
        }
      }
    },
    {
      "description": "Month grid lines",
      "scale": "x",
      "position": {
        "signal": "columnsWidth"
      },
      "domain": false,
      "orient": "top",
      "labels": false,
      "grid": true,
      "tickSize": 0,
      "zindex": 0,
      "tickCount": {
        "signal": " dayBandwidthRound>=minMonthBandwidth || dayBandwidthRound<=0.35?0:'month'"
      }
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "time",
      "domain": {
        "signal": "xDom"
      },
      "range": {
        "signal": "[0,ganttWidth]"
      }
    },
    {
      "name": "y",
      "type": "band",
      "domain": {
        "fields": [
          {
            "data": "yScale",
            "field": "id"
          }
        ],
        "sort": {
          "op": "min",
          "field": "finalSort",
          "order": "ascending"
        }
      },
      "range": {
        "signal": "yRange"
      }
    },
    {
      "name": "cDark",
      "type": "ordinal",
      "range": {
        "signal": "colours.dark"
      },
      "domain": {
        "data": "input",
        "field": "phase"
      }
    },
    {
      "name": "cLight",
      "type": "ordinal",
      "range": {
        "signal": "colours.light"
      },
      "domain": {
        "data": "input",
        "field": "phase"
      }
    },
    {
      "name": "statusText",
      "type": "ordinal",
      "range": {
        "signal": "statusColumn.range"
      },
      "domain": {
        "signal": "statusColumn.domain"
      }
    },
    {
      "name": "statusFont",
      "type": "ordinal",
      "range": {
        "signal": "statusColumn.font"
      },
      "domain": {
        "signal": "statusColumn.domain"
      }
    },
    {
      "name": "statusBackground",
      "type": "ordinal",
      "range": {
        "signal": "statusColumn.background"
      },
      "domain": {
        "signal": "statusColumn.domain"
      }
    }
  ],
  "config": {
    "view": {
      "stroke": "transparent"
    },
    "style": {
      "col": {
        "fontSize": 11
      },
      "cell": {
        "strokeWidth": {
          "value": "0"
        }
      }
    },
    "font": "Segoe UI",
    "text": {
      "font": "Segoe UI",
      "fontSize": 10,
      "baseline": "middle"
    },
    "axis": {
      "labelColor": {
        "signal": "textColour"
      },
      "labelFontSize": 10
    },
    "title": {
      "color": {
        "signal": "textColour"
      }
    }
  }
},
};

const calendarHeatmapData = [
  {
    "Date": "01/01/16",
    "Amount": 2017.6
  },
  {
    "Date": "02/01/16",
    "Amount": 2017.2
  },
  {
    "Date": "03/01/16",
    "Amount": 2017.7
  },
  {
    "Date": "04/01/16",
    "Amount": 2016.5
  },
  {
    "Date": "05/01/16",
    "Amount": 2016.5
  },
  {
    "Date": "06/01/16",
    "Amount": 2017
  },
  {
    "Date": "07/01/16",
    "Amount": 2016.9
  },
  {
    "Date": "08/01/16",
    "Amount": 2016.7
  },
  {
    "Date": "09/01/16",
    "Amount": 2016.8
  },
  {
    "Date": "10/01/16",
    "Amount": 2017.1
  }
];

const calendarHeatmapTemplate: DenebTemplate = {
  name: "Calendar Heatmap",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Calendar Heatmap",
    author: "PBI-David",
    tags: ["deneb", "vega-lite", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Calendar Heatmap data",
      type: "array",
      required: true,
      sampleData: calendarHeatmapData,
    },
  ],
  vegaLite: {
  "width": {
    "step": 14
  },
  "height": {
    "step": 14
  },
  "background": "#222431",
  "data": {
    "name": "dataset",
    "url": "https://raw.githubusercontent.com/PBI-David/Deneb-Showcase/main/Calendar%20Heatmap/data.json",
    "format": {
      "parse": {
        "Date": "date:'%d/%m/%Y'"
      }
    }
  },
  "transform": [
    {
      "calculate": "'20'+year(datum.Date)",
      "as": "Year"
    },
    {
      "calculate": "monthAbbrevFormat(month(datum.Date))",
      "as": "MonthName"
    },
    {
      "calculate": "month(datum.Date)",
      "as": "MonthNumber"
    },
    {
      "calculate": "day(datum.Date)==0?week(datum.Date)-1:week(datum.Date)",
      "as": "WeekNumber"
    }
  ],
  "mark": {
    "type": "bar",
    "tooltip": true,
    "cornerRadius": 2
  },
  "encoding": {
    "column": {
      "spacing": 10,
      "field": "MonthName",
      "sort": [],
      "title": "",
      "header": {
        "labelFontSize": 18,
        "labelPadding": 10,
        "labelFont": "Segoe UI",
        "labelColor": "#9092a1"
      }
    },
    "row": {
      "field": "Year",
      "title": "",
      "sort": "descending",
      "header": {
        "labelFontSize": 44,
        "labelPadding": 5,
        "labelFont": "Segoe UI",
        "labelColor": "#9092a1"
      }
    },
    "x": {
      "field": "WeekNumber",
      "axis": null,
      "title": ""
    },
    "y": {
      "field": "Date",
      "timeUnit": "day",
      "sort": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
        "sun"
      ],
      "type": "ordinal",
      "title": "",
      "axis": {
        "labels": true,
        "format": "",
        "ticks": false,
        "labelPadding": 18,
        "labelColor": "#9092a1"
      }
    },
    "color": {
      "field": "Amount",
      "type": "quantitative",
      "legend": null,
      "scale": {
        "reverse": true,
        "scheme": {
          "name": "turbo",
          "extent": [
            0.1,
            1
          ]
        }
      }
    }
  },
  "resolve": {
    "axis": {
      "x": "independent"
    },
    "scale": {
      "x": "independent"
    }
  },
  "config": {
    "view": {
      "stroke": "transparent"
    },
    "font": "Segoe UI",
    "text": {
      "font": "Segoe UI",
      "fontSize": 12,
      "fill": "#605E5C"
    },
    "axis": {
      "ticks": false,
      "grid": false,
      "domain": false,
      "labelColor": "#605E5C",
      "labelFontSize": 12,
      "titleFont": "wf_standard-font, helvetica, arial, sans-serif",
      "titleColor": "#252423",
      "titleFontSize": 16,
      "titleFontWeight": "normal"
    },
    "axisX": {
      "labelPadding": 5
    },
    "axisY": {
      "labelPadding": 10
    },
    "header": {
      "titleFont": "wf_standard-font, helvetica, arial, sans-serif",
      "titleFontSize": 16,
      "titleColor": "#252423",
      "labelFont": "Segoe UI",
      "labelFontSize": 13.333333333333332,
      "labelColor": "#9092a1"
    },
    "legend": {
      "titleFont": "Segoe UI",
      "titleFontWeight": "bold",
      "titleColor": "#605E5C",
      "labelFont": "Segoe UI",
      "labelFontSize": 13.333333333333332,
      "labelColor": "#605E5C",
      "symbolType": "circle",
      "symbolSize": 75
    }
  }
},
};

const bankFailureBubbleData = [
  {
    "Bank": "First Republic Bank",
    "Date": "01/05/2023",
    "Assets": 229100000000,
    "InflationAdjustedAssets": 229100000000
  },
  {
    "Bank": "Signature Bank",
    "Date": "12/03/2023",
    "Assets": 110400000000,
    "InflationAdjustedAssets": 110400000000
  },
  {
    "Bank": "Silicon Valley Bank",
    "Date": "10/03/2023",
    "Assets": 209000000000,
    "InflationAdjustedAssets": 209000000000
  },
  {
    "Bank": "Almena State Bank",
    "Date": "23/10/2020",
    "Assets": 70000000,
    "InflationAdjustedAssets": 80915803.42
  },
  {
    "Bank": "First City Bank of Florida",
    "Date": "16/10/2020",
    "Assets": 134700000,
    "InflationAdjustedAssets": 155705124.6
  },
  {
    "Bank": "First State Bank",
    "Date": "03/04/2020",
    "Assets": 152400000,
    "InflationAdjustedAssets": 176165263.5
  },
  {
    "Bank": "Ericson State Bank",
    "Date": "14/02/2020",
    "Assets": 100900000,
    "InflationAdjustedAssets": 116634350.9
  },
  {
    "Bank": "City National Bank of New Jersey",
    "Date": "01/11/2019",
    "Assets": 120600000,
    "InflationAdjustedAssets": 141126204.3
  },
  {
    "Bank": "Resolute Bank",
    "Date": "25/10/2019",
    "Assets": 27100000,
    "InflationAdjustedAssets": 31712438.93
  },
  {
    "Bank": "Louisa Community Bank",
    "Date": "25/10/2019",
    "Assets": 29700000,
    "InflationAdjustedAssets": 34754960.75
  }
];

const bankFailureBubbleTemplate: DenebTemplate = {
  name: "Bank Failure Bubble Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Bank Failure Bubble Chart",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Bank Failure Bubble Chart data",
      type: "array",
      required: true,
      sampleData: bankFailureBubbleData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 1500,
  "height": 1000,
  "padding": {
    "left": 0,
    "right": 0,
    "top": 0,
    "bottom": 0
  },
  "description": "Dataviz by David Bacci: https://www.linkedin.com/in/davbacci/",
  "autosize": "pad",
  "signals": [
    {
      "name": "cx",
      "update": "width / 2"
    },
    {
      "name": "cy",
      "update": "height / 2"
    },
    {
      "name": "counter",
      "value": -3,
      "on": [
        {
          "events": {
            "type": "timer",
            "throttle": 700
          },
          "update": "counter<7?counter + 1:counter"
        }
      ]
    }
  ],
  "data": [
    {
      "name": "table",
      "url": "https://raw.githubusercontent.com/PBI-David/Deneb-Showcase/main/Bank%20Failure%20Bubble%20Chart/data.json",
      "format": {
        "parse": {
          "Date": "date:'%d/%m/%Y'"
        }
      },
      "transform": [
        {
          "type": "formula",
          "as": "Year",
          "expr": "year(datum.Date)"
        },
        {
          "type": "formula",
          "as": "friendlyDate",
          "expr": "date(datum.Date)+'/'+(toNumber(month(datum.Date))+1)+'/'+year(datum.Date)"
        }
      ]
    }
  ],
  "scales": [
    {
      "type": "sqrt",
      "name": "size",
      "domain": {
        "data": "table",
        "field": "Assets"
      },
      "range": [
        0.01,
        0.1
      ]
    },
    {
      "type": "time",
      "name": "x",
      "nice": true,
      "domainMax": {
        "signal": "1735760232000"
      },
      "domain": {
        "data": "table",
        "field": "Date"
      },
      "range": "width"
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {
        "data": "table",
        "field": "Year",
        "sort": true
      },
      "range": [
        "#c5b0d5",
        "#ff9896",
        "#d6616b",
        "#6baed6",
        "#bcbddc",
        "#4a8cbd",
        "#f2924c",
        "#7e80cf",
        "#74c476",
        "#e7c06a",
        "#ce6dbd",
        "#c7e9c0",
        "#637939",
        "#ff9896",
        "#c49c94",
        "#17becf",
        "#98df8a",
        "#ab4849"
      ],
      "reverse": false
    }
  ],
  "axes": [
    {
      "offset": -50,
      "zindex": 1,
      "labelFont": {
        "value": "Lato "
      },
      "orient": "top",
      "scale": "x",
      "domain": true,
      "ticks": true,
      "labelFontSize": 12,
      "labelFontWeight": "500",
      "labelColor": "#dedede",
      "tickCount": 20,
      "tickExtra": true,
      "tickSize": {
        "signal": "datum.label %2  == 0? -10:10"
      },
      "encode": {
        "labels": {
          "update": {
            "dy": [
              {
                "test": "datum.label %2  == 0",
                "value": 20
              },
              {
                "value": 0
              }
            ]
          }
        }
      }
    }
  ],
  "marks": [
    {
      "type": "rect",
      "name": "back",
      "clip": false,
      "data": [
        {}
      ],
      "encode": {
        "enter": {
          "fill": {
            "value": {
              "gradient": "linear",
              "x1": 0,
              "y1": 1,
              "x2": 1,
              "y2": 0,
              "stops": [
                {
                  "offset": 0,
                  "color": "#4d6193"
                },
                {
                  "offset": 1,
                  "color": "#263967"
                }
              ]
            }
          },
          "x": {
            "signal": "-40"
          },
          "y": {
            "signal": "0"
          },
          "width": {
            "signal": "width+80"
          },
          "height": {
            "signal": "height"
          }
        }
      }
    },
    {
      "clip": true,
      "type": "text",
      "data": [
        {}
      ],
      "encode": {
        "enter": {
          "fontSize": {
            "signal": "60"
          },
          "font": {
            "value": "Lato Black"
          },
          "align": {
            "value": "left"
          },
          "fill": {
            "value": "white"
          },
          "text": {
            "value": [
              "Bank Failures",
              "2001-2023"
            ]
          },
          "x": {
            "signal": "0"
          },
          "y": {
            "signal": "height-130"
          }
        }
      }
    },
    {
      "type": "text",
      "clip": true,
      "data": [
        {}
      ],
      "encode": {
        "enter": {
          "fontSize": {
            "signal": "16"
          },
          "align": {
            "value": "left"
          },
          "font": {
            "value": "Lato "
          },
          "fontWeight": {
            "value": "normal"
          },
          "fill": {
            "value": "white"
          },
          "text": {
            "value": "Reported by Federal Deposit Insurance Corporation (FDIC)"
          },
          "x": {
            "signal": "0"
          },
          "y": {
            "signal": "height-40"
          }
        }
      }
    },
    {
      "name": "labelSizes",
      "clip": true,
      "type": "text",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "fontSize": {
            "signal": "max( sqrt(datum.Assets)/22000, 8.5)"
          },
          "fontWeight": {
            "value": "bold"
          },
          "fill": {
            "value": "transparent"
          },
          "text": {
            "field": "Bank"
          },
          "x": {
            "value": 100
          },
          "y": {
            "value": 100
          }
        }
      }
    },
    {
      "clip": true,
      "name": "nodes",
      "type": "symbol",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "fill": {
            "scale": "color",
            "field": "Year"
          },
          "fillOpacity": {
            "value": 1
          },
          "zindex": {
            "value": 2
          }
        },
        "update": {
          "size": {
            "signal": "pow(2 * datum.Assets, 2)",
            "scale": "size"
          },
          "xfocus": {
            "field": "Date",
            "scale": "x"
          },
          "yfocus": {
            "signal": "cy"
          },
          "stroke": {
            "value": "black"
          },
          "strokeWidth": {
            "value": 0.5
          },
          "tooltip": {
            "signal": "{'Bank':datum.Bank , 'Date':datum.friendlyDate ,'Assets':replace( format(datum.Assets,'$.3~s'),'G', 'B') }"
          }
        }
      },
      "transform": [
        {
          "type": "force",
          "iterations": 100,
          "restart": true,
          "static": false,
          "forces": [
            {
              "force": "collide",
              "iterations": 2,
              "radius": {
                "expr": "sqrt(datum.size) / 2"
              },
              "strength": 0.7
            },
            {
              "force": "x",
              "x": "xfocus",
              "strength": {
                "signal": "counter==0?1:counter==1?1:counter==2?0:counter==3?1:counter==4?1:counter==5?0:counter==6?1:1"
              }
            },
            {
              "force": "y",
              "y": "yfocus",
              "strength": {
                "signal": "counter==0?1:counter==1?0:counter==2?0:counter==3?0:counter==4?0.04:counter==5?0.04:counter==6?0.04:0"
              }
            }
          ]
        },
        {
          "type": "lookup",
          "from": "labelSizes",
          "key": "text",
          "fields": [
            "datum.Bank"
          ],
          "values": [
            "bounds.x1",
            "bounds.x2"
          ],
          "as": [
            "a",
            "b"
          ]
        }
      ]
    },
    {
      "clip": true,
      "type": "text",
      "name": "labels",
      "from": {
        "data": "nodes"
      },
      "encode": {
        "update": {
          "align": {
            "value": "center"
          },
          "baseline": {
            "value": "bottom"
          },
          "fontSize": {
            "signal": "max( sqrt(datum.datum.Assets)/22000, 8.5) "
          },
          "lineHeight": {
            "signal": "max( sqrt(datum.datum.Assets)/14000, 12) "
          },
          "fontWeight": {
            "value": "normal"
          },
          "fill": {
            "value": "white"
          },
          "limit": {
            "signal": "(datum.bounds.x2-datum.bounds.x1)-6"
          },
          "text": {
            "signal": "datum.datum.Assets> 5000000000?[datum.datum.Bank,replace( format(datum.datum.Assets,'$.3~s'),'G', 'B')]:''"
          },
          "x": {
            "field": "x"
          },
          "y": {
            "field": "y"
          },
          "tooltip": {
            "signal": "{'Bank':datum.datum.Bank , 'Date':datum.datum.friendlyDate ,'Assets':replace( format(datum.datum.Assets,'$.3~s'),'G', 'B') }"
          }
        }
      }
    },
    {
      "type": "text",
      "data": [
        {}
      ],
      "encode": {
        "update": {
          "text": {
            "value": [
              "Source: www.fdic.gov",
              "Dataviz: David Bacci"
            ]
          },
          "href": {
            "value": "https://www.linkedin.com/in/davbacci"
          },
          "align": {
            "value": "left"
          },
          "lineHeight": {
            "value": 16
          },
          "fill": {
            "value": "white"
          },
          "x": {
            "signal": "width - 100"
          },
          "y": {
            "signal": "height-60"
          },
          "fontSize": {
            "value": 10
          },
          "font": {
            "value": "Segoe UI "
          }
        }
      }
    }
  ]
},
};

const coronationArcData = [
  {
    "House": "Wessex",
    "Name": "Alfred the Great",
    "Reign Start": "01/01/0886",
    "Reign End": "26/10/0899",
    "Reign Period": "13 years",
    "Birth": "01/01/0849",
    "Death": "26/10/0899",
    "Age": 50,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 37,
    "Reign End Age": 50.8
  },
  {
    "House": "Wessex",
    "Name": "Edward the Elder",
    "Reign Start": "26/10/0899",
    "Reign End": "17/07/0924",
    "Reign Period": "24 years, 266 days",
    "Birth": "01/01/0874",
    "Death": "17/07/0924",
    "Age": 50,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 25.8,
    "Reign End Age": 50.6
  },
  {
    "House": "Wessex",
    "Name": "Athelstan",
    "Reign Start": "17/07/0924",
    "Reign End": "27/10/0939",
    "Reign Period": "15 years",
    "Birth": "01/01/0894",
    "Death": "27/10/0939",
    "Age": 45,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 30.6,
    "Reign End Age": 45.8
  },
  {
    "House": "Wessex",
    "Name": "Edmund I",
    "Reign Start": "27/10/0939",
    "Reign End": "26/05/0946",
    "Reign Period": "6 years, 212 days",
    "Birth": "01/01/0921",
    "Death": "26/05/0946",
    "Age": 25,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 18.8,
    "Reign End Age": 25.4
  },
  {
    "House": "Wessex",
    "Name": "Eadred",
    "Reign Start": "26/05/0946",
    "Reign End": "23/11/0955",
    "Reign Period": "9 years, 182 days",
    "Birth": "01/01/0923",
    "Death": "23/11/0955",
    "Age": 32,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 23.4,
    "Reign End Age": 32.9
  },
  {
    "House": "Wessex",
    "Name": "Eadwig",
    "Reign Start": "23/11/0955",
    "Reign End": "01/10/0959",
    "Reign Period": "3 years, 313 days",
    "Birth": "01/01/0940",
    "Death": "01/10/0959",
    "Age": 19,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 15.9,
    "Reign End Age": 19.8
  },
  {
    "House": "Wessex",
    "Name": "Edgar",
    "Reign Start": "01/10/0959",
    "Reign End": "08/07/0975",
    "Reign Period": "15 years, 281 days",
    "Birth": "01/01/0943",
    "Death": "08/07/0975",
    "Age": 31,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 16.8,
    "Reign End Age": 32.5
  },
  {
    "House": "Wessex",
    "Name": "Edward the Martyr",
    "Reign Start": "08/07/0975",
    "Reign End": "18/03/0978",
    "Reign Period": "2 years, 254 days",
    "Birth": "01/01/0962",
    "Death": "18/03/0978",
    "Age": 16,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 13.5,
    "Reign End Age": 16.2
  },
  {
    "House": "Wessex",
    "Name": "Aethelred II",
    "Reign Start": "18/03/0978",
    "Reign End": "25/12/1013",
    "Reign Period": "35 years",
    "Birth": "01/01/0966",
    "Death": "23/04/1016",
    "Age": 48,
    "Notes": "Birth date is approximate",
    "Reign Start Age": 12.2,
    "Reign End Age": 48
  },
  {
    "House": "Denmark",
    "Name": "Sweyn Forkbeard",
    "Reign Start": "25/12/1013",
    "Reign End": "03/02/1014",
    "Reign Period": "0 years, 41 days",
    "Birth": "17/04/0963",
    "Death": "03/02/1014",
    "Age": 50,
    "Notes": "",
    "Reign Start Age": 50.7,
    "Reign End Age": 51.3
  }
];

const coronationArcTemplate: DenebTemplate = {
  name: "Coronation Arc Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Coronation Arc Chart",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Coronation Arc Chart data",
      type: "array",
      required: true,
      sampleData: coronationArcData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Dataviz by David Bacci: https://www.linkedin.com/in/davbacci/",
  "width": 900,
  "height": 800,
  "background": "#192730",
  "padding": {
    "bottom": 70,
    "left": 70,
    "right": 70,
    "top": 70
  },
  "autosize": "pad",
  "signals": [
    {
      "name": "facetWidth",
      "value": 70
    },
    {
      "name": "facetHeight",
      "value": 70
    },
    {
      "name": "legendX",
      "update": "0"
    },
    {
      "name": "legendY",
      "update": "1200"
    },
    {
      "name": "keyTitleX",
      "update": "700"
    },
    {
      "name": "keyTitleY",
      "update": "legendY+10"
    },
    {
      "name": "keyX",
      "update": "817"
    },
    {
      "name": "keyY",
      "update": "1270"
    },
    {
      "name": "lifeCircleColour",
      "update": "'silver'"
    },
    {
      "name": "legendLabelColour",
      "update": "'silver'"
    },
    {
      "name": "monarchLabelColour",
      "update": "'#d0d0d2'"
    }
  ],
  "data": [
    {
      "name": "table",
      "values": [
        {
          "House": "Wessex",
          "Name": "Alfred the Great",
          "Reign Start": "01/01/0886",
          "Reign End": "26/10/0899",
          "Reign Period": "13 years",
          "Birth": "01/01/0849",
          "Death": "26/10/0899",
          "Age": 50,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 37,
          "Reign End Age": 50.8
        },
        {
          "House": "Wessex",
          "Name": "Edward the Elder",
          "Reign Start": "26/10/0899",
          "Reign End": "17/07/0924",
          "Reign Period": "24 years, 266 days",
          "Birth": "01/01/0874",
          "Death": "17/07/0924",
          "Age": 50,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 25.8,
          "Reign End Age": 50.6
        },
        {
          "House": "Wessex",
          "Name": "Athelstan",
          "Reign Start": "17/07/0924",
          "Reign End": "27/10/0939",
          "Reign Period": "15 years",
          "Birth": "01/01/0894",
          "Death": "27/10/0939",
          "Age": 45,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 30.6,
          "Reign End Age": 45.8
        },
        {
          "House": "Wessex",
          "Name": "Edmund I",
          "Reign Start": "27/10/0939",
          "Reign End": "26/05/0946",
          "Reign Period": "6 years, 212 days",
          "Birth": "01/01/0921",
          "Death": "26/05/0946",
          "Age": 25,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 18.8,
          "Reign End Age": 25.4
        },
        {
          "House": "Wessex",
          "Name": "Eadred",
          "Reign Start": "26/05/0946",
          "Reign End": "23/11/0955",
          "Reign Period": "9 years, 182 days",
          "Birth": "01/01/0923",
          "Death": "23/11/0955",
          "Age": 32,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 23.4,
          "Reign End Age": 32.9
        },
        {
          "House": "Wessex",
          "Name": "Eadwig",
          "Reign Start": "23/11/0955",
          "Reign End": "01/10/0959",
          "Reign Period": "3 years, 313 days",
          "Birth": "01/01/0940",
          "Death": "01/10/0959",
          "Age": 19,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 15.9,
          "Reign End Age": 19.8
        },
        {
          "House": "Wessex",
          "Name": "Edgar",
          "Reign Start": "01/10/0959",
          "Reign End": "08/07/0975",
          "Reign Period": "15 years, 281 days",
          "Birth": "01/01/0943",
          "Death": "08/07/0975",
          "Age": 31,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 16.8,
          "Reign End Age": 32.5
        },
        {
          "House": "Wessex",
          "Name": "Edward the Martyr",
          "Reign Start": "08/07/0975",
          "Reign End": "18/03/0978",
          "Reign Period": "2 years, 254 days",
          "Birth": "01/01/0962",
          "Death": "18/03/0978",
          "Age": 16,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 13.5,
          "Reign End Age": 16.2
        },
        {
          "House": "Wessex",
          "Name": "Aethelred II",
          "Reign Start": "18/03/0978",
          "Reign End": "25/12/1013",
          "Reign Period": "35 years",
          "Birth": "01/01/0966",
          "Death": "23/04/1016",
          "Age": 48,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 12.2,
          "Reign End Age": 48
        },
        {
          "House": "Denmark",
          "Name": "Sweyn Forkbeard",
          "Reign Start": "25/12/1013",
          "Reign End": "03/02/1014",
          "Reign Period": "0 years, 41 days",
          "Birth": "17/04/0963",
          "Death": "03/02/1014",
          "Age": 50,
          "Notes": "",
          "Reign Start Age": 50.7,
          "Reign End Age": 51.3
        },
        {
          "House": "Wessex",
          "Name": "Aethelred II",
          "Reign Start": "03/02/1014",
          "Reign End": "23/04/1016",
          "Reign Period": "2 years, 81 days",
          "Birth": "01/01/0966",
          "Death": "23/04/1016",
          "Age": 48,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 48.1,
          "Reign End Age": 50.3
        },
        {
          "House": "Wessex",
          "Name": "Edmund II",
          "Reign Start": "23/04/1016",
          "Reign End": "30/11/1016",
          "Reign Period": "0 years, 222 days",
          "Birth": "01/01/0990",
          "Death": "30/11/1016",
          "Age": 26,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 26.3,
          "Reign End Age": 26.9
        },
        {
          "House": "Denmark",
          "Name": "Canute",
          "Reign Start": "18/10/1016",
          "Reign End": "12/11/1035",
          "Reign Period": "19 years, 26 days",
          "Birth": "01/01/0995",
          "Death": "12/11/1035",
          "Age": 40,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 21.8,
          "Reign End Age": 40.9
        },
        {
          "House": "Denmark",
          "Name": "Harold I",
          "Reign Start": "12/11/1035",
          "Reign End": "17/03/1040",
          "Reign Period": "4 years, 127 days",
          "Birth": "01/01/1016",
          "Death": "17/03/1040",
          "Age": 24,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 19.9,
          "Reign End Age": 24.2
        },
        {
          "House": "Denmark",
          "Name": "Harthacanute",
          "Reign Start": "17/03/1040",
          "Reign End": "08/06/1042",
          "Reign Period": "2 years, 84 days",
          "Birth": "01/01/1018",
          "Death": "08/06/1042",
          "Age": 24,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 22.2,
          "Reign End Age": 24.4
        },
        {
          "House": "Wessex",
          "Name": "Edward the Confessor",
          "Reign Start": "08/06/1042",
          "Reign End": "05/01/1066",
          "Reign Period": "23 years, 212 days",
          "Birth": "01/01/1003",
          "Death": "05/01/1066",
          "Age": 63,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 39.5,
          "Reign End Age": 63.1
        },
        {
          "House": "Godwin",
          "Name": "Harold II",
          "Reign Start": "05/01/1066",
          "Reign End": "14/10/1066",
          "Reign Period": "0 years, 282 days",
          "Birth": "01/01/1022",
          "Death": "14/10/1066",
          "Age": 44,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 44,
          "Reign End Age": 44.8
        },
        {
          "House": "Normandy",
          "Name": "William I",
          "Reign Start": "25/12/1066",
          "Reign End": "09/09/1087",
          "Reign Period": "20 years, 259 days",
          "Birth": "01/01/1028",
          "Death": "09/09/1087",
          "Age": 59,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 39,
          "Reign End Age": 59.7
        },
        {
          "House": "Normandy",
          "Name": "William II",
          "Reign Start": "26/09/1087",
          "Reign End": "02/08/1100",
          "Reign Period": "12 years, 311 days",
          "Birth": "01/01/1056",
          "Death": "02/08/1100",
          "Age": 44,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 31.8,
          "Reign End Age": 44.6
        },
        {
          "House": "Normandy",
          "Name": "Henry I",
          "Reign Start": "05/08/1100",
          "Reign End": "01/12/1135",
          "Reign Period": "35 years, 119 days",
          "Birth": "01/08/1068",
          "Death": "01/12/1135",
          "Age": 67,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 32,
          "Reign End Age": 67.4
        },
        {
          "House": "Blois",
          "Name": "Stephen",
          "Reign Start": "22/12/1135",
          "Reign End": "25/10/1154",
          "Reign Period": "18 years, 308 days",
          "Birth": "01/01/1096",
          "Death": "25/10/1154",
          "Age": 58,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 40,
          "Reign End Age": 58.9
        },
        {
          "House": "Plantagenet",
          "Name": "Henry II",
          "Reign Start": "19/12/1154",
          "Reign End": "06/07/1189",
          "Reign Period": "34 years, 200 days",
          "Birth": "05/03/1133",
          "Death": "06/07/1189",
          "Age": 56,
          "Notes": "",
          "Reign Start Age": 21.8,
          "Reign End Age": 56.4
        },
        {
          "House": "Plantagenet",
          "Name": "Richard I",
          "Reign Start": "03/09/1189",
          "Reign End": "06/04/1199",
          "Reign Period": "9 years, 216 days",
          "Birth": "08/09/1157",
          "Death": "06/04/1199",
          "Age": 41,
          "Notes": "",
          "Reign Start Age": 32,
          "Reign End Age": 41.6
        },
        {
          "House": "Plantagenet",
          "Name": "John",
          "Reign Start": "27/05/1199",
          "Reign End": "19/10/1216",
          "Reign Period": "17 years, 146 days",
          "Birth": "24/12/1166",
          "Death": "19/10/1216",
          "Age": 49,
          "Notes": "",
          "Reign Start Age": 32.4,
          "Reign End Age": 49.9
        },
        {
          "House": "Plantagenet",
          "Name": "Henry III",
          "Reign Start": "28/10/1216",
          "Reign End": "16/11/1272",
          "Reign Period": "56 years, 20 days",
          "Birth": "01/10/1207",
          "Death": "16/11/1272",
          "Age": 65,
          "Notes": "",
          "Reign Start Age": 9.1,
          "Reign End Age": 65.2
        },
        {
          "House": "Plantagenet",
          "Name": "Edward I",
          "Reign Start": "20/11/1272",
          "Reign End": "07/07/1307",
          "Reign Period": "34 years, 230 days",
          "Birth": "17/06/1239",
          "Death": "07/07/1307",
          "Age": 68,
          "Notes": "",
          "Reign Start Age": 33.5,
          "Reign End Age": 68.1
        },
        {
          "House": "Plantagenet",
          "Name": "Edward II",
          "Reign Start": "08/07/1307",
          "Reign End": "20/01/1327",
          "Reign Period": "19 years, 197 days",
          "Birth": "25/04/1284",
          "Death": "21/09/1327",
          "Age": 43,
          "Notes": "",
          "Reign Start Age": 23.2,
          "Reign End Age": 42.8
        },
        {
          "House": "Plantagenet",
          "Name": "Edward III",
          "Reign Start": "25/01/1327",
          "Reign End": "21/06/1377",
          "Reign Period": "50 years, 148 days",
          "Birth": "13/11/1312",
          "Death": "21/06/1377",
          "Age": 64,
          "Notes": "",
          "Reign Start Age": 14.2,
          "Reign End Age": 64.6
        },
        {
          "House": "Plantagenet",
          "Name": "Richard II",
          "Reign Start": "22/06/1377",
          "Reign End": "29/09/1399",
          "Reign Period": "22 years, 100 days",
          "Birth": "06/01/1367",
          "Death": "14/02/1400",
          "Age": 33,
          "Notes": "",
          "Reign Start Age": 10.5,
          "Reign End Age": 32.8
        },
        {
          "House": "Lancaster",
          "Name": "Henry IV",
          "Reign Start": "30/09/1399",
          "Reign End": "20/03/1413",
          "Reign Period": "13 years, 172 days",
          "Birth": "01/04/1367",
          "Death": "20/03/1413",
          "Age": 45,
          "Notes": "Birth date is approximate",
          "Reign Start Age": 32.5,
          "Reign End Age": 46
        },
        {
          "House": "Lancaster",
          "Name": "Henry V",
          "Reign Start": "21/03/1413",
          "Reign End": "31/08/1422",
          "Reign Period": "9 years, 164 days",
          "Birth": "16/09/1386",
          "Death": "31/08/1422",
          "Age": 35,
          "Notes": "",
          "Reign Start Age": 26.5,
          "Reign End Age": 36
        },
        {
          "House": "Lancaster",
          "Name": "Henry VI",
          "Reign Start": "01/09/1422",
          "Reign End": "04/03/1461",
          "Reign Period": "38 years, 185 days",
          "Birth": "06/12/1421",
          "Death": "21/05/1471",
          "Age": 49,
          "Notes": "",
          "Reign Start Age": 0.7,
          "Reign End Age": 39.3
        },
        {
          "House": "York",
          "Name": "Edward IV",
          "Reign Start": "04/03/1461",
          "Reign End": "03/10/1470",
          "Reign Period": "9 years, 214 days",
          "Birth": "28/04/1442",
          "Death": "09/04/1483",
          "Age": 40,
          "Notes": "",
          "Reign Start Age": 18.9,
          "Reign End Age": 28.5
        },
        {
          "House": "Lancaster",
          "Name": "Henry VI",
          "Reign Start": "03/10/1470",
          "Reign End": "11/04/1471",
          "Reign Period": "0 years. 191 days",
          "Birth": "06/12/1421",
          "Death": "21/05/1471",
          "Age": 49,
          "Notes": "",
          "Reign Start Age": 48.9,
          "Reign End Age": 49.4
        },
        {
          "House": "York",
          "Name": "Edward IV",
          "Reign Start": "11/04/1471",
          "Reign End": "09/04/1483",
          "Reign Period": "11 years, 364 days",
          "Birth": "28/04/1442",
          "Death": "09/04/1483",
          "Age": 40,
          "Notes": "",
          "Reign Start Age": 29,
          "Reign End Age": 41
        },
        {
          "House": "York",
          "Name": "Edward V",
          "Reign Start": "09/04/1483",
          "Reign End": "25/06/1483",
          "Reign Period": "0 years, 78 days",
          "Birth": "02/11/1470",
          "Death": "01/01/1483",
          "Age": 12,
          "Notes": "Death date is approximate",
          "Reign Start Age": 12.4,
          "Reign End Age": 12.7
        },
        {
          "House": "York",
          "Name": "Richard III",
          "Reign Start": "26/06/1483",
          "Reign End": "22/08/1485",
          "Reign Period": "2 years, 58 days",
          "Birth": "02/10/1452",
          "Death": "22/08/1485",
          "Age": 32,
          "Notes": "",
          "Reign Start Age": 30.8,
          "Reign End Age": 32.9
        },
        {
          "House": "Tudor",
          "Name": "Henry VII",
          "Reign Start": "22/08/1485",
          "Reign End": "21/04/1509",
          "Reign Period": "23 years, 243 days",
          "Birth": "28/01/1457",
          "Death": "21/04/1509",
          "Age": 52,
          "Notes": "",
          "Reign Start Age": 28.6,
          "Reign End Age": 52.3
        },
        {
          "House": "Tudor",
          "Name": "Henry VIII",
          "Reign Start": "22/04/1509",
          "Reign End": "28/01/1547",
          "Reign Period": "37 years, 282 days",
          "Birth": "29/06/1491",
          "Death": "28/01/1547",
          "Age": 55,
          "Notes": "",
          "Reign Start Age": 17.8,
          "Reign End Age": 55.6
        },
        {
          "House": "Tudor",
          "Name": "Edward VI",
          "Reign Start": "28/01/1547",
          "Reign End": "06/07/1553",
          "Reign Period": "6 years, 160 days",
          "Birth": "12/10/1537",
          "Death": "06/07/1553",
          "Age": 15,
          "Notes": "",
          "Reign Start Age": 9.3,
          "Reign End Age": 15.7
        },
        {
          "House": "Tudor",
          "Name": "Mary I",
          "Reign Start": "19/07/1553",
          "Reign End": "17/11/1558",
          "Reign Period": "5 years, 122 days",
          "Birth": "18/02/1516",
          "Death": "17/11/1558",
          "Age": 42,
          "Notes": "",
          "Reign Start Age": 37.4,
          "Reign End Age": 42.8
        },
        {
          "House": "Tudor",
          "Name": "Philip",
          "Reign Start": "25/07/1554",
          "Reign End": "17/11/1558",
          "Reign Period": "4 years, 116 days",
          "Birth": "21/05/1527",
          "Death": "13/09/1598",
          "Age": 71,
          "Notes": "",
          "Reign Start Age": 27.2,
          "Reign End Age": 31.5
        },
        {
          "House": "Tudor",
          "Name": "Elizabeth I",
          "Reign Start": "17/11/1558",
          "Reign End": "24/03/1603",
          "Reign Period": "44 years, 128 days",
          "Birth": "07/09/1533",
          "Death": "24/03/1603",
          "Age": 69,
          "Notes": "",
          "Reign Start Age": 25.2,
          "Reign End Age": 69.6
        },
        {
          "House": "Stuart",
          "Name": "James I",
          "Reign Start": "24/03/1603",
          "Reign End": "27/03/1625",
          "Reign Period": "22 years, 4 days",
          "Birth": "19/06/1566",
          "Death": "27/03/1625",
          "Age": 58,
          "Notes": "",
          "Reign Start Age": 36.8,
          "Reign End Age": 58.8
        },
        {
          "House": "Stuart",
          "Name": "Charles I",
          "Reign Start": "27/03/1625",
          "Reign End": "30/01/1649",
          "Reign Period": "23 years, 310 days",
          "Birth": "19/11/1600",
          "Death": "30/01/1649",
          "Age": 48,
          "Notes": "",
          "Reign Start Age": 24.4,
          "Reign End Age": 48.2
        },
        {
          "House": "Commonwealth",
          "Name": "Oliver Cromwell",
          "Reign Start": "16/12/1653",
          "Reign End": "03/09/1658",
          "Reign Period": "4 years, 262 days",
          "Birth": "25/04/1599",
          "Death": "03/09/1658",
          "Age": 59,
          "Notes": "",
          "Reign Start Age": 54.7,
          "Reign End Age": 59.4
        },
        {
          "House": "Commonwealth",
          "Name": "Richard Cromwell",
          "Reign Start": "03/09/1658",
          "Reign End": "07/05/1659",
          "Reign Period": "0 years, 247 days",
          "Birth": "04/10/1626",
          "Death": "12/07/1712",
          "Age": 85,
          "Notes": "",
          "Reign Start Age": 31.9,
          "Reign End Age": 32.6
        },
        {
          "House": "Stuart",
          "Name": "Charles II",
          "Reign Start": "29/05/1660",
          "Reign End": "06/02/1685",
          "Reign Period": "24 years, 254 days",
          "Birth": "29/05/1630",
          "Death": "06/02/1685",
          "Age": 54,
          "Notes": "",
          "Reign Start Age": 30,
          "Reign End Age": 54.7
        },
        {
          "House": "Stuart",
          "Name": "James II",
          "Reign Start": "06/02/1685",
          "Reign End": "23/12/1688",
          "Reign Period": "3 years, 321 days",
          "Birth": "14/10/1633",
          "Death": "16/09/1701",
          "Age": 67,
          "Notes": "",
          "Reign Start Age": 51.4,
          "Reign End Age": 55.2
        },
        {
          "House": "Stuart/Orange",
          "Name": "Mary II",
          "Reign Start": "13/02/1689",
          "Reign End": "28/12/1694",
          "Reign Period": "5 years, 319 days",
          "Birth": "30/04/1662",
          "Death": "28/12/1694",
          "Age": 32,
          "Notes": "",
          "Reign Start Age": 26.8,
          "Reign End Age": 32.7
        },
        {
          "House": "Stuart/Orange",
          "Name": "William III",
          "Reign Start": "13/02/1689",
          "Reign End": "08/03/1702",
          "Reign Period": "13 years, 24 days",
          "Birth": "04/11/1650",
          "Death": "08/03/1702",
          "Age": 51,
          "Notes": "",
          "Reign Start Age": 38.3,
          "Reign End Age": 51.4
        },
        {
          "House": "Stuart/Orange",
          "Name": "Anne",
          "Reign Start": "08/03/1702",
          "Reign End": "01/08/1714",
          "Reign Period": "12 years, 147 days",
          "Birth": "06/02/1665",
          "Death": "01/08/1714",
          "Age": 49,
          "Notes": "",
          "Reign Start Age": 37.1,
          "Reign End Age": 49.5
        },
        {
          "House": "Hanover ",
          "Name": "George I",
          "Reign Start": "01/08/1714",
          "Reign End": "11/06/1727",
          "Reign Period": "12 years, 315 days",
          "Birth": "28/05/1660",
          "Death": "11/06/1727",
          "Age": 67,
          "Notes": "",
          "Reign Start Age": 54.2,
          "Reign End Age": 67.1
        },
        {
          "House": "Hanover ",
          "Name": "George II",
          "Reign Start": "11/06/1727",
          "Reign End": "25/10/1760",
          "Reign Period": "33 years, 126 days",
          "Birth": "30/10/1683",
          "Death": "25/10/1760",
          "Age": 76,
          "Notes": "",
          "Reign Start Age": 43.6,
          "Reign End Age": 77
        },
        {
          "House": "Hanover ",
          "Name": "George III",
          "Reign Start": "25/10/1760",
          "Reign End": "29/01/1820",
          "Reign Period": "59 years, 97 days",
          "Birth": "24/05/1738",
          "Death": "29/01/1820",
          "Age": 81,
          "Notes": "",
          "Reign Start Age": 22.4,
          "Reign End Age": 81.7
        },
        {
          "House": "Hanover ",
          "Name": "George IV",
          "Reign Start": "29/01/1820",
          "Reign End": "26/06/1830",
          "Reign Period": "10 years, 149 days",
          "Birth": "12/08/1763",
          "Death": "26/06/1830",
          "Age": 67,
          "Notes": "",
          "Reign Start Age": 56.5,
          "Reign End Age": 66.9
        },
        {
          "House": "Hanover ",
          "Name": "William IV",
          "Reign Start": "26/06/1830",
          "Reign End": "20/06/1837",
          "Reign Period": "6 years, 360 days",
          "Birth": "21/08/1765",
          "Death": "20/06/1837",
          "Age": 71,
          "Notes": "",
          "Reign Start Age": 64.9,
          "Reign End Age": 71.9
        },
        {
          "House": "Hanover ",
          "Name": "Victoria",
          "Reign Start": "20/06/1837",
          "Reign End": "22/01/1901",
          "Reign Period": "63 years, 217 days",
          "Birth": "24/05/1819",
          "Death": "22/01/1901",
          "Age": 81,
          "Notes": "",
          "Reign Start Age": 18.1,
          "Reign End Age": 81.7
        },
        {
          "House": "Saxe-Coburg Gotha",
          "Name": "Edward VII",
          "Reign Start": "22/01/1901",
          "Reign End": "06/05/1910",
          "Reign Period": "9 years, 105 days",
          "Birth": "09/11/1841",
          "Death": "06/05/1910",
          "Age": 68,
          "Notes": "",
          "Reign Start Age": 59.2,
          "Reign End Age": 68.5
        },
        {
          "House": "Windsor",
          "Name": "George V",
          "Reign Start": "06/05/1910",
          "Reign End": "20/01/1936",
          "Reign Period": "25 years, 260 days",
          "Birth": "03/06/1865",
          "Death": "20/01/1936",
          "Age": 70,
          "Notes": "",
          "Reign Start Age": 45,
          "Reign End Age": 70.7
        },
        {
          "House": "Windsor",
          "Name": "Edward VIII",
          "Reign Start": "20/01/1936",
          "Reign End": "11/12/1936",
          "Reign Period": "0 years, 327 days",
          "Birth": "23/06/1894",
          "Death": "28/05/1972",
          "Age": 77,
          "Notes": "",
          "Reign Start Age": 41.6,
          "Reign End Age": 42.5
        },
        {
          "House": "Windsor",
          "Name": "George VI",
          "Reign Start": "11/12/1936",
          "Reign End": "06/02/1952",
          "Reign Period": "15 years, 58 days",
          "Birth": "14/12/1895",
          "Death": "06/02/1952",
          "Age": 56,
          "Notes": "",
          "Reign Start Age": 41,
          "Reign End Age": 56.2
        },
        {
          "House": "Windsor",
          "Name": "Elizabeth II",
          "Reign Start": "06/02/1952",
          "Reign End": "08/09/2022",
          "Reign Period": "70 years, 215 days",
          "Birth": "21/04/1926",
          "Death": "08/09/2022",
          "Age": 96,
          "Notes": "",
          "Reign Start Age": 25.8,
          "Reign End Age": 96.4
        },
        {
          "House": "Windsor",
          "Name": "Charles III",
          "Reign Start": "08/09/2022",
          "Reign End": "",
          "Reign Period": "221 days",
          "Birth": "14/11/1948",
          "Death": "",
          "Age": 74,
          "Notes": "",
          "Reign Start Age": 73.9,
          "Reign End Age": 74.5
        }
      ]
    }
  ],
  "legends": [
    {
      "fill": "color",
      "title": "House",
      "direction": "horizontal",
      "titleColor": {
        "signal": "legendLabelColour"
      },
      "labelColor": {
        "signal": "legendLabelColour"
      },
      "orient": "none",
      "legendY": {
        "signal": "legendY"
      },
      "legendX": {
        "signal": "legendX"
      },
      "padding": 0,
      "columns": 4,
      "offset": 110,
      "rowPadding": 10,
      "columnPadding": 60,
      "strokeColor": "",
      "encode": {
        "symbols": {
          "enter": {
            "shape": {
              "value": "m -0.01332636,-0.63421406 c -0.0558846,0.005699 -0.0990523,0.0530842 -0.0990523,0.11048006 0,0.0306255 0.0141754,0.0599157 0.0343008,0.0800062 l -0.2400122,0.31620306 c -0.0371009,0.0491761 -0.0944205,0.080006 -0.15619691,0.080006 -0.0522679,0 -0.10415657,-0.0238589 -0.14095991,-0.0609539 l -0.14476916,-0.1447691 c 0.024734,-0.0203588 0.0380926,-0.0531429 0.0380926,-0.0876245 0,-0.0612223 -0.0492344,-0.11048008 -0.11048004,-0.11048008 -0.0612222,0 -0.11048,0.0492347 -0.11048,0.11048008 0,0.0496428 0.0312088,0.0924954 0.0761967,0.10667078 -3.3892e-4,0.005323 0.002469,0.009859 0.003809,0.0152254 l 0.11428929,0.46859077 c 0.005891,0.0235672 0.0290508,0.0380925 0.0533179,0.0380925 h 0.69717481 l 0.69717459,-0.003809 c 0.0241506,-1.2834e-4 0.0474843,-0.014642 0.0533179,-0.0380925 L 0.86668648,-0.21897 c 0.0013,-0.005244 2.829e-4,-0.0100336 0,-0.0152254 0.043167,-0.0152254 0.076197,-0.0583813 0.076197,-0.10667078 0,-0.0612165 -0.049293,-0.11048001 -0.11048,-0.11048001 -0.061216,0 -0.11048002,0.0492347 -0.11048002,0.11048001 0,0.0348842 0.0166254,0.067254 0.0418843,0.0876245 l -0.14857835,0.14476919 c -0.0372759,0.0372758 -0.088237,0.0609539 -0.14095991,0.0609539 -0.0619514,0 -0.11911941,-0.0303924 -0.15619692,-0.080006 L 0.08186941,-0.44753726 c 0.0190171,-0.0199507 0.0304508,-0.0464928 0.0304508,-0.0761971 0,-0.0612222 -0.0530845,-0.11048006 -0.11428929,-0.11048006 -0.003826,0 -0.0077,-3.7975e-4 -0.0114336,0 z m -0.67812599,1.03623851 c -0.0240922,0.004928 -0.0418843,0.0277673 -0.0418843,0.0533179 v 0.12572284 c 0,0.029167 0.0241506,0.053318 0.0533179,0.053318 h 1.36768093 c 0.0291674,-10e-8 0.0533179,-0.0241507 0.0533179,-0.053318 V 0.45534234 c 0,-0.0292257 -0.0241506,-0.0533179 -0.0533179,-0.0533179 h -1.36768151 c -0.00365,0 -0.007992,-7.0469e-4 -0.011433,10e-9 z"
            },
            "strokeWidth": {
              "value": 0
            },
            "size": {
              "value": 500
            }
          }
        }
      }
    }
  ],
  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "domain": {
        "data": "table",
        "field": "House"
      },
      "range": [
        "#e7298a",
        "#cccf3a",
        "#f65beb",
        "#d95f02",
        "#66a61e",
        "#28a3dc",
        "#fc6064",
        "#73f65c",
        "#9f3cb1",
        "#2751e3",
        "#d62728",
        "#5154b3",
        "#e2a902",
        "#8ca252",
        "#1b9e77"
      ]
    }
  ],
  "marks": [
    {
      "type": "group",
      "style": "cell",
      "layout": {
        "columns": 8,
        "padding": {
          "row": 75,
          "column": 60
        },
        "align": "all",
        "bounds": "flush",
        "center": true
      },
      "marks": [
        {
          "type": "group",
          "style": "cell",
          "name": "monarchs",
          "from": {
            "facet": {
              "data": "table",
              "name": "facet",
              "groupby": [
                "Name"
              ]
            }
          },
          "sort": {
            "field": "datum.index",
            "order": "ascending"
          },
          "title": {
            "text": {
              "signal": "parent.Name"
            },
            "color": {
              "signal": "monarchLabelColour"
            },
            "fontSize": 12,
            "fontWeight": "400",
            "dy": 8,
            "orient": "bottom",
            "lineHeight": 0,
            "align": "center",
            "anchor": "middle"
          },
          "encode": {
            "update": {
              "width": {
                "signal": "facetWidth"
              },
              "height": {
                "signal": "facetHeight"
              }
            }
          },
          "marks": [
            {
              "type": "arc",
              "name": "life",
              "from": {
                "data": "facet"
              },
              "encode": {
                "enter": {},
                "update": {
                  "fill": {
                    "signal": "lifeCircleColour"
                  },
                  "x": {
                    "signal": "item.mark.group.width/2"
                  },
                  "y": {
                    "signal": "item.mark.group.height/2"
                  },
                  "startAngle": {
                    "value": 0
                  },
                  "endAngle": {
                    "signal": "(2*PI/100)*datum.Age"
                  },
                  "innerRadius": {
                    "signal": "28"
                  },
                  "outerRadius": {
                    "signal": "29"
                  },
                  "tooltip": {
                    "signal": "item"
                  }
                }
              }
            },
            {
              "type": "arc",
              "name": "reign",
              "from": {
                "data": "facet"
              },
              "encode": {
                "enter": {},
                "update": {
                  "fill": {
                    "field": "House",
                    "scale": "color"
                  },
                  "x": {
                    "signal": "item.mark.group.width/2"
                  },
                  "y": {
                    "signal": "item.mark.group.height/2"
                  },
                  "startAngle": {
                    "signal": "(2*PI/100)*datum['Reign Start Age']"
                  },
                  "endAngle": {
                    "signal": "(2*PI/100)*datum['Reign End Age']"
                  },
                  "innerRadius": {
                    "signal": "25"
                  },
                  "outerRadius": {
                    "signal": "32"
                  },
                  "tooltip": {
                    "signal": "item"
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      "type": "text",
      "name": "keyTitle",
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "legendLabelColour"
          },
          "text": {
            "value": "Life & Reign"
          },
          "fontWeight": {
            "value": "bold"
          },
          "fontSize": {
            "value": 11
          },
          "x": {
            "signal": "keyTitleX"
          },
          "y": {
            "signal": "keyTitleY"
          }
        }
      }
    },
    {
      "type": "arc",
      "name": "key",
      "data": [
        {}
      ],
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "lifeCircleColour"
          },
          "x": {
            "signal": "keyX "
          },
          "y": {
            "signal": "keyY "
          },
          "startAngle": {
            "value": 0
          },
          "endAngle": {
            "signal": "(2*PI/100)*75"
          },
          "innerRadius": {
            "signal": "28"
          },
          "outerRadius": {
            "signal": "29"
          },
          "tooltip": {
            "signal": "item"
          }
        }
      }
    },
    {
      "type": "arc",
      "name": "key2",
      "data": [
        {}
      ],
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "lifeCircleColour"
          },
          "x": {
            "signal": "keyX"
          },
          "y": {
            "signal": "keyY"
          },
          "startAngle": {
            "signal": "(2*PI/100)*25"
          },
          "endAngle": {
            "signal": "(2*PI/100)*50"
          },
          "innerRadius": {
            "signal": "25"
          },
          "outerRadius": {
            "signal": "32"
          },
          "tooltip": {
            "signal": "item"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "birth",
      "from": {
        "data": "key2"
      },
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "legendLabelColour"
          },
          "text": {
            "value": "birth"
          },
          "fontSize": {
            "value": 11
          },
          "align": {
            "value": "center"
          },
          "x": {
            "signal": "datum.x"
          },
          "y": {
            "signal": "datum.y-datum.outerRadius - 2"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "death",
      "from": {
        "data": "key2"
      },
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "legendLabelColour"
          },
          "text": {
            "value": "death"
          },
          "fontSize": {
            "value": 11
          },
          "align": {
            "value": "right"
          },
          "x": {
            "signal": "datum.x-datum.outerRadius"
          },
          "y": {
            "signal": "datum.y"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "reign",
      "from": {
        "data": "key2"
      },
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "legendLabelColour"
          },
          "text": {
            "value": "reign"
          },
          "fontSize": {
            "value": 11
          },
          "align": {
            "value": "left"
          },
          "x": {
            "signal": "datum.x+27"
          },
          "y": {
            "signal": "datum.y+30"
          }
        }
      }
    },
    {
      "type": "arc",
      "name": "key3",
      "data": [
        {}
      ],
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "lifeCircleColour"
          },
          "x": {
            "signal": "keyX +125"
          },
          "y": {
            "signal": "keyY "
          },
          "startAngle": {
            "value": 0
          },
          "endAngle": {
            "signal": "2*PI"
          },
          "innerRadius": {
            "signal": "28"
          },
          "outerRadius": {
            "signal": "29"
          },
          "tooltip": {
            "signal": "item"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "life",
      "from": {
        "data": "key3"
      },
      "encode": {
        "enter": {},
        "update": {
          "fill": {
            "signal": "legendLabelColour"
          },
          "text": {
            "value": "100 years"
          },
          "fontSize": {
            "value": 10
          },
          "align": {
            "value": "center"
          },
          "baseline": {
            "value": "middle"
          },
          "x": {
            "signal": "datum.x"
          },
          "y": {
            "signal": "datum.y"
          }
        }
      }
    }
  ],
  "config": {
    "view": {
      "stroke": "red"
    },
    "style": {
      "col": {
        "fontSize": 11
      },
      "cell": {
        "strokeWidth": {
          "signal": "0"
        }
      }
    }
  }
},
};

const forceDirectedGraphData = {
  "nodes": [
    {
      "name": "PowerBI",
      "group": "BI Tools"
    },
    {
      "name": "Tableau",
      "group": "BI Tools"
    },
    {
      "name": "Google Data Studio",
      "group": "BI Tools"
    },
    {
      "name": "QlikView",
      "group": "BI Tools"
    },
    {
      "name": "GoodData",
      "group": "BI Tools"
    },
    {
      "name": "Cognos Analytics",
      "group": "Analytics"
    },
    {
      "name": "MicroStrategy",
      "group": "Analytics"
    },
    {
      "name": "Yellowfin",
      "group": "Analytics"
    },
    {
      "name": "Domo",
      "group": "Analytics"
    },
    {
      "name": "Sisense",
      "group": "Analytics"
    },
    {
      "name": "Birst",
      "group": "Cloud BI"
    },
    {
      "name": "Periscope Data",
      "group": "Cloud BI"
    },
    {
      "name": "FDX-Elite",
      "group": "Finance"
    },
    {
      "name": "AML-Secure",
      "group": "Finance"
    }
  ],
  "links": [
    {
      "source": "PowerBI",
      "target": "Tableau",
      "value": "Sales performance metrics"
    },
    {
      "source": "Google Data Studio",
      "target": "QlikView",
      "value": "Customer segmentation"
    },
    {
      "source": "FDX-Elite",
      "target": "AML-Secure",
      "value": "Customer segmentation"
    },
    {
      "source": "Google Data Studio",
      "target": "GoodData",
      "value": "Customer segmentation"
    },
    {
      "source": "Google Data Studio",
      "target": "Cognos Analytics",
      "value": "Customer segmentation"
    },
    {
      "source": "Google Data Studio",
      "target": "MicroStrategy",
      "value": "Financial reports"
    },
    {
      "source": "Cognos Analytics",
      "target": "Yellowfin",
      "value": "Product analytics"
    },
    {
      "source": "Google Data Studio",
      "target": "Domo",
      "value": "Supply chain data"
    },
    {
      "source": "Birst",
      "target": "Periscope Data",
      "value": "Market trends"
    },
    {
      "source": "PowerBI",
      "target": "Sisense",
      "value": "Market trends"
    }
  ]
};

const forceDirectedGraphTemplate: DenebTemplate = {
  name: "Force Directed Graph",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Force Directed Graph",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Force Directed Graph data",
      type: "array",
      required: true,
      sampleData: forceDirectedGraphData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Dataviz by David Bacci: https://www.linkedin.com/in/davbacci/",
  "width": 1400,
  "height": 800,
  "padding": {
    "left": 0,
    "right": 0,
    "top": 0,
    "bottom": 0
  },
  "autosize": "pad",
  "background": "#f4f7ff",
  "signals": [
    {
      "name": "xrange",
      "update": "[0, width]"
    },
    {
      "name": "yrange",
      "update": "[height, 0]"
    },
    {
      "name": "xext",
      "update": "[0, width]"
    },
    {
      "name": "yext",
      "update": "[height, 0]"
    },
    {
      "name": "down",
      "value": null,
      "on": [
        {
          "events": "mouseup,touchend",
          "update": "null"
        },
        {
          "events": "mousedown, touchstart",
          "update": "xy()"
        },
        {
          "events": "symbol:mousedown, symbol:touchstart",
          "update": "null"
        }
      ]
    },
    {
      "name": "xcur",
      "value": null,
      "on": [
        {
          "events": "mousedown, touchstart, touchend",
          "update": "xdom"
        }
      ]
    },
    {
      "name": "ycur",
      "value": null,
      "on": [
        {
          "events": "mousedown, touchstart, touchend",
          "update": "ydom"
        }
      ]
    },
    {
      "name": "delta",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": [
            {
              "source": "window",
              "type": "mousemove",
              "consume": true,
              "between": [
                {
                  "type": "mousedown"
                },
                {
                  "source": "window",
                  "type": "mouseup"
                }
              ]
            },
            {
              "type": "touchmove",
              "consume": true,
              "filter": "event.touches.length === 1"
            }
          ],
          "update": "down ? [down[0]-x(), y()-down[1]] : [0,0]"
        }
      ]
    },
    {
      "name": "anchor",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": "wheel",
          "update": "[invert('xscale', x()), invert('yscale', y())]"
        },
        {
          "events": {
            "type": "touchstart",
            "filter": "event.touches.length===2"
          },
          "update": "[(xdom[0] + xdom[1]) / 2, (ydom[0] + ydom[1]) / 2]"
        }
      ]
    },
    {
      "name": "zoom",
      "value": 1,
      "on": [
        {
          "events": "wheel!",
          "force": true,
          "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
        },
        {
          "events": {
            "signal": "dist2"
          },
          "force": true,
          "update": "dist1 / dist2"
        },
        {
          "events": [
            {
              "source": "view",
              "type": "dblclick"
            }
          ],
          "update": "1"
        }
      ]
    },
    {
      "name": "dist1",
      "value": 0,
      "on": [
        {
          "events": {
            "type": "touchstart",
            "filter": "event.touches.length===2"
          },
          "update": "pinchDistance(event)"
        },
        {
          "events": {
            "signal": "dist2"
          },
          "update": "dist2"
        }
      ]
    },
    {
      "name": "dist2",
      "value": 0,
      "on": [
        {
          "events": {
            "type": "touchmove",
            "consume": true,
            "filter": "event.touches.length===2"
          },
          "update": "pinchDistance(event)"
        }
      ]
    },
    {
      "name": "xdom",
      "update": "xext",
      "on": [
        {
          "events": {
            "signal": "delta"
          },
          "update": "[xcur[0] + span(xcur) * delta[0] / width, xcur[1] + span(xcur) * delta[0] / width]"
        },
        {
          "events": {
            "signal": "zoom"
          },
          "update": "[anchor[0] + (xdom[0] - anchor[0]) * zoom, anchor[0] + (xdom[1] - anchor[0]) * zoom]"
        },
        {
          "events": [
            {
              "source": "view",
              "type": "dblclick"
            }
          ],
          "update": "xrange"
        }
      ]
    },
    {
      "name": "ydom",
      "update": "yext",
      "on": [
        {
          "events": {
            "signal": "delta"
          },
          "update": "[ycur[0] + span(ycur) * delta[1] / height, ycur[1] + span(ycur) * delta[1] / height]"
        },
        {
          "events": {
            "signal": "zoom"
          },
          "update": "[anchor[1] + (ydom[0] - anchor[1]) * zoom, anchor[1] + (ydom[1] - anchor[1]) * zoom]"
        },
        {
          "events": [
            {
              "source": "view",
              "type": "dblclick"
            }
          ],
          "update": "yrange"
        }
      ]
    },
    {
      "name": "size",
      "update": "clamp(20 / span(xdom), 1, 1000)"
    },
    {
      "name": "cx",
      "update": "width / 2",
      "on": [
        {
          "events": "[symbol:mousedown, window:mouseup] > window:mousemove",
          "update": " cx==width/2?cx+0.001:width/2"
        }
      ]
    },
    {
      "name": "cy",
      "update": "height / 2"
    },
    {
      "name": "nodeRadiusKey",
      "description": "q=increase size, a=decrease size",
      "value": 8,
      "on": [
        {
          "events": "window:keypress",
          "update": "event.key=='a'&&nodeRadiusKey>1?nodeRadiusKey-1:event.key=='q'?nodeRadiusKey+1:nodeRadiusKey"
        }
      ]
    },
    {
      "name": "nodeRadius",
      "value": 8,
      "bind": {
        "input": "range",
        "min": 1,
        "max": 50,
        "step": 1
      },
      "on": [
        {
          "events": {
            "signal": "nodeRadiusKey"
          },
          "update": "nodeRadiusKey"
        }
      ]
    },
    {
      "name": "nodeCharge",
      "value": -30,
      "bind": {
        "input": "range",
        "min": -100,
        "max": 10,
        "step": 1
      }
    },
    {
      "name": "linkDistance",
      "value": 30,
      "bind": {
        "input": "range",
        "min": 5,
        "max": 300,
        "step": 1
      }
    },
    {
      "description": "State variable for active node fix status.",
      "name": "fix",
      "value": false,
      "on": [
        {
          "events": "symbol:mouseout[!event.buttons], window:mouseup",
          "update": "false"
        },
        {
          "events": "symbol:mouseover",
          "update": "fix || true",
          "force": true
        },
        {
          "events": "[symbol:mousedown, window:mouseup] > window:mousemove!",
          "update": "xy()",
          "force": true
        }
      ]
    },
    {
      "description": "Graph node most recently interacted with.",
      "name": "node",
      "value": null,
      "on": [
        {
          "events": "symbol:mouseover",
          "update": "fix === true ? datum.index : node"
        }
      ]
    },
    {
      "name": "nodeHover",
      "value": {
        "id": null,
        "connections": []
      },
      "on": [
        {
          "events": "symbol:mouseover",
          "update": "{'id':datum.index, 'connections':split(datum.sources+','+datum.targets,',')}"
        },
        {
          "events": "symbol:mouseout",
          "update": "{'id':null, 'connections':[]}"
        }
      ]
    },
    {
      "description": "Flag to restart Force simulation upon data changes.",
      "name": "restart",
      "value": false,
      "on": [
        {
          "events": {
            "signal": "fix"
          },
          "update": "fix && fix.length"
        }
      ]
    }
  ],
  "data": [
    {
      "name": "link-data-raw",
      "url": "https://raw.githubusercontent.com/PBI-David/Deneb-Showcase/main/Force%20Directed%20Graph/data.json",
      "format": {
        "type": "json",
        "property": "links"
      }
    },
    {
      "name": "link-data",
      "source": "link-data-raw"
    },
    {
      "name": "source-connections",
      "source": "link-data-raw",
      "transform": [
        {
          "type": "aggregate",
          "groupby": [
            "source"
          ],
          "ops": [
            "values"
          ],
          "fields": [
            "target"
          ],
          "as": [
            "connections"
          ]
        },
        {
          "type": "formula",
          "as": "targets",
          "expr": "pluck(datum.connections, 'target')"
        }
      ]
    },
    {
      "name": "target-connections",
      "source": "link-data-raw",
      "transform": [
        {
          "type": "aggregate",
          "groupby": [
            "target"
          ],
          "ops": [
            "values"
          ],
          "fields": [
            "source"
          ],
          "as": [
            "connections"
          ]
        },
        {
          "type": "formula",
          "as": "sources",
          "expr": "pluck(datum.connections, 'source')"
        }
      ]
    },
    {
      "name": "node-data",
      "url": "https://raw.githubusercontent.com/PBI-David/Deneb-Showcase/main/Force%20Directed%20Graph/data.json",
      "format": {
        "type": "json",
        "property": "nodes"
      },
      "transform": [
        {
          "type": "lookup",
          "from": "source-connections",
          "key": "source",
          "fields": [
            "name"
          ],
          "values": [
            "targets"
          ],
          "as": [
            "targets"
          ],
          "default": [
            ""
          ]
        },
        {
          "type": "lookup",
          "from": "target-connections",
          "key": "target",
          "fields": [
            "name"
          ],
          "values": [
            "sources"
          ],
          "as": [
            "sources"
          ],
          "default": [
            ""
          ]
        },
        {
          "type": "force",
          "iterations": 300,
          "restart": {
            "signal": "restart"
          },
          "signal": "force",
          "forces": [
            {
              "force": "center",
              "x": {
                "signal": "cx"
              },
              "y": {
                "signal": "cy"
              }
            },
            {
              "force": "collide",
              "radius": {
                "signal": "sqrt(4 * nodeRadius * nodeRadius)"
              },
              "iterations": 1,
              "strength": 0.7
            },
            {
              "force": "nbody",
              "strength": {
                "signal": "nodeCharge"
              }
            },
            {
              "force": "link",
              "links": "link-data-raw",
              "distance": {
                "signal": "linkDistance"
              },
              "id": "name"
            }
          ]
        },
        {
          "type": "formula",
          "as": "fx",
          "expr": "fix[0]!=null && node==datum.index ?invert('xscale',fix[0]):null"
        },
        {
          "type": "formula",
          "as": "fy",
          "expr": "fix[1]!=null && node==datum.index ?invert('yscale',fix[1]):null"
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "domain": {
        "data": "node-data",
        "field": "group"
      },
      "range": [
        "#4682b4",
        "#4666b4",
        "#46b494",
        "#b46746",
        "#b44662",
        "#a44fa3"
      ]
    },
    {
      "name": "xscale",
      "zero": false,
      "domain": {
        "signal": "xdom"
      },
      "range": {
        "signal": "xrange"
      }
    },
    {
      "name": "yscale",
      "zero": false,
      "domain": {
        "signal": "ydom"
      },
      "range": {
        "signal": "yrange"
      }
    }
  ],
  "marks": [
    {
      "type": "path",
      "name": "links",
      "from": {
        "data": "link-data"
      },
      "interactive": false,
      "encode": {
        "update": {
          "stroke": {
            "signal": "datum.source.index!=nodeHover.id && datum.target.index!=nodeHover.id ? '#929399':merge(hsl(scale('color', datum.source.group)), {l:0.64})"
          },
          "strokeWidth": {
            "signal": "datum.source.index!=nodeHover.id && datum.target.index!=nodeHover.id ? 0.5:2"
          }
        }
      },
      "transform": [
        {
          "type": "linkpath",
          "require": {
            "signal": "force"
          },
          "shape": "line",
          "sourceX": {
            "expr": "scale('xscale', datum.datum.source.x)"
          },
          "sourceY": {
            "expr": "scale('yscale', datum.datum.source.y)"
          },
          "targetX": {
            "expr": "scale('xscale', datum.datum.target.x)"
          },
          "targetY": {
            "expr": "scale('yscale', datum.datum.target.y)"
          }
        },
        {
          "type": "formula",
          "expr": "atan2(datum.datum.target.y - datum.datum.source.y,datum.datum.source.x - datum.datum.target.x)",
          "as": "angle1"
        },
        {
          "type": "formula",
          "expr": "(datum.angle1>=0?datum.angle1:(2*PI + datum.angle1)) * (360 / (2*PI))",
          "as": "angle2"
        },
        {
          "type": "formula",
          "expr": "(360-datum.angle2)*(PI/180)",
          "as": "angle3"
        },
        {
          "type": "formula",
          "expr": "(cos(datum.angle3)*(nodeRadius+5))+(scale('xscale',datum.datum.target.x))",
          "as": "arrowX"
        },
        {
          "type": "formula",
          "expr": "(sin(datum.angle3)*(nodeRadius+5))+(scale('yscale',datum.datum.target.y))",
          "as": "arrowY"
        }
      ]
    },
    {
      "type": "symbol",
      "name": "arrows",
      "zindex": 1,
      "from": {
        "data": "links"
      },
      "encode": {
        "update": {
          "shape": {
            "value": "triangle"
          },
          "angle": {
            "signal": "-datum.angle2-90"
          },
          "x": {
            "signal": "datum.arrowX"
          },
          "y": {
            "signal": "datum.arrowY"
          },
          "text": {
            "signal": "'\u25b2'"
          },
          "fill": {
            "signal": "datum.datum.source.index!=nodeHover.id && datum.datum.target.index!=nodeHover.id ? '#929399':merge(hsl(scale('color', datum.datum.source.group)), {l:0.64})"
          },
          "size": {
            "signal": "nodeRadius==1?0:60"
          }
        }
      }
    },
    {
      "name": "nodes",
      "type": "symbol",
      "zindex": 1,
      "from": {
        "data": "node-data"
      },
      "encode": {
        "update": {
          "opacity": {
            "value": 1
          },
          "fill": {
            "signal": "nodeHover.id===datum.index || indexof(nodeHover.connections, datum.name)>-1 ?scale('color', datum.group):merge(hsl(scale('color', datum.group)), {l:0.64})"
          },
          "stroke": {
            "signal": "nodeHover.id===datum.index || indexof(nodeHover.connections, datum.name)>-1 ?scale('color', datum.group):merge(hsl(scale('color', datum.group)), {l:0.84})"
          },
          "strokeWidth": {
            "value": 3
          },
          "strokeOpacity": {
            "value": 1
          },
          "size": {
            "signal": "4 * nodeRadius * nodeRadius"
          },
          "cursor": {
            "value": "pointer"
          },
          "x": {
            "signal": "fix[0]!=null && node===datum.index ?fix[0]:scale('xscale', datum.x)"
          },
          "y": {
            "signal": "fix[1]!=null && node===datum.index ?fix[1]:scale('yscale', datum.y)"
          }
        },
        "hover": {
          "tooltip": {
            "signal": "datum.name"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "labels",
      "from": {
        "data": "nodes"
      },
      "zindex": 2,
      "interactive": false,
      "enter": {},
      "encode": {
        "update": {
          "fill": {
            "signal": "'white'"
          },
          "y": {
            "field": "y"
          },
          "x": {
            "field": "x"
          },
          "text": {
            "field": "datum.name"
          },
          "align": {
            "value": "center"
          },
          "fontSize": {
            "value": 10
          },
          "baseline": {
            "value": "middle"
          },
          "limit": {
            "signal": "clamp(sqrt(4 * nodeRadius * nodeRadius)-7,1,1000)"
          },
          "ellipsis": {
            "value": " "
          }
        }
      }
    },
    {
      "type": "text",
      "data": [
        {}
      ],
      "encode": {
        "update": {
          "text": {
            "value": [
              "Dataviz: David Bacci"
            ]
          },
          "align": {
            "value": "left"
          },
          "lineHeight": {
            "value": 16
          },
          "fill": {
            "value": "#595959"
          },
          "x": {
            "signal": "width - 100"
          },
          "y": {
            "signal": "height + 200"
          },
          "fontSize": {
            "value": 10
          }
        }
      }
    }
  ]
},
};

const mekkoChartData = [
  {
    "Continent": "Africa",
    "Country": "Algeria",
    "Spend": 9145.8
  },
  {
    "Continent": "Africa",
    "Country": "Morocco",
    "Spend": 4995
  },
  {
    "Continent": "Africa",
    "Country": "Tunisia",
    "Spend": 1156.2
  },
  {
    "Continent": "Africa",
    "Country": "Angola",
    "Spend": 1622.8
  },
  {
    "Continent": "Africa",
    "Country": "Benin",
    "Spend": 97.2
  },
  {
    "Continent": "Africa",
    "Country": "Botswana",
    "Spend": 489.3
  },
  {
    "Continent": "Africa",
    "Country": "Burkina Faso",
    "Spend": 562.6
  },
  {
    "Continent": "Africa",
    "Country": "Burundi",
    "Spend": 101.4
  },
  {
    "Continent": "Africa",
    "Country": "Cameroon",
    "Spend": 416.6
  },
  {
    "Continent": "Africa",
    "Country": "Cape Verde",
    "Spend": 10.3
  }
];

const mekkoChartTemplate: DenebTemplate = {
  name: "Mekko Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Mekko Chart",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Mekko Chart data",
      type: "array",
      required: true,
      sampleData: mekkoChartData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A Marimekko Chart by Dav Bacci: https://www.linkedin.com/in/davbacci/",
  "width": 1200,
  "height": 900,
  "background": "#dae3f3",
  "view": {
    "stroke": null
  },
  "padding": {
    "top": 30,
    "bottom": 20,
    "left": 60,
    "right": 60
  },
  "title": {
    "text": "Global Military Spending 2022",
    "offset": 30,
    "align": "center",
    "anchor": "middle",
    "fontSize": 34,
    "fontWeight": "600",
    "font": "Roboto",
    "color": "#333F50"
  },
  "data": [
    {
      "name": "table",
      "values": [
        {
          "Continent": "Africa",
          "Country": "Algeria",
          "Spend": 9145.8
        },
        {
          "Continent": "Africa",
          "Country": "Morocco",
          "Spend": 4995
        },
        {
          "Continent": "Africa",
          "Country": "Tunisia",
          "Spend": 1156.2
        },
        {
          "Continent": "Africa",
          "Country": "Angola",
          "Spend": 1622.8
        },
        {
          "Continent": "Africa",
          "Country": "Benin",
          "Spend": 97.2
        },
        {
          "Continent": "Africa",
          "Country": "Botswana",
          "Spend": 489.3
        },
        {
          "Continent": "Africa",
          "Country": "Burkina Faso",
          "Spend": 562.6
        },
        {
          "Continent": "Africa",
          "Country": "Burundi",
          "Spend": 101.4
        },
        {
          "Continent": "Africa",
          "Country": "Cameroon",
          "Spend": 416.6
        },
        {
          "Continent": "Africa",
          "Country": "Cape Verde",
          "Spend": 10.3
        },
        {
          "Continent": "Africa",
          "Country": "Central African Republic",
          "Spend": 42
        },
        {
          "Continent": "Africa",
          "Country": "Chad",
          "Spend": 357.4
        },
        {
          "Continent": "Africa",
          "Country": "Congo, DR",
          "Spend": 371.1
        },
        {
          "Continent": "Africa",
          "Country": "Congo, Republic",
          "Spend": 265.8
        },
        {
          "Continent": "Africa",
          "Country": "Cote d'Ivoire",
          "Spend": 607.2
        },
        {
          "Continent": "Africa",
          "Country": "Equatorial Guinea",
          "Spend": 156.8
        },
        {
          "Continent": "Africa",
          "Country": "Ethiopia",
          "Spend": 1031.4
        },
        {
          "Continent": "Africa",
          "Country": "Gabon",
          "Spend": 277.7
        },
        {
          "Continent": "Africa",
          "Country": "Gambia, The",
          "Spend": 15.2
        },
        {
          "Continent": "Africa",
          "Country": "Ghana",
          "Spend": 229.3
        },
        {
          "Continent": "Africa",
          "Country": "Guinea",
          "Spend": 441.3
        },
        {
          "Continent": "Africa",
          "Country": "Guinea-Bissau",
          "Spend": 24.5
        },
        {
          "Continent": "Africa",
          "Country": "Kenya",
          "Spend": 1138.3
        },
        {
          "Continent": "Africa",
          "Country": "Lesotho",
          "Spend": 34.7
        },
        {
          "Continent": "Africa",
          "Country": "Liberia",
          "Spend": 18.7
        },
        {
          "Continent": "Africa",
          "Country": "Madagascar",
          "Spend": 98
        },
        {
          "Continent": "Africa",
          "Country": "Malawi",
          "Spend": 75.8
        },
        {
          "Continent": "Africa",
          "Country": "Mali",
          "Spend": 515.1
        },
        {
          "Continent": "Africa",
          "Country": "Mauritania",
          "Spend": 225.4
        },
        {
          "Continent": "Africa",
          "Country": "Mauritius",
          "Spend": 20.3
        },
        {
          "Continent": "Africa",
          "Country": "Mozambique",
          "Spend": 281.9
        },
        {
          "Continent": "Africa",
          "Country": "Namibia",
          "Spend": 369.1
        },
        {
          "Continent": "Africa",
          "Country": "Niger",
          "Spend": 242.5
        },
        {
          "Continent": "Africa",
          "Country": "Nigeria",
          "Spend": 3109.4
        },
        {
          "Continent": "Africa",
          "Country": "Rwanda",
          "Spend": 177.2
        },
        {
          "Continent": "Africa",
          "Country": "Senegal",
          "Spend": 433.5
        },
        {
          "Continent": "Africa",
          "Country": "Seychelles",
          "Spend": 26.1
        },
        {
          "Continent": "Africa",
          "Country": "Sierra Leone",
          "Spend": 24.5
        },
        {
          "Continent": "Africa",
          "Country": "Somalia",
          "Spend": 115.1
        },
        {
          "Continent": "Africa",
          "Country": "South Africa",
          "Spend": 2995.3
        },
        {
          "Continent": "Africa",
          "Country": "South Sudan",
          "Spend": 378.8
        },
        {
          "Continent": "Africa",
          "Country": "Eswatini",
          "Spend": 74.3
        },
        {
          "Continent": "Africa",
          "Country": "Tanzania",
          "Spend": 832.2
        },
        {
          "Continent": "Africa",
          "Country": "Togo",
          "Spend": 336.6
        },
        {
          "Continent": "Africa",
          "Country": "Uganda",
          "Spend": 923.1
        },
        {
          "Continent": "Africa",
          "Country": "Zambia",
          "Spend": 326.1
        },
        {
          "Continent": "Africa",
          "Country": "Zimbabwe",
          "Spend": 182.1
        },
        {
          "Continent": "Americas",
          "Country": "Belize",
          "Spend": 23.7
        },
        {
          "Continent": "Americas",
          "Country": "Costa Rica",
          "Spend": 0
        },
        {
          "Continent": "Americas",
          "Country": "Dominican Republic",
          "Spend": 760.8
        },
        {
          "Continent": "Americas",
          "Country": "El Salvador",
          "Spend": 422.4
        },
        {
          "Continent": "Americas",
          "Country": "Guatemala",
          "Spend": 430.6
        },
        {
          "Continent": "Americas",
          "Country": "Haiti",
          "Spend": 12.6
        },
        {
          "Continent": "Americas",
          "Country": "Honduras",
          "Spend": 477.5
        },
        {
          "Continent": "Americas",
          "Country": "Jamaica",
          "Spend": 215.1
        },
        {
          "Continent": "Americas",
          "Country": "Mexico",
          "Spend": 8535.5
        },
        {
          "Continent": "Americas",
          "Country": "Nicaragua",
          "Spend": 84.2
        },
        {
          "Continent": "Americas",
          "Country": "Panama",
          "Spend": 0
        },
        {
          "Continent": "Americas",
          "Country": "Trinidad and Tobago",
          "Spend": 201.1
        },
        {
          "Continent": "Americas",
          "Country": "Canada",
          "Spend": 26896.3
        },
        {
          "Continent": "Americas",
          "Country": "United States of America",
          "Spend": 876943.2
        },
        {
          "Continent": "Americas",
          "Country": "Argentina",
          "Spend": 2577.6
        },
        {
          "Continent": "Americas",
          "Country": "Bolivia",
          "Spend": 640.3
        },
        {
          "Continent": "Americas",
          "Country": "Brazil",
          "Spend": 20210.8
        },
        {
          "Continent": "Americas",
          "Country": "Chile",
          "Spend": 5566.5
        },
        {
          "Continent": "Americas",
          "Country": "Colombia",
          "Spend": 9937.7
        },
        {
          "Continent": "Americas",
          "Country": "Ecuador",
          "Spend": 2488.6
        },
        {
          "Continent": "Americas",
          "Country": "Guyana",
          "Spend": 84.3
        },
        {
          "Continent": "Americas",
          "Country": "Paraguay",
          "Spend": 365.7
        },
        {
          "Continent": "Americas",
          "Country": "Peru",
          "Spend": 2845.4
        },
        {
          "Continent": "Americas",
          "Country": "Uruguay",
          "Spend": 1375.6
        },
        {
          "Continent": "Americas",
          "Country": "Venezuela",
          "Spend": 4.6
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Australia",
          "Spend": 32298.9
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Fiji",
          "Spend": 66.8
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "New Zealand",
          "Spend": 2829.1
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Papua New Guinea",
          "Spend": 97.5
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Bangladesh",
          "Spend": 4806.3
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "India",
          "Spend": 81363.2
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Nepal",
          "Spend": 428.3
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Pakistan",
          "Spend": 10337.5
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Sri Lanka",
          "Spend": 1053.5
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "China",
          "Spend": 291958.4
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Japan",
          "Spend": 45992.1
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "South Korea",
          "Spend": 46365.4
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Mongolia",
          "Spend": 118.4
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Taiwan",
          "Spend": 12508.6
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Brunei",
          "Spend": 435.9
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Cambodia",
          "Spend": 611
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Indonesia",
          "Spend": 8986.6
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Malaysia",
          "Spend": 3670.7
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Myanmar",
          "Spend": 1856.9
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Philippines",
          "Spend": 3965.4
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Singapore",
          "Spend": 11687.6
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Thailand",
          "Spend": 5724.4
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Timor Leste",
          "Spend": 44.3
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Kazakhstan",
          "Spend": 1133
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Kyrgyz Republic",
          "Spend": 149.8
        },
        {
          "Continent": "Asia & Oceania",
          "Country": "Tajikistan",
          "Spend": 103.5
        },
        {
          "Continent": "Europe",
          "Country": "Albania",
          "Spend": 288.7
        },
        {
          "Continent": "Europe",
          "Country": "Bosnia and Herzegovina",
          "Spend": 184.5
        },
        {
          "Continent": "Europe",
          "Country": "Bulgaria",
          "Spend": 1336
        },
        {
          "Continent": "Europe",
          "Country": "Croatia",
          "Spend": 1308.5
        },
        {
          "Continent": "Europe",
          "Country": "Czechia",
          "Spend": 4005.4
        },
        {
          "Continent": "Europe",
          "Country": "Estonia",
          "Spend": 810.9
        },
        {
          "Continent": "Europe",
          "Country": "Hungary",
          "Spend": 2572.2
        },
        {
          "Continent": "Europe",
          "Country": "Kosovo",
          "Spend": 107.6
        },
        {
          "Continent": "Europe",
          "Country": "Latvia",
          "Spend": 848.8
        },
        {
          "Continent": "Europe",
          "Country": "Lithuania",
          "Spend": 1732.3
        },
        {
          "Continent": "Europe",
          "Country": "North Macedonia",
          "Spend": 225
        },
        {
          "Continent": "Europe",
          "Country": "Montenegro",
          "Spend": 98
        },
        {
          "Continent": "Europe",
          "Country": "Poland",
          "Spend": 16573.1
        },
        {
          "Continent": "Europe",
          "Country": "Romania",
          "Spend": 5186.7
        },
        {
          "Continent": "Europe",
          "Country": "Serbia",
          "Spend": 1426.4
        },
        {
          "Continent": "Europe",
          "Country": "Slovakia",
          "Spend": 1994.2
        },
        {
          "Continent": "Europe",
          "Country": "Slovenia",
          "Spend": 735.2
        },
        {
          "Continent": "Europe",
          "Country": "Armenia",
          "Spend": 795.2
        },
        {
          "Continent": "Europe",
          "Country": "Azerbaijan",
          "Spend": 2991
        },
        {
          "Continent": "Europe",
          "Country": "Belarus",
          "Spend": 820.8
        },
        {
          "Continent": "Europe",
          "Country": "Georgia",
          "Spend": 360.3
        },
        {
          "Continent": "Europe",
          "Country": "Moldova",
          "Spend": 47.7
        },
        {
          "Continent": "Europe",
          "Country": "Russia",
          "Spend": 86373.1
        },
        {
          "Continent": "Europe",
          "Country": "Ukraine",
          "Spend": 43997.7
        },
        {
          "Continent": "Europe",
          "Country": "Austria",
          "Spend": 3625.6
        },
        {
          "Continent": "Europe",
          "Country": "Belgium",
          "Spend": 6867
        },
        {
          "Continent": "Europe",
          "Country": "Cyprus",
          "Spend": 494.2
        },
        {
          "Continent": "Europe",
          "Country": "Denmark",
          "Spend": 5467.9
        },
        {
          "Continent": "Europe",
          "Country": "Finland",
          "Spend": 4822.9
        },
        {
          "Continent": "Europe",
          "Country": "France",
          "Spend": 53638.7
        },
        {
          "Continent": "Europe",
          "Country": "Germany",
          "Spend": 55759.7
        },
        {
          "Continent": "Europe",
          "Country": "Greece",
          "Spend": 8104.9
        },
        {
          "Continent": "Europe",
          "Country": "Iceland",
          "Spend": 0
        },
        {
          "Continent": "Europe",
          "Country": "Ireland",
          "Spend": 1164.3
        },
        {
          "Continent": "Europe",
          "Country": "Italy",
          "Spend": 33489.7
        },
        {
          "Continent": "Europe",
          "Country": "Luxembourg",
          "Spend": 564.6
        },
        {
          "Continent": "Europe",
          "Country": "Malta",
          "Spend": 87
        },
        {
          "Continent": "Europe",
          "Country": "Netherlands",
          "Spend": 15606.6
        },
        {
          "Continent": "Europe",
          "Country": "Norway",
          "Spend": 8388.4
        },
        {
          "Continent": "Europe",
          "Country": "Portugal",
          "Spend": 3500.3
        },
        {
          "Continent": "Europe",
          "Country": "Spain",
          "Spend": 20306.6
        },
        {
          "Continent": "Europe",
          "Country": "Sweden",
          "Spend": 7722.5
        },
        {
          "Continent": "Europe",
          "Country": "Switzerland",
          "Spend": 6145.2
        },
        {
          "Continent": "Europe",
          "Country": "United Kingdom",
          "Spend": 68462.6
        },
        {
          "Continent": "Europe",
          "Country": "European Union",
          "Spend": 1283.2
        },
        {
          "Continent": "Middle East",
          "Country": "Bahrain",
          "Spend": 1381.3
        },
        {
          "Continent": "Middle East",
          "Country": "Egypt",
          "Spend": 4645.9
        },
        {
          "Continent": "Middle East",
          "Country": "Iran",
          "Spend": 6846.6
        },
        {
          "Continent": "Middle East",
          "Country": "Iraq",
          "Spend": 4683.1
        },
        {
          "Continent": "Middle East",
          "Country": "Israel",
          "Spend": 23406.1
        },
        {
          "Continent": "Middle East",
          "Country": "Jordan",
          "Spend": 2323.3
        },
        {
          "Continent": "Middle East",
          "Country": "Kuwait",
          "Spend": 8244.1
        },
        {
          "Continent": "Middle East",
          "Country": "Lebanon",
          "Spend": 4739
        },
        {
          "Continent": "Middle East",
          "Country": "Oman",
          "Spend": 5783.5
        },
        {
          "Continent": "Middle East",
          "Country": "Qatar",
          "Spend": 15412.1
        },
        {
          "Continent": "Middle East",
          "Country": [
            "Saudi",
            "Arabia"
          ],
          "Spend": 75013.3
        },
        {
          "Continent": "Middle East",
          "Country": "T\u00fcrkiye",
          "Spend": 10644.6
        }
      ],
      "transform": [
        {
          "type": "formula",
          "as": "Continent",
          "expr": "datum.Continent =='Africa' ||datum.Continent =='Middle East'? 'Africa & Middle East': datum.Continent"
        }
      ]
    },
    {
      "name": "continents",
      "source": "table",
      "transform": [
        {
          "type": "aggregate",
          "fields": [
            "Spend"
          ],
          "ops": [
            "sum"
          ],
          "as": [
            "continentTotal"
          ],
          "groupby": [
            "Continent"
          ]
        },
        {
          "type": "stack",
          "offset": "normalize",
          "sort": {
            "field": "continentTotal",
            "order": "descending"
          },
          "field": "continentTotal",
          "as": [
            "x0",
            "x1"
          ]
        },
        {
          "type": "formula",
          "as": "ContinentLabel",
          "expr": "datum.Continent == 'Africa & Middle East'?['Africa &','Middle East']:datum.Continent"
        },
        {
          "type": "formula",
          "as": "Percent",
          "expr": "datum.x1-datum.x0"
        },
        {
          "type": "formula",
          "as": "Label",
          "expr": "[format(round(datum.continentTotal/1000),'$')+'B (' + format(datum.Percent,'.0%')+')']"
        }
      ]
    },
    {
      "name": "finalTable",
      "source": "table",
      "transform": [
        {
          "type": "stack",
          "offset": "normalize",
          "groupby": [
            "Continent"
          ],
          "sort": {
            "field": "Spend",
            "order": "descending"
          },
          "field": "Spend",
          "as": [
            "y0",
            "y1"
          ]
        },
        {
          "type": "lookup",
          "from": "continents",
          "key": "Continent",
          "values": [
            "x0",
            "x1"
          ],
          "fields": [
            "Continent"
          ]
        },
        {
          "type": "formula",
          "as": "Percent",
          "expr": "datum.y1-datum.y0"
        },
        {
          "type": "formula",
          "as": "Country",
          "expr": "datum.Percent < 0.027? 'Other': datum.Country"
        },
        {
          "type": "aggregate",
          "fields": [
            "x0",
            "x1",
            "y0",
            "y1",
            "Country",
            "Spend",
            "Percent",
            "Country"
          ],
          "ops": [
            "min",
            "min",
            "min",
            "max",
            "max",
            "sum",
            "sum",
            "count"
          ],
          "groupby": [
            "Continent",
            "Country"
          ],
          "as": [
            "x0",
            "x1",
            "y0",
            "y1",
            "Country",
            "Spend",
            "Percent",
            "Count"
          ]
        },
        {
          "type": "formula",
          "as": "Country",
          "expr": "datum.Count == 1? datum.Country:'Others (' + datum.Count +')'"
        },
        {
          "type": "formula",
          "as": "Label",
          "expr": "[datum.Country,format(round(datum.Spend/1000),'$')+'B (' + format(datum.Percent,'.0%')+')']"
        },
        {
          "type": "window",
          "sort": {
            "field": "y0",
            "order": "ascending"
          },
          "ops": [
            "row_number"
          ],
          "fields": [
            null
          ],
          "as": [
            "rank"
          ],
          "groupby": [
            "Continent"
          ]
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "range": "width",
      "domain": {
        "data": "finalTable",
        "field": "x1"
      }
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": false,
      "zero": true,
      "domain": {
        "data": "finalTable",
        "field": "y1"
      }
    },
    {
      "name": "opacity",
      "type": "linear",
      "range": [
        1,
        0.5
      ],
      "domain": {
        "data": "finalTable",
        "field": "rank"
      }
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": {
        "scheme": "viridis",
        "extent": [
          0.1,
          0.5
        ]
      },
      "domain": {
        "data": "continents",
        "field": "Continent",
        "sort": {
          "field": "x0",
          "order": "ascending",
          "op": "sum"
        }
      }
    }
  ],
  "axes": [
    {
      "orient": "left",
      "scale": "y",
      "zindex": 1,
      "format": "%",
      "tickCount": 5,
      "tickSize": 15,
      "labelColor": {
        "value": "#333740"
      },
      "labelFontWeight": {
        "value": "normal"
      },
      "labelFontSize": {
        "value": 12
      },
      "labelFont": {
        "value": "Roboto"
      },
      "offset": 5,
      "domain": false
    }
  ],
  "marks": [
    {
      "type": "rect",
      "name": "bars",
      "from": {
        "data": "finalTable"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "field": "x0"
          },
          "x2": {
            "scale": "x",
            "field": "x1"
          },
          "y": {
            "scale": "y",
            "field": "y0"
          },
          "y2": {
            "scale": "y",
            "field": "y1"
          },
          "fill": {
            "scale": "color",
            "field": "Continent"
          },
          "stroke": {
            "value": "white"
          },
          "strokeWidth": {
            "value": 1
          },
          "fillOpacity": {
            "scale": "opacity",
            "field": "rank"
          },
          "tooltip": {
            "signal": "datum"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "labels",
      "interactive": false,
      "from": {
        "data": "bars"
      },
      "encode": {
        "update": {
          "x": {
            "signal": "(datum.x2 - datum.x)*0.5 + datum.x"
          },
          "align": {
            "value": "center"
          },
          "text": {
            "field": "datum.Label"
          },
          "y": {
            "signal": "(datum.y2 - datum.y)*0.45 + datum.y"
          },
          "fill": {
            "value": "white"
          },
          "font": {
            "value": "Segoe UI"
          },
          "lineHeight": {
            "value": 12
          },
          "fontSize": {
            "value": 12
          }
        }
      }
    },
    {
      "type": "rect",
      "name": "ticksBottomLeft",
      "from": {
        "data": "continents"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "field": "x0",
            "offset": 4
          },
          "y": {
            "signal": "height+10"
          },
          "width": {
            "signal": "0.7"
          },
          "height": {
            "signal": "20"
          },
          "fill": {
            "value": "#333740"
          }
        }
      }
    },
    {
      "type": "rect",
      "name": "ticksBottomRight",
      "from": {
        "data": "continents"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "field": "x1",
            "offset": -4
          },
          "y": {
            "signal": "height+10"
          },
          "width": {
            "signal": "0.7"
          },
          "height": {
            "signal": "20"
          },
          "fill": {
            "value": "#333740"
          }
        }
      }
    },
    {
      "type": "rect",
      "name": "ticksJoin",
      "from": {
        "data": "continents"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "signal": "datum.x0",
            "offset": 4
          },
          "y": {
            "signal": "height+20"
          },
          "width": {
            "scale": "x",
            "signal": "(datum.x1-datum.x0)",
            "offset": -8
          },
          "height": {
            "signal": "0.7"
          },
          "fill": {
            "value": "#333740"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "axisTop",
      "from": {
        "data": "continents"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "signal": "(datum.x1-datum.x0)/2 + datum.x0"
          },
          "y": {
            "signal": "-25"
          },
          "text": {
            "field": "ContinentLabel"
          },
          "align": {
            "value": "center"
          },
          "baseline": {
            "value": "top"
          },
          "dy": {
            "signal": "datum.Continent=='Africa & Middle East'?-12:0"
          },
          "fill": {
            "value": "#333740"
          },
          "fontWeight": {
            "value": "normal"
          },
          "fontSize": {
            "value": 14
          },
          "font": {
            "value": "Roboto"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "axisBottom",
      "from": {
        "data": "continents"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "signal": "(datum.x1-datum.x0)/2 + datum.x0"
          },
          "y": {
            "signal": "height+40"
          },
          "text": {
            "field": "Label"
          },
          "align": {
            "value": "center"
          },
          "baseline": {
            "value": "middle"
          },
          "fill": {
            "value": "#333740"
          },
          "fontWeight": {
            "value": "normal"
          },
          "fontSize": {
            "value": 14
          },
          "font": {
            "value": "Roboto"
          }
        }
      }
    },
    {
      "type": "group",
      "data": [
        {}
      ],
      "encode": {
        "update": {
          "xc": {
            "signal": "width/2"
          },
          "y": {
            "signal": "-65"
          },
          "width": {
            "signal": "0"
          },
          "height": {
            "signal": "0"
          },
          "clip": {
            "signal": "false"
          },
          "opacity": {
            "value": 1
          },
          "stroke": {
            "signal": "'#652c90'"
          }
        },
        "hover": {
          "opacity": {
            "value": 0.5
          }
        }
      },
      "marks": [
        {
          "type": "path",
          "name": "guns",
          "clip": false,
          "encode": {
            "update": {
              "x": {
                "signal": "20"
              },
              "y": {
                "signal": "-10"
              },
              "scaleX": {
                "signal": "1.3"
              },
              "scaleY": {
                "signal": "1.3"
              },
              "path": {
                "value": "M13.9506 32.9343C13.8088 32.8686 13.5528 32.5849 13.5079 32.4431 13.494 32.405 13.494 32.3324 13.5044 32.2805 13.5217 32.2182 14.1962 31.5195 15.5418 30.1808 16.6487 29.0774 17.6104 28.1053 17.6796 28.0189 17.7487 27.9324 17.9874 27.6695 18.2053 27.4308L18.6066 27.0019 18.5132 26.9604C18.4129 26.9189 18.3264 26.8116 18.2849 26.6836 18.2676 26.6318 18.2953 26.5695 18.3852 26.4588 18.4509 26.3758 18.5063 26.272 18.5063 26.234 18.5063 26.144 18.7035 25.9434 18.7899 25.9434 18.828 25.9434 18.9283 26.0126 19.0217 26.0991 19.1774 26.2443 19.1912 26.2513 19.2396 26.1925 19.3123 26.1129 19.4057 25.9226 19.4057 25.8604 19.4057 25.8327 19.4852 25.7428 19.5855 25.6563L19.7654 25.5006 19.6513 25.255C19.5821 25.1063 19.5475 24.9852 19.5613 24.9437 19.5959 24.8365 19.8208 24.6566 19.8865 24.6843 20.0836 24.7673 20.1425 24.667 20.0491 24.3972 19.966 24.1585 19.9799 24.0962 20.1355 23.9164L20.2774 23.7538 18.5132 22.0035C17.5412 21.0418 16.7214 20.2116 16.6903 20.1597 16.6349 20.0733 16.6384 20.0594 16.7041 19.9038 16.7456 19.8138 16.7733 19.7377 16.7698 19.7343 16.711 19.6997 16.2267 19.295 16.1921 19.2569 16.161 19.2154 16.1575 19.1843 16.1887 19.1324 16.2094 19.0909 16.2164 19.0597 16.206 19.0597 16.1921 19.0597 16.0123 19.2154 15.8047 19.4057 15.5937 19.5959 15.3827 19.7619 15.3343 19.7723 15.2893 19.7862 15.1475 19.7862 15.0264 19.7758 14.8465 19.7619 14.767 19.7343 14.6217 19.6374 14.5214 19.5717 13.7811 18.9387 12.9717 18.2296 12.1623 17.517 10.9792 16.4827 10.3428 15.9258 8.85535 14.6286 8.85189 14.6252 8.80692 14.3104 8.78616 14.1755 8.79654 14.1132 8.8588 13.9887 8.90031 13.9022 8.95912 13.8157 8.99371 13.795 9.03868 13.7673 9.04906 13.7223 9.03868 13.5978 9.02484 13.4802 9.04906 13.366 9.12862 13.1516 9.25314 12.8195 9.2566 12.7676 9.17704 12.6154 9.09057 12.4425 9.05943 12.2799 9.11824 12.2799 9.19088 12.2799 9.17704 12.2176 9.09748 12.1761 9.00409 12.1277 9.01101 12.0447 9.11132 11.9374L9.19434 11.8475 8.94874 11.5154C8.81038 11.3321 8.6478 11.1245 8.58553 11.0553 8.52673 10.9862 8.47484 10.9031 8.47484 10.8755 8.47484 10.8063 7.26069 9.54025 6.66572 8.99025 6.42013 8.76541 6.19182 8.57862 6.15723 8.57862 6.12264 8.57862 5.91855 8.39874 5.68333 8.1566 5.45849 7.92484 4.60755 7.05314 3.79119 6.2195L2.30377 4.70786 2.11352 4.66981C1.88522 4.62138 1.57736 4.54874 0.899371 4.37925 0.0968553 4.17862 0.141824 4.19245 0.11761 4.08868 0.107233 4.03679 0.0761006 3.9261 0.0518868 3.83962 0.00345912 3.68742 0.00691824 3.67358 0.103774 3.47987 0.224843 3.24119 0.231761 3.16509 0.138365 3.02673 0.0622642 2.90912 0.0518868 2.8088 0.107233 2.61855 0.148742 2.46289 0.66761 1.91289 1.26258 1.38711 2.13428 0.619182 3.08208-0.0345912 3.25157 0.0172956 3.32767 0.0415094 3.33113 0.0449686 3.33805 0.311321 3.34151 0.480818 3.3934 0.601887 3.79811 1.43208 4.05063 1.94403 4.26164 2.37296 4.27201 2.37987 4.27893 2.38679 4.3827 2.31415 4.49686 2.2173 4.61447 2.12044 4.72516 2.04088 4.74245 2.04088 4.80818 2.04088 4.88428 2.22767 5.1022 2.95755 5.3478 3.76698 5.4239 3.93994 5.62107 4.11289 5.76289 4.23396 5.79748 4.24088 5.88396 4.16478 5.96006 4.09906 6.0327 4.13365 6.18836 4.3066 6.30252 4.43805 6.31981 4.52799 6.25409 4.63522 6.21604 4.69403 6.22987 4.72516 6.38553 4.88428 6.6761 5.18868 6.74528 5.28899 6.74528 5.41006 6.74528 5.54151 6.68994 5.63145 6.44088 5.88742L6.24717 6.08805 6.34748 6.19874C6.40629 6.26101 6.66226 6.53082 6.9217 6.80063 7.22956 7.11887 7.40252 7.32296 7.41635 7.38868 7.43019 7.44403 7.55472 7.61698 7.69654 7.7761 7.87642 7.97327 8.00786 8.16352 8.11509 8.38145 8.24308 8.63742 8.35031 8.77579 8.63742 9.08711 8.83459 9.29811 9.03868 9.53679 9.09057 9.61289 9.18742 9.75818 9.39151 9.92767 9.46415 9.92767 9.48837 9.92767 9.58176 9.98994 9.6717 10.066 9.81006 10.1906 9.83774 10.2009 9.88962 10.1594 9.92075 10.1352 10.0418 10.0314 10.1594 9.93113L10.3774 9.7478 10.6264 9.9761C10.9481 10.2701 11.1142 10.3497 11.4358 10.3704 11.8959 10.3981 11.9443 10.3566 12.0204 9.83774 12.0689 9.49528 12.1796 8.14969 12.2453 7.04623 12.2868 6.36478 12.3214 6.26101 12.5013 6.26101 12.695 6.26101 13.1343 6.53428 14.0198 7.20535 14.473 7.5478 14.5975 7.68616 14.5975 7.84182 14.5975 7.9456 14.4799 8.09434 14.3969 8.09434 14.3726 8.09434 14.338 8.13239 14.3242 8.17736 14.2689 8.31918 14.1478 9.1044 14.1409 9.36384 14.134 9.58522 14.1443 9.64057 14.2343 9.79969 14.3519 10.0176 14.338 10.0833 14.1582 10.1594 13.9956 10.2252 13.9748 10.2563 13.9748 10.4292 13.9748 10.5538 14.006 10.6022 14.255 10.8962 14.4107 11.0761 14.6044 11.3113 14.684 11.4151 14.8984 11.6918 16.0469 12.8022 16.2129 12.8956L16.3547 12.9717 16.7802 12.6604C17.4789 12.1415 18.2399 11.7057 19.0494 11.3494 19.2569 11.2594 19.4645 11.1591 19.5164 11.1245 19.7654 10.9619 20.0906 11.2491 20.5541 12.0377 20.6613 12.2176 20.9311 12.6396 21.1525 12.9717 21.4016 13.3453 21.5607 13.6151 21.5607 13.6739 21.5676 13.7638 21.5469 13.7777 21.2494 13.9022 20.6925 14.1374 19.5717 14.7289 19.2569 14.9538 18.8349 15.2582 18.4717 15.5903 18.4717 15.6733 18.4717 15.7113 18.4959 15.7874 18.5236 15.8393 18.5686 15.9292 18.5686 15.9431 18.5132 15.9915 18.4821 16.0226 18.3852 16.0745 18.2987 16.1126 18.1465 16.1783 17.9355 16.3755 17.6588 16.7214L17.5204 16.8909 17.5204 17.2437C17.5204 17.5931 17.5204 17.5965 17.4028 17.728 17.2541 17.8975 17.3129 17.9217 17.5204 17.7799 17.6069 17.7211 17.6899 17.683 17.7107 17.6934 17.728 17.7038 17.8456 17.8456 17.977 18.0082 18.2296 18.3299 18.1984 18.316 18.5097 18.2434 18.5755 18.2296 18.6308 18.2538 18.7519 18.3506 18.8349 18.4198 19.6132 19.2189 20.478 20.1252 21.3462 21.0314 22.0692 21.7752 22.0899 21.7752 22.1072 21.7752 22.761 21.0972 23.5428 20.2704 24.3245 19.4437 25.0302 18.7069 25.1097 18.6343 25.3208 18.444 25.3865 18.4198 25.5456 18.4855 25.6148 18.5167 25.7013 18.5409 25.7358 18.5409 25.7704 18.5409 25.8984 18.4129 26.0437 18.2296L26.2893 17.9182 26.4969 18.0635C26.611 18.1431 26.7113 18.1984 26.7252 18.1846 26.7355 18.1742 26.6836 18.0877 26.6041 17.9943 26.4623 17.8283 26.4623 17.8248 26.4623 17.5481 26.4623 17.1987 26.438 17.133 26.2028 16.8459 25.8673 16.4412 25.6425 16.2302 25.428 16.123 25.1789 15.995 25.134 15.9327 25.2031 15.7978 25.2308 15.7459 25.2447 15.6733 25.2343 15.6352 25.1928 15.5038 24.4664 14.8742 23.9579 14.5283 23.6223 14.3035 22.7091 13.7777 22.1038 13.4629 21.827 13.3211 21.5953 13.1965 21.5884 13.1896 21.5572 13.1654 21.661 12.8991 21.7371 12.8091 21.8167 12.7123 22.3321 11.8406 22.5673 11.3978 22.6399 11.2664 22.7748 11.0346 22.8752 10.8893 23.017 10.6714 23.0827 10.6022 23.2349 10.5261L23.4182 10.4292 23.5324 10.495C23.5912 10.533 23.8472 10.6714 24.0928 10.8028 25.2135 11.4013 25.9296 11.8509 26.7217 12.4667 27.0088 12.6881 27.2648 12.8679 27.2959 12.8679 27.4101 12.8679 27.6833 12.6465 28.223 12.1242 28.5308 11.8233 28.8387 11.4981 28.9079 11.4013 28.977 11.3044 29.1535 11.0865 29.3022 10.9135 29.5928 10.5676 29.6447 10.4881 29.6447 10.3704 29.6447 10.2563 29.5236 10.0764 29.4302 10.0487 29.323 10.0142 29.195 9.89308 29.195 9.82736 29.195 9.79623 29.2296 9.70975 29.2711 9.63365 29.3783 9.43648 29.3645 9.18742 29.1984 8.52327 29.0324 7.85912 29.0116 7.80377 28.8594 7.71384 28.7972 7.67924 28.7211 7.59277 28.6865 7.52704 28.6381 7.42327 28.6381 7.39214 28.6761 7.29528 28.7349 7.16038 29.0635 6.89748 29.7173 6.46164 30.5371 5.91855 30.7965 5.81824 30.9557 5.99119 31.0456 6.08459 31.0836 6.20566 31.1321 6.57233 31.1943 7.05314 31.5437 9.11132 31.6509 9.64057 31.7755 10.2597 31.8481 10.4327 32.0176 10.5019 32.1698 10.5676 32.5814 10.578 32.7786 10.5226 32.917 10.4811 33.0173 10.4119 33.3597 10.1248L33.5154 9.98994 33.8025 10.239C33.9616 10.3774 34.1069 10.495 34.1311 10.5053 34.1553 10.5157 34.2418 10.4673 34.3248 10.3981 34.4079 10.3289 34.5047 10.2736 34.5393 10.2736 34.6292 10.2736 34.8714 10.0695 34.9233 9.94843 34.9475 9.88962 35.1377 9.66132 35.3453 9.43994 35.6393 9.12516 35.7396 8.99025 35.8019 8.83459 35.9506 8.46101 36.044 8.30535 36.2516 8.0805 36.3865 7.93868 36.4799 7.80031 36.5179 7.69654 36.5629 7.56509 36.6805 7.42327 37.1267 6.96321L37.6836 6.39591 37.4035 6.11226C37.0887 5.79057 37.0472 5.7283 37.0472 5.55535 37.0472 5.45503 37.0852 5.38931 37.2547 5.19214 37.3689 5.06069 37.4761 4.93962 37.4969 4.92925 37.5487 4.89811 37.5384 4.78742 37.4796 4.73899 37.4519 4.71478 37.4277 4.67327 37.4277 4.64214 37.4277 4.55912 37.5695 4.37233 37.6767 4.3066 37.7701 4.25472 37.7805 4.25472 37.8635 4.32044 37.9154 4.36195 37.9742 4.39308 37.9984 4.39308 38.0607 4.39308 38.3236 4.0956 38.3789 3.96415 38.4066 3.90189 38.4896 3.54214 38.5692 3.16164 38.756 2.24843 38.7975 2.11006 38.8736 2.11006 38.9082 2.11006 39.0465 2.20346 39.178 2.31761 39.3094 2.43176 39.427 2.52516 39.4374 2.52516 39.4478 2.52516 39.6346 2.09277 39.8525 1.56698 40.2434 0.608805 40.2434 0.605346 40.2399 0.338994 40.2296-0.0242138 40.2711-0.0484277 40.5962 0.141824 41.5544 0.702201 43.8305 2.72579 44.0346 3.19969 44.1142 3.38994 44.1211 3.58711 44.0519 3.6805 44.0242 3.71855 44 3.78428 44 3.82925 44 3.91572 44.1003 4.13711 44.2145 4.29969 44.2733 4.37925 44.2767 4.41384 44.2456 4.50377 44.2248 4.56258 44.2075 4.66635 44.2075 4.73553 44.2075 4.80472 44.1937 4.88082 44.1764 4.90503 44.1591 4.9327 43.9689 4.97767 43.6956 5.01572 43.4465 5.05031 43.1145 5.10566 42.9588 5.13679 42.8031 5.16447 42.4918 5.21289 42.267 5.24057L41.8588 5.28899 40.8418 6.31981C40.2849 6.88711 39.4409 7.75189 38.9635 8.23962 38.3374 8.88648 38.0814 9.13208 38.0226 9.13208 37.9258 9.13208 37.4761 9.54025 36.7013 10.3324 35.8157 11.2318 35.7223 11.3355 35.7154 11.4116 35.7119 11.4497 35.6462 11.5638 35.5667 11.6642 35.3626 11.927 35.0409 12.3836 35.0409 12.4148 35.0409 12.4286 35.0893 12.484 35.1447 12.5393 35.2726 12.6604 35.2726 12.6811 35.155 12.8091 35.0858 12.8852 35.0755 12.906 35.1204 12.8921 35.2138 12.8575 35.2311 12.9509 35.1619 13.1377 35.1308 13.2277 35.0962 13.3314 35.0893 13.3695 35.0789 13.411 35.1481 13.6324 35.2484 13.8814 35.3764 14.2031 35.4214 14.3484 35.4041 14.4176 35.3903 14.4937 35.4041 14.5318 35.4767 14.5975 35.6947 14.805 35.7811 15.2028 35.6531 15.4484 35.577 15.5937 35.2761 15.8704 34.2626 16.7248 33.7679 17.1434 32.6852 18.0601 31.8585 18.7657 29.9456 20.395 29.9283 20.4088 29.783 20.4711 29.6066 20.5437 29.2399 20.5437 29.0843 20.4676 29.0151 20.433 28.7695 20.2255 28.5343 20.0075 28.3025 19.7896 28.1053 19.6201 28.0984 19.627 28.0881 19.634 28.0984 19.672 28.1157 19.7066 28.1365 19.7447 28.1434 19.7896 28.1296 19.8104 28.1123 19.8346 27.7006 20.1736 27.5415 20.2877 27.538 20.2912 27.5726 20.3846 27.6245 20.4918 27.711 20.6821 27.711 20.689 27.6522 20.7824 27.6176 20.8343 26.7805 21.6818 25.7912 22.6642L23.989 24.456 24.1308 24.456C24.2415 24.456 24.2899 24.4767 24.3799 24.5701 24.5113 24.705 24.5217 24.8192 24.4214 25.0371L24.3557 25.1858 24.5425 25.3692C24.6462 25.4695 24.7327 25.5767 24.7327 25.6044 24.7327 25.6321 24.7811 25.722 24.8399 25.8016L24.9437 25.9469 25.0821 25.8258C25.1547 25.7566 25.2481 25.7013 25.2827 25.7013 25.3623 25.7013 25.5629 25.8915 25.5629 25.9676 25.5629 25.9987 25.6148 26.0852 25.677 26.1648 25.7393 26.2443 25.805 26.3239 25.8189 26.3481 25.8535 26.4104 25.7497 26.5903 25.6459 26.6456L25.556 26.694 25.9157 27.0711C26.1129 27.2786 26.3758 27.5657 26.4934 27.7075 26.6145 27.8494 27.161 28.3994 27.7041 28.9321 29.0981 30.2915 30.5094 31.7167 30.6236 31.8862 30.7516 32.0695 30.7274 32.194 30.5302 32.3947 30.2638 32.661 30.2708 32.6645 29.5443 31.9692 28.9459 31.3915 28.7072 31.1459 27.2925 29.6204 26.7079 28.9943 26.1164 28.389 25.2827 27.5761L24.8123 27.1195 24.1862 27.7283C23.4943 28.3994 23.3318 28.5377 23.2487 28.5377 23.1657 28.5377 22.8544 28.2714 22.806 28.1572 22.7783 28.095 22.7506 27.7075 22.7299 27.1057 22.7091 26.5799 22.678 26.1233 22.6607 26.0887 22.6434 26.0575 22.5984 25.9987 22.5569 25.9642 22.4843 25.8984 22.4843 25.9019 22.1142 26.2547 21.9066 26.4519 21.7267 26.6318 21.7129 26.6594 21.6991 26.6836 21.7025 26.9569 21.7233 27.2648 21.7821 28.1676 21.8028 28.8318 21.7821 28.9252 21.7682 28.977 21.6783 29.0739 21.5641 29.1604L21.367 29.3091 21.2425 29.2434C21.1733 29.2088 20.7478 28.8145 20.2947 28.3682L19.4714 27.5553 19.1013 27.9186C17.9113 29.0774 17.6519 29.3368 17.4962 29.5236 16.9877 30.1289 14.2101 33 14.1305 33 14.1132 33 14.0302 32.9689 13.9506 32.9343ZM21.2736 28.005C21.3324 27.8252 21.239 26.7252 21.156 26.6456 21.1491 26.6352 21.0972 26.6594 21.0418 26.6975 20.9069 26.7943 20.1667 27.5519 20.1667 27.5899 20.1667 27.6107 20.2358 27.6937 20.3223 27.7767 20.4676 27.922 20.4918 27.9324 20.6613 27.9324 20.8101 27.9324 20.8654 27.9497 20.9588 28.0292 21.1179 28.1607 21.2217 28.1538 21.2736 28.005ZM23.4701 27.4239C23.567 27.3478 23.733 27.327 23.8403 27.3755 23.8818 27.3928 23.9336 27.3616 24.0374 27.2579 24.117 27.1748 24.1792 27.1022 24.1792 27.0884 24.1792 27.0745 23.9613 26.8462 23.6915 26.5833 23.266 26.1613 23.2003 26.106 23.1692 26.1613 23.1484 26.1994 23.1415 26.4519 23.1484 26.7909 23.1588 27.2855 23.1657 27.3616 23.2245 27.4274 23.3075 27.5208 23.3491 27.5173 23.4701 27.4239ZM29.6447 20.0664C29.8764 19.8969 32.9827 16.839 33.384 16.3858 33.6053 16.1403 33.6226 16.1057 33.6226 15.9604 33.6226 15.784 33.5085 15.6352 33.3736 15.6352 33.1522 15.6387 32.9965 15.7736 31.4538 17.3025 29.9248 18.8211 29.2434 19.5302 29.1223 19.7343 29.0497 19.8519 29.0358 20.0802 29.0981 20.1182 29.1673 20.1632 29.3472 20.1943 29.4371 20.1736 29.4855 20.1667 29.5789 20.1182 29.6447 20.0664ZM15.317 19.4333C15.3862 19.3642 15.3654 19.2569 15.2513 19.0736 15.1925 18.9767 14.3104 18.0704 13.2208 16.9808 11.1626 14.9296 11.0969 14.8708 10.8997 14.9814 10.7959 15.0403 10.7648 15.2028 10.827 15.3585 10.8824 15.4899 14.7566 19.3434 14.9088 19.416 15.0506 19.4818 15.2582 19.4921 15.317 19.4333ZM28.7314 13.577C28.9425 13.4698 29.5513 12.9094 29.6101 12.7607 29.6516 12.6673 29.6481 12.6362 29.5893 12.5324 29.4925 12.3491 29.3333 12.2453 29.1085 12.2142 28.7937 12.1692 28.7487 12.0377 29.0531 12.0377 29.2987 12.0377 29.5374 12.1242 29.7277 12.2799 29.8176 12.356 29.9006 12.4182 29.9075 12.4182 29.9145 12.4182 29.9525 12.3664 29.9906 12.3075 30.1151 12.1 30.0597 11.7472 29.8833 11.6538 29.8003 11.6123 29.3403 11.6088 29.2399 11.6503 29.1431 11.6918 27.9843 12.8818 27.9843 12.9406 27.9843 13.0201 28.1503 13.4906 28.1987 13.5494 28.3094 13.6843 28.4997 13.6912 28.7314 13.577ZM15.5453 13.5079C15.6006 13.4491 15.6525 13.2899 15.6906 13.0478L15.7148 12.8956 15.0956 12.2764C14.5248 11.7057 14.466 11.6572 14.3138 11.6226 13.8814 11.5327 13.7258 11.5984 13.7258 11.8752 13.7258 12.0204 13.8088 12.2591 13.8711 12.2972 13.8884 12.3075 13.9645 12.2591 14.044 12.1934 14.2204 12.0447 14.2723 12.0308 14.5802 12.0447 14.767 12.0516 14.8223 12.0654 14.8223 12.1069 14.8223 12.145 14.7704 12.1623 14.6321 12.1761 14.3969 12.1969 14.2827 12.2695 14.2031 12.4355 14.1443 12.5601 14.1443 12.5635 14.2274 12.6915 14.3277 12.8403 14.8362 13.3176 15.0541 13.4629 15.2167 13.5736 15.4553 13.5943 15.5453 13.5079Z"
              },
              "angle": {
                "value": 180
              },
              "fill": {
                "value": "#333F50"
              }
            }
          }
        },
        {
          "type": "rule",
          "data": [
            {}
          ],
          "encode": {
            "update": {
              "x": {
                "signal": "30"
              },
              "y": {
                "signal": "-30"
              },
              "x2": {
                "signal": "110"
              },
              "y2": {
                "signal": "-30"
              },
              "stroke": {
                "value": "#333F50"
              },
              "strokeWidth": {
                "value": 5
              }
            }
          }
        },
        {
          "type": "rule",
          "data": [
            {}
          ],
          "encode": {
            "update": {
              "x": {
                "signal": "-50"
              },
              "y": {
                "signal": "-30"
              },
              "x2": {
                "signal": "-130"
              },
              "y2": {
                "signal": "-30"
              },
              "stroke": {
                "value": "#333F50"
              },
              "strokeWidth": {
                "value": 5
              }
            }
          }
        }
      ]
    },
    {
      "type": "text",
      "data": [
        {}
      ],
      "encode": {
        "update": {
          "text": {
            "value": [
              "Source: SIPRI",
              "Dataviz: David Bacci"
            ]
          },
          "align": {
            "value": "left"
          },
          "lineHeight": {
            "value": 16
          },
          "fill": {
            "value": "#595959"
          },
          "x": {
            "signal": "0"
          },
          "y": {
            "signal": "height + 100"
          },
          "fontSize": {
            "value": 10
          }
        }
      }
    }
  ]
},
};

const orgTreeData = [
  {
    "level1": "Acme",
    "person": "Max Armstrong",
    "kpi": 75,
    "image": "Max.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "person": "Dwayne Billiot",
    "kpi": 80,
    "image": "Dwayne.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "person": "Robert C. Carmichael",
    "kpi": 50,
    "image": "Robert.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "level4": "Area 1",
    "person": "Edward Foster",
    "kpi": 60,
    "image": "Edward.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "level4": "Area 1",
    "level5": "Location 1",
    "person": "Jodie Hilton",
    "kpi": 20,
    "image": "Jodie.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "level4": "Area 1",
    "level5": "Location 2",
    "person": "Finlay Akhtar",
    "kpi": 10,
    "image": "Finlay.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "level4": "Area 1",
    "level5": "Location 3",
    "person": "Joe Young",
    "kpi": 34,
    "image": "Joe.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "level4": "Area 2",
    "person": "George Stephens",
    "kpi": 85,
    "image": "George.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "level4": "Area 2",
    "level5": "Location 1",
    "person": "Keira Hughes",
    "kpi": 25,
    "image": "Keira.jpg"
  },
  {
    "level1": "Acme",
    "level2": "North America",
    "level3": "United States",
    "level4": "Area 3",
    "person": "Abigail Allen",
    "kpi": 40,
    "image": "Abigail.jpg"
  }
];

const orgTreeTemplate: DenebTemplate = {
  name: "Organisation Tree Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Organisation Tree Chart",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Organisation Tree Chart data",
      type: "array",
      required: true,
      sampleData: orgTreeData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Zoomable, collapsable tree by David Bacci: https://www.linkedin.com/in/davbacci/",
  "width": {
    "signal": "1400"
  },
  "height": {
    "signal": "1000"
  },
  "background": "#f5f5f5",
  "autosize": "pad",
  "padding": 5,
  "signals": [
    {
      "name": "nodeWidth",
      "value": 190
    },
    {
      "name": "nodeHeight",
      "value": 45
    },
    {
      "name": "startingDepth",
      "value": 1,
      "on": [
        {
          "events": {
            "type": "timer",
            "throttle": 0
          },
          "update": "-1"
        }
      ]
    },
    {
      "name": "node",
      "value": 0,
      "on": [
        {
          "events": {
            "type": "click",
            "markname": "node"
          },
          "update": "datum.id"
        },
        {
          "events": {
            "type": "timer",
            "throttle": 10
          },
          "update": "0"
        }
      ]
    },
    {
      "name": "nodeHighlight",
      "value": "[0]",
      "on": [
        {
          "events": {
            "type": "mouseover",
            "markname": "node"
          },
          "update": "pluck(treeAncestors('treeCalcs', datum.id), 'id')"
        },
        {
          "events": {
            "type": "mouseout"
          },
          "update": "[0]"
        }
      ]
    },
    {
      "name": "isExpanded",
      "value": 0,
      "on": [
        {
          "events": {
            "type": "click",
            "markname": "node"
          },
          "update": "datum.children > 0 && indata('treeClickStorePerm', 'id', datum.childrenIds[0])?true:false"
        }
      ]
    },
    {
      "name": "xrange",
      "update": "[0, width]"
    },
    {
      "name": "yrange",
      "update": "[0, height]"
    },
    {
      "name": "down",
      "value": null,
      "on": [
        {
          "events": "mousedown",
          "update": "xy()"
        }
      ]
    },
    {
      "name": "xcur",
      "value": null,
      "on": [
        {
          "events": "mousedown",
          "update": "slice(xdom)"
        }
      ]
    },
    {
      "name": "ycur",
      "value": null,
      "on": [
        {
          "events": "mousedown",
          "update": "slice(ydom)"
        }
      ]
    },
    {
      "name": "delta",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": [
            {
              "source": "window",
              "type": "mousemove",
              "consume": true,
              "between": [
                {
                  "type": "mousedown"
                },
                {
                  "source": "window",
                  "type": "mouseup"
                }
              ]
            }
          ],
          "update": "down ? [down[0]-x(), down[1]-y()] : [0,0]"
        }
      ]
    },
    {
      "name": "anchor",
      "value": [
        0,
        0
      ],
      "on": [
        {
          "events": "wheel",
          "update": "[invert('xscale', x()), invert('yscale', y())]"
        }
      ]
    },
    {
      "name": "xext",
      "update": "[0,width]"
    },
    {
      "name": "yext",
      "update": "[0,height]"
    },
    {
      "name": "zoom",
      "value": 1,
      "on": [
        {
          "events": "wheel!",
          "force": true,
          "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
        }
      ]
    },
    {
      "name": "xdom",
      "update": "slice(xext)",
      "on": [
        {
          "events": {
            "signal": "delta"
          },
          "update": "[xcur[0] + span(xcur) * delta[0] / width, xcur[1] + span(xcur) * delta[0] / width]"
        },
        {
          "events": {
            "signal": "zoom"
          },
          "update": "[anchor[0] + (xdom[0] - anchor[0]) * zoom, anchor[0] + (xdom[1] - anchor[0]) * zoom]"
        },
        {
          "events": "dblclick",
          "update": "[0,width]"
        }
      ]
    },
    {
      "name": "ydom",
      "update": "slice(yext)",
      "on": [
        {
          "events": {
            "signal": "delta"
          },
          "update": "[ycur[0] + span(ycur) * delta[1] / height, ycur[1] + span(ycur) * delta[1] / height]"
        },
        {
          "events": {
            "signal": "zoom"
          },
          "update": "[anchor[1] + (ydom[0] - anchor[1]) * zoom, anchor[1] + (ydom[1] - anchor[1]) * zoom]"
        },
        {
          "events": "dblclick",
          "update": "[0,height]"
        }
      ]
    },
    {
      "name": "scaledNodeWidth",
      "update": "(nodeWidth/ span(xdom))*width"
    },
    {
      "name": "scaledNodeHeight",
      "update": "abs(nodeHeight/ span(ydom))*height"
    },
    {
      "name": "scaledFont13",
      "update": "(13/ span(xdom))*width"
    },
    {
      "name": "scaledFont12",
      "update": "(12/ span(xdom))*width"
    },
    {
      "name": "scaledFont11",
      "update": "(11/ span(xdom))*width"
    },
    {
      "name": "scaledKPIHeight",
      "update": "(5/ span(xdom))*width"
    },
    {
      "name": "scaledLimit",
      "update": "(20/ span(xdom))*width"
    }
  ],
  "data": [
    {
      "name": "source",
      "url": "https://raw.githubusercontent.com/PBI-David/Deneb-Showcase/main/Organisation%20Tree%20Chart/data.json"
    },
    {
      "name": "wideToTall",
      "source": "source",
      "transform": [
        {
          "type": "formula",
          "expr": "{key: datum.level1,parent: null, person:datum.person, kpi:datum.kpi}",
          "as": "l1"
        },
        {
          "type": "formula",
          "expr": "{key: datum.level1+ '|'+datum.level2,parent: datum.level1, person:datum.person, kpi:datum.kpi}",
          "as": "l2"
        },
        {
          "type": "formula",
          "expr": "{key:datum.level1 + '|'+datum.level2+ '|'+datum.level3,parent: datum.level1+ '|'+datum.level2, person:datum.person, kpi:datum.kpi}",
          "as": "l3"
        },
        {
          "type": "formula",
          "expr": "{key:datum.level1 + '|'+datum.level2+ '|'+datum.level3+ '|'+ datum.level4,parent: datum.level1 + '|'+datum.level2+ '|'+datum.level3, person:datum.person, kpi:datum.kpi}",
          "as": "l4"
        },
        {
          "type": "formula",
          "expr": "{key:datum.level1 + '|'+datum.level2+ '|'+datum.level3+ '|'+ datum.level4+ '|'+ datum.level5,parent: datum.level1 + '|'+datum.level2+ '|'+datum.level3+ '|'+ datum.level4, person:datum.person, kpi:datum.kpi}",
          "as": "l5"
        },
        {
          "type": "fold",
          "fields": [
            "l1",
            "l2",
            "l3",
            "l4",
            "l5"
          ]
        },
        {
          "type": "project",
          "fields": [
            "key",
            "value"
          ]
        },
        {
          "type": "formula",
          "expr": "datum.value.key",
          "as": "id"
        },
        {
          "type": "formula",
          "expr": "reverse(split(datum.value.key,'|'))[0]",
          "as": "title"
        },
        {
          "type": "formula",
          "expr": "datum.value.parent",
          "as": "parent"
        },
        {
          "type": "filter",
          "expr": "datum.title != 'null' && datum.title != 'undefined'"
        },
        {
          "type": "aggregate",
          "groupby": [
            "id",
            "parent",
            "title",
            "value"
          ]
        },
        {
          "type": "formula",
          "expr": "datum.value.person",
          "as": "person"
        },
        {
          "type": "formula",
          "expr": "datum.value.kpi",
          "as": "kpi"
        }
      ]
    },
    {
      "name": "treeCalcs",
      "source": "wideToTall",
      "transform": [
        {
          "type": "stratify",
          "key": "id",
          "parentKey": "parent"
        },
        {
          "type": "tree",
          "method": {
            "signal": "'tidy'"
          },
          "separation": {
            "signal": "false"
          },
          "as": [
            "y",
            "x",
            "depth",
            "children"
          ]
        },
        {
          "as": "parent",
          "type": "formula",
          "expr": "datum.parent"
        }
      ]
    },
    {
      "name": "treeChildren",
      "source": "treeCalcs",
      "transform": [
        {
          "type": "aggregate",
          "groupby": [
            "parent"
          ],
          "fields": [
            "parent"
          ],
          "ops": [
            "values"
          ],
          "as": [
            "childrenObjects"
          ]
        },
        {
          "type": "formula",
          "expr": "pluck(datum.childrenObjects,'id')",
          "as": "childrenIds"
        }
      ]
    },
    {
      "name": "treeAncestors",
      "source": "treeCalcs",
      "transform": [
        {
          "type": "formula",
          "as": "treeAncestors",
          "expr": "treeAncestors('treeCalcs', datum.id, 'root')"
        },
        {
          "type": "flatten",
          "fields": [
            "treeAncestors"
          ]
        },
        {
          "type": "formula",
          "expr": "datum.treeAncestors.parent",
          "as": "allParents"
        }
      ]
    },
    {
      "name": "treeChildrenAll",
      "source": "treeAncestors",
      "transform": [
        {
          "type": "project",
          "fields": [
            "allParents",
            "id",
            "name",
            "parent",
            "x",
            "y",
            "depth",
            "children"
          ]
        },
        {
          "type": "aggregate",
          "fields": [
            "parent",
            "parent",
            "id"
          ],
          "ops": [
            "values",
            "count",
            "min"
          ],
          "groupby": [
            "allParents"
          ],
          "as": [
            "allChildrenObjects",
            "allChildrenCount",
            "id"
          ]
        },
        {
          "type": "formula",
          "expr": "pluck(datum.allChildrenObjects,'id')",
          "as": "allChildrenIds"
        }
      ]
    },
    {
      "name": "treeClickStoreTemp",
      "source": "treeAncestors",
      "transform": [
        {
          "type": "filter",
          "expr": "startingDepth!=-1?datum.depth <= startingDepth:node !=0 && !isExpanded? datum.parent == node: node !=0 && isExpanded? datum.allParents == node:false"
        },
        {
          "type": "project",
          "fields": [
            "id",
            "name",
            "parent",
            "x",
            "y",
            "depth",
            "children"
          ]
        },
        {
          "type": "aggregate",
          "fields": [
            "id"
          ],
          "ops": [
            "min"
          ],
          "groupby": [
            "id",
            "name",
            "parent",
            "x",
            "y",
            "depth",
            "children"
          ]
        }
      ]
    },
    {
      "name": "treeClickStorePerm",
      "values": [],
      "on": [
        {
          "trigger": "startingDepth>=0",
          "insert": "data('treeClickStoreTemp')"
        },
        {
          "trigger": "node",
          "insert": "!isExpanded? data('treeClickStoreTemp'):false"
        },
        {
          "trigger": "node",
          "remove": "isExpanded?data('treeClickStoreTemp'):false"
        }
      ]
    },
    {
      "name": "treeLayout",
      "source": "wideToTall",
      "transform": [
        {
          "type": "filter",
          "expr": "indata('treeClickStorePerm', 'id', datum.id)"
        },
        {
          "type": "stratify",
          "key": "id",
          "parentKey": "parent"
        },
        {
          "type": "tree",
          "method": {
            "signal": "'tidy'"
          },
          "nodeSize": [
            {
              "signal": "nodeHeight+10"
            },
            {
              "signal": "nodeWidth+140"
            }
          ],
          "separation": {
            "signal": "false"
          },
          "as": [
            "y",
            "x",
            "depth",
            "children"
          ]
        },
        {
          "type": "formula",
          "expr": "datum.y+(height/2)",
          "as": "y"
        },
        {
          "type": "formula",
          "expr": "scale('xscale',datum.x)",
          "as": "xscaled"
        },
        {
          "as": "parent",
          "type": "formula",
          "expr": "datum.parent"
        }
      ]
    },
    {
      "name": "fullTreeLayout",
      "source": "treeLayout",
      "transform": [
        {
          "type": "lookup",
          "from": "treeChildren",
          "key": "parent",
          "fields": [
            "id"
          ],
          "values": [
            "childrenObjects",
            "childrenIds"
          ]
        },
        {
          "type": "lookup",
          "from": "treeChildrenAll",
          "key": "allParents",
          "fields": [
            "id"
          ],
          "values": [
            "allChildrenIds",
            "allChildrenObjects"
          ]
        },
        {
          "type": "lookup",
          "from": "treeCalcs",
          "key": "id",
          "fields": [
            "id"
          ],
          "values": [
            "children"
          ]
        },
        {
          "type": "formula",
          "expr": "reverse(pluck(treeAncestors('treeCalcs', datum.id), 'id'))[1]",
          "as": "treeParent"
        }
      ]
    },
    {
      "name": "visibleNodes",
      "source": "fullTreeLayout",
      "transform": [
        {
          "type": "filter",
          "expr": "indata('treeClickStorePerm', 'id', datum.id)"
        }
      ]
    },
    {
      "name": "maxWidthAndHeight",
      "source": "visibleNodes",
      "transform": [
        {
          "type": "aggregate",
          "groupby": [
            "depth"
          ],
          "fields": [
            "depth",
            "x",
            "y"
          ],
          "ops": [
            "count",
            "max",
            "max"
          ],
          "as": [
            "count",
            "x",
            "y"
          ]
        },
        {
          "type": "aggregate",
          "fields": [
            "depth",
            "count",
            "x",
            "y"
          ],
          "ops": [
            "max",
            "max",
            "max",
            "max"
          ],
          "as": [
            "maxDepth",
            "maxNodes",
            "maxX",
            "maxY"
          ]
        }
      ]
    },
    {
      "name": "links",
      "source": "treeLayout",
      "transform": [
        {
          "type": "treelinks"
        },
        {
          "type": "linkpath",
          "orient": "horizontal",
          "shape": "diagonal",
          "sourceY": {
            "expr": "scale('yscale', datum.source.y)"
          },
          "sourceX": {
            "expr": "scale('xscale', datum.source.x+nodeWidth)"
          },
          "targetY": {
            "expr": "scale('yscale', datum.target.y)"
          },
          "targetX": {
            "expr": "scale('xscale', datum.target.x)"
          }
        },
        {
          "type": "filter",
          "expr": " indata('treeClickStorePerm', 'id', datum.target.id)"
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "xscale",
      "zero": false,
      "domain": {
        "signal": "xdom"
      },
      "range": {
        "signal": "xrange"
      }
    },
    {
      "name": "yscale",
      "zero": false,
      "domain": {
        "signal": "ydom"
      },
      "range": {
        "signal": "yrange"
      }
    },
    {
      "name": "kpiscale",
      "zero": false,
      "domain": [
        0,
        100
      ],
      "range": {
        "signal": "[0,scaledNodeWidth]"
      }
    },
    {
      "name": "colour",
      "type": "ordinal",
      "range": [
        "#6f6f6f",
        "#4472C4",
        "#3A8E50",
        "#ED7D31",
        "#a63939",
        "#6338a6",
        "#3843a6",
        "#38a695"
      ],
      "domain": {
        "data": "visibleNodes",
        "field": "treeParent"
      }
    }
  ],
  "marks": [
    {
      "type": "path",
      "interactive": false,
      "from": {
        "data": "links"
      },
      "encode": {
        "update": {
          "path": {
            "field": "path"
          },
          "strokeWidth": {
            "signal": "indexof(nodeHighlight, datum.target.id)> -1? 2.5:0.4"
          },
          "stroke": {
            "scale": "colour",
            "signal": "reverse(pluck(treeAncestors('treeCalcs', datum.target.id), 'id'))[1]"
          }
        }
      }
    },
    {
      "name": "node",
      "description": "The parent node",
      "type": "group",
      "clip": false,
      "from": {
        "data": "visibleNodes"
      },
      "encode": {
        "update": {
          "x": {
            "field": "x",
            "scale": "xscale"
          },
          "width": {
            "signal": "scaledNodeWidth"
          },
          "yc": {
            "field": "y",
            "scale": "yscale"
          },
          "height": {
            "signal": "scaledNodeHeight"
          },
          "fill": {
            "signal": "merge(hsl(scale('colour', datum.treeParent)), {l:0.94})"
          },
          "stroke": {
            "signal": "merge(hsl(scale('colour', datum.treeParent)), {l:0.79})"
          },
          "cornerRadius": {
            "value": 2
          },
          "cursor": {
            "signal": "datum.children>0?'pointer':''"
          },
          "tooltip": {
            "signal": ""
          }
        }
      },
      "marks": [
        {
          "name": "highlight",
          "description": "highlight (seems like a Vega bug as this doens't work on the group element)",
          "type": "rect",
          "interactive": false,
          "encode": {
            "update": {
              "x": {
                "signal": "item.mark.group.x1"
              },
              "y": {
                "signal": "0"
              },
              "fill": {
                "signal": "indexof(nodeHighlight, parent.id)> -1? merge(hsl(scale('colour', parent.treeParent)), {l:0.82}):0"
              },
              "height": {
                "signal": "item.mark.group.height"
              },
              "width": {
                "signal": "item.mark.group.width"
              }
            }
          }
        },
        {
          "name": "KPI background",
          "description": "KPI background",
          "type": "rect",
          "interactive": false,
          "clip": true,
          "encode": {
            "update": {
              "x": {
                "signal": "item.mark.group.x1"
              },
              "y": {
                "signal": "item.mark.group.height-scaledKPIHeight"
              },
              "height": {
                "signal": "scaledKPIHeight"
              },
              "width": {
                "signal": "(item.mark.group.width)"
              },
              "fill": {
                "scale": "colour",
                "signal": "parent.treeParent"
              },
              "opacity": {
                "value": 0.2
              }
            }
          }
        },
        {
          "name": "KPI",
          "description": "KPI",
          "type": "rect",
          "interactive": false,
          "clip": true,
          "encode": {
            "update": {
              "x": {
                "signal": "item.mark.group.x1"
              },
              "y": {
                "signal": "item.mark.group.height-scaledKPIHeight"
              },
              "height": {
                "signal": "scaledKPIHeight"
              },
              "width": {
                "signal": "scale('kpiscale',parent.kpi)"
              },
              "fill": {
                "scale": "colour",
                "signal": "parent.treeParent"
              }
            }
          }
        },
        {
          "type": "text",
          "interactive": false,
          "name": "name",
          "encode": {
            "update": {
              "x": {
                "signal": "(10/ span(xdom))*width"
              },
              "y": {
                "signal": "(6/ span(xdom))*width"
              },
              "fontWeight": {
                "value": "600"
              },
              "baseline": {
                "value": "top"
              },
              "fill": {
                "scale": "colour",
                "signal": "parent.treeParent"
              },
              "text": {
                "signal": "parent.person"
              },
              "fontSize": {
                "signal": "scaledFont13"
              },
              "limit": {
                "signal": "scaledNodeWidth-scaledLimit"
              },
              "font": {
                "value": "Calibri"
              }
            }
          }
        },
        {
          "type": "text",
          "interactive": false,
          "name": "title",
          "encode": {
            "update": {
              "x": {
                "signal": "(10/ span(xdom))*width"
              },
              "y": {
                "signal": "(22/ span(xdom))*width"
              },
              "align": {
                "value": "left"
              },
              "baseline": {
                "value": "top"
              },
              "fill": {
                "signal": "'#4D4B44'"
              },
              "text": {
                "signal": "parent.title"
              },
              "fontSize": {
                "signal": "scaledFont11"
              },
              "limit": {
                "signal": "scaledNodeWidth-scaledLimit"
              },
              "font": {
                "value": "Calibri"
              }
            }
          }
        },
        {
          "type": "text",
          "interactive": false,
          "name": "node children",
          "encode": {
            "update": {
              "x": {
                "signal": "item.mark.group.width - (9/ span(xdom))*width"
              },
              "y": {
                "signal": "item.mark.group.height/2"
              },
              "align": {
                "value": "right"
              },
              "baseline": {
                "value": "middle"
              },
              "fill": {
                "scale": "colour",
                "signal": "parent.treeParent"
              },
              "text": {
                "signal": "parent.children>0?parent.children:''"
              },
              "fontSize": {
                "signal": "scaledFont12"
              },
              "font": {
                "value": "Calibri"
              }
            }
          }
        }
      ]
    }
  ]
},
};

const varianceChartData = [
  {
    "BU": "Channel Partners",
    "Actual": 200,
    "Forecast": 100,
    "Index": 1
  },
  {
    "BU": "Enterprise",
    "Actual": 150,
    "Forecast": 100,
    "Index": 3
  },
  {
    "BU": "Government",
    "Actual": 40,
    "Forecast": 66,
    "Index": 2
  },
  {
    "BU": "Midmarket",
    "Actual": 205,
    "Forecast": 97,
    "Index": 4
  },
  {
    "BU": "Small Business",
    "Actual": 38,
    "Forecast": 18,
    "Index": 5
  },
  {
    "BU": "Channel Partners",
    "Actual": 200,
    "Forecast": 100,
    "Index": 1
  },
  {
    "BU": "Enterprise",
    "Actual": 150,
    "Forecast": 100,
    "Index": 3
  },
  {
    "BU": "Government",
    "Actual": 40,
    "Forecast": 66,
    "Index": 2
  },
  {
    "BU": "Midmarket",
    "Actual": 205,
    "Forecast": 97,
    "Index": 4
  },
  {
    "BU": "Small Business",
    "Actual": 38,
    "Forecast": 18,
    "Index": 5
  }
];

const varianceChartTemplate: DenebTemplate = {
  name: "Variance Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Variance Chart",
    author: "PBI-David",
    tags: ["deneb", "vega-lite", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Variance Chart data",
      type: "array",
      required: true,
      sampleData: varianceChartData,
    },
  ],
  vegaLite: {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "name": "dataset",
    "values": [
      {
        "BU": "Channel Partners",
        "Actual": 200,
        "Forecast": 100,
        "Index": 1
      },
      {
        "BU": "Enterprise",
        "Actual": 150,
        "Forecast": 100,
        "Index": 3
      },
      {
        "BU": "Government",
        "Actual": 40,
        "Forecast": 66,
        "Index": 2
      },
      {
        "BU": "Midmarket",
        "Actual": 205,
        "Forecast": 97,
        "Index": 4
      },
      {
        "BU": "Small Business",
        "Actual": 38,
        "Forecast": 18,
        "Index": 5
      },
      {
        "BU": "Channel Partners",
        "Actual": 200,
        "Forecast": 100,
        "Index": 1
      },
      {
        "BU": "Enterprise",
        "Actual": 150,
        "Forecast": 100,
        "Index": 3
      },
      {
        "BU": "Government",
        "Actual": 40,
        "Forecast": 66,
        "Index": 2
      },
      {
        "BU": "Midmarket",
        "Actual": 205,
        "Forecast": 97,
        "Index": 4
      },
      {
        "BU": "Small Business",
        "Actual": 38,
        "Forecast": 18,
        "Index": 5
      },
      {
        "BU": "Channel Partners",
        "Actual": 200,
        "Forecast": 100,
        "Index": 1
      },
      {
        "BU": "Enterprise",
        "Actual": 150,
        "Forecast": 100,
        "Index": 3
      },
      {
        "BU": "Government",
        "Actual": 40,
        "Forecast": 66,
        "Index": 2
      },
      {
        "BU": "Midmarket",
        "Actual": 205,
        "Forecast": 97,
        "Index": 4
      },
      {
        "BU": "Small Business",
        "Actual": 38,
        "Forecast": 18,
        "Index": 5
      }
    ]
  },
  "transform": [
    {
      "aggregate": [
        {
          "op": "sum",
          "field": "Actual",
          "as": "Actual"
        },
        {
          "op": "sum",
          "field": "Forecast",
          "as": "Forecast"
        }
      ],
      "groupby": [
        "BU"
      ]
    },
    {
      "calculate": "datum['Actual'] - datum['Forecast']",
      "as": "Variance Absolute"
    },
    {
      "calculate": "datum['Actual']/datum['Forecast']-1",
      "as": "Variance Percent"
    }
  ],
  "hconcat": [
    {
      "width": 350,
      "height": {
        "step": 50
      },
      "view": {
        "stroke": "transparent"
      },
      "encoding": {
        "color": {
          "type": "nominal",
          "scale": {
            "domain": [
              "Actual",
              "Forecast"
            ],
            "range": [
              "#404040",
              "silver"
            ]
          },
          "legend": {
            "title": null,
            "orient": "top"
          }
        },
        "y": {
          "field": "BU",
          "type": "nominal",
          "sort": {
            "field": "Index",
            "op": "sum",
            "order": "ascending"
          },
          "axis": {
            "domain": false,
            "offset": 0,
            "ticks": false,
            "title": ""
          }
        },
        "x": {
          "type": "quantitative",
          "axis": {
            "domain": false,
            "labels": false,
            "title": null,
            "ticks": false,
            "gridWidth": 1,
            "gridColor": {
              "condition": {
                "test": "datum.value === 0",
                "value": "#605E5C"
              },
              "value": "#transparent"
            }
          }
        }
      },
      "layer": [
        {
          "mark": {
            "type": "bar",
            "tooltip": true,
            "cornerRadius": 3,
            "yOffset": 12,
            "height": {
              "band": 0.5
            }
          },
          "encoding": {
            "x": {
              "field": "Forecast"
            },
            "color": {
              "datum": "Forecast"
            },
            "opacity": {
              "condition": {
                "test": {
                  "field": "__selected__",
                  "equal": "off"
                },
                "value": 0.3
              }
            }
          }
        },
        {
          "mark": {
            "type": "bar",
            "tooltip": true,
            "cornerRadius": 3,
            "yOffset": 0,
            "height": {
              "band": 0.5
            }
          },
          "encoding": {
            "x": {
              "field": "Actual"
            },
            "color": {
              "datum": "Actual"
            },
            "opacity": {
              "condition": {
                "test": {
                  "field": "__selected__",
                  "equal": "off"
                },
                "value": 0.3
              }
            }
          }
        },
        {
          "mark": {
            "type": "text",
            "align": "right",
            "dx": -5,
            "color": "white"
          },
          "encoding": {
            "x": {
              "field": "Actual"
            },
            "text": {
              "field": "Actual",
              "type": "quantitative",
              "format": ","
            }
          }
        }
      ]
    },
    {
      "width": 150,
      "height": {
        "step": 50
      },
      "view": {
        "stroke": "transparent"
      },
      "encoding": {
        "y": {
          "field": "BU",
          "type": "nominal",
          "sort": {
            "field": "Index",
            "op": "sum",
            "order": "ascending"
          },
          "axis": null
        },
        "x": {
          "field": "Variance Absolute",
          "type": "quantitative",
          "axis": {
            "domain": false,
            "labels": false,
            "title": null,
            "ticks": false,
            "gridWidth": 1,
            "gridColor": {
              "condition": {
                "test": "datum.value === 0",
                "value": "#605E5C"
              },
              "value": "#transparent"
            }
          }
        }
      },
      "layer": [
        {
          "mark": {
            "type": "bar",
            "tooltip": true,
            "cornerRadius": 3,
            "yOffset": 0,
            "height": {
              "band": 0.5
            }
          },
          "encoding": {
            "fill": {
              "condition": {
                "test": "datum['Variance Absolute'] < 0",
                "value": "#b92929"
              },
              "value": "#329351"
            },
            "opacity": {
              "condition": {
                "test": {
                  "field": "__selected__",
                  "equal": "off"
                },
                "value": 0.3
              }
            }
          }
        },
        {
          "mark": {
            "type": "text",
            "align": {
              "expr": "datum['Variance Absolute'] < 0 ? 'right' : 'left'"
            },
            "dx": {
              "expr": "datum['Variance Absolute'] < 0 ? -5 : 5"
            }
          },
          "encoding": {
            "text": {
              "field": "Variance Absolute",
              "type": "quantitative",
              "format": "+,"
            }
          }
        }
      ]
    },
    {
      "width": 150,
      "height": {
        "step": 50
      },
      "view": {
        "stroke": "transparent"
      },
      "encoding": {
        "y": {
          "field": "BU",
          "type": "nominal",
          "sort": {
            "field": "Index",
            "op": "sum",
            "order": "ascending"
          },
          "axis": null
        },
        "x": {
          "field": "Variance Percent",
          "type": "quantitative",
          "axis": {
            "domain": false,
            "labels": false,
            "title": null,
            "ticks": false,
            "gridColor": {
              "condition": {
                "test": "datum.value === 0",
                "value": "#605E5C"
              },
              "value": "#transparent"
            }
          }
        }
      },
      "layer": [
        {
          "mark": {
            "type": "rule",
            "tooltip": true
          },
          "encoding": {
            "strokeWidth": {
              "value": 2
            },
            "stroke": {
              "condition": {
                "test": "datum['Variance Absolute'] < 0",
                "value": "#b92929"
              },
              "value": "#329351"
            },
            "opacity": {
              "condition": {
                "test": {
                  "field": "__selected__",
                  "equal": "off"
                },
                "value": 0.3
              }
            }
          }
        },
        {
          "mark": {
            "type": "circle",
            "tooltip": true
          },
          "encoding": {
            "size": {
              "value": 100
            },
            "color": {
              "condition": {
                "test": "datum['Variance Absolute'] < 0",
                "value": "#b92929"
              },
              "value": "#329351"
            },
            "opacity": {
              "condition": {
                "test": {
                  "field": "__selected__",
                  "equal": "off"
                },
                "value": 0.3
              },
              "value": 1
            }
          }
        },
        {
          "mark": {
            "type": "text",
            "align": {
              "expr": "datum['Variance Absolute'] < 0 ? 'right' : 'left'"
            },
            "dx": {
              "expr": "datum['Variance Absolute'] < 0 ? -10 : 10"
            }
          },
          "encoding": {
            "text": {
              "field": "Variance Percent",
              "type": "quantitative",
              "format": "+.1%"
            }
          }
        }
      ]
    }
  ],
  "config": {
    "view": {
      "stroke": "transparent"
    },
    "padding": {
      "left": 5,
      "top": 20,
      "right": 5,
      "bottom": 5
    },
    "font": "Segoe UI",
    "axis": {
      "labelFontSize": 12,
      "labelPadding": 10,
      "offset": 5,
      "labelFont": "Segoe UI",
      "labelColor": "#252423"
    },
    "text": {
      "fontSize": 12,
      "font": "Segoe UI",
      "color": "#605E5C"
    },
    "concat": {
      "spacing": 50
    },
    "legend": {
      "labelFontSize": 12,
      "labelFont": "Segoe UI",
      "labelColor": "#605E5C"
    }
  }
},
};

const sankeyChartData = [
  {
    "category": "Server Products & Cloud",
    "stack": 1,
    "sort": 1,
    "labels": "left"
  },
  {
    "category": "Enterprise Services",
    "stack": 1,
    "sort": 2,
    "labels": "left",
    "gap": 20
  },
  {
    "category": "Office Products",
    "stack": 1,
    "sort": 3,
    "labels": "left"
  },
  {
    "category": "LinkedIn",
    "stack": 1,
    "sort": 4,
    "labels": "left"
  },
  {
    "category": "Other",
    "stack": 1,
    "sort": 5,
    "labels": "left"
  },
  {
    "category": "Windows",
    "stack": 1,
    "sort": 6,
    "labels": "left"
  },
  {
    "category": "Gaming",
    "stack": 1,
    "sort": 7,
    "labels": "left"
  },
  {
    "category": "Search & News Advertising",
    "stack": 1,
    "sort": 8,
    "labels": "left"
  },
  {
    "category": "Devices",
    "stack": 1,
    "sort": 9,
    "labels": "left"
  },
  {
    "category": "Intelligent Cloud",
    "stack": 2,
    "sort": 1
  }
];

const sankeyChartTemplate: DenebTemplate = {
  name: "Sankey Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "Sankey Chart",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "Sankey Chart data",
      type: "array",
      required: true,
      sampleData: sankeyChartData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Sankey Chart by David Bacci: https://www.linkedin.com/in/davbacci/",
  "width": 1000,
  "height": 800,
  "padding": {
    "bottom": 20,
    "left": 20,
    "right": 30,
    "top": 40
  },
  "title": {
    "text": "Microsoft's FY23 Q2 Income Statement",
    "color": "#005ca5",
    "fontSize": 32,
    "dy": 0,
    "fontWeight": "bold",
    "offset": 30
  },
  "background": "#fafafa",
  "signals": [
    {
      "name": "standardGap",
      "value": 14,
      "description": "Gap as a percentage of full domain"
    },
    {
      "name": "base",
      "value": "center",
      "description": "How to stack(center or zero)"
    }
  ],
  "data": [
    {
      "name": "input",
      "values": [
        {
          "category": "Server Products & Cloud",
          "stack": 1,
          "sort": 1,
          "labels": "left"
        },
        {
          "category": "Enterprise Services",
          "stack": 1,
          "sort": 2,
          "labels": "left",
          "gap": 20
        },
        {
          "category": "Office Products",
          "stack": 1,
          "sort": 3,
          "labels": "left"
        },
        {
          "category": "LinkedIn",
          "stack": 1,
          "sort": 4,
          "labels": "left"
        },
        {
          "category": "Other",
          "stack": 1,
          "sort": 5,
          "labels": "left"
        },
        {
          "category": "Windows",
          "stack": 1,
          "sort": 6,
          "labels": "left"
        },
        {
          "category": "Gaming",
          "stack": 1,
          "sort": 7,
          "labels": "left"
        },
        {
          "category": "Search & News Advertising",
          "stack": 1,
          "sort": 8,
          "labels": "left"
        },
        {
          "category": "Devices",
          "stack": 1,
          "sort": 9,
          "labels": "left"
        },
        {
          "category": "Intelligent Cloud",
          "stack": 2,
          "sort": 1
        },
        {
          "category": "Productivity",
          "stack": 2,
          "sort": 2
        },
        {
          "category": "Personal Computing",
          "stack": 2,
          "sort": 3
        },
        {
          "category": "Revenue",
          "stack": 3
        },
        {
          "category": "Gross Profit",
          "stack": 4,
          "sort": 1,
          "gap": 30
        },
        {
          "category": "Cost of Revenue",
          "stack": 4,
          "sort": 2,
          "gap": 30
        },
        {
          "category": "Operating Profit",
          "stack": 5,
          "sort": 1,
          "gap": 60
        },
        {
          "category": "Operating Expenses",
          "stack": 5,
          "sort": 2,
          "gap": 30
        },
        {
          "category": "Product Costs",
          "stack": 5,
          "sort": 3,
          "gap": 20
        },
        {
          "category": "Service Costs",
          "stack": 5,
          "sort": 4,
          "gap": 20
        },
        {
          "category": "Net Profit",
          "stack": 6,
          "sort": 1,
          "gap": 0
        },
        {
          "category": "Tax",
          "stack": 6,
          "sort": 2,
          "gap": 0
        },
        {
          "category": "R&D",
          "stack": 6,
          "sort": 3,
          "gap": 20
        },
        {
          "category": "S&M",
          "stack": 6,
          "sort": 4,
          "gap": 0
        },
        {
          "category": "G&A",
          "stack": 6,
          "sort": 5,
          "gap": 0
        },
        {
          "source": "Server Products & Cloud",
          "destination": "Intelligent Cloud",
          "value": 19.6
        },
        {
          "source": "Enterprise Services",
          "destination": "Intelligent Cloud",
          "value": 1.9
        },
        {
          "source": "Office Products",
          "destination": "Productivity",
          "value": 11.8
        },
        {
          "source": "LinkedIn",
          "destination": "Productivity",
          "value": 3.9
        },
        {
          "source": "Other",
          "destination": "Productivity",
          "value": 1.3
        },
        {
          "source": "Windows",
          "destination": "Personal Computing",
          "value": 4.8
        },
        {
          "source": "Gaming",
          "destination": "Personal Computing",
          "value": 4.8
        },
        {
          "source": "Search & News Advertising",
          "destination": "Personal Computing",
          "value": 3.2
        },
        {
          "source": "Devices",
          "destination": "Personal Computing",
          "value": 1.4
        },
        {
          "source": "Intelligent Cloud",
          "destination": "Revenue",
          "value": 21.5
        },
        {
          "source": "Productivity",
          "destination": "Revenue",
          "value": 17
        },
        {
          "source": "Personal Computing",
          "destination": "Revenue",
          "value": 14.2
        },
        {
          "source": "Revenue",
          "destination": "Gross Profit",
          "value": 35.2
        },
        {
          "source": "Revenue",
          "destination": "Cost of Revenue",
          "value": 17.5
        },
        {
          "source": "Gross Profit",
          "destination": "Operating Profit",
          "value": 20.4
        },
        {
          "source": "Gross Profit",
          "destination": "Operating Expenses",
          "value": 14.8
        },
        {
          "source": "Cost of Revenue",
          "destination": "Product Costs",
          "value": 5.7
        },
        {
          "source": "Cost of Revenue",
          "destination": "Service Costs",
          "value": 11.8
        },
        {
          "source": "Operating Profit",
          "destination": "Net Profit",
          "value": 16.4
        },
        {
          "source": "Operating Profit",
          "destination": "Tax",
          "value": 3.9
        },
        {
          "source": "Operating Expenses",
          "destination": "R&D",
          "value": 6.8
        },
        {
          "source": "Operating Expenses",
          "destination": "S&M",
          "value": 5.7
        },
        {
          "source": "Operating Expenses",
          "destination": "G&A",
          "value": 2.3
        }
      ]
    },
    {
      "name": "stacks",
      "source": "input",
      "transform": [
        {
          "type": "filter",
          "expr": "datum.source != null"
        },
        {
          "type": "formula",
          "as": "end",
          "expr": "['source','destination']"
        },
        {
          "type": "formula",
          "as": "name",
          "expr": "[ datum.source,datum.destination]"
        },
        {
          "type": "project",
          "fields": [
            "end",
            "name",
            "value"
          ]
        },
        {
          "type": "flatten",
          "fields": [
            "end",
            "name"
          ]
        },
        {
          "type": "lookup",
          "from": "input",
          "key": "category",
          "values": [
            "stack",
            "sort",
            "gap",
            "labels"
          ],
          "fields": [
            "name"
          ],
          "as": [
            "stack",
            "sort",
            "gap",
            "labels"
          ]
        },
        {
          "type": "aggregate",
          "fields": [
            "value",
            "stack",
            "sort",
            "gap",
            "labels"
          ],
          "groupby": [
            "end",
            "name"
          ],
          "ops": [
            "sum",
            "max",
            "max",
            "max",
            "max"
          ],
          "as": [
            "value",
            "stack",
            "sort",
            "gap",
            "labels"
          ]
        },
        {
          "type": "aggregate",
          "fields": [
            "value",
            "stack",
            "sort",
            "gap",
            "labels"
          ],
          "groupby": [
            "name"
          ],
          "ops": [
            "max",
            "max",
            "max",
            "max",
            "max"
          ],
          "as": [
            "value",
            "stack",
            "sort",
            "gap",
            "labels"
          ]
        },
        {
          "type": "formula",
          "as": "gap",
          "expr": "datum.gap?datum.gap:0"
        }
      ]
    },
    {
      "name": "maxValue",
      "source": [
        "stacks"
      ],
      "transform": [
        {
          "type": "aggregate",
          "fields": [
            "value"
          ],
          "groupby": [
            "stack"
          ],
          "ops": [
            "sum"
          ],
          "as": [
            "value"
          ]
        },
        {
          "type": "aggregate",
          "fields": [
            "value"
          ],
          "ops": [
            "max"
          ],
          "as": [
            "value"
          ]
        }
      ]
    },
    {
      "name": "plottedStacks",
      "source": [
        "stacks"
      ],
      "transform": [
        {
          "type": "formula",
          "as": "spacer",
          "expr": " (data('maxValue')[0].value/100)*(standardGap+datum.gap)"
        },
        {
          "type": "formula",
          "as": "type",
          "expr": "['data','spacer']"
        },
        {
          "type": "formula",
          "as": "spacedValue",
          "expr": "[datum.value,datum.spacer]"
        },
        {
          "type": "flatten",
          "fields": [
            "type",
            "spacedValue"
          ]
        },
        {
          "type": "stack",
          "groupby": [
            "stack"
          ],
          "sort": {
            "field": "sort",
            "order": "descending"
          },
          "field": "spacedValue",
          "offset": {
            "signal": "base"
          }
        },
        {
          "type": "formula",
          "expr": "((datum.value)/2)+datum.y0",
          "as": "yc"
        }
      ]
    },
    {
      "name": "finalTable",
      "source": [
        "plottedStacks"
      ],
      "transform": [
        {
          "type": "filter",
          "expr": "datum.type == 'data'"
        }
      ]
    },
    {
      "name": "linkTable",
      "source": [
        "input"
      ],
      "transform": [
        {
          "type": "filter",
          "expr": "datum.source != null"
        },
        {
          "type": "lookup",
          "from": "finalTable",
          "key": "name",
          "values": [
            "y0",
            "y1",
            "stack",
            "sort"
          ],
          "fields": [
            "source"
          ],
          "as": [
            "sourceStacky0",
            "sourceStacky1",
            "sourceStack",
            "sourceSort"
          ]
        },
        {
          "type": "lookup",
          "from": "finalTable",
          "key": "name",
          "values": [
            "y0",
            "y1",
            "stack",
            "sort"
          ],
          "fields": [
            "destination"
          ],
          "as": [
            "destinationStacky0",
            "destinationStacky1",
            "destinationStack",
            "destinationSort"
          ]
        },
        {
          "type": "stack",
          "groupby": [
            "source"
          ],
          "sort": {
            "field": "destinationSort",
            "order": "descending"
          },
          "field": "value",
          "offset": "zero",
          "as": [
            "syi0",
            "syi1"
          ]
        },
        {
          "type": "formula",
          "expr": "datum.syi0+datum.sourceStacky0",
          "as": "sy0"
        },
        {
          "type": "formula",
          "expr": "datum.sy0+datum.value",
          "as": "sy1"
        },
        {
          "type": "stack",
          "groupby": [
            "destination"
          ],
          "sort": {
            "field": "sourceSort",
            "order": "descending"
          },
          "field": "value",
          "offset": "zero",
          "as": [
            "dyi0",
            "dyi1"
          ]
        },
        {
          "type": "formula",
          "expr": "datum.dyi0+datum.destinationStacky0",
          "as": "dy0"
        },
        {
          "type": "formula",
          "expr": "datum.dy0+datum.value",
          "as": "dy1"
        },
        {
          "type": "formula",
          "expr": "((datum.value)/2)+datum.sy0",
          "as": "syc"
        },
        {
          "type": "formula",
          "expr": "((datum.value)/2)+datum.dy0",
          "as": "dyc"
        },
        {
          "type": "linkpath",
          "orient": "horizontal",
          "shape": "diagonal",
          "sourceY": {
            "expr": "scale('y', datum.syc)"
          },
          "sourceX": {
            "expr": "scale('x', toNumber(  datum.sourceStack))+ bandwidth('x')"
          },
          "targetY": {
            "expr": "scale('y', datum.dyc)"
          },
          "targetX": {
            "expr": "scale('x', datum.destinationStack)"
          }
        },
        {
          "type": "formula",
          "expr": "range('y')[0]-scale('y', datum.value)",
          "as": "strokeWidth"
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "band",
      "range": "width",
      "domain": {
        "data": "finalTable",
        "field": "stack"
      },
      "paddingInner": 0.88
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "domain": {
        "data": "finalTable",
        "field": "y1"
      },
      "reverse": false
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": {
        "scheme": "rainbow"
      },
      "domain": {
        "data": "stacks",
        "field": "name"
      }
    }
  ],
  "marks": [
    {
      "type": "rect",
      "from": {
        "data": "finalTable"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "field": "stack"
          },
          "width": {
            "scale": "x",
            "band": 1
          },
          "y": {
            "scale": "y",
            "field": "y0"
          },
          "y2": {
            "scale": "y",
            "field": "y1"
          },
          "fill": {
            "scale": "color",
            "field": "name"
          },
          "fillOpacity": {
            "value": 0.75
          },
          "strokeWidth": {
            "value": 0
          },
          "stroke": {
            "scale": "color",
            "field": "name"
          }
        },
        "hover": {
          "tooltip": {
            "signal": "{'Name':datum.name, 'Value':format(datum.value, '$') + 'B'}"
          },
          "fillOpacity": {
            "value": 1
          }
        }
      }
    },
    {
      "type": "path",
      "name": "links",
      "from": {
        "data": "linkTable"
      },
      "clip": true,
      "encode": {
        "update": {
          "strokeWidth": {
            "field": "strokeWidth"
          },
          "path": {
            "field": "path"
          },
          "strokeOpacity": {
            "signal": "0.3"
          },
          "stroke": {
            "field": "destination",
            "scale": "color"
          }
        },
        "hover": {
          "strokeOpacity": {
            "value": 1
          },
          "tooltip": {
            "signal": "{'Source':datum.source,'Destination':datum.destination, 'Value':format(datum.value, '$') + 'B'}"
          }
        }
      }
    },
    {
      "type": "group",
      "name": "labelText",
      "zindex": 1,
      "from": {
        "facet": {
          "data": "finalTable",
          "name": "labelFacet",
          "groupby": [
            "name",
            "stack",
            "yc",
            "value",
            "labels"
          ]
        }
      },
      "clip": false,
      "encode": {
        "update": {
          "strokeWidth": {
            "value": 1
          },
          "stroke": {
            "value": "red"
          },
          "x": {
            "signal": "datum.labels=='left'?scale('x', datum.stack)-8 : scale('x', datum.stack) + (bandwidth('x')) +8"
          },
          "yc": {
            "scale": "y",
            "signal": "datum.yc"
          },
          "width": {
            "signal": "0"
          },
          "height": {
            "signal": "0"
          },
          "fillOpacity": {
            "signal": "0.1"
          }
        }
      },
      "marks": [
        {
          "type": "text",
          "name": "heading",
          "from": {
            "data": "labelFacet"
          },
          "encode": {
            "update": {
              "x": {
                "value": 0
              },
              "y": {
                "value": -2
              },
              "text": {
                "field": "name"
              },
              "align": {
                "signal": "datum.labels=='left'?'right':'left'"
              },
              "fontWeight": {
                "value": "normal"
              }
            }
          }
        },
        {
          "type": "text",
          "name": "amount",
          "from": {
            "data": "labelFacet"
          },
          "encode": {
            "update": {
              "x": {
                "value": 0
              },
              "y": {
                "value": 12
              },
              "text": {
                "signal": " format(datum.value, '$') + 'B'"
              },
              "align": {
                "signal": "datum.labels=='left'?'right':'left'"
              }
            }
          }
        }
      ]
    },
    {
      "type": "rect",
      "from": {
        "data": "labelText"
      },
      "encode": {
        "update": {
          "x": {
            "field": "bounds.x1",
            "offset": -2
          },
          "x2": {
            "field": "bounds.x2",
            "offset": 2
          },
          "y": {
            "field": "bounds.y1",
            "offset": -2
          },
          "y2": {
            "field": "bounds.y2",
            "offset": 2
          },
          "fill": {
            "value": "white"
          },
          "opacity": {
            "value": 0.8
          },
          "cornerRadius": {
            "value": 4
          }
        }
      }
    },
    {
      "type": "text",
      "data": [
        {}
      ],
      "encode": {
        "update": {
          "text": {
            "value": [
              "Source: https://www.microsoft.com/en-us/investor/earnings/fy-2023-q2/income-statements",
              "Dataviz: David Bacci"
            ]
          },
          "align": {
            "value": "left"
          },
          "lineHeight": {
            "value": 16
          },
          "fill": {
            "value": "#595959"
          },
          "x": {
            "signal": "-150"
          },
          "y": {
            "signal": "height +70"
          },
          "fontSize": {
            "value": 10
          }
        }
      }
    }
  ],
  "config": {
    "view": {
      "stroke": "transparent"
    },
    "text": {
      "fontSize": 13,
      "fill": "#333333"
    }
  }
},
};

const presidentAgeRangeData = [
  {
    "No": "1",
    "President": "George Washington",
    "Prospective": null,
    "Start Label": "57 years 67 days",
    "Start Encode": 57.18356164,
    "End Label": "65 years 10 days",
    "End Encode": 65.02739726,
    "Alive": false,
    "Death Label": "67 years 295 days",
    "Death Encode": 67.80821918,
    "Party": "Other",
    "Death Type": ""
  },
  {
    "No": "10",
    "President": "John Tyler",
    "Prospective": null,
    "Start Label": "51 years 6 days",
    "Start Encode": 51.01643836,
    "End Label": "54 years 340 days",
    "End Encode": 54.93150685,
    "Alive": false,
    "Death Label": "71 years 295 days",
    "Death Encode": 71.80821918,
    "Party": "Other",
    "Death Type": ""
  },
  {
    "No": "11",
    "President": "James K. Polk",
    "Prospective": null,
    "Start Label": "49 years 122 days",
    "Start Encode": 49.33424658,
    "End Label": "53 years 122 days",
    "End Encode": 53.33424658,
    "Alive": false,
    "Death Label": "53 years 225 days",
    "Death Encode": 53.61643836,
    "Party": "Democratic",
    "Death Type": ""
  },
  {
    "No": "12",
    "President": "Zachary Taylor",
    "Prospective": null,
    "Start Label": "64 years 100 days",
    "Start Encode": 64.2739726,
    "End Label": "65 years 227 days",
    "End Encode": 65.62191781,
    "Alive": false,
    "Death Label": "65 years 227 days",
    "Death Encode": 65.62191781,
    "Party": "Other",
    "Death Type": "Died in Office"
  },
  {
    "No": "13",
    "President": "Millard Fillmore",
    "Prospective": null,
    "Start Label": "50 years 183 days",
    "Start Encode": 50.50136986,
    "End Label": "53 years 56 days",
    "End Encode": 53.15342466,
    "Alive": false,
    "Death Label": "74 years 60 days",
    "Death Encode": 74.16438356,
    "Party": "Other",
    "Death Type": ""
  },
  {
    "No": "14",
    "President": "Franklin Pierce",
    "Prospective": null,
    "Start Label": "48 years 101 days",
    "Start Encode": 48.27671233,
    "End Label": "52 years 101 days",
    "End Encode": 52.27671233,
    "Alive": false,
    "Death Label": "64 years 319 days",
    "Death Encode": 64.8739726,
    "Party": "Democratic",
    "Death Type": ""
  },
  {
    "No": "15",
    "President": "James Buchanan",
    "Prospective": null,
    "Start Label": "65 years 315 days",
    "Start Encode": 65.8630137,
    "End Label": "69 years 315 days",
    "End Encode": 69.8630137,
    "Alive": false,
    "Death Label": "77 years 39 days",
    "Death Encode": 77.10684932,
    "Party": "Democratic",
    "Death Type": ""
  },
  {
    "No": "16",
    "President": "Abraham Lincoln",
    "Prospective": null,
    "Start Label": "52 years 20 days",
    "Start Encode": 52.05479452,
    "End Label": "56 years 62 days",
    "End Encode": 56.16986301,
    "Alive": false,
    "Death Label": "56 years 62 days",
    "Death Encode": 56.16986301,
    "Party": "Other",
    "Death Type": "Assassinated in Office"
  },
  {
    "No": "17",
    "President": "Andrew Johnson",
    "Prospective": null,
    "Start Label": "56 years 107 days",
    "Start Encode": 56.29315068,
    "End Label": "60 years 65 days",
    "End Encode": 60.17808219,
    "Alive": false,
    "Death Label": "66 years 214 days",
    "Death Encode": 66.58630137,
    "Party": "Other",
    "Death Type": ""
  },
  {
    "No": "18",
    "President": "Ulysses S. Grant",
    "Prospective": null,
    "Start Label": "46 years 311 days",
    "Start Encode": 46.85205479,
    "End Label": "54 years 311 days",
    "End Encode": 54.85205479,
    "Alive": false,
    "Death Label": "63 years 87 days",
    "Death Encode": 63.23835616,
    "Party": "Republican",
    "Death Type": ""
  }
];

const presidentAgeRangeTemplate: DenebTemplate = {
  name: "President Age Range Chart",
  description: "Dataviz by PBI-David",
  version: "1.0.0",
  metadata: {
    name: "President Age Range Chart",
    author: "PBI-David",
    tags: ["deneb", "vega", "showcase"],
    license: "MIT",
  },
  dataConfig: [
    {
      name: "dataset",
      description: "President Age Range Chart data",
      type: "array",
      required: true,
      sampleData: presidentAgeRangeData,
    },
  ],
  vega: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Dataviz by David Bacci: https://www.linkedin.com/in/davbacci/",
  "width": 1000,
  "background": "#F6F0E6",
  "autosize": "pad",
  "padding": 25,
  "title": "",
  "data": [
    {
      "name": "table",
      "values": [
        {
          "No": "1",
          "President": "George Washington",
          "Prospective": null,
          "Start Label": "57 years 67 days",
          "Start Encode": 57.18356164,
          "End Label": "65 years 10 days",
          "End Encode": 65.02739726,
          "Alive": false,
          "Death Label": "67 years 295 days",
          "Death Encode": 67.80821918,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "10",
          "President": "John Tyler",
          "Prospective": null,
          "Start Label": "51 years 6 days",
          "Start Encode": 51.01643836,
          "End Label": "54 years 340 days",
          "End Encode": 54.93150685,
          "Alive": false,
          "Death Label": "71 years 295 days",
          "Death Encode": 71.80821918,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "11",
          "President": "James K. Polk",
          "Prospective": null,
          "Start Label": "49 years 122 days",
          "Start Encode": 49.33424658,
          "End Label": "53 years 122 days",
          "End Encode": 53.33424658,
          "Alive": false,
          "Death Label": "53 years 225 days",
          "Death Encode": 53.61643836,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "12",
          "President": "Zachary Taylor",
          "Prospective": null,
          "Start Label": "64 years 100 days",
          "Start Encode": 64.2739726,
          "End Label": "65 years 227 days",
          "End Encode": 65.62191781,
          "Alive": false,
          "Death Label": "65 years 227 days",
          "Death Encode": 65.62191781,
          "Party": "Other",
          "Death Type": "Died in Office"
        },
        {
          "No": "13",
          "President": "Millard Fillmore",
          "Prospective": null,
          "Start Label": "50 years 183 days",
          "Start Encode": 50.50136986,
          "End Label": "53 years 56 days",
          "End Encode": 53.15342466,
          "Alive": false,
          "Death Label": "74 years 60 days",
          "Death Encode": 74.16438356,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "14",
          "President": "Franklin Pierce",
          "Prospective": null,
          "Start Label": "48 years 101 days",
          "Start Encode": 48.27671233,
          "End Label": "52 years 101 days",
          "End Encode": 52.27671233,
          "Alive": false,
          "Death Label": "64 years 319 days",
          "Death Encode": 64.8739726,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "15",
          "President": "James Buchanan",
          "Prospective": null,
          "Start Label": "65 years 315 days",
          "Start Encode": 65.8630137,
          "End Label": "69 years 315 days",
          "End Encode": 69.8630137,
          "Alive": false,
          "Death Label": "77 years 39 days",
          "Death Encode": 77.10684932,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "16",
          "President": "Abraham Lincoln",
          "Prospective": null,
          "Start Label": "52 years 20 days",
          "Start Encode": 52.05479452,
          "End Label": "56 years 62 days",
          "End Encode": 56.16986301,
          "Alive": false,
          "Death Label": "56 years 62 days",
          "Death Encode": 56.16986301,
          "Party": "Other",
          "Death Type": "Assassinated in Office"
        },
        {
          "No": "17",
          "President": "Andrew Johnson",
          "Prospective": null,
          "Start Label": "56 years 107 days",
          "Start Encode": 56.29315068,
          "End Label": "60 years 65 days",
          "End Encode": 60.17808219,
          "Alive": false,
          "Death Label": "66 years 214 days",
          "Death Encode": 66.58630137,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "18",
          "President": "Ulysses S. Grant",
          "Prospective": null,
          "Start Label": "46 years 311 days",
          "Start Encode": 46.85205479,
          "End Label": "54 years 311 days",
          "End Encode": 54.85205479,
          "Alive": false,
          "Death Label": "63 years 87 days",
          "Death Encode": 63.23835616,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "19",
          "President": "Rutherford B. Hayes",
          "Prospective": null,
          "Start Label": "54 years 151 days",
          "Start Encode": 54.41369863,
          "End Label": "58 years 151 days",
          "End Encode": 58.41369863,
          "Alive": false,
          "Death Label": "70 years 105 days",
          "Death Encode": 70.28767123,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "2",
          "President": "John Adams",
          "Prospective": null,
          "Start Label": "61 years 125 days",
          "Start Encode": 61.34246575,
          "End Label": "65 years 125 days",
          "End Encode": 65.34246575,
          "Alive": false,
          "Death Label": "90 years 247 days",
          "Death Encode": 90.67671233,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "20",
          "President": "James A. Garfield",
          "Prospective": null,
          "Start Label": "49 years 105 days",
          "Start Encode": 49.28767123,
          "End Label": "49 years 304 days",
          "End Encode": 49.83287671,
          "Alive": false,
          "Death Label": "49 years 304 days",
          "Death Encode": 49.83287671,
          "Party": "Republican",
          "Death Type": "Assassinated in Office"
        },
        {
          "No": "21",
          "President": "Chester A. Arthur",
          "Prospective": null,
          "Start Label": "51 years 349 days",
          "Start Encode": 51.95616438,
          "End Label": "55 years 150 days",
          "End Encode": 55.4109589,
          "Alive": false,
          "Death Label": "57 years 44 days",
          "Death Encode": 57.12054795,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "22",
          "President": "Grover Cleveland",
          "Prospective": null,
          "Start Label": "47 years 351 days",
          "Start Encode": 47.96164384,
          "End Label": "51 years 351 days",
          "End Encode": 51.96164384,
          "Alive": false,
          "Death Label": "71 years 98 days",
          "Death Encode": 71.26849315,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "23",
          "President": "Benjamin Harrison",
          "Prospective": null,
          "Start Label": "55 years 196 days",
          "Start Encode": 55.5369863,
          "End Label": "59 years 196 days",
          "End Encode": 59.5369863,
          "Alive": false,
          "Death Label": "67 years 205 days",
          "Death Encode": 67.56164384,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "24",
          "President": "Grover Cleveland",
          "Prospective": null,
          "Start Label": "55 years 351 days",
          "Start Encode": 55.96164384,
          "End Label": "59 years 351 days",
          "End Encode": 59.96164384,
          "Alive": false,
          "Death Label": "71 years 98 days",
          "Death Encode": 71.26849315,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "25",
          "President": "William McKinley",
          "Prospective": null,
          "Start Label": "54 years 34 days",
          "Start Encode": 54.09315068,
          "End Label": "58 years 228 days",
          "End Encode": 58.62465753,
          "Alive": false,
          "Death Label": "58 years 228 days",
          "Death Encode": 58.62465753,
          "Party": "Republican",
          "Death Type": "Assassinated in Office"
        },
        {
          "No": "26",
          "President": "Theodore Roosevelt",
          "Prospective": null,
          "Start Label": "42 years 322 days",
          "Start Encode": 42.88219178,
          "End Label": "50 years 128 days",
          "End Encode": 50.35068493,
          "Alive": false,
          "Death Label": "60 years 71 days",
          "Death Encode": 60.19452055,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "27",
          "President": "William Howard Taft",
          "Prospective": null,
          "Start Label": "51 years 170 days",
          "Start Encode": 51.46575342,
          "End Label": "55 years 170 days",
          "End Encode": 55.46575342,
          "Alive": false,
          "Death Label": "72 years 174 days",
          "Death Encode": 72.47671233,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "28",
          "President": "Woodrow Wilson",
          "Prospective": null,
          "Start Label": "56 years 66 days",
          "Start Encode": 56.18082192,
          "End Label": "64 years 66 days",
          "End Encode": 64.18082192,
          "Alive": false,
          "Death Label": "67 years 37 days",
          "Death Encode": 67.10136986,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "29",
          "President": "Warren G. Harding",
          "Prospective": null,
          "Start Label": "55 years 122 days",
          "Start Encode": 55.33424658,
          "End Label": "57 years 273 days",
          "End Encode": 57.74794521,
          "Alive": false,
          "Death Label": "57 years 273 days",
          "Death Encode": 57.74794521,
          "Party": "Republican",
          "Death Type": "Died in Office"
        },
        {
          "No": "3",
          "President": "Thomas Jefferson",
          "Prospective": null,
          "Start Label": "57 years 325 days",
          "Start Encode": 57.89041096,
          "End Label": "65 years 325 days",
          "End Encode": 65.89041096,
          "Alive": false,
          "Death Label": "83 years 82 days",
          "Death Encode": 83.22465753,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "30",
          "President": "Calvin Coolidge",
          "Prospective": null,
          "Start Label": "51 years 29 days",
          "Start Encode": 51.07945205,
          "End Label": "56 years 243 days",
          "End Encode": 56.66575342,
          "Alive": false,
          "Death Label": "60 years 185 days",
          "Death Encode": 60.50684932,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "31",
          "President": "Herbert Hoover",
          "Prospective": null,
          "Start Label": "54 years 206 days",
          "Start Encode": 54.56438356,
          "End Label": "58 years 206 days",
          "End Encode": 58.56438356,
          "Alive": false,
          "Death Label": "90 years 71 days",
          "Death Encode": 90.19452055,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "32",
          "President": "Franklin D. Roosevelt",
          "Prospective": null,
          "Start Label": "51 years 33 days",
          "Start Encode": 51.09041096,
          "End Label": "63 years 72 days",
          "End Encode": 63.19726027,
          "Alive": false,
          "Death Label": "63 years 72 days",
          "Death Encode": 63.19726027,
          "Party": "Democratic",
          "Death Type": "Died in Office"
        },
        {
          "No": "33",
          "President": "Harry S. Truman",
          "Prospective": null,
          "Start Label": "60 years 339 days",
          "Start Encode": 60.92876712,
          "End Label": "68 years 257 days",
          "End Encode": 68.70410959,
          "Alive": false,
          "Death Label": "88 years 232 days",
          "Death Encode": 88.63561644,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "34",
          "President": "Dwight D. Eisenhower",
          "Prospective": null,
          "Start Label": "62 years 98 days",
          "Start Encode": 62.26849315,
          "End Label": "70 years 98 days",
          "End Encode": 70.26849315,
          "Alive": false,
          "Death Label": "78 years 165 days",
          "Death Encode": 78.45205479,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "35",
          "President": "John F. Kennedy",
          "Prospective": null,
          "Start Label": "43 years 236 days",
          "Start Encode": 43.64657534,
          "End Label": "46 years 177 days",
          "End Encode": 46.48493151,
          "Alive": false,
          "Death Label": "46 years 177 days",
          "Death Encode": 46.48493151,
          "Party": "Democratic",
          "Death Type": "Assassinated in Office"
        },
        {
          "No": "36",
          "President": "Lyndon B. Johnson",
          "Prospective": null,
          "Start Label": "55 years 87 days",
          "Start Encode": 55.23835616,
          "End Label": "60 years 146 days",
          "End Encode": 60.4,
          "Alive": false,
          "Death Label": "64 years 148 days",
          "Death Encode": 64.40547945,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "37",
          "President": "Richard Nixon",
          "Prospective": null,
          "Start Label": "56 years 11 days",
          "Start Encode": 56.03013699,
          "End Label": "61 years 212 days",
          "End Encode": 61.58082192,
          "Alive": false,
          "Death Label": "81 years 103 days",
          "Death Encode": 81.28219178,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "38",
          "President": "Gerald Ford",
          "Prospective": null,
          "Start Label": "61 years 26 days",
          "Start Encode": 61.07123288,
          "End Label": "63 years 190 days",
          "End Encode": 63.52054795,
          "Alive": false,
          "Death Label": "93 years 165 days",
          "Death Encode": 93.45205479,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "39",
          "President": "Jimmy Carter",
          "Prospective": null,
          "Start Label": "52 years 111 days",
          "Start Encode": 52.30410959,
          "End Label": "56 years 111 days",
          "End Encode": 56.30410959,
          "Alive": true,
          "Death Label": "99 years 288 days",
          "Death Encode": 99.7890411,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "4",
          "President": "James Madison",
          "Prospective": null,
          "Start Label": "57 years 353 days",
          "Start Encode": 57.96712329,
          "End Label": "65 years 353 days",
          "End Encode": 65.96712329,
          "Alive": false,
          "Death Label": "85 years 104 days",
          "Death Encode": 85.28493151,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "40",
          "President": "Ronald Reagan",
          "Prospective": null,
          "Start Label": "69 years 349 days",
          "Start Encode": 69.95616438,
          "End Label": "77 years 349 days",
          "End Encode": 77.95616438,
          "Alive": false,
          "Death Label": "93 years 120 days",
          "Death Encode": 93.32876712,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "41",
          "President": "George H. W. Bush",
          "Prospective": null,
          "Start Label": "64 years 222 days",
          "Start Encode": 64.60821918,
          "End Label": "68 years 222 days",
          "End Encode": 68.60821918,
          "Alive": false,
          "Death Label": "94 years 171 days",
          "Death Encode": 94.46849315,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "42",
          "President": "Bill Clinton",
          "Prospective": null,
          "Start Label": "46 years 154 days",
          "Start Encode": 46.42191781,
          "End Label": "54 years 154 days",
          "End Encode": 54.42191781,
          "Alive": true,
          "Death Label": "77 years 331 days",
          "Death Encode": 77.90684932,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "43",
          "President": "George W. Bush",
          "Prospective": null,
          "Start Label": "54 years 198 days",
          "Start Encode": 54.54246575,
          "End Label": "62 years 198 days",
          "End Encode": 62.54246575,
          "Alive": true,
          "Death Label": "78 years 9 days",
          "Death Encode": 78.02465753,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "44",
          "President": "Barack Obama",
          "Prospective": null,
          "Start Label": "47 years 169 days",
          "Start Encode": 47.4630137,
          "End Label": "55 years 169 days",
          "End Encode": 55.4630137,
          "Alive": true,
          "Death Label": "62 years 346 days",
          "Death Encode": 62.94794521,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "45",
          "President": "Donald Trump",
          "Prospective": null,
          "Start Label": "70 years 220 days",
          "Start Encode": 70.60273973,
          "End Label": "74 years 220 days",
          "End Encode": 74.60273973,
          "Alive": true,
          "Death Label": "78 years 31 days",
          "Death Encode": 78.08493151,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "46",
          "President": "Joe Biden",
          "Prospective": null,
          "Start Label": "78 years 61 days",
          "Start Encode": 78.16712329,
          "End Label": "82 years 61 days",
          "End Encode": 82.16712329,
          "Alive": true,
          "Death Label": "81 years 238 days",
          "Death Encode": 81.65205479,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "46\u200b",
          "President": "Joe Biden",
          "Prospective": true,
          "Start Label": "82 years 61 days",
          "Start Encode": 82.16712329,
          "End Label": "86 years 61 days",
          "End Encode": 86.16712329,
          "Alive": true,
          "Death Label": "81 years 238 days",
          "Death Encode": 81.65205479,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "47\u200b",
          "President": "Donald Trump",
          "Prospective": true,
          "Start Label": "78 years 220 days",
          "Start Encode": 78.60273973,
          "End Label": "82 years 220 days",
          "End Encode": 82.60273973,
          "Alive": true,
          "Death Label": "78 years 31 days",
          "Death Encode": 78.08493151,
          "Party": "Republican",
          "Death Type": ""
        },
        {
          "No": "5",
          "President": "James Monroe",
          "Prospective": null,
          "Start Label": "58 years 310 days",
          "Start Encode": 58.84931507,
          "End Label": "66 years 310 days",
          "End Encode": 66.84931507,
          "Alive": false,
          "Death Label": "73 years 67 days",
          "Death Encode": 73.18356164,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "6",
          "President": "John Quincy Adams",
          "Prospective": null,
          "Start Label": "57 years 236 days",
          "Start Encode": 57.64657534,
          "End Label": "61 years 236 days",
          "End Encode": 61.64657534,
          "Alive": false,
          "Death Label": "80 years 227 days",
          "Death Encode": 80.62191781,
          "Party": "Other",
          "Death Type": ""
        },
        {
          "No": "7",
          "President": "Andrew Jackson",
          "Prospective": null,
          "Start Label": "61 years 354 days",
          "Start Encode": 61.96986301,
          "End Label": "69 years 354 days",
          "End Encode": 69.96986301,
          "Alive": false,
          "Death Label": "78 years 85 days",
          "Death Encode": 78.23287671,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "8",
          "President": "Martin Van Buren",
          "Prospective": null,
          "Start Label": "54 years 89 days",
          "Start Encode": 54.24383562,
          "End Label": "58 years 89 days",
          "End Encode": 58.24383562,
          "Alive": false,
          "Death Label": "79 years 231 days",
          "Death Encode": 79.63287671,
          "Party": "Democratic",
          "Death Type": ""
        },
        {
          "No": "9",
          "President": "William Henry Harrison",
          "Prospective": null,
          "Start Label": "68 years 23 days",
          "Start Encode": 68.0630137,
          "End Label": "68 years 54 days",
          "End Encode": 68.14794521,
          "Alive": false,
          "Death Label": "68 years 54 days",
          "Death Encode": 68.14794521,
          "Party": "Other",
          "Death Type": "Died in Office"
        }
      ],
      "transform": [
        {
          "type": "extent",
          "field": "No",
          "signal": "myExtent"
        },
        {
          "type": "formula",
          "as": "No",
          "expr": "datum.Prospective?datum.No+'\u200b':datum.No"
        },
        {
          "type": "formula",
          "as": "Alive Label",
          "expr": "datum.Alive?'Alive':'Dead'"
        },
        {
          "type": "formula",
          "as": "President",
          "expr": "datum.Prospective?datum.President+' (Prospective)':datum.President"
        }
      ]
    }
  ],
  "signals": [
    {
      "name": "height",
      "update": "(myExtent[1]+2)*stepSize+10"
    },
    {
      "name": "stepSize",
      "update": "16"
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "range": "width",
      "domain": {
        "data": "table",
        "fields": [
          "Start Encode",
          "End Encode",
          "Death Encode"
        ]
      },
      "domainMin": 30,
      "domainMax": 100
    },
    {
      "name": "y",
      "type": "band",
      "range": {
        "step": {
          "signal": "stepSize"
        }
      },
      "domain": {
        "data": "table",
        "field": "No",
        "sort": {
          "field": "Start Encode",
          "op": "max",
          "order": "descending"
        }
      },
      "padding": 0.2
    },
    {
      "name": "c1",
      "type": "ordinal",
      "range": [
        "#224798",
        "#a43e44",
        "#A9791C"
      ],
      "domain": [
        "Democratic",
        "Republican",
        "Other"
      ]
    },
    {
      "name": "c2",
      "type": "ordinal",
      "range": [
        "#739AD5",
        "#EA9999",
        "#EBC67E"
      ],
      "domain": [
        "Democratic",
        "Republican",
        "Other"
      ]
    },
    {
      "name": "strokeDash",
      "type": "ordinal",
      "domain": {
        "data": "table",
        "field": "Alive Label",
        "sort": true
      },
      "range": [
        [],
        [
          2,
          4
        ]
      ]
    },
    {
      "name": "death",
      "type": "ordinal",
      "range": [
        "m -0.08499,9.18061 c -5,0 -9,-4 -9,-9 0,-5 4,-9 9,-9 5,0 9,4 9,9 0,5 -4,9 -9,9 z m 0,-16 c -3.9,0 -7,3.1 -7,7 0,3.9 3.1,7 7,7 3.9,0 7,-3.1 7,-7 0,-3.9 -3.1,-7 -7,-7 z m 0,11 c -2.2,0 -4,-1.8 -4,-4 0,-2.2 1.8,-4 4,-4 2.2,0 4,1.8 4,4 0,2.2 -1.8,4 -4,4 z m 0,-6 c -1.1,0 -2,0.9 -2,2 0,1.1 0.9,2 2,2 1.1,0 2,-0.9 2,-2 0,-1.1 -0.9,-2 -2,-2 z M -0.08499,12.18061 c -0.6,0 -1,-0.4 -1,-1 v -8 c 0,-0.6 0.4,-1 1,-1 0.6,0 1,0.4 1,1 v 8 c 0,0.6 -0.4,1 -1,1 z M -0.08499,-1.81939 c -0.6,0 -1,-0.4 -1,-1 v -8 c 0,-0.6 0.4,-1 1,-1 0.6,0 1,0.4 1,1 v 8 c 0,0.6 -0.4,1 -1,1 z M -3.08499,1.18061 h -8 c -0.6,0 -1,-0.4 -1,-1 0,-0.6 0.4,-1 1,-1 h 8 c 0.6,0 1,0.4 1,1 0,0.6 -0.4,1 -1,1 z M 10.91501,1.18061 h -8 c -0.6,0 -1,-0.4 -1,-1 0,-0.6 0.4,-1 1,-1 h 8 c 0.6,0 1,0.4 1,1 0,0.6 -0.4,1 -1,1 z",
        "M 6.73411,-7.8353 H 2.62583 v -4.03746 c 0,-0.35086 -0.28107,-0.63515 -0.6319,-0.63515 h -3.03199 c -0.35082,0 -0.6319,0.28428 -0.6319,0.63515 v 4.03746 h -4.10828 c -0.29829,0 -0.52664,0.22391 -0.52664,0.5222 v 3.22228 c 0,0.2983 0.22836,0.5513 0.52664,0.5513 h 4.10828 V 5.6602 c 0,0.35086 0.28108,0.63536 0.6319,0.63536 h 3.03199 c 0.35083,0 0.6319,-0.28455 0.6319,-0.63536 v -9.19972 h 4.10828 c 0.29829,0 0.52664,-0.253 0.52664,-0.5513 V -7.3131 c 0,-0.2983 -0.22836,-0.5222 -0.52664,-0.5222 z",
        "m 0,0"
      ],
      "domain": [
        "Assassinated in Office",
        "Died in Office",
        ""
      ]
    }
  ],
  "legends": [
    {
      "fill": "c1",
      "symbolType": "square",
      "symbolOpacity": 0.8,
      "labelColor": "#3f444d",
      "labelFont": "Segoe UI",
      "labelFontSize": 12,
      "title": "",
      "titlePadding": 0
    },
    {
      "fill": "death",
      "shape": "death",
      "symbolSize": 2,
      "labelOffset": 6,
      "labelColor": "#3f444d",
      "labelFont": "Segoe UI",
      "labelFontSize": 12,
      "offset": 20,
      "titlePadding": 100,
      "orient": "none",
      "legendX": {
        "signal": "width +20"
      },
      "legendY": {
        "signal": "110"
      }
    },
    {
      "strokeDash": "strokeDash",
      "symbolType": "stroke",
      "symbolOpacity": 0.8,
      "labelColor": "#3f444d",
      "labelFont": "Segoe UI",
      "labelFontSize": 12,
      "title": "",
      "titlePadding": 0,
      "encode": {
        "symbols": {
          "update": {
            "stroke": {
              "value": "#3f444d"
            }
          }
        }
      }
    }
  ],
  "axes": [
    {
      "orient": "bottom",
      "scale": "x",
      "zindex": 0,
      "domain": false,
      "labelColor": "grey",
      "labelFontSize": 11,
      "labelFont": "Segoe UI",
      "labelOpacity": 0.8,
      "grid": true,
      "tickCount": 8,
      "tickColor": "#dddddd",
      "title": "President Age",
      "titleColor": "#3f444d",
      "titleFont": "Segoe UI",
      "titleOpacity": 0.8,
      "titleFontSize": 13,
      "titleFontWeight": "normal"
    },
    {
      "orient": "left",
      "scale": "y",
      "zindex": 1,
      "tickOpacity": 0,
      "labels": false
    }
  ],
  "marks": [
    {
      "type": "text",
      "name": "medianLabel",
      "data": [
        {}
      ],
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "value": 38.8
          },
          "y": {
            "signal": "height+30"
          },
          "text": {
            "value": [
              "Median Age 38.8",
              "in United States"
            ]
          },
          "font": {
            "value": "Segoe UI"
          },
          "fontSize": {
            "value": 12
          },
          "fontStyle": {
            "value": "normal"
          },
          "baseline": {
            "value": "middle"
          },
          "align": {
            "value": "right"
          },
          "fill": {
            "value": "teal"
          },
          "opacity": {
            "value": 0.8
          }
        }
      }
    },
    {
      "type": "rule",
      "name": "medianRule",
      "data": [
        {}
      ],
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "value": 38.8
          },
          "y": {
            "value": 0
          },
          "x2": {
            "scale": "x",
            "value": 38.8
          },
          "y2": {
            "signal": "height+20"
          },
          "stroke": {
            "value": "teal"
          },
          "opacity": {
            "value": 0.6
          },
          "strokeDash": {
            "value": [
              2,
              3
            ]
          }
        }
      }
    },
    {
      "type": "text",
      "name": "number",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "value": -8
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0.5
          },
          "text": {
            "field": "No"
          },
          "font": {
            "value": "Segoe UI"
          },
          "fontSize": {
            "value": 12
          },
          "fontStyle": {
            "signal": "datum.Prospective?'italic':'normal'"
          },
          "baseline": {
            "value": "middle"
          },
          "align": {
            "value": "right"
          },
          "fill": {
            "signal": "datum.Prospective?scale('c1',datum.Party):'#3f444d'"
          },
          "opacity": {
            "value": 0.8
          }
        }
      }
    },
    {
      "type": "text",
      "name": "name",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "value": 8
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0.5
          },
          "text": {
            "field": "President"
          },
          "font": {
            "value": "Segoe UI"
          },
          "fontSize": {
            "value": 12
          },
          "fontStyle": {
            "signal": "datum.Prospective?'italic':'normal'"
          },
          "baseline": {
            "value": "middle"
          },
          "fill": {
            "signal": "datum.Prospective?scale('c1',datum.Party):'#3f444d'"
          },
          "opacity": {
            "value": 1
          }
        }
      }
    },
    {
      "type": "rule",
      "name": "before",
      "from": {
        "data": "name"
      },
      "encode": {
        "enter": {
          "x": {
            "field": "bounds.x2",
            "offset": 5
          },
          "x2": {
            "scale": "x",
            "signal": "datum.datum['Start Encode']",
            "offset": -20
          },
          "y": {
            "scale": "y",
            "field": "datum.No",
            "band": 0.5
          },
          "y2": {
            "scale": "y",
            "field": "datum.No",
            "band": 0.5
          },
          "stroke": {
            "value": "#3f444d"
          },
          "strokeDash": {
            "field": "datum.['Alive Label']",
            "scale": "strokeDash"
          },
          "strokeWidth": {
            "value": 1
          },
          "opacity": {
            "value": 0.8
          }
        }
      }
    },
    {
      "type": "rule",
      "name": "after",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "End Encode",
            "offset": 20
          },
          "x2": {
            "scale": "x",
            "field": "Death Encode"
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0.5
          },
          "y2": {
            "scale": "y",
            "field": "No",
            "band": 0.5
          },
          "stroke": {
            "value": "#3f444d"
          },
          "strokeDash": {
            "field": "Alive Label",
            "scale": "strokeDash"
          },
          "strokeWidth": {
            "signal": "datum.No =='46' || datum.No =='11' || datum.Prospective !=null  || datum['Death Type'] !=''?0:1"
          },
          "opacity": {
            "value": 0.8
          }
        }
      }
    },
    {
      "type": "rect",
      "name": "presidency",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "Start Encode"
          },
          "x2": {
            "scale": "x",
            "field": "End Encode"
          },
          "y": {
            "scale": "y",
            "field": "No"
          },
          "height": {
            "signal": "bandwidth('y')"
          },
          "fill": {
            "scale": "c2",
            "field": "Party"
          },
          "opacity": {
            "value": 1
          }
        }
      }
    },
    {
      "type": "rect",
      "name": "presidencyStart",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "Start Encode",
            "offset": 0
          },
          "width": {
            "value": 4
          },
          "y": {
            "scale": "y",
            "field": "No"
          },
          "height": {
            "signal": "bandwidth('y')"
          },
          "fill": {
            "scale": "c1",
            "field": "Party"
          },
          "opacity": {
            "signal": "datum.Prospective ==null ?1:0"
          }
        }
      }
    },
    {
      "type": "rect",
      "name": "presidencyEnd",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "End Encode",
            "offset": -4
          },
          "width": {
            "value": 4
          },
          "y": {
            "scale": "y",
            "field": "No"
          },
          "height": {
            "signal": "bandwidth('y')"
          },
          "fill": {
            "scale": "c1",
            "field": "Party"
          },
          "opacity": {
            "signal": "datum.Prospective ==null ?1:0"
          }
        }
      }
    },
    {
      "type": "text",
      "name": "startAge",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "Start Encode",
            "offset": -3
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0.5
          },
          "text": {
            "signal": "split(datum['Start Label'],' ' )[0]"
          },
          "align": {
            "value": "right"
          },
          "baseline": {
            "value": "middle"
          },
          "fill": {
            "field": "Party",
            "scale": "c1"
          },
          "opacity": {
            "value": 0.9
          }
        }
      }
    },
    {
      "type": "text",
      "name": "endAge",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "End Encode",
            "offset": 3
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0.5
          },
          "text": {
            "signal": "datum.President =='James K. Polk'?'': split(datum['End Label'],' ' )[0] "
          },
          "align": {
            "value": "left"
          },
          "fontSize": {
            "value": 11
          },
          "baseline": {
            "value": "middle"
          },
          "fill": {
            "field": "Party",
            "scale": "c1"
          },
          "opacity": {
            "value": 0.9
          }
        }
      }
    },
    {
      "type": "text",
      "name": "deathAge",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "Death Encode",
            "offset": 3
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0.5
          },
          "text": {
            "signal": "datum.President =='Joe Biden' || datum['Death Type'] !='' || datum.Prospective !=null?'':split(datum['Death Label'],' ' )[0]"
          },
          "align": {
            "value": "left"
          },
          "baseline": {
            "value": "middle"
          },
          "fill": {
            "value": "#3f444d"
          },
          "opacity": {
            "value": 0.7
          }
        }
      }
    },
    {
      "type": "symbol",
      "name": "deathInOffice",
      "from": {
        "data": "endAge"
      },
      "encode": {
        "enter": {
          "x": {
            "field": "bounds.x2",
            "offset": 9
          },
          "y": {
            "scale": "y",
            "field": "datum.No",
            "band": 0.5
          },
          "shape": {
            "scale": "death",
            "field": "datum['Death Type']"
          },
          "size": {
            "value": 1.5
          },
          "fill": {
            "field": "datum.Party",
            "scale": "c1"
          },
          "opacity": {
            "value": 0.8
          }
        }
      }
    },
    {
      "type": "rule",
      "name": "prospectiveStart",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "Start Encode",
            "offset": 3
          },
          "x2": {
            "scale": "x",
            "field": "Start Encode",
            "offset": 3
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0
          },
          "y2": {
            "scale": "y",
            "field": "No",
            "band": 1
          },
          "strokeWidth": {
            "signal": "datum.Prospective? 6:0"
          },
          "stroke": {
            "field": "Party",
            "scale": "c1"
          },
          "strokeDash": {
            "value": [
              2,
              2
            ]
          },
          "opacity": {
            "value": 1
          }
        }
      }
    },
    {
      "type": "rule",
      "name": "prospectiveEnd",
      "from": {
        "data": "table"
      },
      "encode": {
        "enter": {
          "x": {
            "scale": "x",
            "field": "End Encode",
            "offset": -3
          },
          "x2": {
            "scale": "x",
            "field": "End Encode",
            "offset": -3
          },
          "y": {
            "scale": "y",
            "field": "No",
            "band": 0
          },
          "y2": {
            "scale": "y",
            "field": "No",
            "band": 1
          },
          "strokeWidth": {
            "signal": "datum.Prospective? 6:0"
          },
          "stroke": {
            "field": "Party",
            "scale": "c1"
          },
          "strokeDash": {
            "value": [
              2,
              2
            ]
          },
          "opacity": {
            "value": 1
          }
        }
      }
    },
    {
      "type": "text",
      "data": [
        {}
      ],
      "encode": {
        "update": {
          "text": {
            "value": [
              "Source: https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States_by_age",
              "Dataviz: David Bacci"
            ]
          },
          "href": {
            "value": "https://www.linkedin.com/in/davbacci"
          },
          "align": {
            "value": "left"
          },
          "lineHeight": {
            "value": 16
          },
          "fill": {
            "value": "grey"
          },
          "opacity": {
            "value": 0.8
          },
          "x": {
            "signal": "width - 220"
          },
          "y": {
            "signal": "height+60"
          },
          "fontSize": {
            "value": 10
          },
          "font": {
            "value": "Segoe UI "
          }
        }
      }
    }
  ]
},
};



export const denebTemplates: DenebTemplateGalleryItem[] = [
  {
    id: "deneb-regional-sales",
    title: "Regional Sales Breakdown",
    description: "Grouped bar chart comparing quarterly revenue across global regions.",
    category: "Comparisons",
    tags: ["deneb", "bar", "grouped", "vega-lite", "business"],
    template: regionalSalesTemplate,
    sampleData: regionalSalesData,
  },
  {
    id: "deneb-revenue-trend",
    title: "Revenue vs Forecast Trend",
    description: "Dual-series time-series chart with legend-driven highlighting.",
    category: "Time Series",
    tags: ["deneb", "line", "time-series", "forecast"],
    template: revenueTrendTemplate,
    sampleData: revenueTrendData,
  },
  {
    id: "deneb-segmentation-scatter",
    title: "Customer Segmentation Insights",
    description: "Scatter plot with regional filtering and hover details by segment.",
    category: "Distribution",
    tags: ["deneb", "scatter", "segmentation", "analytics"],
    template: segmentationTemplate,
    sampleData: segmentationData,
  },
  {
    id: "deneb-team-performance",
    title: "Team Performance Heatmap",
    description: "Heatmap showcasing team performance across agile delivery metrics.",
    category: "Heatmaps",
    tags: ["deneb", "heatmap", "operations", "agile"],
    template: performanceHeatmapTemplate,
    sampleData: performanceHeatmapData,
  },
  {
    id: "deneb-forecast-band",
    title: "Revenue Forecast Band",
    description: "Forecast cone with confidence interval around actual revenue results.",
    category: "Forecasting",
    tags: ["deneb", "forecast", "area", "band"],
    template: forecastBandTemplate,
    sampleData: forecastBandData,
  },
  {
    id: "deneb-gantt-chart",
    title: "Gantt Chart",
    description: "Interactive Gantt chart for project management with task dependencies and milestones.",
    category: "Project Management",
    tags: ["deneb", "gantt", "project", "timeline", "vega"],
    template: ganttChartTemplate,
    sampleData: ganttChartData,
  },
  {
    id: "deneb-calendar-heatmap",
    title: "Calendar Heatmap",
    description: "Calendar-style heatmap visualization showing daily values across months and years.",
    category: "Heatmaps",
    tags: ["deneb", "calendar", "heatmap", "time-series", "vega-lite"],
    template: calendarHeatmapTemplate,
    sampleData: calendarHeatmapData,
  },
  {
    id: "deneb-bank-failure-bubble",
    title: "Bank Failure Bubble Chart",
    description: "Force-directed bubble chart showing bank failures over time with asset size.",
    category: "Distribution",
    tags: ["deneb", "bubble", "force", "animation", "vega"],
    template: bankFailureBubbleTemplate,
    sampleData: bankFailureBubbleData,
  },
  {
    id: "deneb-coronation-arc",
    title: "Coronation Arc Chart",
    description: "Arc chart visualization showing British monarch reign periods and lifespans.",
    category: "Timeline",
    tags: ["deneb", "arc", "timeline", "historical", "vega"],
    template: coronationArcTemplate,
    sampleData: coronationArcData,
  },
  {
    id: "deneb-force-directed-graph",
    title: "Force Directed Graph",
    description: "Interactive force-directed network graph showing relationships between entities.",
    category: "Network",
    tags: ["deneb", "network", "graph", "force", "vega"],
    template: forceDirectedGraphTemplate,
    sampleData: forceDirectedGraphData,
  },
  {
    id: "deneb-mekko-chart",
    title: "Mekko Chart",
    description: "Marimekko chart showing proportional relationships across categories.",
    category: "Comparisons",
    tags: ["deneb", "mekko", "marimekko", "proportional", "vega"],
    template: mekkoChartTemplate,
    sampleData: mekkoChartData,
  },
  {
    id: "deneb-org-tree",
    title: "Organisation Tree Chart",
    description: "Collapsible and zoomable organization tree chart for hierarchical data.",
    category: "Hierarchy",
    tags: ["deneb", "tree", "org-chart", "hierarchy", "vega"],
    template: orgTreeTemplate,
    sampleData: orgTreeData,
  },
  {
    id: "deneb-variance-chart",
    title: "Variance Chart",
    description: "Multi-panel variance chart comparing actual vs forecast with absolute and percentage differences.",
    category: "Comparisons",
    tags: ["deneb", "variance", "comparison", "business", "vega-lite"],
    template: varianceChartTemplate,
    sampleData: varianceChartData,
  },
  {
    id: "deneb-sankey-chart",
    title: "Sankey Chart",
    description: "Sankey diagram showing flow of values through different stages.",
    category: "Flow",
    tags: ["deneb", "sankey", "flow", "diagram", "vega"],
    template: sankeyChartTemplate,
    sampleData: sankeyChartData,
  },
  {
    id: "deneb-president-age-range",
    title: "President Age Range Chart",
    description: "Timeline chart showing US presidents' ages during their terms and lifespan.",
    category: "Timeline",
    tags: ["deneb", "timeline", "age", "historical", "vega"],
    template: presidentAgeRangeTemplate,
    sampleData: presidentAgeRangeData,
  },
];

export const denebTemplateMap = denebTemplates.reduce<Record<string, DenebTemplateGalleryItem>>(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {},
);
