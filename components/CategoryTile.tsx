import React from 'react';
import { type I18nCategory } from '../constants';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { useLocalization } from '../contexts/LocalizationContext';
import type { Translations } from '../locales/en';
import styled from 'styled-components/native';
import { TouchableOpacity, View, Text } from 'react-native';

interface CategoryTileProps {
  category: I18nCategory; 
  onClick: () => void;
}

const TileContainer = styled(TouchableOpacity)<{ color?: string }>`
  background-color: ${props => props.color ? props.color.replace('bg-', '') : '#3b82f6'};
  padding: 24px;
  border-radius: 12px;
  justify-content: space-between;
  elevation: 3;
`;

const IconContainer = styled(View)`
  margin-bottom: 12px;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  align-self: flex-start;
`;

const Title = styled(Text)<{ textColor?: string }>`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.textColor ? props.textColor.replace('text-', '') : 'white'};
  margin-bottom: 4px;
`;

const Description = styled(Text)<{ textColor?: string }>`
  font-size: 14px;
  color: ${props => props.textColor ? props.textColor.replace('text-', '') : 'white'};
  opacity: 0.9;
  margin-bottom: 16px;
  flex-grow: 1;
`;

const ViewServicesContainer = styled(View)`
  margin-top: auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  opacity: 0.9;
`;

const ViewServicesText = styled(Text)<{ textColor?: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.textColor ? props.textColor.replace('text-', '') : 'white'};
`;

export const CategoryTile: React.FC<CategoryTileProps> = ({ category, onClick }) => {
  const { t } = useLocalization();
  const IconComponent = category.icon;
  const categoryName = t(`jobCategory.${category.nameEnum}` as keyof Translations);
  const categoryDescription = t(category.descriptionKey as keyof Translations);

  // A simple mapping from tailwind bg colors to hex values
  const colorMap: { [key: string]: string } = {
    'bg-blue-500': '#3b82f6',
    'bg-yellow-500': '#eab308',
    'bg-pink-500': '#ec4899',
    'bg-slate-600': '#475569',
    'bg-orange-500': '#f97316',
    'bg-purple-500': '#a855f7',
    'bg-green-500': '#22c55e',
    'bg-teal-500': '#14b8a6',
    'bg-gray-500': '#6b7280'
  };
  const textColorMap: { [key: string]: string } = {
    'text-white': '#FFFFFF'
  }

  return (
    <TileContainer
      onPress={onClick}
      color={colorMap[category.color]}
      aria-label={t('categoryTile.selectCategory', { categoryName: categoryName })}
    >
      <IconContainer>
        <IconComponent height={32} width={32} color={textColorMap[category.textColor]} />
      </IconContainer>
      <Title textColor={textColorMap[category.textColor]}>{categoryName}</Title>
      <Description textColor={textColorMap[category.textColor]}>{categoryDescription}</Description>
      <ViewServicesContainer>
        <ViewServicesText textColor={textColorMap[category.textColor]}>
          {t('categoryTile.viewServices')}
        </ViewServicesText>
        <ChevronRightIcon height={20} width={20} color={textColorMap[category.textColor]} style={{ marginLeft: 4 }}/>
      </ViewServicesContainer>
    </TileContainer>
  );
};