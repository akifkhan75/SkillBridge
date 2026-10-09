// ============================================================
// Phone numbers: one implementation shared by the app (as-you-type masking) and the API
// (validation + normalisation), so what the user sees accepted is what the server accepts.
// Numbers are stored only as E.164 (e.g. +923001234567).
// ============================================================

import {
  AsYouType,
  getExampleNumber,
  parsePhoneNumberFromString,
  type CountryCode as LibCountry,
} from 'libphonenumber-js/mobile';
import examples from 'libphonenumber-js/mobile/examples';
import { COUNTRIES, type CountryCode } from './countries';

export type PhoneErrorCode = 'EMPTY' | 'TOO_SHORT' | 'TOO_LONG' | 'INVALID' | 'NOT_MOBILE' | 'WRONG_COUNTRY';

export interface PhoneParseResult {
  ok: boolean;
  /** E.164, only when ok */
  e164?: string;
  country?: CountryCode;
  /** National-format display, e.g. "0300 1234567" */
  national?: string;
  error?: PhoneErrorCode;
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');

/**
 * Normalise Arabic-Indic (٠-٩) and Persian/Urdu (۰-۹) digits to Latin so a user typing in
 * an Urdu/Arabic keyboard produces the same number.
 */
export function toLatinDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Parse what a user typed or pasted. `country` is the country selected in the UI; a number
 * pasted with an explicit "+" or "00" prefix is interpreted by its own country code.
 * With `requireCountry`, a number from a different country is rejected (server signup).
 */
export function parsePhone(
  raw: string,
  country: CountryCode,
  opts: { requireCountry?: boolean } = {},
): PhoneParseResult {
  const cleaned = toLatinDigits(raw ?? '').trim();
  if (!digitsOnly(cleaned)) return { ok: false, error: 'EMPTY' };

  const international = cleaned.startsWith('+') || cleaned.startsWith('00');
  const text = cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned;
  const parsed = international
    ? parsePhoneNumberFromString(text)
    : parsePhoneNumberFromString(text, country as LibCountry);

  if (!parsed) return { ok: false, error: digitsOnly(cleaned).length < 6 ? 'TOO_SHORT' : 'INVALID' };

  const detected = parsed.country as CountryCode | undefined;
  if (opts.requireCountry && detected !== country) return { ok: false, error: 'WRONG_COUNTRY' };

  if (!parsed.isPossible()) {
    return { ok: false, country: detected, error: digitsOnly(parsed.nationalNumber).length < 8 ? 'TOO_SHORT' : 'TOO_LONG' };
  }
  if (!parsed.isValid()) return { ok: false, country: detected, error: 'INVALID' };

  const type = parsed.getType();
  if (type && type !== 'MOBILE' && type !== 'FIXED_LINE_OR_MOBILE') {
    return { ok: false, country: detected, error: 'NOT_MOBILE' };
  }

  return {
    ok: true,
    e164: parsed.number,
    country: detected,
    national: parsed.formatNational(),
  };
}

/** Format as the user types, for the selected country. Returns national format without the dial code. */
export function formatAsYouType(input: string, country: CountryCode): string {
  const latin = toLatinDigits(input).replace(/[^\d+]/g, '');
  const f = new AsYouType(country as LibCountry);
  return f.input(latin);
}

/** A realistic example for the placeholder, e.g. "0300 1234567" for Pakistan. */
export function examplePhone(country: CountryCode): string {
  return getExampleNumber(country as LibCountry, examples)?.formatNational() ?? '';
}

export function dialCodeOf(country: CountryCode): string {
  return `+${COUNTRIES[country].dialCode}`;
}

/** Plain-language message for the UI / API. */
export function phoneErrorMessage(code: PhoneErrorCode, country: CountryCode): string {
  const name = COUNTRIES[country].name;
  switch (code) {
    case 'EMPTY': return 'Enter your mobile number.';
    case 'TOO_SHORT': return `That number is too short for ${name}.`;
    case 'TOO_LONG': return `That number is too long for ${name}.`;
    case 'NOT_MOBILE': return 'Please use a mobile number, not a landline.';
    case 'WRONG_COUNTRY': return `That is not a ${name} number. Check the country.`;
    default: return `We couldn't recognise that number. Check the digits for ${name}.`;
  }
}

/** Best guess of which supported country a pasted international number belongs to. */
export function countryFromE164(e164: string): CountryCode | undefined {
  const p = parsePhoneNumberFromString(e164);
  const c = p?.country as CountryCode | undefined;
  return c && c in COUNTRIES ? c : undefined;
}

/** "+923001234567" -> "+92 300 1234567" for showing a stored number back to the user. */
export function formatPhoneDisplay(e164?: string | null): string {
  if (!e164) return '';
  return parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;
}
