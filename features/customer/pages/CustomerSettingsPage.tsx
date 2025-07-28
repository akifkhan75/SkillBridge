import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { ChevronLeftIcon } from '../../../components/icons/ChevronLeftIcon';
import { BellIcon } from '../../../components/icons/BellIcon';
import { ShieldCheckIcon } from '../../../components/icons/ShieldCheckIcon';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

const Container = styled(ScrollView)`
    padding: 16px;
    background-color: #f7fafc;
`;

const BackButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    background-color: #2563eb;
    padding: 8px 16px;
    border-radius: 8px;
    align-self: flex-start;
    margin-bottom: 16px;
`;

const BackButtonText = styled(Text)`
    color: white;
    font-weight: 500;
    margin-left: 8px;
`;

const Card = styled(View)`
    padding: 24px;
    background-color: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
`;

const PageTitle = styled(Text)`
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
`;

const PageDescription = styled(Text)`
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom-width: 1px;
    border-bottom-color: #e5e7eb;
`;

const Section = styled(View)`
    margin-bottom: 24px;
`;

const SectionTitle = styled(Text)`
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
`;

const SectionContent = styled(View)`
    background-color: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    gap: 16px;
`;

const Row = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Label = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
`;

const DisabledButton = styled(TouchableOpacity)`
    background-color: #d1d5db;
    padding: 12px 16px;
    border-radius: 8px;
    align-self: flex-start;
`;

const DisabledButtonText = styled(Text)`
    color: #6b7280;
    font-weight: 500;
`;

export const CustomerSettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t } = useLocalization();
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <ChevronLeftIcon height={20} width={20} color="white" />
        <BackButtonText>{t('customerFlow.backToDashboard')}</BackButtonText>
      </BackButton>

      <Card>
        <PageTitle>{t('customerFlow.settings.title')}</PageTitle>
        <PageDescription>{t('customerFlow.settings.description')}</PageDescription>

        <View>
          <Section>
            <SectionTitle>
              <BellIcon height={24} width={24} color="#2563eb" style={{marginRight: 8}}/>
              {t('customerFlow.settings.notifications')}
            </SectionTitle>
            <SectionContent>
              <Row>
                <Label>{t('customerFlow.settings.emailNotifications')}</Label>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={emailNotifications ? "#2563eb" : "#f4f3f4"}
                    onValueChange={setEmailNotifications}
                    value={emailNotifications}
                />
              </Row>
               <Row style={{opacity: 0.5}}>
                <Label>{t('customerFlow.settings.pushNotifications')}</Label>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={"#f4f3f4"}
                    value={false}
                    disabled={true}
                />
              </Row>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>
              <ShieldCheckIcon height={24} width={24} color="#2563eb" style={{marginRight: 8}}/>
              {t('customerFlow.settings.security')}
            </SectionTitle>
             <SectionContent>
                <DisabledButton disabled>
                    <DisabledButtonText>{t('customerFlow.settings.changePassword')}</DisabledButtonText>
                </DisabledButton>
             </SectionContent>
          </Section>
        </View>
      </Card>
    </Container>
  );
};
