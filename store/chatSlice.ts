
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as apiService from '../services/apiService';
import { type ChatThread, type ChatMessage } from '../types';
import type { RootState } from '../app/store';

interface ChatState {
  threads: ChatThread[];
  messages: ChatMessage[];
  activeThreadId: string | null;
  isPanelOpen: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ChatState = {
  threads: [],
  messages: [],
  activeThreadId: null,
  isPanelOpen: false,
  status: 'idle',
};

export const fetchChatData = createAsyncThunk<
    { threads: ChatThread[], messages: ChatMessage[] },
    string,
    { state: RootState, rejectValue: string }
>(
    'chat/fetchChatData',
    async (userId, { rejectWithValue }) => {
        try {
            const threads = await apiService.fetchChatThreadsAPI(userId);
            const allMessages: ChatMessage[] = [];
            for (const thread of threads) {
                const messagesInThread = await apiService.fetchChatMessagesAPI(thread.id);
                allMessages.push(...messagesInThread);
            }
            return { threads, messages: allMessages };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLatestChatData = createAsyncThunk<
    { threads: ChatThread[], messages: ChatMessage[] },
    string,
    { state: RootState, rejectValue: string }
>(
    'chat/fetchLatestChatData',
    async (userId, { rejectWithValue }) => {
         try {
            const threads = await apiService.fetchChatThreadsAPI(userId);
            const allMessages: ChatMessage[] = [];
            for (const thread of threads) {
                const messagesInThread = await apiService.fetchChatMessagesAPI(thread.id);
                allMessages.push(...messagesInThread);
            }
            return { threads, messages: allMessages };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const sendMessage = createAsyncThunk<
    ChatMessage,
    { text: string },
    { state: RootState, rejectValue: string }
>(
    'chat/sendMessage',
    async ({ text }, { getState, rejectWithValue }) => {
        const { auth, chat } = getState();
        const { currentUser } = auth;
        const { activeThreadId, threads } = chat;

        if (!currentUser || !activeThreadId || !text.trim()) {
            return rejectWithValue('Cannot send message: missing user, thread, or text.');
        }

        const thread = threads.find(t => t.id === activeThreadId);
        if (!thread) return rejectWithValue('Active chat thread not found.');

        const receiverId = thread.participantIds.find(id => id !== currentUser.id);
        if (!receiverId) return rejectWithValue('Chat recipient not found.');

        try {
            const newMessage = await apiService.sendChatMessageAPI({
                threadId: activeThreadId,
                senderId: currentUser.id,
                receiverId,
                text: text.trim(),
            });
            return newMessage;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChatPanel: (state) => {
      state.isPanelOpen = !state.isPanelOpen;
    },
    closeChatPanel: (state) => {
        state.isPanelOpen = false;
    },
    setActiveThread: (state, action: PayloadAction<string | null>) => {
        state.activeThreadId = action.payload;
        // Mark messages as read locally for immediate UI update
        if(action.payload && state.threads.length > 0) {
            const { auth } = (this as any).getState() as RootState;
            const currentUserId = auth.currentUser?.id;
            if (currentUserId) {
                 state.messages = state.messages.map(msg =>
                    msg.threadId === action.payload && msg.receiverId === currentUserId && !msg.isRead
                    ? { ...msg, isRead: true }
                    : msg
                );
                // Fire and forget API call
                apiService.markMessagesAsReadAPI(action.payload, currentUserId);
            }
        }
    },
    startOrOpenChat: (state, action: PayloadAction<{ targetUserId: string, currentUserId: string, jobReqId?: string }>) => {
        const { targetUserId, currentUserId, jobReqId } = action.payload;
        let threadToOpen = state.threads.find(thread =>
            thread.participantIds.includes(currentUserId) &&
            thread.participantIds.includes(targetUserId) &&
            (jobReqId ? thread.jobRequestId === jobReqId : true) // Looser matching
        );

        if (threadToOpen) {
            state.activeThreadId = threadToOpen.id;
        } else {
            const newThread: ChatThread = {
                id: `thread${Date.now()}`,
                participantIds: [currentUserId, targetUserId],
                lastMessageTimestamp: Date.now(),
                jobRequestId: jobReqId,
            };
            state.threads.unshift(newThread);
            state.activeThreadId = newThread.id;
        }
        state.isPanelOpen = true;
    }
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchChatData.fulfilled, (state, action) => {
            state.threads = action.payload.threads;
            state.messages = action.payload.messages;
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
            state.messages.push(action.payload);
            const threadIndex = state.threads.findIndex(t => t.id === action.payload.threadId);
            if (threadIndex !== -1) {
                state.threads[threadIndex].lastMessageId = action.payload.id;
                state.threads[threadIndex].lastMessageTimestamp = action.payload.timestamp;
                // Move thread to top
                const updatedThread = state.threads.splice(threadIndex, 1)[0];
                state.threads.unshift(updatedThread);
            }
        })
        .addCase(fetchLatestChatData.fulfilled, (state, action) => {
            // Merge new threads
            action.payload.threads.forEach(newThread => {
                const existingIndex = state.threads.findIndex(t => t.id === newThread.id);
                if (existingIndex !== -1) {
                    if (newThread.lastMessageTimestamp > state.threads[existingIndex].lastMessageTimestamp) {
                        state.threads[existingIndex] = newThread;
                    }
                } else {
                    state.threads.push(newThread);
                }
            });
            state.threads.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
            
            // Merge new messages
            action.payload.messages.forEach(newMessage => {
                if (!state.messages.some(m => m.id === newMessage.id)) {
                    state.messages.push(newMessage);
                }
            });
        });
  }
});

export const { toggleChatPanel, closeChatPanel, setActiveThread, startOrOpenChat } = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;
export const selectUnreadMessageCount = (state: RootState) => {
    const { currentUser } = state.auth;
    if (!currentUser) return 0;
    return state.chat.messages.filter(msg => msg.receiverId === currentUser.id && !msg.isRead).length;
};


export default chatSlice.reducer;