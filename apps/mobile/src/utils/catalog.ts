import type { SupportedLocale } from '../i18n';

export interface Translatable {
  name: string;
  translations?: Record<string, { name?: string; description?: string }> | null;
}

/** Name in the user's language, falling back to the English name stored on the row. */
export function localizedName(item: Translatable, locale: SupportedLocale): string {
  return (locale !== 'en' && item.translations?.[locale]?.name) || item.name;
}

/** Category codes like APPLIANCE_REPAIR as a readable fallback when there is no translation. */
export function humanize(code: string): string {
  return code.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}
