
import { en } from './en';
import { ar } from './ar';
import { ur } from './ur';
import type { Translations } from './en';

export type LanguageCode = 'en' | 'ar' | 'ur';

export const translations: Record<LanguageCode, Translations> = {
  en,
  ar,
  ur,
};

export const DIRS: Record<LanguageCode, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
  ur: 'rtl',
};

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
    en: "English",
    ar: "العربية",
    ur: "اردو",
}
