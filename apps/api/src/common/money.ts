/** Integer minor units + ISO currency -> "Rs 1,500" in the reader's language. Mirrors the app's formatMoney. */
export function formatMoney(minor: number, currency: string, locale = 'en'): string {
  try {
    const digits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
    return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: digits }).format(minor / 10 ** digits);
  } catch {
    return `${currency} ${minor}`;
  }
}
