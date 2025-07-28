
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import dataReducer from '../store/dataSlice';
import uiReducer from '../store/uiSlice';
import customerFlowReducer from '../store/customerFlowSlice';
import workerFlowReducer from '../store/workerFlowSlice';
import chatReducer from '../store/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    ui: uiReducer,
    customerFlow: customerFlowReducer,
    workerFlow: workerFlowReducer,
    chat: chatReducer,
  },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types, as they contain non-serializable values like Date objects
      ignoredActions: ['data/fetchInitialData/fulfilled'],
      // Ignore these paths in the state
      ignoredPaths: ['data.jobRequests'],
    },
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
