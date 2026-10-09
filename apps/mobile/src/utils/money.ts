/**
 * Money is stored as integer minor units plus an ISO currency. This is the only place that turns
 * it into text, using the currency's own number of decimals (PKR 2, JPY 0, KWD 3).
 */
export function formatMoney(minor: number, currency: string, locale = 'en'): string {
  const probe = new Intl.NumberFormat(locale, { style: 'currency', currency });
  const digits = probe.resolvedOptions().maximumFractionDigits ?? 2;
  const major = minor / 10 ** digits;
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: digits,
  }).format(major);
}

/** "1500" typed by a user -> 150000 minor units. Returns null for anything that is not a plain positive amount. */
export function parseMajorToMinor(input: string, currency: string): number | null {
  const cleaned = input.replace(/[,\s]/g, '');
  if (!/^\d+(\.\d{1,3})?$/.test(cleaned)) return null;
  const digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  const minor = Math.round(parseFloat(cleaned) * 10 ** digits);
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}
