import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import { getLocale, setLocale, t, SupportedLocale, isRTL } from '../i18n';

interface I18nContextType {
  locale: SupportedLocale;
  setLanguage: (lang: SupportedLocale) => Promise<void>;
  t: (key: string) => string;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(getLocale());

  const setLanguage = async (lang: SupportedLocale) => {
    setLocale(lang);
    setLocaleState(lang);
    
    const rtl = isRTL();
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
      // RTL changes require app reload in React Native to layout correctly
      if (!__DEV__) {
        await Updates.reloadAsync();
      }
    }
  };

  return (
    <I18nContext.Provider value={{ locale, setLanguage, t, isRtl: isRTL() }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
