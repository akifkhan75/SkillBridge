

import React from 'react';
import { WorkerPage, WorkerActivationStatus, Worker } from '../../types';
import { HomeIcon } from '../../components/icons/HomeIcon';
import { ListBulletIcon } from '../../components/icons/ListBulletIcon';
import { UserCircleIcon } from '../../components/icons/UserCircleIcon';
import { PresentationChartLineIcon } from '../../components/icons/PresentationChartLineIcon';
import { AdjustmentsHorizontalIcon } from '../../components/icons/AdjustmentsHorizontalIcon';
import { CalendarClockIcon } from '../../components/icons/CalendarClockIcon';
import { FolderOpenIcon } from '../../components/icons/FolderOpenIcon';
import { BanknotesIcon } from '../../components/icons/BanknotesIcon';
import { Cog6ToothIcon } from '../../components/icons/Cog6ToothIcon';
import { InformationCircleIcon } from '../../components/icons/InformationCircleIcon';
import { APP_NAME_KEY } from '../../constants';
import { BriefcaseIcon } from '../../components/icons/BriefcaseIcon';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { Translations } from '../../locales/en';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import type { SvgProps } from 'react-native-svg';


interface WorkerNavProps {
  worker: Worker;
  [key: string]: any; // To accept props from Drawer.Navigator
}

interface NavItem {
  page: WorkerPage;
  name: string; // for react-navigation
  labelKey: keyof Translations;
  icon: React.FC<SvgProps>;
  isComingSoon?: boolean;
  minStatusToAccess?: WorkerActivationStatus[];
}

const NavContainer = styled(View)`
  flex: 1;
`;

const Header = styled(View)`
  padding: 16px;
  padding-top: 50px; /* For status bar */
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const AppName = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: #2563eb;
  margin-left: 8px;
`;

const StatusBanner = styled(View)`
  margin: 16px;
  padding: 10px;
  border-radius: 8px;
  border-width: 1px;
`;

const StatusText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
`;

const ComingSoonBadge = styled(View)`
  background-color: #e5e7eb;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
`;

const ComingSoonText = styled(Text)`
  font-size: 10px;
  color: #4b5563;
  font-weight: 500;
`;


export const WorkerNav: React.FC<WorkerNavProps> = ({ worker, ...props }) => {
  const { t } = useLocalization();
  const workerActivationStatus = worker.activationStatus;

  const navItems: NavItem[] = [
    { page: 'DASHBOARD', name: 'Dashboard', labelKey: 'workerFlow.nav.dashboard', icon: HomeIcon, minStatusToAccess: ['ACTIVE', 'PENDING_REVIEW', 'NEEDS_VERIFICATION'] },
    { page: 'JOB_REQUESTS', name: 'JobRequests', labelKey: 'workerFlow.nav.jobRequests', icon: ListBulletIcon, minStatusToAccess: ['ACTIVE', 'PENDING_REVIEW'] },
    { page: 'PROJECTS', name: 'Projects', labelKey: 'workerFlow.nav.myProjects', icon: FolderOpenIcon, minStatusToAccess: ['ACTIVE', 'PENDING_REVIEW'] },
    { page: 'PAYMENTS', name: 'Payments', labelKey: 'workerFlow.nav.myEarnings', icon: BanknotesIcon, minStatusToAccess: ['ACTIVE'] },
    { page: 'MY_PROFILE', name: 'MyProfile', labelKey: 'workerFlow.nav.myProfile', icon: UserCircleIcon, minStatusToAccess: ['ACTIVE', 'PENDING_REVIEW', 'NEEDS_VERIFICATION'] },
    { page: 'PERFORMANCE_ANALYTICS', name: 'PerformanceAnalytics', labelKey: 'workerFlow.nav.performance', icon: PresentationChartLineIcon, minStatusToAccess: ['ACTIVE'] },
    { page: 'SETTINGS', name: 'Settings', labelKey: 'workerFlow.nav.settings', icon: Cog6ToothIcon, minStatusToAccess: ['ACTIVE', 'PENDING_REVIEW', 'NEEDS_VERIFICATION'] },
    { page: 'AR_TOOLS', name: 'ArTools', labelKey: 'workerFlow.nav.arTools', icon: AdjustmentsHorizontalIcon, isComingSoon: true, minStatusToAccess: ['ACTIVE'] },
    { page: 'SCHEDULING_SYSTEM', name: 'SchedulingSystem', labelKey: 'workerFlow.nav.scheduling', icon: CalendarClockIcon, isComingSoon: true, minStatusToAccess: ['ACTIVE'] },
  ];

  const canAccessItem = (item: NavItem): boolean => {
    if (!item.minStatusToAccess) return true;
    return item.minStatusToAccess.includes(workerActivationStatus);
  };

  const getStatusBanner = () => {
    if (workerActivationStatus === 'PENDING_REVIEW') {
      return (
        <StatusBanner style={{ backgroundColor: '#fefce8', borderColor: '#fde047' }}>
          <StatusText style={{ color: '#a16207' }}>{t('workerFlow.nav.profileUnderReview')}</StatusText>
        </StatusBanner>
      );
    }
    if (workerActivationStatus === 'NEEDS_VERIFICATION') {
        return (
          <StatusBanner style={{ backgroundColor: '#fff7ed', borderColor: '#fdba74' }}>
            <StatusText style={{ color: '#c2410c' }}>{t('workerFlow.nav.verificationRequired')}</StatusText>
          </StatusBanner>
        );
      }
    return null;
  }

  return (
    <NavContainer>
      <Header>
        <BriefcaseIcon height={32} width={32} color="#2563eb" />
        <AppName>{t(APP_NAME_KEY)}</AppName>
      </Header>
      <DrawerContentScrollView {...props}>
        {getStatusBanner()}
        {navItems.map(item => {
           const accessible = canAccessItem(item);
           return (
            <DrawerItem
              key={item.name}
              label={t(item.labelKey)}
              icon={({ color, size }) => <item.icon height={size} width={size} color={color} />}
              onPress={() => props.navigation.navigate(item.name)}
              disabled={!accessible}
              labelStyle={{ fontWeight: '500', opacity: accessible ? 1 : 0.5 }}
              style={{ opacity: accessible ? 1 : 0.7 }}
              {...(item.isComingSoon && {
                label: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                        <Text style={{ opacity: 0.5 }}>{t(item.labelKey)}</Text>
                        <ComingSoonBadge><ComingSoonText>{t('workerFlow.nav.soon')}</ComingSoonText></ComingSoonBadge>
                    </View>
                ),
                disabled: true
              })}
            />
           )
        })}
      </DrawerContentScrollView>
    </NavContainer>
  );
};
