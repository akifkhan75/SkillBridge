import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { getTheme, ThemeMode } from '../theme';

export function useTheme() {
  const systemScheme = useColorScheme();
  
  // Later we can integrate a user override from Redux/AsyncStorage here
  const currentMode: ThemeMode = systemScheme === 'light' ? 'light' : 'dark';

  return useMemo(() => {
    return {
      ...getTheme(currentMode),
      mode: currentMode,
    };
  }, [currentMode]);
}
