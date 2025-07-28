
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, DIRS, LanguageCode } from '../locales';
import type { Translations } from '../locales/en';

interface LocalizationContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: keyof Translations, options?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'appLanguage';

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  const setLanguage = async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
      setLanguageState(lang);
      const isRTL = DIRS[lang] === 'rtl';
      if (I18nManager.isRTL !== isRTL) {
          I18nManager.forceRTL(isRTL);
          // You might need to restart the app for this to take full effect on all components
          // import RNRestart from 'react-native-restart'; RNRestart.Restart();
      }
    } catch (error) {
        console.error("Failed to save language setting.", error);
    }
  };

  useEffect(() => {
    const loadLanguage = async () => {
        try {
            const storedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null;
            if (storedLang && translations[storedLang]) {
                setLanguageState(storedLang);
            } else {
                // Device locale can be used here for initial setup
                // For simplicity, we default to English
                setLanguageState('en');
            }
        } catch (error) {
            console.error("Failed to load language setting.", error);
            setLanguageState('en');
        }
    };
    loadLanguage();
  }, []);

  const dir = DIRS[language];

  const t = useCallback((key: keyof Translations, options?: Record<string, string | number>): string => {
    const translationSet = translations[language] || translations.en;
    let translatedString = translationSet[key] || key.toString();

    if (options) {
      Object.keys(options).forEach(optionKey => {
        const regex = new RegExp(`{{${optionKey}}}`, 'g');
        translatedString = translatedString.replace(regex, String(options[optionKey]));
      });
    }
    return translatedString;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
