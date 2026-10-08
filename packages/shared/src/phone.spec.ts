import { parsePhone, formatAsYouType, examplePhone, toLatinDigits, countryFromE164 } from './phone';
import { ALL_COUNTRY_CODES } from './countries';

describe('parsePhone', () => {
  it.each([
    ['PK', '0300 1234567', '+923001234567'],
    ['PK', '300-1234567', '+923001234567'],
    ['PK', '+92 300 1234567', '+923001234567'],
    ['PK', '00923001234567', '+923001234567'],
    ['IN', '98765 43210', '+919876543210'],
    ['AE', '050 123 4567', '+971501234567'],
    ['SA', '0512345678', '+966512345678'],
    ['BD', '01712 345678', '+8801712345678'],
  ] as const)('%s: "%s" -> %s', (country, raw, e164) => {
    const r = parsePhone(raw, country);
    expect(r.ok).toBe(true);
    expect(r.e164).toBe(e164);
  });

  it('accepts Urdu/Arabic-Indic digits', () => {
    expect(toLatinDigits('۰۳۰۰۱۲۳۴۵۶۷')).toBe('03001234567');
    expect(parsePhone('۰۳۰۰ ۱۲۳۴۵۶۷', 'PK').e164).toBe('+923001234567');
    expect(parsePhone('٠٥٠ ١٢٣ ٤٥٦٧', 'AE').e164).toBe('+971501234567');
  });

  it('rejects too short, too long, empty, and nonsense', () => {
    expect(parsePhone('', 'PK')).toMatchObject({ ok: false, error: 'EMPTY' });
    expect(parsePhone('0300 12', 'PK').ok).toBe(false);
    expect(parsePhone('0300 1234567890123', 'PK').ok).toBe(false);
    expect(parsePhone('abcdef', 'PK').ok).toBe(false);
    expect(parsePhone('0000 0000000', 'PK').ok).toBe(false);
  });

  it('rejects a landline', () => {
    const r = parsePhone('021 34567890', 'PK');
    expect(r.ok).toBe(false);
    expect(['NOT_MOBILE', 'INVALID']).toContain(r.error);
  });

  it('requireCountry rejects a number from another country (server signup)', () => {
    expect(parsePhone('+919876543210', 'PK', { requireCountry: true })).toMatchObject({ ok: false, error: 'WRONG_COUNTRY' });
    expect(parsePhone('+919876543210', 'PK').country).toBe('IN');
  });

  it('is idempotent on its own output', () => {
    const once = parsePhone('0300 1234567', 'PK');
    expect(parsePhone(once.e164!, 'PK', { requireCountry: true }).e164).toBe(once.e164);
  });
});

describe('formatAsYouType', () => {
  it('formats progressively for Pakistan', () => {
    expect(formatAsYouType('0300', 'PK')).toBe('0300');
    expect(formatAsYouType('03001234567', 'PK')).toBe('0300 1234567');
  });
  it('strips letters and symbols', () => {
    expect(formatAsYouType('03a00-12(34)567', 'PK')).toBe('0300 1234567');
  });
  it('formats Arabic-Indic input', () => {
    expect(formatAsYouType('٠٣٠٠١٢٣٤٥٦٧', 'PK')).toBe('0300 1234567');
  });
});

describe('examples & detection', () => {
  it.each(ALL_COUNTRY_CODES)('%s has a placeholder that parses', (c) => {
    const ex = examplePhone(c);
    expect(ex).not.toBe('');
    expect(parsePhone(ex, c).ok).toBe(true);
  });
  it('detects country from a full number', () => {
    expect(countryFromE164('+923001234567')).toBe('PK');
    expect(countryFromE164('+971501234567')).toBe('AE');
    expect(countryFromE164('+14155550123')).toBeUndefined();
  });
});
