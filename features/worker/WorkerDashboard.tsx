import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/authSlice';
import { selectWorkerById } from '../../store/dataSlice';
import { WorkerNav } from './WorkerNav';
import { InformationCircleIcon } from '../../components/icons/InformationCircleIcon';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { WorkerDrawerParamList } from '../../types';

import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';

// Page Components
import { DashboardPage } from './pages/DashboardPage';
import { JobRequestsPage } from './pages/JobRequestsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SchedulingPage } from './pages/SchedulingPage';
import { ArToolsPage } from './pages/ArToolsPage';

const Drawer = createDrawerNavigator<WorkerDrawerParamList>();

const CenteredContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f0f4f8;
`;

const ErrorCard = styled(View)`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ErrorTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-top: 16px;
  text-align: center;
`;

const ErrorMessage = styled(Text)`
  font-size: 14px;
  color: #4b5563;
  margin-top: 8px;
  text-align: center;
`;

export const WorkerDashboard: React.FC = () => {
  const { t } = useLocalization();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentWorkerDetails = useAppSelector(selectWorkerById(currentUser?.id || null));
  
  if (!currentWorkerDetails) {
    return (
      <CenteredContainer>
        <ErrorCard>
          <InformationCircleIcon height={48} width={48} color="#3b82f6" />
          <ErrorTitle>{t('app.workerDetailsNotFound')}</ErrorTitle>
          <ErrorMessage>{t('app.workerProfileProcessing')}</ErrorMessage>
        </ErrorCard>
      </CenteredContainer>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => <WorkerNav {...props} worker={currentWorkerDetails} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Dashboard">{props => <DashboardPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="JobRequests">{props => <JobRequestsPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="MyProfile">{props => <ProfilePage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="Settings">{props => <SettingsPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="Projects">{props => <ProjectsPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="Payments">{props => <PaymentsPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="PerformanceAnalytics">{props => <AnalyticsPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="SchedulingSystem">{props => <SchedulingPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
      <Drawer.Screen name="ArTools">{props => <ArToolsPage {...props} worker={currentWorkerDetails} />}</Drawer.Screen>
    </Drawer.Navigator>
  );
};
