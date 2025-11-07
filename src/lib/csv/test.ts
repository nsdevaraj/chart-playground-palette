/**
 * CSV Module Test
 * 
 * Simple test to verify CSV parsing and mapping functionality
 */

import { parseCSV, detectSchema, processCSVForTemplate } from './index';

// Test CSV content
const testCSV = `name,value,category,date
Product A,100,Electronics,2024-01-15
Product B,150,Clothing,2024-01-16
Product C,75,Electronics,2024-01-17
Product D,200,Books,2024-01-18`;

// Simple test template
const testTemplate = {
  name: "Test Template",
  vegaLite: {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { values: [] },
    mark: "bar",
    encoding: {
      x: { field: "name", type: "nominal" },
      y: { field: "value", type: "quantitative" },
      color: { field: "category", type: "nominal" }
    }
  }
};

// Test parsing
export const testCSVFunctionality = () => {
  console.log('Testing CSV functionality...');
  
  try {
    // Test basic parsing
    const parseResult = parseCSV(testCSV);
    console.log('Parse result:', parseResult);
    
    // Test schema detection
    const schema = detectSchema(parseResult);
    console.log('Detected schema:', schema);
    
    // Test full processing
    processCSVForTemplate(testCSV, testTemplate).then(result => {
      console.log('Processing result:', result);
    });
    
    console.log('CSV functionality test completed successfully');
    return true;
  } catch (error) {
    console.error('CSV functionality test failed:', error);
    return false;
  }
};

// Export for manual testing
export { testCSV, testTemplate };