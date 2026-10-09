// ============================================================
// Country reference data. Country-specific behaviour is configuration, never code
// (doc 17 / doc 22 §11.3a). Which countries are *enabled* for signup is decided by the
// server (ENABLED_COUNTRIES), not here: a country may exist here before it may launch.
// ============================================================

export type CountryCode = 'PK' | 'IN' | 'AE' | 'SA' | 'BD';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  nativeName: string;
  flag: string;
  /** E.164 dial prefix without "+" */
  dialCode: string;
  currency: { code: string; exponent: number };
  /** Supported UI languages, first is the default for this country. */
  locales: ('en' | 'ar' | 'ur')[];
  /** IANA zone used for working hours */
  timezone: string;
  /** 0 = Sunday ... 6 = Saturday */
  weekendDays: number[];
  /** Verified before launch (doc 17: never hard-code globally). Shown in the SOS flow. */
  emergencyNumbers: { label: string; number: string }[];
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  PK: {
    code: 'PK', timezone: 'Asia/Karachi', name: 'Pakistan', nativeName: 'پاکستان', flag: '🇵🇰', dialCode: '92',
    currency: { code: 'PKR', exponent: 2 }, locales: ['ur', 'en'], weekendDays: [0],
    emergencyNumbers: [{ label: 'Police', number: '15' }, { label: 'Rescue', number: '1122' }],
  },
  IN: {
    code: 'IN', timezone: 'Asia/Kolkata', name: 'India', nativeName: 'भारत', flag: '🇮🇳', dialCode: '91',
    currency: { code: 'INR', exponent: 2 }, locales: ['en'], weekendDays: [0],
    emergencyNumbers: [{ label: 'Emergency', number: '112' }],
  },
  AE: {
    code: 'AE', timezone: 'Asia/Dubai', name: 'United Arab Emirates', nativeName: 'الإمارات', flag: '🇦🇪', dialCode: '971',
    currency: { code: 'AED', exponent: 2 }, locales: ['ar', 'en'], weekendDays: [0, 6],
    emergencyNumbers: [{ label: 'Police', number: '999' }, { label: 'Ambulance', number: '998' }, { label: 'Fire', number: '997' }],
  },
  SA: {
    code: 'SA', timezone: 'Asia/Riyadh', name: 'Saudi Arabia', nativeName: 'السعودية', flag: '🇸🇦', dialCode: '966',
    currency: { code: 'SAR', exponent: 2 }, locales: ['ar', 'en'], weekendDays: [5, 6],
    emergencyNumbers: [{ label: 'Police', number: '911' }, { label: 'Ambulance', number: '997' }],
  },
  BD: {
    code: 'BD', timezone: 'Asia/Dhaka', name: 'Bangladesh', nativeName: 'বাংলাদেশ', flag: '🇧🇩', dialCode: '880',
    currency: { code: 'BDT', exponent: 2 }, locales: ['en'], weekendDays: [5, 6],
    emergencyNumbers: [{ label: 'Emergency', number: '999' }],
  },
};

export const ALL_COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];
export const DEFAULT_COUNTRY: CountryCode = 'PK';

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && value in COUNTRIES;
}

/** What the API returns from GET /config/countries. */
export interface CountryListItem extends CountryConfig {
  enabled: boolean;
}
