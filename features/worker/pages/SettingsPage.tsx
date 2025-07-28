
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Switch, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { Worker } from '../../../types';
import { BellIcon } from '../../../components/icons/BellIcon';
import { MapPinIcon } from '../../../components/icons/MapPinIcon';
import { HomeIcon } from '../../../components/icons/HomeIcon';
import { BuildingOfficeIcon } from '../../../components/icons/BuildingOfficeIcon';
import * as apiService from '../../../services/apiService';
import { updateWorker } from '../../../store/dataSlice';
import { setAppError } from '../../../store/uiSlice';

interface SettingsPageProps {
  worker: Worker;
}

const Container = styled(ScrollView)`
  padding: 16px;
  background-color: #f0f4f8;
`;

const Card = styled(View)`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
`;

const PageTitle = styled(Text)`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const Section = styled(View)`
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const SectionTitle = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled(Text)`
  font-size: 14px;
  color: #374151;
`;

const Input = styled(TextInput)`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  background-color: white;
`;

const SaveButton = styled(TouchableOpacity)`
  background-color: #2563eb;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-weight: 600;
`;


export const SettingsPage: React.FC<SettingsPageProps> = ({ worker }) => {
  const dispatch = useAppDispatch();
  const { t } = useLocalization();

  const [homeAddress, setHomeAddress] = useState(worker.homeAddress);
  const [workAddress, setWorkAddress] = useState(worker.workAddress || '');
  const [isOnline, setIsOnline] = useState(worker.isOnline);
  
  useEffect(() => {
    setHomeAddress(worker.homeAddress);
    setWorkAddress(worker.workAddress || '');
    setIsOnline(worker.isOnline);
  }, [worker]);

  const handleUpdate = async (updates: Partial<Worker>) => {
    try {
        const updatedWorker = await apiService.updateWorkerProfileAPI(worker.id, updates);
        dispatch(updateWorker(updatedWorker));
    } catch (e: any) {
        dispatch(setAppError(e.message));
    }
  };

  const handleAddressSave = () => {
    handleUpdate({ homeAddress, workAddress });
  }

  const toggleOnlineStatus = () => {
      const newStatus = !isOnline;
      setIsOnline(newStatus);
      handleUpdate({ isOnline: newStatus, availability: newStatus ? 'Available Now' : 'Offline' });
  }
  
  return (
    <Container>
      <Card>
        <PageTitle>{t('workerFlow.settings.title')}</PageTitle>
          
          <Section>
            <SectionTitle><BellIcon height={20} width={20} color="#2563eb" style={{marginRight: 8}}/> {t('workerFlow.settings.onlineStatusTitle')}</SectionTitle>
            <Row>
              <Label>{t('workerFlow.settings.currentStatus')} <Text style={{fontWeight: 'bold', color: isOnline ? '#16a34a' : '#dc2626'}}>{isOnline ? t('workerFlow.settings.statusOnline') : t('workerFlow.settings.statusOffline')}</Text></Label>
              <Switch
                trackColor={{ false: "#fca5a5", true: "#bbf7d0" }}
                thumbColor={isOnline ? "#22c55e" : "#ef4444"}
                onValueChange={toggleOnlineStatus}
                value={isOnline}
              />
            </Row>
          </Section>

          <Section>
             <SectionTitle><MapPinIcon height={20} width={20} color="#2563eb" style={{marginRight: 8}}/> {t('workerFlow.settings.addressTitle')}</SectionTitle>
             <View style={{gap: 16}}>
                <View>
                    <Label style={{marginBottom: 8}}>{t('workerFlow.settings.homeAddressLabel')}</Label>
                    <Input value={homeAddress} onChangeText={setHomeAddress}/>
                </View>
                 <View>
                    <Label style={{marginBottom: 8}}>{t('workerFlow.settings.workAddressLabel')}</Label>
                    <Input value={workAddress} onChangeText={setWorkAddress}/>
                </View>
             </View>
             <SaveButton onPress={handleAddressSave}>
                <ButtonText>Save Addresses</ButtonText>
             </SaveButton>
          </Section>

      </Card>
    </Container>
  );
};
