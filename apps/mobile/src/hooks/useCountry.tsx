import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import {
  ALL_COUNTRY_CODES, COUNTRIES, DEFAULT_COUNTRY, isCountryCode,
  type CountryCode, type CountryConfig, type CountryListItem,
} from '@fixli/shared';
import * as api from '../services/api';

const STORAGE_KEY = '@fixli/country';

// Used until (or if) the server list can't be fetched. Only the launch country is open.
const BUNDLED: CountryListItem[] = ALL_COUNTRY_CODES.map((c) => ({ ...COUNTRIES[c], enabled: c === DEFAULT_COUNTRY }));

interface CountryContextValue {
  /** Countries where signup is currently open (the picker's options). */
  countries: CountryListItem[];
  country: CountryCode;
  config: CountryConfig;
  setCountry: (c: CountryCode) => void;
}

const CountryContext = createContext<CountryContextValue | null>(null);

/** Pure so it can be tested: saved choice > device region > default, restricted to open countries. */
export function pickCountry(open: CountryCode[], saved: string | null, deviceRegion: string | null | undefined): CountryCode {
  const candidates = [saved, deviceRegion?.toUpperCase()];
  for (const c of candidates) {
    if (c && isCountryCode(c) && open.includes(c)) return c;
  }
  return open.includes(DEFAULT_COUNTRY) ? DEFAULT_COUNTRY : open[0] ?? DEFAULT_COUNTRY;
}

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<CountryListItem[]>(BUNDLED);
  const [country, setCountryState] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [userChose, setUserChose] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
      const region = getLocales()[0]?.regionCode;
      let source = BUNDLED;
      try {
        source = await api.getCountries();
      } catch {
        // Offline on first launch: the bundled list (launch country only) is correct enough.
      }
      if (cancelled) return;
      setList(source);
      setCountryState(pickCountry(source.filter((c) => c.enabled).map((c) => c.code), saved, region));
    })();
    return () => { cancelled = true; };
  }, []);

  const setCountry = useCallback((c: CountryCode) => {
    setUserChose(true);
    setCountryState(c);
    AsyncStorage.setItem(STORAGE_KEY, c).catch(() => undefined);
  }, []);

  const value = useMemo<CountryContextValue>(
    () => ({ countries: list.filter((c) => c.enabled), country, config: COUNTRIES[country], setCountry }),
    [list, country, setCountry],
  );
  void userChose;
  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error('useCountry must be used within CountryProvider');
  return ctx;
}
