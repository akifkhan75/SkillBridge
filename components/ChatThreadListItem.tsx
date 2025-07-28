
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { type ChatThread, type ChatMessage } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { selectAllUsers } from '../../store/dataSlice';
import { selectCurrentUser } from '../../store/authSlice';
import { selectChatState } from '../../store/chatSlice';

interface ChatThreadListItemProps {
  thread: ChatThread;
  isActive: boolean;
  onSelectThread: (threadId: string) => void;
}

const ItemContainer = styled(TouchableOpacity)<{isActive: boolean}>`
  flex-direction: row;
  padding: 12px;
  align-items: center;
  background-color: ${props => props.isActive ? '#eff6ff' : 'white'};
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

const ProfileImage = styled(Image)`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin-right: 12px;
`;

const ContentContainer = styled(View)`
  flex: 1;
`;

const TopRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ParticipantName = styled(Text)<{isActive: boolean}>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.isActive ? '#1d4ed8' : '#1f2937'};
`;

const TimestampText = styled(Text)`
  font-size: 12px;
  color: #9ca3af;
`;

const BottomRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
`;

const LastMessageText = styled(Text)`
  font-size: 12px;
  color: #6b7280;
  flex: 1;
`;

const UnreadBadge = styled(View)`
  background-color: #f59e0b;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  padding-horizontal: 6px;
  margin-left: 8px;
`;

const UnreadCountText = styled(Text)`
    color: white;
    font-size: 10px;
    font-weight: bold;
`;


export const ChatThreadListItem: React.FC<ChatThreadListItemProps> = ({
  thread,
  isActive,
  onSelectThread,
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const allUsers = useAppSelector(selectAllUsers);
  const { messages } = useAppSelector(selectChatState);

  const otherParticipant = allUsers.find(u => u.id === thread.participantIds.find(id => id !== currentUser?.id));
  const lastMessage = messages.filter(m => m.threadId === thread.id).sort((a,b) => b.timestamp - a.timestamp)[0];

  const unreadCountInThread = messages.filter(msg => msg.threadId === thread.id && msg.receiverId === currentUser?.id && !msg.isRead).length;

  const participantName = otherParticipant?.name || 'Unknown User';
  const participantImage = otherParticipant?.profileImageUrl || 'https://picsum.photos/seed/defaultuser/100';
  const lastMessageText = lastMessage?.text ? (lastMessage.text.length > 30 ? `${lastMessage.text.substring(0, 27)}...` : lastMessage.text) : 'No messages yet';
  const lastMessageTime = lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <ItemContainer isActive={isActive} onPress={() => onSelectThread(thread.id)}>
        <ProfileImage source={{ uri: participantImage }} />
        <ContentContainer>
            <TopRow>
                <ParticipantName isActive={isActive} numberOfLines={1}>{participantName}</ParticipantName>
                {lastMessageTime && <TimestampText>{lastMessageTime}</TimestampText>}
            </TopRow>
            <BottomRow>
                <LastMessageText numberOfLines={1}>{lastMessageText}</LastMessageText>
                {unreadCountInThread > 0 && (
                    <UnreadBadge>
                        <UnreadCountText>{unreadCountInThread}</UnreadCountText>
                    </UnreadBadge>
                )}
            </BottomRow>
        </ContentContainer>
    </ItemContainer>
  );
};
