
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type WorkerPage, type ProjectsPageTab, type PaymentTimeFilter } from '../types';
import { RootState } from '../app/store';

interface WorkerFlowState {
  currentWorkerPage: WorkerPage;
  currentProjectTab: ProjectsPageTab;
  paymentTimeFilter: PaymentTimeFilter;
}

const initialState: WorkerFlowState = {
  currentWorkerPage: 'DASHBOARD',
  currentProjectTab: 'CURRENT',
  paymentTimeFilter: 'ALL_TIME',
};

const workerFlowSlice = createSlice({
  name: 'workerFlow',
  initialState,
  reducers: {
    setWorkerPage: (state, action: PayloadAction<WorkerPage>) => {
      state.currentWorkerPage = action.payload;
    },
    setProjectTab: (state, action: PayloadAction<ProjectsPageTab>) => {
      state.currentProjectTab = action.payload;
    },
    setPaymentFilter: (state, action: PayloadAction<PaymentTimeFilter>) => {
      state.paymentTimeFilter = action.payload;
    },
  },
});

export const { setWorkerPage, setProjectTab, setPaymentFilter } = workerFlowSlice.actions;

export const selectWorkerFlow = (state: RootState) => state.workerFlow;

export default workerFlowSlice.reducer;