
import React from 'react';
import { type ChatMessage } from '../../types';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isSender: boolean;
}

const BubbleContainer = styled(View)<{isSender: boolean}>`
  align-self: ${props => props.isSender ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isSender ? '#2563eb' : '#e5e7eb'};
  border-radius: 12px;
  ${props => props.isSender ? 'border-bottom-right-radius: 2px;' : 'border-bottom-left-radius: 2px;'}
  padding: 12px;
  margin-vertical: 4px;
  max-width: 80%;
`;

const MessageText = styled(Text)<{isSender: boolean}>`
  font-size: 14px;
  color: ${props => props.isSender ? 'white' : '#1f2937'};
`;

const TimestampText = styled(Text)<{isSender: boolean}>`
  font-size: 10px;
  color: ${props => props.isSender ? '#dbeafe' : '#6b7280'};
  text-align: right;
  margin-top: 4px;
`;

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, isSender }) => {
  const timeFormatted = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <BubbleContainer isSender={isSender}>
      <MessageText isSender={isSender}>{message.text}</MessageText>
      <TimestampText isSender={isSender}>{timeFormatted}</TimestampText>
    </BubbleContainer>
  );
};
