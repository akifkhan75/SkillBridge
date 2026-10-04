import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import customerFlowReducer from './customerFlowSlice';
import workerFlowReducer from './workerFlowSlice';
import dataReducer from './dataSlice';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';

import trackingReducer from './trackingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customerFlow: customerFlowReducer,
    workerFlow: workerFlowReducer,
    data: dataReducer,
    chat: chatReducer,
    ui: uiReducer,
    tracking: trackingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['data/fetchInitialData/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
