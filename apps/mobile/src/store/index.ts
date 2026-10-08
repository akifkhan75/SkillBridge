import { configureStore } from '@reduxjs/toolkit';
import authReducer, { sessionExpired } from './authSlice';
import { setSessionExpiredHandler } from '../services/session';
import workerFlowReducer from './workerFlowSlice';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';

import trackingReducer from './trackingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workerFlow: workerFlowReducer,
    chat: chatReducer,
    ui: uiReducer,
    tracking: trackingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// When a token refresh is rejected, drop the UI back to the sign-in screen.
setSessionExpiredHandler(() => store.dispatch(sessionExpired()));
