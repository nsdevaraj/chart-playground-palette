export interface AggridTemplate {
  name: string;
  description: string;
  version: string;
  metadata: {
    name: string;
    author: string;
    tags: string[];
    license: string;
  };
  columnDefs: Record<string, unknown>[];
  defaultColDef?: Record<string, unknown>;
}

export interface AggridTemplateGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  template: AggridTemplate;
}

const basicGridTemplate: AggridTemplate = {
  name: "Basic Grid",
  description: "Basic data grid with standard columns",
  version: "1.0.0",
  metadata: {
    name: "Basic Grid",
    author: "ChartStudio",
    tags: ["aggrid", "grid", "table"],
    license: "MIT",
  },
  columnDefs: [
    { field: "name", headerName: "Name", width: 150 },
    { field: "value", headerName: "Value", width: 100 },
    { field: "date", headerName: "Date", width: 120 },
  ],
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
  },
};

const advancedGridTemplate: AggridTemplate = {
  name: "Advanced Grid",
  description: "Advanced grid with grouping and aggregation",
  version: "1.0.0",
  metadata: {
    name: "Advanced Grid",
    author: "ChartStudio",
    tags: ["aggrid", "grid", "advanced"],
    license: "MIT",
  },
  columnDefs: [
    { field: "category", headerName: "Category", width: 150, rowGroup: true },
    { field: "name", headerName: "Name", width: 150 },
    { field: "value", headerName: "Value", width: 100, aggFunc: "sum" },
  ],
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
  },
};

export const aggridTemplates: AggridTemplateGalleryItem[] = [
  {
    id: "aggrid-basic",
    title: "Basic Grid",
    description: "Simple data grid for displaying tabular data",
    category: "Tables",
    tags: ["grid", "table", "basic", "aggrid"],
    template: basicGridTemplate,
  },
  {
    id: "aggrid-advanced",
    title: "Advanced Grid",
    description: "Advanced grid with grouping and aggregation features",
    category: "Tables",
    tags: ["grid", "table", "advanced", "aggrid"],
    template: advancedGridTemplate,
  },
];
