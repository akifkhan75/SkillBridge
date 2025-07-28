

import React from 'react';
import { APP_NAME_KEY } from '../constants';
import { useLocalization } from '../contexts/LocalizationContext';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';

const FooterContainer = styled(View)`
  background-color: #1f2937; /* gray-800 */
  padding: 32px 16px;
  margin-top: 48px;
  align-items: center;
`;

const CopyrightText = styled(Text)`
  color: #f9fafb; /* gray-100 */
  font-size: 14px;
  text-align: center;
`;

const TaglineText = styled(Text)`
  color: #f9fafb; /* gray-100 */
  font-size: 12px;
  margin-top: 4px;
  text-align: center;
`;

const LinksContainer = styled(View)`
  margin-top: 16px;
  flex-direction: row;
  align-items: center;
`;

const LinkText = styled(Text)`
  color: #3b82f6; /* blue-500 */
  font-size: 12px;
`;

const Separator = styled(Text)`
  color: #4b5563; /* gray-500 */
  margin: 0 8px;
`;

export const Footer: React.FC = () => {
  const { t } = useLocalization();
  return (
    <FooterContainer>
      <CopyrightText>{t('footer.copyright', { year: new Date().getFullYear().toString(), appName: t(APP_NAME_KEY) })}</CopyrightText>
      <TaglineText>{t('footer.tagline')}</TaglineText>
      <LinksContainer>
          <LinkText>{t('footer.privacyPolicy')}</LinkText>
          <Separator>|</Separator>
          <LinkText>{t('footer.termsOfService')}</LinkText>
          <Separator>|</Separator>
          <LinkText>{t('footer.contactUs')}</LinkText>
      </LinksContainer>
    </FooterContainer>
  );
};