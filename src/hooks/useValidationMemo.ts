import { useMemo, useCallback } from 'react';
import { ValidationWarning } from '../types/attestation';
import { validateProjectField } from '../utils/projectValidation';

interface ValidationCache {
  [key: string]: ValidationWarning[];
}

export const useValidationMemo = () => {
  const validationCache: ValidationCache = useMemo(() => ({}), []);

  const validateFieldMemo = useCallback(async (
    field: string, 
    value: string, 
    isBulkImport: boolean = false
  ): Promise<ValidationWarning[]> => {
    if (!value.trim()) return [];
    
    const cacheKey = `${field}:${value}:${isBulkImport}`;
    
    if (validationCache[cacheKey]) {
      return validationCache[cacheKey];
    }

    const result = await validateProjectField(field, value, isBulkImport);
    validationCache[cacheKey] = result;
    
    return result;
  }, [validationCache]);

  const clearCache = useCallback(() => {
    Object.keys(validationCache).forEach(key => {
      delete validationCache[key];
    });
  }, [validationCache]);

  return { validateFieldMemo, clearCache };
};

export default useValidationMemo;