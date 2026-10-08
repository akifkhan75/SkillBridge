import { useEffect, useCallback, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useDraft<TFieldValues extends Record<string, any>>(
  formKey: string,
  form: UseFormReturn<TFieldValues>
) {
  const { watch, reset, getValues } = form;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isRestoring = useRef(false);

  // Auto-save logic (debounced)
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // Don't save if we are currently restoring from draft
      if (isRestoring.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          const currentValues = getValues();
          await AsyncStorage.setItem(`@draft_${formKey}`, JSON.stringify(currentValues));
          console.log(`[useDraft] Saved draft for ${formKey}`);
        } catch (error) {
          console.error(`[useDraft] Failed to save draft for ${formKey}`, error);
        }
      }, 1000); // 1s debounce
    });

    return () => subscription.unsubscribe();
  }, [watch, formKey, getValues]);

  // Restore logic
  const restoreDraft = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(`@draft_${formKey}`);
      if (saved) {
        isRestoring.current = true;
        const parsed = JSON.parse(saved);
        reset(parsed, { keepDefaultValues: true });
        console.log(`[useDraft] Restored draft for ${formKey}`);
        
        // Allow time for react-hook-form to re-render before enabling saves again
        setTimeout(() => {
          isRestoring.current = false;
        }, 100);
        return true;
      }
    } catch (error) {
      console.error(`[useDraft] Failed to restore draft for ${formKey}`, error);
    }
    return false;
  }, [formKey, reset]);

  // Clear draft
  const clearDraft = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(`@draft_${formKey}`);
      console.log(`[useDraft] Cleared draft for ${formKey}`);
    } catch (error) {
      console.error(`[useDraft] Failed to clear draft for ${formKey}`, error);
    }
  }, [formKey]);

  return { restoreDraft, clearDraft };
}
