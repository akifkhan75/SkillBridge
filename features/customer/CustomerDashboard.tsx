import React from 'react';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import type { CustomerStackParamList } from '../../types';

import { ServiceFlow } from './components/ServiceFlow';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { CustomerSettingsPage } from './pages/CustomerSettingsPage';
import { WorkerProfileView } from './components/WorkerProfileView';
import Navbar from '../../components/Navbar';

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export const CustomerDashboard: React.FC = () => {
  return (
    <Stack.Navigator
        screenOptions={{
            header: (props: NativeStackHeaderProps) => <Navbar {...props} />,
        }}
    >
      <Stack.Screen name="ServiceFlow" component={ServiceFlow} />
      <Stack.Screen name="Profile" component={CustomerProfilePage} />
      <Stack.Screen name="Settings" component={CustomerSettingsPage} />
      <Stack.Screen name="WorkerProfile" component={WorkerProfileView} />
    </Stack.Navigator>
  );
};
