
import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { selectWorkerById } from '../../../store/dataSlice';
import { selectCustomerFlow, backToPreviousCustomerView } from '../../../store/customerFlowSlice';
import { startOrOpenChat } from '../../../store/chatSlice';
import { selectCurrentUser } from '../../../store/authSlice';
import { ChevronLeftIcon } from '../../../components/icons/ChevronLeftIcon';
import { UserCircleIcon } from '../../../components/icons/UserCircleIcon';
import { ShieldCheckIcon } from '../../../components/icons/ShieldCheckIcon';
import { StarIcon } from '../../../components/icons/StarIcon';
import { ChatBubbleBottomCenterTextIcon } from '../../../components/icons/ChatBubbleBottomCenterTextIcon';
import { MapPinIcon } from '../../../components/icons/MapPinIcon';
import { ClockIcon } from '../../../components/icons/ClockIcon';
import { CurrencyDollarIcon } from '../../../components/icons/CurrencyDollarIcon';
import { PresentationChartLineIcon } from '../../../components/icons/PresentationChartLineIcon';
import { CheckCircleIcon } from '../../../components/icons/CheckCircleIcon';
import { ArrowPathRoundedSquareIcon } from '../../../components/icons/ArrowPathRoundedSquareIcon';

const Container = styled(ScrollView)`
    padding: 16px;
    background-color: #f7fafc;
`;

const Card = styled(View)`
    padding: 16px;
    background-color: white;
    border-radius: 12px;
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

const ProfileImage = styled(Image)`
    width: 128px;
    height: 128px;
    border-radius: 64px;
    align-self: center;
    margin-bottom: 16px;
`;

const WorkerName = styled(Text)`
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    color: #1f2937;
`;

const VerifiedBadge = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
`;
const VerifiedText = styled(Text)`
    color: #059669;
    font-weight: 500;
    margin-left: 4px;
`;

const RatingContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
`;

const RatingText = styled(Text)`
    color: #f59e0b;
    font-size: 18px;
    font-weight: 600;
    margin-left: 4px;
`;

const RatingSubText = styled(Text)`
    color: #6b7280;
    font-size: 12px;
    margin-left: 4px;
`;

const ChatButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #f59e0b;
    padding: 12px;
    border-radius: 8px;
    margin-top: 16px;
`;

const ChatButtonText = styled(Text)`
    color: white;
    font-weight: 600;
    margin-left: 8px;
`;

const InfoRow = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
`;

const InfoText = styled(Text)`
    color: #4b5563;
    margin-left: 8px;
`;

const Section = styled(View)`
    margin-top: 24px;
`;

const SectionTitle = styled(Text)`
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom-width: 1px;
    border-bottom-color: #e5e7eb;
`;

const BioText = styled(Text)`
    color: #4b5563;
    line-height: 22px;
`;

const StatGrid = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    margin: -8px;
`;

const StatCard = styled(View)`
    width: 50%;
    padding: 8px;
`;

const StatCardInner = styled(View)`
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

const StatValue = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-top: 8px;
`;

const StatLabel = styled(Text)`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
`;


