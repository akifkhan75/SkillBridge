import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { IWorker, IJobRequest, IServicePackage, ISubscriptionPlan, IUser } from '@fixli/shared';
import * as api from '../services/api';
import type { RootState } from './index';

interface DataState {
  users: IUser[];
  workers: IWorker[];
  jobRequests: IJobRequest[];
  servicePackages: IServicePackage[];
  subscriptionPlans: ISubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DataState = {
  users: [],
  workers: [],
  jobRequests: [],
  servicePackages: [],
  subscriptionPlans: [],
  isLoading: false,
  error: null,
};

export const fetchInitialData = createAsyncThunk('data/fetchInitialData', async (_, { getState }) => {
  const [workers, jobRequests, servicePackages, subscriptionPlans] = await Promise.all([
    api.getWorkers(),
    api.getJobRequests(),
    api.getServicePackages(),
    api.getSubscriptionPlans(),
  ]);
  return { workers, jobRequests, servicePackages, subscriptionPlans };
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addJobRequest: (state, action) => {
      state.jobRequests.unshift(action.payload);
    },
    updateJobRequest: (state, action) => {
      const index = state.jobRequests.findIndex((j) => j.id === action.payload.id);
      if (index !== -1) state.jobRequests[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workers = action.payload.workers;
        state.jobRequests = action.payload.jobRequests;
        state.servicePackages = action.payload.servicePackages;
        state.subscriptionPlans = action.payload.subscriptionPlans;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch data';
      });
  },
});

export const { addJobRequest, updateJobRequest } = dataSlice.actions;
export default dataSlice.reducer;
