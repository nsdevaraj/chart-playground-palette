/**
 * React Hook for Deneb Template Management
 * 
 * Provides state management and utilities for loading and rendering Deneb templates
 */

import { useState, useCallback, useEffect } from 'react';
import {
  DenebTemplate,
  VegaLiteSpec,
  ValidationResult,
} from '@/lib/deneb/types';
import {
  loadTemplateFromJSON,
  loadTemplateFromURL,
  loadTemplateFromBase64,
  loadTemplateFromObject,
  getVegaLiteSpec,
} from '@/lib/deneb/loader';
import { validateDenebTemplate, validateRequiredFields } from '@/lib/deneb/validation';
import {
  bindDataToTemplate,
  mergeDataWithTemplate,
} from '@/lib/deneb/data';
import {
  generateHTMLFromTemplate,
  generateIFrameHTML,
  createTemplatePreviewHTML,
} from '@/lib/deneb/renderer';

interface UseDenebTemplateState {
  template: DenebTemplate | null;
  data: Record<string, unknown>[] | unknown;
  loading: boolean;
  error: string | null;
  validationResult: ValidationResult | null;
}

interface UseDenebTemplateActions {
  loadFromJSON: (json: string) => Promise<void>;
  loadFromURL: (url: string) => Promise<void>;
  loadFromBase64: (base64: string) => void;
  loadFromObject: (obj: unknown) => void;
  setTemplate: (template: DenebTemplate | null) => void;
  setData: (data: Record<string, unknown>[] | unknown) => void;
  validate: () => ValidationResult;
  clearError: () => void;
  reset: () => void;
  getSpec: () => VegaLiteSpec | null;
  getHTML: (
    options?: {
      containerId?: string;
      width?: number | string;
      height?: number | string;
    }
  ) => string;
  getIFrameHTML: () => string;
  getPreviewHTML: () => string;
}

/**
 * Hook for managing Deneb templates
 */
export const useDenebTemplate = (
  initialTemplate?: DenebTemplate | null
): UseDenebTemplateState & UseDenebTemplateActions => {
  const [template, setTemplate] = useState<DenebTemplate | null>(initialTemplate || null);
  const [data, setData] = useState<Record<string, unknown>[] | unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadFromJSON = useCallback(async (json: string) => {
    setLoading(true);
    setError(null);
    try {
      const loaded = loadTemplateFromJSON(json);
      if (!loaded) {
        setError('Failed to parse JSON');
        setLoading(false);
        return;
      }
      setTemplate(loaded);
      const validation = validateDenebTemplate(loaded);
      setValidationResult(validation);
      if (!validation.valid) {
        setError(validation.errors.join('; '));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFromURL = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await loadTemplateFromURL(url);
      if (!loaded) {
        setError('Failed to load template from URL');
        setLoading(false);
        return;
      }
      setTemplate(loaded);
      const validation = validateDenebTemplate(loaded);
      setValidationResult(validation);
      if (!validation.valid) {
        setError(validation.errors.join('; '));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFromBase64 = useCallback((base64: string) => {
    setLoading(true);
    setError(null);
    try {
      const loaded = loadTemplateFromBase64(base64);
      if (!loaded) {
        setError('Failed to decode Base64 template');
        setLoading(false);
        return;
      }
      setTemplate(loaded);
      const validation = validateDenebTemplate(loaded);
      setValidationResult(validation);
      if (!validation.valid) {
        setError(validation.errors.join('; '));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFromObjectHandler = useCallback((obj: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const loaded = loadTemplateFromObject(obj);
      if (!loaded) {
        setError('Invalid template object');
        setLoading(false);
        return;
      }
      setTemplate(loaded);
      const validation = validateDenebTemplate(loaded);
      setValidationResult(validation);
      if (!validation.valid) {
        setError(validation.errors.join('; '));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const validate = useCallback(() => {
    if (!template) {
      const result: ValidationResult = {
        valid: false,
        errors: ['No template loaded'],
        warnings: [],
        metadata: {},
      };
      setValidationResult(result);
      return result;
    }

    const result = validateDenebTemplate(template);
    setValidationResult(result);
    return result;
  }, [template]);

  const reset = useCallback(() => {
    setTemplate(initialTemplate || null);
    setData(null);
    setError(null);
    setValidationResult(null);
  }, [initialTemplate]);

  const getSpec = useCallback((): VegaLiteSpec | null => {
    if (!template) return null;

    if (data) {
      const updatedTemplate = mergeDataWithTemplate(template, Array.isArray(data) ? data : [data]);
      return getVegaLiteSpec(updatedTemplate);
    }

    return getVegaLiteSpec(template);
  }, [template, data]);

  const getHTML = useCallback(
    (options?: {
      containerId?: string;
      width?: number | string;
      height?: number | string;
    }) => {
      if (!template) return '<div>No template loaded</div>';

      const templateToUse = data
        ? mergeDataWithTemplate(template, Array.isArray(data) ? data : [data])
        : template;

      return generateHTMLFromTemplate(templateToUse, options);
    },
    [template, data]
  );

  const getIFrameHTML = useCallback(() => {
    if (!template) return '<div>No template loaded</div>';

    const templateToUse = data
      ? mergeDataWithTemplate(template, Array.isArray(data) ? data : [data])
      : template;

    return generateIFrameHTML(templateToUse, data);
  }, [template, data]);

  const getPreviewHTML = useCallback(() => {
    if (!template) return '<div>No template loaded</div>';

    const templateToUse = data
      ? mergeDataWithTemplate(template, Array.isArray(data) ? data : [data])
      : template;

    return createTemplatePreviewHTML(templateToUse, data);
  }, [template, data]);

  return {
    template,
    data,
    loading,
    error,
    validationResult,
    loadFromJSON,
    loadFromURL,
    loadFromBase64,
    loadFromObject: loadFromObjectHandler,
    setTemplate,
    setData,
    validate,
    clearError,
    reset,
    getSpec,
    getHTML,
    getIFrameHTML,
    getPreviewHTML,
  };
};
