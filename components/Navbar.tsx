

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutUser, selectCurrentUser } from '../store/authSlice';
import { toggleChatPanel, selectUnreadMessageCount } from '../store/chatSlice';
import { setCustomerPage } from '../store/customerFlowSlice';
import { APP_NAME_KEY, DEFAULT_CUSTOMER_PROFILE_IMAGE, DEFAULT_WORKER_PROFILE_IMAGE, ChatIcon } from '../constants';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ArrowRightStartOnRectangleIcon } from './icons/ArrowRightStartOnRectangleIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { Bars3Icon } from './icons/Bars3Icon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { useLocalization } from '../contexts/LocalizationContext';
import { LanguageCode, LANGUAGE_NAMES } from '../locales';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, Image } from 'react-native';

const NavContainer = styled(View)`
  background-color: #3b82f6; /* Fallback for linear-gradient */
  padding: 12px 16px;
  padding-top: 40px; /* Safe area for status bar */
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LogoContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const AppName = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-left: 8px;
`;

const ActionsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: 8px;
  margin-left: 8px;
  position: relative;
`;

const UnreadBadge = styled(View)`
    position: absolute;
    top: 5px;
    right: 5px;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background-color: #ef4444;
    border: 2px solid white;
`;

const DropdownContainer = styled(View)`
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: white;
  border-radius: 8px;
  padding: 4px 0;
  width: 180px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  z-index: 100;
`;

const DropdownItem = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
`;

const DropdownItemText = styled(Text)`
    font-size: 14px;
    color: #1f2937;
    margin-left: 8px;
`;

const ProfileImage = styled(Image)`
    height: 32px;
    width: 32px;
    border-radius: 16px;
`;


const Navbar: React.FC = (props: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t, language, setLanguage, dir } = useLocalization();
  const currentUser = useAppSelector(selectCurrentUser);
  const unreadMessageCount = useAppSelector(selectUnreadMessageCount);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    setIsProfileDropdownOpen(false);
  };

  const handleNavigate = (page: string) => {
    // @ts-ignore
    navigation.navigate(page);
    setIsProfileDropdownOpen(false);
  }

  const getFlagEmoji = (langCode: LanguageCode): string => {
    switch (langCode) {
      case 'en': return '🇺🇸';
      case 'ar': return '🇸🇦';
      case 'ur': return '🇵🇰';
      default: return '🌐';
    }
  }

  return (
    <>
    <NavContainer>
      <LogoContainer onPress={() => handleNavigate('ServiceFlow')}>
        <BriefcaseIcon height={32} width={32} color="#facc15" />
        <AppName>{t(APP_NAME_KEY)}</AppName>
      </LogoContainer>

      <ActionsContainer>
        {currentUser && (
          <ActionButton onPress={() => dispatch(toggleChatPanel())}>
            <ChatIcon height={24} width={24} color="white" />
            {unreadMessageCount > 0 && <UnreadBadge />}
          </ActionButton>
        )}
        <ActionButton onPress={() => setIsLanguageDropdownOpen(p => !p)}>
            <GlobeAltIcon height={24} width={24} color="white" />
        </ActionButton>

        {currentUser && (
            <ActionButton onPress={() => setIsProfileDropdownOpen(p => !p)}>
              <ProfileImage source={{ uri: currentUser.profileImageUrl || (currentUser.type === 'worker' ? DEFAULT_WORKER_PROFILE_IMAGE : DEFAULT_CUSTOMER_PROFILE_IMAGE) }} />
            </ActionButton>
        )}
      </ActionsContainer>
    </NavContainer>
    {isLanguageDropdownOpen && (
        <DropdownContainer style={{ top: 80, right: currentUser ? 80 : 10 }}>
            {(Object.keys(LANGUAGE_NAMES) as LanguageCode[]).map((langCode) => (
                <DropdownItem key={langCode} onPress={() => { setLanguage(langCode); setIsLanguageDropdownOpen(false); }}>
                    <DropdownItemText>{getFlagEmoji(langCode)} {LANGUAGE_NAMES[langCode]}</DropdownItemText>
                </DropdownItem>
            ))}
        </DropdownContainer>
    )}
    {isProfileDropdownOpen && currentUser && (
        <DropdownContainer>
             {currentUser.type === 'worker' ? (
                <>
                    <DropdownItem onPress={() => handleNavigate('MyProfile')}><UserCircleIcon height={20} width={20} color="#6b7280" /><DropdownItemText>{t('navbar.viewProfile')}</DropdownItemText></DropdownItem>
                    <DropdownItem onPress={() => handleNavigate('Settings')}><Cog6ToothIcon height={20} width={20} color="#6b7280" /><DropdownItemText>{t('navbar.settings')}</DropdownItemText></DropdownItem>
                </>
             ) : (
                <>
                    <DropdownItem onPress={() => handleNavigate('Profile')}><UserCircleIcon height={20} width={20} color="#6b7280" /><DropdownItemText>{t('navbar.viewProfile')}</DropdownItemText></DropdownItem>
                    <DropdownItem onPress={() => handleNavigate('Settings')}><Cog6ToothIcon height={20} width={20} color="#6b7280" /><DropdownItemText>{t('navbar.settings')}</DropdownItemText></DropdownItem>
                </>
             )}
             <DropdownItem onPress={handleLogout}><ArrowRightStartOnRectangleIcon height={20} width={20} color="#dc2626" /><DropdownItemText style={{color: '#dc2626'}}>{t('navbar.logout')}</DropdownItemText></DropdownItem>
        </DropdownContainer>
    )}
    </>
  );
};

export default Navbar;