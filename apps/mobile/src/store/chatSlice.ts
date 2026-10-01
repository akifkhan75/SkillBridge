import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IChatThread, IChatMessage } from '@skillbridge/shared';
import * as api from '../services/api';
import type { RootState } from './index';

interface ChatState {
  threads: IChatThread[];
  currentThreadId: string | null;
  messages: IChatMessage[];
  isPanelOpen: boolean;
  isLoading: boolean;
}

const initialState: ChatState = {
  threads: [],
  currentThreadId: null,
  messages: [],
  isPanelOpen: false,
  isLoading: false,
};

export const fetchChatThreads = createAsyncThunk('chat/fetchThreads', async (userId: string) => {
  return api.getChatThreads(userId);
});

export const fetchChatMessages = createAsyncThunk('chat/fetchMessages', async (threadId: string) => {
  return api.getChatMessages(threadId);
});

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: { threadId: string; receiverId: string; text: string }) => {
    return api.sendChatMessage(data);
  },
);

export const markMessagesRead = createAsyncThunk(
  'chat/markRead',
  async (data: { threadId: string; userId: string }) => {
    return api.markMessagesAsRead(data.threadId, data.userId);
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChatPanel: (state) => { state.isPanelOpen = true; },
    closeChatPanel: (state) => { state.isPanelOpen = false; state.currentThreadId = null; state.messages = []; },
    setCurrentThread: (state, action: PayloadAction<string>) => { state.currentThreadId = action.payload; },
    addIncomingMessage: (state, action: PayloadAction<IChatMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatThreads.fulfilled, (state, action) => { state.threads = action.payload; })
      .addCase(fetchChatMessages.pending, (state) => { state.isLoading = true; })
      .addCase(fetchChatMessages.fulfilled, (state, action) => { state.messages = action.payload; state.isLoading = false; })
      .addCase(sendMessage.fulfilled, (state, action) => { state.messages.push(action.payload); });
  },
});

export const { openChatPanel, closeChatPanel, setCurrentThread, addIncomingMessage } = chatSlice.actions;
export const selectChatState = (state: RootState) => state.chat;
export default chatSlice.reducer;
