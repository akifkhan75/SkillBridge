
import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { Worker, VerificationStatus } from '../../../types';
import type { Translations } from '../../../locales/en';
import { PhotoIcon } from '../../../components/icons/PhotoIcon';
import { UserCircleIcon } from '../../../components/icons/UserCircleIcon';
import { ArrowUpTrayIcon } from '../../../components/icons/ArrowUpTrayIcon';
import { IdentificationIcon } from '../../../components/icons/IdentificationIcon';
import { ShieldExclamationIcon } from '../../../components/icons/ShieldExclamationIcon';
import { UserGroupIcon } from '../../../components/icons/UserGroupIcon';
import { HomeIcon } from '../../../components/icons/HomeIcon';
import { BuildingOfficeIcon } from '../../../components/icons/BuildingOfficeIcon';
import { SvgProps } from 'react-native-svg';

interface ProfilePageProps {
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

const ProfileHeader = styled(View)`
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileImage = styled(Image)`
    width: 128px;
    height: 128px;
    border-radius: 64px;
    border-width: 3px;
    border-color: white;
`;

const ChangePictureButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    background-color: #d1d5db;
    padding: 8px 16px;
    border-radius: 8px;
    margin-top: 16px;
`;

const ButtonText = styled(Text)`
    color: #374151;
    font-weight: 500;
    margin-left: 8px;
`;

const Section = styled(View)`
  margin-top: 24px;
  padding-top: 24px;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
`;

const SectionTitle = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
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
  width: 100px;
`;

const InfoValue = styled(Text)`
  color: #4b5563;
  flex-shrink: 1;
`;

const VerificationContainer = styled(View)`
  gap: 16px;
`;

const VerificationItem = styled(View)`
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const VerificationHeader = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const VerificationLabel = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-left: 12px;
`;

const VerificationStatusText = styled(Text)`
  font-size: 14px;
  margin-bottom: 12px;
`;

const UploadButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: #9ca3af;
  padding: 8px 12px;
  border-radius: 8px;
  align-self: flex-start;
`;

const renderVerificationStatus = (t: Function, labelKey: keyof Translations, status: VerificationStatus, actionTextKey: keyof Translations, Icon: React.FC<SvgProps>) => {
  let statusColor = "#6b7280";
  let statusTextKey: keyof Translations = 'workerFlow.profile.verificationStatus.NotStarted';

  switch (status) {
    case 'VERIFIED': case 'CHECKED': statusColor = "#16a34a"; statusTextKey = "workerFlow.profile.verificationStatus.Verified"; break;
    case 'SUBMITTED': case 'IN_PROGRESS': statusColor = "#2563eb"; statusTextKey = "workerFlow.profile.verificationStatus.InProgress"; break;
    case 'REJECTED': statusColor = "#dc2626"; statusTextKey = "workerFlow.profile.verificationStatus.Rejected"; break;
    case 'PENDING_UPLOAD': statusColor = "#f97316"; statusTextKey = "workerFlow.profile.verificationStatus.PendingUpload"; break;
    default: statusColor = "#6b7280"; statusTextKey = "workerFlow.profile.verificationStatus.NotStarted"; break;
  }

  return (
    <VerificationItem>
      <VerificationHeader>
        <Icon height={24} width={24} color={status === 'VERIFIED' || status === 'CHECKED' ? '#16a34a' : '#2563eb' } />
        <VerificationLabel>{t(labelKey)}</VerificationLabel>
      </VerificationHeader>
      <VerificationStatusText>
        {t('workerFlow.profile.verificationStatus')}{' '}
        <Text style={{ fontWeight: '600', color: statusColor }}>{t(statusTextKey)}</Text>
      </VerificationStatusText>
      {(status === 'NONE' || status === 'PENDING_UPLOAD' || status === 'REJECTED') && (
        <UploadButton disabled>
          <ArrowUpTrayIcon height={16} width={16} color="white" />
          <ButtonText style={{color: 'white', fontSize: 12}}>{t(actionTextKey)} ({t('workerFlow.nav.soon')})</ButtonText>
        </UploadButton>
      )}
    </VerificationItem>
  );
};


export const ProfilePage: React.FC<ProfilePageProps> = ({ worker }) => {
    const { t } = useLocalization();

    return (
        <Container>
            <Card>
              <PageTitle>{t('workerFlow.profile.title')}</PageTitle>
               
              <ProfileHeader>
                  <ProfileImage source={{ uri: worker.profileImageUrl }} />
                  <ChangePictureButton disabled>
                      <PhotoIcon height={20} width={20} color="#374151" />
                      <ButtonText>{t('workerFlow.profile.changePicture')} ({t('workerFlow.nav.soon')})</ButtonText>
                  </ChangePictureButton>
              </ProfileHeader>
              
               <SectionTitle>
                    <UserCircleIcon height={24} width={24} color="#2563eb" style={{marginRight: 8}}/> 
                    {t('workerFlow.profile.overviewTitle')}
                </SectionTitle>
                <InfoBox>
                      <InfoRow><InfoLabel>{t('workerFlow.profile.name')}</InfoLabel><InfoValue>{worker.name}</InfoValue></InfoRow>
                      <InfoRow><InfoLabel>{t('workerFlow.profile.bio')}</InfoLabel><InfoValue>{worker.bio}</InfoValue></InfoRow>
                      <InfoRow><InfoLabel>{t('workerFlow.profile.experience')}</InfoLabel><InfoValue>{t('workerFlow.profile.years', {count: worker.experienceYears})}</InfoValue></InfoRow>
                      <InfoRow><InfoLabel>{t('workerFlow.profile.homeAddress')}</InfoLabel><InfoValue>{worker.homeAddress}</InfoValue></InfoRow>
                      {worker.workAddress && <InfoRow><InfoLabel>{t('workerFlow.profile.workAddress')}</InfoLabel><InfoValue>{worker.workAddress}</InfoValue></InfoRow>}
                </InfoBox>
                
                <Section>
                    <SectionTitle>
                        {t('workerFlow.profile.verificationCenterTitle')}
                    </SectionTitle>
                    <VerificationContainer>
                        {renderVerificationStatus(t, "workerFlow.profile.idVerification", worker.verificationDetails.idVerifiedStatus, "workerFlow.profile.uploadId", IdentificationIcon)}
                        {renderVerificationStatus(t, "workerFlow.profile.backgroundCheck", worker.verificationDetails.backgroundCheckStatus, "workerFlow.profile.startBackgroundCheck", ShieldExclamationIcon)}
                        {renderVerificationStatus(t, "workerFlow.profile.referenceChecks", worker.verificationDetails.referencesStatus, "workerFlow.profile.submitReferences", UserGroupIcon)}
                    </VerificationContainer>
                </Section>
            </Card>
        </Container>
    );
};
