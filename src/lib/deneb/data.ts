/**
 * Deneb Data Utilities
 * 
 * Provides functionality for:
 * - Binding data to templates
 * - Transforming data for templates
 * - Merging data with template specifications
 */

import { DenebTemplate, VegaLiteSpec, DataBinding } from './types';
import { getVegaLiteSpec } from './loader';

/**
 * Binds data to a Deneb template
 * Updates the data field in the Vega-Lite specification
 */
export const bindDataToTemplate = (
  template: DenebTemplate,
  data: Record<string, unknown>[] | unknown
): DenebTemplate => {
  const updated = { ...template };
  const vegaSpec = getVegaLiteSpec(template);

  if (vegaSpec) {
    const newSpec = { ...vegaSpec } as Record<string, unknown>;
    
    if (Array.isArray(data)) {
      newSpec.data = { values: data };
    } else if (typeof data === 'object') {
      newSpec.data = data;
    }

    updated.vegaLite = newSpec as VegaLiteSpec;
  }

  return updated;
};

/**
 * Transforms data according to Vega-Lite transform rules
 */
export const transformDataForTemplate = (
  data: Record<string, unknown>[],
  transforms?: unknown[]
): Record<string, unknown>[] => {
  if (!transforms || transforms.length === 0) {
    return data;
  }

  let transformedData = [...data];

  // Process each transform
  (transforms as Record<string, unknown>[]).forEach((transform) => {
    if (typeof transform !== 'object' || !transform) return;

    const t = transform as Record<string, unknown>;

    // Handle filter transform
    if (t.filter) {
      transformedData = applyFilter(transformedData, t.filter);
    }

    // Handle aggregate transform
    if (t.aggregate) {
      transformedData = applyAggregate(
        transformedData,
        t.aggregate as unknown[],
        t.groupby as string[]
      );
    }

    // Handle calculate transform
    if (t.calculate) {
      transformedData = applyCalculate(
        transformedData,
        t.calculate as string,
        t.as as string
      );
    }

    // Handle sort transform
    if (t.sort) {
      transformedData = applySortTransform(
        transformedData,
        t.sort as Record<string, unknown>
      );
    }
  });

  return transformedData;
};

/**
 * Applies filter to data
 */
const applyFilter = (
  data: Record<string, unknown>[],
  filter: unknown
): Record<string, unknown>[] => {
  if (typeof filter !== 'string') return data;

  // Simple filter implementation
  // In production, this would need a full Vega expression parser
  return data.filter((row) => {
    try {
      // Basic field comparison support
      const matches = evaluateFilterExpression(filter, row);
      return matches;
    } catch {
      return true;
    }
  });
};

/**
 * Evaluates a simple filter expression
 */
const evaluateFilterExpression = (
  expression: string,
  row: Record<string, unknown>
): boolean => {
  // Simple regex for basic comparisons like "field > value"
  const match = expression.match(/(\w+)\s*([><=!]+)\s*(.+)/);
  if (!match) return true;

  const [, field, operator, value] = match;
  const fieldValue = row[field];

  if (fieldValue === undefined) return true;

  try {
    const compareValue = isNaN(Number(value)) ? value : Number(value);

    switch (operator) {
      case '>':
        return (fieldValue as number) > (compareValue as number);
      case '<':
        return (fieldValue as number) < (compareValue as number);
      case '>=':
        return (fieldValue as number) >= (compareValue as number);
      case '<=':
        return (fieldValue as number) <= (compareValue as number);
      case '==':
      case '=':
        return fieldValue === compareValue || String(fieldValue) === String(compareValue);
      case '!=':
      case '<>':
        return fieldValue !== compareValue && String(fieldValue) !== String(compareValue);
      default:
        return true;
    }
  } catch {
    return true;
  }
};

/**
 * Applies aggregate transform
 */
const applyAggregate = (
  data: Record<string, unknown>[],
  aggregates: unknown[],
  groupby?: string[]
): Record<string, unknown>[] => {
  if (!aggregates || aggregates.length === 0) return data;

  const grouped: Map<string, Record<string, unknown>[]> = new Map();

  // Group data
  data.forEach((row) => {
    const key = groupby && groupby.length > 0
      ? groupby.map((field) => row[field]).join('|')
      : 'all';

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(row);
  });

  // Aggregate each group
  const result: Record<string, unknown>[] = [];

  grouped.forEach((group, key) => {
    const aggregated: Record<string, unknown> = {};

    // Add groupby fields
    if (groupby && groupby.length > 0) {
      const groupValues = key.split('|');
      groupby.forEach((field, i) => {
        aggregated[field] = groupValues[i];
      });
    }

    // Apply aggregates
    (aggregates as Record<string, unknown>[]).forEach((agg) => {
      if (typeof agg === 'object' && agg !== null) {
        const aggRecord = agg as Record<string, unknown>;
        const op = aggRecord.op as string;
        const field = aggRecord.field as string;
        const as = aggRecord.as as string;

        aggregated[as || field] = applyAggregateOperation(op, group, field);
      }
    });

    result.push(aggregated);
  });

  return result;
};

