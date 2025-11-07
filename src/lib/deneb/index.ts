/**
 * Deneb Template Module - Main Export
 * 
 * This module provides comprehensive functionality for working with Deneb templates
 * including loading, validating, rendering, and integrating with the application.
 */

// Export types
export * from './types';

// Export validation utilities
export {
  validateDenebTemplate,
  validateDataAgainstConfig,
  validateRequiredFields,
} from './validation';

// Export loader utilities
export {
  loadTemplateFromJSON,
  loadTemplateFromObject,
  loadTemplateFromURL,
  loadTemplateFromBase64,
  normalizeTemplate,
  canLoadTemplate,
  getVegaLiteSpec,
  applyParametersToTemplate,
  extractDataFromTemplate,
  createSampleTemplate,
} from './loader';

// Export renderer utilities
export {
  generateHTMLFromTemplate,
  generateIFrameHTML,
  createTemplatePreviewHTML,
  createTemplateViewer,
} from './renderer';

// Export data utilities
export {
  bindDataToTemplate,
  transformDataForTemplate,
  mergeDataWithTemplate,
} from './data';
