import chatReducer, { openChatPanel, closeChatPanel, setCurrentThread, addIncomingMessage, fetchChatThreads, fetchChatMessages, sendMessage } from '../store/chatSlice';
import { IChatMessage, IChatThread } from '@skillbridge/shared';

describe('chatSlice', () => {
  const initialState = {
    threads: [],
    currentThreadId: null,
    messages: [],
    isPanelOpen: false,
    isLoading: false,
  };

  const mockMessage: IChatMessage = {
    id: 'msg1',
    threadId: 't1',
    senderId: 'u1',
    receiverId: 'u2',
    text: 'Hello',
    isRead: false,
    createdAt: new Date(),
  };

  it('should handle initial state', () => {
    expect(chatReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle openChatPanel', () => {
    expect(chatReducer(initialState, openChatPanel()).isPanelOpen).toBe(true);
  });

  it('should handle closeChatPanel', () => {
    const state = { ...initialState, isPanelOpen: true, currentThreadId: 't1', messages: [mockMessage] };
    const nextState = chatReducer(state, closeChatPanel());
    expect(nextState.isPanelOpen).toBe(false);
    expect(nextState.currentThreadId).toBeNull();
    expect(nextState.messages).toEqual([]);
  });

  it('should handle setCurrentThread', () => {
    expect(chatReducer(initialState, setCurrentThread('t2')).currentThreadId).toBe('t2');
  });

  it('should handle addIncomingMessage', () => {
    const nextState = chatReducer(initialState, addIncomingMessage(mockMessage));
    expect(nextState.messages).toHaveLength(1);
    expect(nextState.messages[0]).toEqual(mockMessage);
  });

  it('should handle fetchChatThreads.fulfilled', () => {
    const mockThread: IChatThread = { id: 't1', createdAt: new Date(), updatedAt: new Date() };
    const action = { type: fetchChatThreads.fulfilled.type, payload: [mockThread] };
    const state = chatReducer(initialState, action);
    expect(state.threads).toEqual([mockThread]);
  });

  it('should handle fetchChatMessages.pending', () => {
    const action = { type: fetchChatMessages.pending.type };
    expect(chatReducer(initialState, action).isLoading).toBe(true);
  });

  it('should handle fetchChatMessages.fulfilled', () => {
    const action = { type: fetchChatMessages.fulfilled.type, payload: [mockMessage] };
    const state = chatReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.messages).toEqual([mockMessage]);
  });

  it('should handle sendMessage.fulfilled', () => {
    const action = { type: sendMessage.fulfilled.type, payload: mockMessage };
    const state = chatReducer(initialState, action);
    expect(state.messages).toEqual([mockMessage]);
  });
});