/**
 * Applies aggregation operation
 */
const applyAggregateOperation = (
  op: string,
  data: Record<string, unknown>[],
  field: string
): unknown => {
  const values = data.map((row) => row[field]);

  switch (op) {
    case 'sum':
      return values.reduce((a, b) => (a as number) + (b as number), 0);
    case 'mean':
    case 'average':
      return values.length > 0
        ? (values.reduce((a, b) => (a as number) + (b as number), 0) as number) /
          values.length
        : 0;
    case 'count':
      return values.length;
    case 'min':
      return Math.min(...(values as number[]));
    case 'max':
      return Math.max(...(values as number[]));
    case 'distinct':
      return new Set(values).size;
    default:
      return null;
  }
};

/**
 * Applies calculate transform
 */
const applyCalculate = (
  data: Record<string, unknown>[],
  expression: string,
  fieldName: string
): Record<string, unknown>[] => {
  return data.map((row) => {
    try {
      const value = evaluateExpression(expression, row);
      return { ...row, [fieldName]: value };
    } catch {
      return row;
    }
  });
};

/**
 * Evaluates a simple expression with field references
 */
const evaluateExpression = (
  expression: string,
  row: Record<string, unknown>
): unknown => {
  // Replace field references with values
  let expr = expression;

  // Find all field references (word characters between quotes or without)
  const fieldPattern = /\b(\w+)\b/g;
  expr = expr.replace(fieldPattern, (match) => {
    const value = row[match];
    if (value === undefined) return match;
    return typeof value === 'string' ? `"${value}"` : String(value);
  });

  // Evaluate the expression
  try {
    return Function('"use strict"; return (' + expr + ')')();
  } catch {
    return null;
  }
};

/**
 * Applies sort transform
 */
const applySortTransform = (
  data: Record<string, unknown>[],
  sort: Record<string, unknown>
): Record<string, unknown>[] => {
  const field = sort.field as string;
  const order = (sort.order as string) || 'ascending';

  if (!field) return data;

  const sorted = [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === undefined || bVal === undefined) return 0;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'descending' ? bVal - aVal : aVal - bVal;
    }

    const aStr = String(aVal);
    const bStr = String(bVal);
    return order === 'descending'
      ? bStr.localeCompare(aStr)
      : aStr.localeCompare(bStr);
  });

  return sorted;
};

/**
 * Merges data with template, applying all transforms
 */
export const mergeDataWithTemplate = (
  template: DenebTemplate,
  data: Record<string, unknown>[]
): DenebTemplate => {
  const vegaSpec = getVegaLiteSpec(template);
  if (!vegaSpec) return template;

  // Transform data if there are transforms in the spec
  let transformedData = data;
  const transforms = vegaSpec.transform as unknown[] | undefined;
  if (transforms && transforms.length > 0) {
    transformedData = transformDataForTemplate(data, transforms);
  }

  // Bind transformed data to template
  return bindDataToTemplate(template, transformedData);
};

/**
 * Maps data columns to Vega-Lite encoding channels
 */
export const mapDataColumnsToEncoding = (
  dataColumns: string[],
  suggestions?: Partial<Record<string, string>>
): Record<string, unknown> => {
  const encoding: Record<string, unknown> = {};

  dataColumns.forEach((column, index) => {
    // Use suggestions if available
    if (suggestions && suggestions[column]) {
      encoding[suggestions[column]] = {
        field: column,
        type: inferColumnType(column),
      };
      return;
    }

    // Auto-assign based on position and type
    if (index === 0) {
      encoding.x = { field: column, type: 'nominal' };
    } else if (index === 1) {
      encoding.y = { field: column, type: 'quantitative' };
    } else if (index === 2) {
      encoding.color = { field: column, type: 'nominal' };
    }
  });

  return encoding;
};

/**
 * Infers column type from column name
 */
const inferColumnType = (columnName: string): string => {
  const name = columnName.toLowerCase();

  if (
    name.includes('date') ||
    name.includes('time') ||
    name.includes('year') ||
    name.includes('month')
  ) {
    return 'temporal';
  }

  if (
    name.includes('count') ||
    name.includes('total') ||
    name.includes('value') ||
    name.includes('amount') ||
    name.includes('price') ||
    name.includes('sales')
  ) {
    return 'quantitative';
  }

  if (
    name.includes('id') ||
    name.includes('category') ||
    name.includes('name') ||
    name.includes('type') ||
    name.includes('status')
  ) {
    return 'nominal';
  }

  return 'nominal'; // Default to nominal
};

/**
 * Creates sample data based on data config
 */
export const generateSampleData = (
  count: number = 10
): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      category: String.fromCharCode(65 + (i % 5)), // A, B, C, D, E
      value: Math.floor(Math.random() * 100) + 50,
      date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      percentage: Math.floor(Math.random() * 100),
    });
  }

  return data;
};
