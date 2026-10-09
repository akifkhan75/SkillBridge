import { useCallback, useMemo, useState } from 'react';
import {
  countryFromE164, formatAsYouType, parsePhone, phoneErrorMessage,
  type CountryCode, type PhoneParseResult,
} from '@fixli/shared';

/**
 * Masked phone state for one field. The text is formatted for the selected country as the user
 * types; a pasted international number ("+971…") switches to its own country when that country
 * is open. Errors are only shown after the user leaves the field or submits (doc 21 §10.5).
 */
export function usePhoneInput(
  country: CountryCode,
  setCountry: (c: CountryCode) => void,
  openCountries: CountryCode[],
) {
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);

  const onChangeText = useCallback(
    (raw: string) => {
      if (raw.trim().startsWith('+') || raw.trim().startsWith('00')) {
        const parsed = parsePhone(raw, country);
        const detected = parsed.country ?? (parsed.e164 ? countryFromE164(parsed.e164) : undefined);
        if (parsed.ok && detected && detected !== country && openCountries.includes(detected)) {
          setCountry(detected);
          setText(parsed.national ?? raw);
          return;
        }
      }
      setText(formatAsYouType(raw, country));
    },
    [country, setCountry, openCountries],
  );

  // Changing country reformats whatever is already typed.
  const reformatFor = useCallback((next: CountryCode) => setText((t) => formatAsYouType(t, next)), []);

  const result: PhoneParseResult = useMemo(() => parsePhone(text, country, { requireCountry: false }), [text, country]);
  const error = touched && !result.ok && result.error ? phoneErrorMessage(result.error, country) : undefined;

  return {
    text,
    onChangeText,
    onBlur: () => setTouched(true),
    touch: () => setTouched(true),
    reformatFor,
    result,
    isValid: result.ok,
    error,
  };
}
