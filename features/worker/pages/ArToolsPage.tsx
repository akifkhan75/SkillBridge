
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { useLocalization } from '../../../contexts/LocalizationContext';
import { Worker } from '../../../types';
import { CubeTransparentIcon } from '../../../components/icons/CubeTransparentIcon';

interface ArToolsPageProps {
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
  margin-bottom: 8px;
`;

const PageDescription = styled(Text)`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const GradientBox = styled(View)`
    padding: 32px;
    background-color: #6d28d9; /* Fallback */
    border-radius: 12px;
    align-items: center;
`;

const ImagineTitle = styled(Text)`
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
`;

const FeatureList = styled(View)`
    gap: 12px;
    align-self: flex-start;
    margin-left: 16px;
`;

const FeatureItem = styled(Text)`
    font-size: 14px;
    color: white;
`;

const StayTunedText = styled(Text)`
    margin-top: 32px;
    font-size: 18px;
    font-weight: 600;
    color: white;
`;

export const ArToolsPage: React.FC<ArToolsPageProps> = ({ worker }) => {
  const { t } = useLocalization();
  return (
    <Container>
        <Card>
            <PageTitle>{t('workerFlow.arTools.title')}</PageTitle>
            <PageDescription>{t('workerFlow.arTools.description')}</PageDescription>

            <GradientBox>
                <CubeTransparentIcon height={64} width={64} color="white" style={{ opacity: 0.8, marginBottom: 24 }} />
                <ImagineTitle>{t('workerFlow.arTools.imagine')}</ImagineTitle>
                <FeatureList>
                    <FeatureItem>&bull; {t('workerFlow.arTools.feature1')}</FeatureItem>
                    <FeatureItem>&bull; {t('workerFlow.arTools.feature2')}</FeatureItem>
                    <FeatureItem>&bull; {t('workerFlow.arTools.feature3')}</FeatureItem>
                    <FeatureItem>&bull; {t('workerFlow.arTools.feature4')}</FeatureItem>
                </FeatureList>
                <StayTunedText>{t('workerFlow.arTools.stayTuned')}</StayTunedText>
            </GradientBox>
        </Card>
    </Container>
  );
};
