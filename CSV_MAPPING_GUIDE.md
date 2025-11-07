# CSV Data Mapper for Deneb Templates

This guide explains how to use the CSV Data Mapper feature to map CSV data to Deneb templates in chart-playground-palette.

## Overview

The CSV Data Mapper allows you to:
- Upload CSV files with automatic delimiter detection
- Automatically detect data types and schema
- Map CSV columns to template fields with suggestions
- Preview mapped data before applying
- Validate data compatibility with templates

## Features

### CSV Parser
- **Automatic delimiter detection**: Supports comma, semicolon, tab, pipe, and colon delimiters
- **Header handling**: Automatically detects and processes header rows
- **Data type inference**: Automatically detects string, number, boolean, and date types
- **Error handling**: Comprehensive validation and error reporting
- **Multiple input methods**: File upload, drag-and-drop, or paste content

### Schema Detection
- **Type inference**: Analyzes data to determine column types
- **Statistical analysis**: Provides min, max, mean, unique counts
- **Null value handling**: Identifies and reports missing data
- **Sample values**: Shows representative values for each column

### Field Mapping
- **Template field extraction**: Automatically identifies required fields from Deneb templates
- **Smart suggestions**: Uses naming patterns and type matching
- **Manual mapping**: Override automatic suggestions
- **Data transforms**: Apply formatting and calculations
- **Validation**: Checks type compatibility and required fields

### Data Preview
- **Original data view**: See uploaded CSV data
- **Mapped data view**: Preview transformed data
- **Column statistics**: Detailed analysis of each column
- **Export options**: Download as CSV or JSON

## Usage

### 1. Access CSV Mapper
1. Navigate to any Deneb template in the editor
2. Click the "Map CSV Data" button in the Template Controls
3. The CSV mapper interface will open in a modal

### 2. Upload CSV Data
**Option A: File Upload**
- Click "Upload File" tab
- Drag and drop a CSV file or click to browse
- Supported formats: .csv files

**Option B: Paste Content**
- Click "Paste Content" tab
- Paste CSV data directly into the text area
- Click "Parse and Load CSV"

### 3. Map Fields
1. **Review suggestions**: The system will suggest mappings based on:
   - Column name similarity
   - Data type compatibility
   - Common field patterns

2. **Manual mapping**: Use dropdowns to select CSV columns for each template field

3. **Apply suggestions**: Click "Apply Suggestions" for automatic mapping

4. **Validate mappings**: Check for:
   - Required field coverage
   - Type compatibility
   - Duplicate mappings

### 4. Preview and Apply
1. **Preview data**: Switch to "Preview & Apply" step
2. **Review mapped data**: See how your CSV data will be used
3. **Apply to template**: Click "Apply to Template" to finalize

## CSV Format Requirements

### Supported Delimiters
- Comma (`,`) - Default
- Semicolon (`;`)
- Tab (`\t`)
- Pipe (`|`)
- Colon (`:`)

### Header Rows
- First row is automatically detected as headers
- Empty headers are auto-generated as "Column_N"
- Headers can be customized during mapping

### Data Types
- **Numbers**: Integers and decimals (e.g., `123`, `45.67`)
- **Strings**: Text values (e.g., `"Hello"`, `World`)
- **Booleans**: True/false values (e.g., `true`, `false`, `yes`, `no`)
- **Dates**: Various date formats (e.g., `2024-01-01`, `01/01/2024`)
- **Null values**: Empty cells are treated as null

### Quoting and Escaping
- Standard CSV quoting with double quotes (`"`)
- Escaped quotes: `""` for embedded quotes
- Automatic handling of complex values

## Template Field Types

### Quantitative Fields
- Expected numeric data
- Used for Y-axis, size, and measurements
- CSV columns should contain numbers

### Nominal Fields  
- Expected categorical data
- Used for X-axis categories, colors, and groups
- CSV columns should contain text or categories

### Temporal Fields
- Expected date/time data
- Used for time-series X-axis
- CSV columns should contain dates in recognized formats

## Best Practices

### CSV Preparation
1. **Clean headers**: Use descriptive, unique column names
2. **Consistent data**: Ensure each column has consistent data types
3. **Remove empty rows**: Delete unnecessary blank rows
4. **Standardize dates**: Use consistent date formats
5. **Check encoding**: Save as UTF-8 for special characters

### Mapping Strategy
1. **Start with suggestions**: Let the system auto-map fields
2. **Review critical fields**: Ensure required fields are mapped
3. **Check types**: Verify data type compatibility
4. **Test with sample**: Preview before applying to large datasets

### Common Patterns
- `x`, `category`, `label` → X-axis/nominal fields
- `y`, `value`, `amount`, `count` → Y-axis/quantitative fields  
- `color`, `group`, `segment` → Color/nominal fields
- `date`, `time`, `year` → Temporal fields
- `size`, `weight` → Size/quantitative fields

## Troubleshooting

### Common Issues
**"No valid rows could be parsed"**
- Check delimiter setting
- Verify CSV file isn't corrupted
- Ensure consistent column counts

**"Type mismatch" warnings**
- Review data type expectations
- Clean data to match expected types
- Consider data transformations

**"Required field not mapped"**
- Map all required template fields
- Check template data requirements
- Verify column names match

### Data Quality Tips
- Remove extra whitespace around values
- Standardize boolean representations
- Use consistent date formats
- Handle missing values appropriately

## Integration Examples

### Sales Data Example
```csv
region,quarter,revenue
North America,Q1,320
North America,Q2,360
Europe,Q1,280
Europe,Q2,300
```

### Customer Data Example
```csv
segment,satisfaction,spend,customers,region
Enterprise,88,420,120,Americas
Growth,75,210,340,Americas
SMB,68,140,510,Americas
```

### Time Series Example
```csv
date,metric,value
2024-01-01,Actual,38
2024-02-01,Actual,42
2024-01-01,Forecast,36
2024-02-01,Forecast,39
```

## Advanced Features

### Data Transformations
- **Format values**: Apply number formatting, percentages
- **Calculate expressions**: Create new fields from existing data
- **Filter data**: Include/exclude rows based on conditions

### Multiple Datasets
- Upload multiple CSV files
- Map each dataset independently
- Switch between datasets in templates

### Validation Rules
- Required field validation
- Data type checking
- Uniqueness constraints
- Custom validation rules

This CSV Data Mapper provides a comprehensive solution for integrating real-world data with Deneb visualization templates, making it easy to create dynamic, data-driven charts and dashboards.