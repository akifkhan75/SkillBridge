import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '../src/store';
import { useAppSelector } from '../src/hooks/useRedux';
import { selectCurrentUser } from '../src/store/authSlice';
import { socketService } from '../src/services/socket';
import { useWorkerLocationTracker } from '../src/hooks/useWorkerLocationTracker';
import { useCustomerLocationTracker } from '../src/hooks/useCustomerLocationTracker';

function SocketHandler() {
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser?.id) {
      socketService.connect(currentUser.id);
    } else {
      socketService.disconnect();
    }
  }, [currentUser]);

  return null;
}

function LocationTrackerHandler() {
  useWorkerLocationTracker();
  useCustomerLocationTracker();

  return null;
}

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { I18nProvider } from '../src/hooks/useI18n';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <I18nProvider>
          <BottomSheetModalProvider>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
              <SocketHandler />
              <LocationTrackerHandler />
              <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  contentStyle: { backgroundColor: theme.colors.background },
                }}
              />
            </View>
          </BottomSheetModalProvider>
        </I18nProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