export const WorkerProfileView: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useLocalization();
    const { viewingWorkerProfileId } = useAppSelector(selectCustomerFlow);
    const worker = useAppSelector(selectWorkerById(viewingWorkerProfileId));
    const currentUser = useAppSelector(selectCurrentUser);

    const handleInitiateChat = (workerId: string) => {
        if (currentUser) {
            dispatch(startOrOpenChat({ targetUserId: workerId, currentUserId: currentUser.id }));
        }
    };

    if (!worker) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{t('customerFlow.workerProfile.notFound')}</Text>
                <TouchableOpacity onPress={() => dispatch(backToPreviousCustomerView())}>
                    <Text style={{color: 'blue', marginTop: 16}}>{t('customerFlow.workerProfile.goBack')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <Container>
            <BackButton onPress={() => dispatch(backToPreviousCustomerView())}>
                <ChevronLeftIcon height={20} width={20} color="white" />
                <BackButtonText>{t('customerFlow.workerProfile.backButton')}</BackButtonText>
            </BackButton>

            <Card>
                <ProfileImage source={{uri: worker.profileImageUrl}} />
                <WorkerName>{worker.name}</WorkerName>
                {worker.isVerified && (
                    <VerifiedBadge>
                        <ShieldCheckIcon height={20} width={20} color="#059669" />
                        <VerifiedText>{t('customerFlow.workerProfile.verifiedPro')}</VerifiedText>
                    </VerifiedBadge>
                )}
                <RatingContainer>
                    <StarIcon height={24} width={24} color="#f59e0b" />
                    <RatingText>{worker.rating.toFixed(1)}</RatingText>
                    <RatingSubText>{t('customerFlow.workerProfile.reviews', { count: (worker.portfolio?.testimonialCount || 0) + 15 })}</RatingSubText>
                </RatingContainer>
                
                <View style={{marginTop: 16, alignItems: 'center', gap: 4}}>
                    <InfoRow><MapPinIcon height={16} width={16} color="#6b7280" /><InfoText>{worker.homeAddress}</InfoText></InfoRow>
                    <InfoRow><ClockIcon height={16} width={16} color="#6b7280" /><InfoText>{worker.availability === "Available Now" ? t('workerCard.onlineNow') : worker.availability}</InfoText></InfoRow>
                    <InfoRow><CurrencyDollarIcon height={16} width={16} color="#6b7280" /><InfoText>{t('customerFlow.workerProfile.hourlyRate', { rate: worker.hourlyRateRange })}</InfoText></InfoRow>
                </View>

                <ChatButton onPress={() => handleInitiateChat(worker.id)}>
                    <ChatBubbleBottomCenterTextIcon height={20} width={20} color="white" />
                    <ChatButtonText>{t('customerFlow.workerProfile.chatAndBook')}</ChatButtonText>
                </ChatButton>

                <Section>
                    <SectionTitle><UserCircleIcon height={24} width={24} color="#2563eb" style={{marginRight: 8}} />{t('customerFlow.workerProfile.about', { name: worker.name.split(' ')[0] })}</SectionTitle>
                    <BioText>{worker.bio}</BioText>
                    <InfoText style={{marginTop: 8, fontWeight: 'bold'}}>{t('customerFlow.workerProfile.experience')} {t('customerFlow.workerProfile.years', {count: worker.experienceYears})}</InfoText>
                </Section>
                 <Section>
                    <SectionTitle><PresentationChartLineIcon height={24} width={24} color="#2563eb" style={{marginRight: 8}} />{t('customerFlow.workerProfile.performanceHighlights')}</SectionTitle>
                    <StatGrid>
                        <StatCard><StatCardInner><ClockIcon height={24} width={24} color="#3b82f6" /><StatValue>{worker.performanceMetrics?.averageResponseTime || 'N/A'}</StatValue><StatLabel>{t('customerFlow.workerProfile.avgResponse')}</StatLabel></StatCardInner></StatCard>
                        <StatCard><StatCardInner><CheckCircleIcon height={24} width={24} color="#22c55e" /><StatValue>{worker.performanceMetrics?.completionRate || 0}%</StatValue><StatLabel>{t('customerFlow.workerProfile.completionRate')}</StatLabel></StatCardInner></StatCard>
                        <StatCard><StatCardInner><ArrowPathRoundedSquareIcon height={24} width={24} color="#14b8a6" /><StatValue>{worker.performanceMetrics?.rehirePercentage || 0}%</StatValue><StatLabel>{t('customerFlow.workerProfile.rehireRate')}</StatLabel></StatCardInner></StatCard>
                        <StatCard><StatCardInner><StarIcon height={24} width={24} color="#f59e0b" /><StatValue>{worker.rating.toFixed(1)} Stars</StatValue><StatLabel>{t('customerFlow.workerProfile.overallSatisfaction')}</StatLabel></StatCardInner></StatCard>
                    </StatGrid>
                </Section>
            </Card>
        </Container>
    );
};
