import React from 'react';
import { type Worker, JobCategory } from '../types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { requestBooking, setViewWorkerProfile } from '../store/customerFlowSlice';
import { startOrOpenChat } from '../store/chatSlice';
import { selectCurrentUser } from '../store/authSlice';
import { MapPinIcon } from './icons/MapPinIcon';
import { StarIcon } from './icons/StarIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { EyeIcon } from './icons/EyeIcon';
import { ChatBubbleBottomCenterTextIcon } from './icons/ChatBubbleBottomCenterTextIcon';
import { CATEGORIES_DATA } from '../constants'; 
import { useLocalization } from '../contexts/LocalizationContext';
import type { Translations } from '../locales/en';
import { BookmarkIcon } from './icons/BookmarkIcon';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, TouchableOpacity } from 'react-native';

const CardContainer = styled(View)`
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  flex: 1;
`;

const ProfileImage = styled(Image)`
  width: 100%;
  height: 180px;
`;

const VerifiedBadge = styled(View)`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #10b981;
  padding: 4px 10px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
`;

const VerifiedText = styled(Text)`
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-left: 4px;
`;

const ContentContainer = styled(View)`
  padding: 20px;
  flex: 1;
`;

const WorkerName = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 6px;
`;

const RatingContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`;

const RatingText = styled(Text)`
  font-size: 14px;
  color: #f59e0b;
  margin-left: 4px;
`;

const BioText = styled(Text)`
  font-size: 14px;
  color: #4b5563;
  line-height: 20px;
  margin-bottom: 16px;
  flex-grow: 1;
`;

const InfoRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoText = styled(Text)`
  font-size: 14px;
  color: #4b5563;
  margin-left: 8px;
  flex-shrink: 1;
`;

const SkillsContainer = styled(View)`
  margin-top: 16px;
  margin-bottom: 20px;
`;

const SkillsTitle = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const SkillBadgesContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const SkillBadge = styled(View)`
  background-color: #dbeafe;
  padding: 4px 10px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SkillText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  color: #2563eb;
  margin-left: 6px;
`;

const ActionButton = styled(TouchableOpacity)<{ $color?: string }>`
  background-color: ${props => props.$color || '#2563eb'};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: 8px;
`;

const ActionButtonText = styled(Text)`
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
`;


const JobCategoryIconComponent: React.FC<{ categoryName: JobCategory | string, size?: number }> = ({ categoryName, size = 14 }) => {
  const categoryDetails = CATEGORIES_DATA.find(cat => cat.nameEnum === categoryName);
  const IconComponent = categoryDetails ? categoryDetails.icon : BriefcaseIcon;
  return <IconComponent height={size} width={size} color="#2563eb" />;
};


export const WorkerCard: React.FC<{ worker: Worker }> = ({ worker }) => {
  const { t } = useLocalization();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const currentUser = useAppSelector(selectCurrentUser);
  const { currentJobRequestDetails } = useAppSelector(state => state.customerFlow);

  const handleViewProfile = () => {
    dispatch(setViewWorkerProfile(worker.id));
    // @ts-ignore
    navigation.navigate('WorkerProfile', { workerId: worker.id });
  };

  const handleInitiateChat = () => {
    if (currentUser) {
      dispatch(startOrOpenChat({ targetUserId: worker.id, currentUserId: currentUser.id }));
    }
  };

  const handleBookNow = () => {
    if (currentJobRequestDetails) {
        dispatch(requestBooking({ workerId: worker.id }))
        .unwrap()
        .then(() => {
            alert(t('customerFlow.booking.requestSentMessage'));
        })
        .catch((error) => {
            console.error("Booking failed:", error);
        });
    }
  };
  
  const canBook = currentJobRequestDetails && currentJobRequestDetails.status === 'Matches Found';

  return (
    <CardContainer>
      <ProfileImage source={{ uri: worker.profileImageUrl }} />
      {worker.isVerified && (
        <VerifiedBadge>
            <ShieldCheckIcon height={16} width={16} color="white" />
            <VerifiedText>{t('workerCard.verifiedPro')}</VerifiedText>
        </VerifiedBadge>
      )}
      <ContentContainer>
        <WorkerName>{worker.name}</WorkerName>
        <RatingContainer>
            <StarIcon height={20} width={20} color="#f59e0b" />
            <RatingText>{worker.rating.toFixed(1)} ({t('workerCard.reviews', { count: (worker.portfolio?.testimonialCount || 0) + 15})})</RatingText>
        </RatingContainer>
        <BioText numberOfLines={3}>{worker.bio}</BioText>
        
        <View style={{ marginBottom: 16 }}>
          <InfoRow><MapPinIcon height={16} width={16} color="#2563eb" /><InfoText>{worker.homeAddress}</InfoText></InfoRow>
          {worker.distance !== undefined && <InfoRow><MapPinIcon height={16} width={16} color="#2563eb" /><InfoText>{t('workerCard.kmAway', { distance: worker.distance.toFixed(1) })}</InfoText></InfoRow>}
          <InfoRow><BriefcaseIcon height={16} width={16} color="#2563eb" /><InfoText>{t('workerCard.experience', { years: worker.experienceYears })}</InfoText></InfoRow>
        </View>

        <SkillsContainer>
          <SkillsTitle>{t('workerCard.topSkills')}</SkillsTitle>
          <SkillBadgesContainer>
            {worker.skills.slice(0, 3).map(skill => (
                <SkillBadge key={skill}>
                    <JobCategoryIconComponent categoryName={skill} />
                    <SkillText>{t(`jobCategory.${skill}` as keyof Translations)}</SkillText>
                </SkillBadge>
            ))}
          </SkillBadgesContainer>
        </SkillsContainer>

        <View style={{ marginTop: 'auto' }}>
            <ActionButton $color="#2563eb" onPress={handleViewProfile}>
                <EyeIcon height={20} width={20} color="white" />
                <ActionButtonText>{t('workerCard.viewProfile')}</ActionButtonText>
            </ActionButton>
            {canBook && (
              <ActionButton $color="#10b981" onPress={handleBookNow}>
                <BookmarkIcon height={20} width={20} color="white" />
                <ActionButtonText>{t('workerCard.bookNow')}</ActionButtonText>
              </ActionButton>
            )}
            <ActionButton $color="#f59e0b" onPress={handleInitiateChat}>
                <ChatBubbleBottomCenterTextIcon height={20} width={20} color="white" />
                <ActionButtonText>{t('workerCard.chatWith', { name: worker.name.split(' ')[0] })}</ActionButtonText>
            </ActionButton>
        </View>
      </ContentContainer>
    </CardContainer>
  );
};