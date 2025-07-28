import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectCurrentUser } from '../../../store/authSlice';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { setCustomerPage } from '../../../store/customerFlowSlice';
import { ChevronLeftIcon } from '../../../components/icons/ChevronLeftIcon';
import { UserCircleIcon } from '../../../components/icons/UserCircleIcon';
import { PhotoIcon } from '../../../components/icons/PhotoIcon';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
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

const ProfileImageContainer = styled(View)`
    align-items: center;
    margin-bottom: 24px;
`;

const ProfileImage = styled(Image)`
    width: 128px;
    height: 128px;
    border-radius: 64px;
`;

const DisabledButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    background-color: #d1d5db;
    padding: 8px 16px;
    border-radius: 8px;
    margin-top: 16px;
`;

const DisabledButtonText = styled(Text)`
    color: #374151;
    font-weight: 500;
    margin-left: 8px;
`;

const InfoSectionTitle = styled(Text)`
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
`;

const InfoBox = styled(View)`
    background-color: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    gap: 12px;
`;

const InfoRow = styled(View)`
    flex-direction: row;
`;

const InfoLabel = styled(Text)`
    font-weight: 700;
    color: #374151;
`;

const InfoValue = styled(Text)`
    color: #4b5563;
    margin-left: 8px;
`;


export const CustomerProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t } = useLocalization();
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) return null;

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <ChevronLeftIcon height={20} width={20} color="white" />
        <BackButtonText>{t('customerFlow.backToDashboard')}</BackButtonText>
      </BackButton>

      <Card>
        <PageTitle>{t('customerFlow.profile.title')}</PageTitle>
        <PageDescription>{t('customerFlow.profile.description')}</PageDescription>

        <View>
            <ProfileImageContainer>
                <ProfileImage source={{ uri: currentUser.profileImageUrl }} />
                <DisabledButton disabled>
                    <PhotoIcon height={20} width={20} color="#374151" />
                    <DisabledButtonText>{t('customerFlow.profile.changePicture')} ({t('workerFlow.nav.soon')})</DisabledButtonText>
                </DisabledButton>
            </ProfileImageContainer>
          
          <View>
            <InfoSectionTitle>
              <UserCircleIcon height={24} width={24} color="#2563eb" style={{marginRight: 8}}/>
              {t('customerFlow.profile.basicInfo')}
            </InfoSectionTitle>
            <InfoBox>
              <InfoRow>
                <InfoLabel>{t('signupPage.fullNameLabel')}:</InfoLabel>
                <InfoValue>{currentUser.name}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>{t('signupPage.emailLabel')}:</InfoLabel>
                <InfoValue>{currentUser.email}</InfoValue>
              </InfoRow>
            </InfoBox>
            <DisabledButton disabled style={{alignSelf: 'flex-start'}}>
              <DisabledButtonText>{t('customerFlow.profile.editInfo')} ({t('workerFlow.nav.soon')})</DisabledButtonText>
            </DisabledButton>
          </View>
        </View>
      </Card>
    </Container>
  );
};
