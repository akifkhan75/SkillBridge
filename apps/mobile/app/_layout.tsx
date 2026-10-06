import React, { useEffect } from 'react';
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

function SocketHandler({ children }: { children: React.ReactNode }) {
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser?.id) {
      socketService.connect(currentUser.id);
    } else {
      socketService.disconnect();
    }
  }, [currentUser]);

  return <>{children}</>;
}

function LocationTrackerHandler({ children }: { children: React.ReactNode }) {
  useWorkerLocationTracker();
  useCustomerLocationTracker();

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SocketHandler>
          <LocationTrackerHandler>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#0A0A1A' },
              }}
            />
          </LocationTrackerHandler>
        </SocketHandler>
      </Provider>
    </GestureHandlerRootView>
  );
}
