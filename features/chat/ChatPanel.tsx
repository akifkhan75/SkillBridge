import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/authSlice';
import { selectAllUsers } from '../../store/dataSlice';
import {
  selectChatState,
  setActiveThread,
  sendMessage,
  closeChatPanel,
  fetchLatestChatData,
} from '../../store/chatSlice';
import { ChatThreadListItem } from './ChatThreadListItem';
import { ChatMessageBubble } from './ChatMessageBubble';
import { PaperAirplaneIcon } from '../../components/icons/PaperAirplaneIcon';
import { XCircleIcon } from '../../components/icons/XCircleIcon';
import { InformationCircleIcon } from '../../components/icons/InformationCircleIcon';
import { useLocalization } from '../../contexts/LocalizationContext';

const ModalOverlay = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
`;

const PanelContainer = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height'
})`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 20px;
  elevation: 5;
  width: 90%;
  max-width: 800px;
  height: 80%;
  max-height: 700px;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  background-color: #f9fafb;
`;

const HeaderTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const Body = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const ThreadListContainer = styled(View)`
  width: 35%;
  border-right-width: 1px;
  border-right-color: #e5e7eb;
  background-color: white;
`;

const MessageAreaContainer = styled(View)`
  flex: 1;
  background-color: #f9fafb;
`;

const NoSelectionContainer = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const NoSelectionText = styled(Text)`
    font-size: 16px;
    color: #6b7280;
    text-align: center;
    margin-top: 16px;
`;


const MessageInputContainer = styled(View)`
  padding: 12px;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  background-color: white;
  flex-direction: row;
  align-items: center;
`;

const StyledTextInput = styled(TextInput)`
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 8px;
`;

const SendButton = styled(TouchableOpacity)`
  padding: 10px;
  background-color: #2563eb;
  border-radius: 20px;
`;

export const ChatPanel: React.FC = () => {
  const { t } = useLocalization();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const allUsers = useAppSelector(selectAllUsers);
  const { threads, messages, activeThreadId, isPanelOpen, status } = useAppSelector(selectChatState);

  const [newMessageText, setNewMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const activeThreadMessages = activeThreadId ? messages.filter(msg => msg.threadId === activeThreadId).sort((a, b) => a.timestamp - b.timestamp) : [];
  const activeThreadDetails = activeThreadId ? threads.find(t => t.id === activeThreadId) : null;
  const otherParticipant = activeThreadDetails && currentUser ? allUsers.find(u => u.id === activeThreadDetails.participantIds.find(id => id !== currentUser.id)) : null;

   useEffect(() => {
    if (isPanelOpen && currentUser) {
        dispatch(fetchLatestChatData(currentUser.id)); // Initial fetch
        const interval = setInterval(() => {
            dispatch(fetchLatestChatData(currentUser.id));
        }, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }
  }, [isPanelOpen, currentUser, dispatch]);

  const handleSendMessageClick = () => {
    if (newMessageText.trim()) {
      dispatch(sendMessage({ text: newMessageText.trim() }));
      setNewMessageText('');
    }
  };
  
  const handleSelectThread = (threadId: string) => {
      dispatch(setActiveThread(threadId));
  }

  if (!isPanelOpen || !currentUser) return null;

  return (
    <Modal visible={isPanelOpen} transparent={true} animationType="fade" onRequestClose={() => dispatch(closeChatPanel())}>
        <ModalOverlay>
            <PanelContainer>
                <Header>
                <HeaderTitle>
                    {activeThreadId && otherParticipant ? t('chatPanel.headerWithUser', {userName: otherParticipant.name}) : t("chatPanel.headerDefault")}
                </HeaderTitle>
                <TouchableOpacity onPress={() => dispatch(closeChatPanel())} >
                    <XCircleIcon height={28} width={28} color="#6b7280" />
                </TouchableOpacity>
                </Header>
                <Body>
                <ThreadListContainer>
                    {status === 'loading' && threads.length === 0 ? <ActivityIndicator style={{marginTop: 20}}/> :
                    threads.length === 0 ? (
                        <NoSelectionContainer>
                            <InformationCircleIcon height={40} width={40} color="#9ca3af" />
                            <NoSelectionText>{t("chatPanel.noConversations")}</NoSelectionText>
                        </NoSelectionContainer>
                    ) : (
                    <FlatList
                        data={threads}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <ChatThreadListItem
                                thread={item}
                                isActive={item.id === activeThreadId}
                                onSelectThread={handleSelectThread}
                            />
                        )}
                    />
                    )}
                </ThreadListContainer>
                <MessageAreaContainer>
                    {activeThreadId ? (
                        <>
                            <FlatList
                                ref={flatListRef}
                                data={activeThreadMessages}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => <ChatMessageBubble message={item} isSender={item.senderId === currentUser.id} />}
                                contentContainerStyle={{ padding: 8 }}
                                onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
                                onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
                            />
                            <MessageInputContainer>
                                <StyledTextInput
                                    value={newMessageText}
                                    onChangeText={setNewMessageText}
                                    placeholder={t("chatPanel.typeMessagePlaceholder")}
                                    multiline
                                />
                                <SendButton onPress={handleSendMessageClick} disabled={!newMessageText.trim()}>
                                    <PaperAirplaneIcon height={20} width={20} color="white" />
                                </SendButton>
                            </MessageInputContainer>
                        </>
                    ) : (
                        <NoSelectionContainer>
                             <InformationCircleIcon height={48} width={48} color="#9ca3af" />
                            <NoSelectionText>{t("chatPanel.selectConversation")}</NoSelectionText>
                        </NoSelectionContainer>
                    )}
                </MessageAreaContainer>
                </Body>
            </PanelContainer>
        </ModalOverlay>
    </Modal>
  );
};
