import React from 'react';
import { View, Text } from 'react-native';
import { type ServicePackage, type SubscriptionPlan } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import styled from 'styled-components/native';

interface OfferCardProps {
  offer: ServicePackage | SubscriptionPlan;
  type: 'package' | 'subscription';
}

const CardContainer = styled(View)`
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  elevation: 3;
`;

const ComingSoonBadge = styled(View)`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #fef3c7;
  padding: 4px 8px;
  border-radius: 12px;
`;

const ComingSoonText = styled(Text)`
  color: #92400e;
  font-size: 10px;
  font-weight: 600;
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const IconContainer = styled(View)`
  padding: 12px;
  background-color: #e0f2fe; /* light blue */
  border-radius: 8px;
  margin-right: 16px;
`;

const TitleContainer = styled(View)`
  flex: 1;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
`;

const Subtitle = styled(Text)`
  font-size: 12px;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled(Text)`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 16px;
  flex-grow: 1;
`;

const FeaturesContainer = styled(View)`
  margin-bottom: 16px;
`;

const FeaturesTitle = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const FeatureItem = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 6px;
`;

const FeatureText = styled(Text)`
  font-size: 14px;
  color: #4b5563;
  margin-left: 8px;
  flex: 1;
`;

const MoreItemsText = styled(Text)`
    font-size: 12px;
    color: #6b7280;
    font-style: italic;
    margin-left: 28px;
`;

const Footer = styled(View)`
  margin-top: auto;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #f3f4f6;
`;

const PriceText = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 8px;
`;

const DisabledButton = styled(View)`
  width: 100%;
  background-color: #d1d5db;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const DisabledButtonText = styled(Text)`
  color: #6b7280;
  font-weight: 500;
`;

export const OfferCard: React.FC<OfferCardProps> = ({ offer, type }) => {
  const IconComponent = offer.icon;
  const featuresOrBenefits = type === 'package' ? (offer as ServicePackage).includedFeatures : (offer as SubscriptionPlan).benefits;
  const price = type === 'package' ? (offer as ServicePackage).indicativePrice : `${(offer as SubscriptionPlan).pricePerTerm} (${(offer as SubscriptionPlan).frequency})`;

  return (
    <CardContainer>
      <ComingSoonBadge>
        <ComingSoonText>Coming Soon</ComingSoonText>
      </ComingSoonBadge>
      <Header>
        <IconContainer>
          <IconComponent height={32} width={32} color="#2563eb" />
        </IconContainer>
        <TitleContainer>
          <Title>{offer.name}</Title>
          <Subtitle>{offer.categoryName} {type === 'package' ? 'Package' : 'Subscription'}</Subtitle>
        </TitleContainer>
      </Header>
      
      <Description>{offer.description}</Description>
      
      <FeaturesContainer>
        <FeaturesTitle>
          {type === 'package' ? "What's Included:" : 'Key Benefits:'}
        </FeaturesTitle>
        <View>
          {featuresOrBenefits.slice(0, 3).map((item, index) => (
            <FeatureItem key={index}>
              <CheckIcon height={20} width={20} color="#10b981" style={{ marginTop: 2 }} />
              <FeatureText>{item}</FeatureText>
            </FeatureItem>
          ))}
          {featuresOrBenefits.length > 3 && (
            <MoreItemsText>+ {featuresOrBenefits.length - 3} more</MoreItemsText>
          )}
        </View>
      </FeaturesContainer>
      
      <Footer>
        <PriceText>{price}</PriceText>
        <DisabledButton>
          <DisabledButtonText>Learn More</DisabledButtonText>
        </DisabledButton>
      </Footer>
    </CardContainer>
  );
};