
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as apiService from '../services/apiService';
import {
  type User,
  type Worker,
  type JobRequest,
  type ServicePackage,
  type SubscriptionPlan,
  type ChatMessage,
  type ChatThread,
} from '../types';
import { RootState } from '../app/store';

interface DataState {
  users: User[];
  workers: Worker[];
  jobRequests: JobRequest[];
  servicePackages: ServicePackage[];
  subscriptionPlans: SubscriptionPlan[];
  chatThreads: ChatThread[];
  chatMessages: ChatMessage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DataState = {
  users: [],
  workers: [],
  jobRequests: [],
  servicePackages: [],
  subscriptionPlans: [],
  chatThreads: [],
  chatMessages: [],
  status: 'idle',
  error: null,
};

export const fetchInitialData = createAsyncThunk('data/fetchInitialData', async (_, { rejectWithValue, getState }) => {
  try {
    const [usersData, workersData, jobsData, packagesData, plansData] = await Promise.all([
      apiService.fetchAllUsersAPI(),
      apiService.fetchWorkersAPI(),
      apiService.fetchJobRequestsAPI(),
      apiService.fetchServicePackagesAPI(),
      apiService.fetchSubscriptionPlansAPI(),
    ]);

    const state = getState() as RootState;
    const currentUser = state.auth.currentUser;
    let chatThreads: ChatThread[] = [];
    let chatMessages: ChatMessage[] = [];

    if (currentUser) {
        chatThreads = await apiService.fetchChatThreadsAPI(currentUser.id);
        const messagesPromises = chatThreads.map(thread => apiService.fetchChatMessagesAPI(thread.id));
        const messagesArrays = await Promise.all(messagesPromises);
        chatMessages = messagesArrays.flat();
    }


    return { usersData, workersData, jobsData, packagesData, plansData, chatThreads, chatMessages };
  } catch (error: any) {
    return rejectWithValue(error.toString());
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
     // Reducer to update a job request, e.g., after an action
    updateJobRequest: (state, action: PayloadAction<JobRequest>) => {
      const index = state.jobRequests.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.jobRequests[index] = action.payload;
      }
    },
    addJobRequest: (state, action: PayloadAction<JobRequest>) => {
        state.jobRequests.unshift(action.payload);
    },
    updateWorker: (state, action: PayloadAction<Worker>) => {
      const index = state.workers.findIndex(worker => worker.id === action.payload.id);
      if (index !== -1) {
        state.workers[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.usersData;
        state.workers = action.payload.workersData;
        state.jobRequests = action.payload.jobsData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        state.servicePackages = action.payload.packagesData;
        state.subscriptionPlans = action.payload.plansData;
        state.chatThreads = action.payload.chatThreads;
        state.chatMessages = action.payload.chatMessages;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { updateJobRequest, addJobRequest, updateWorker } = dataSlice.actions;

export const selectAllWorkers = (state: RootState) => state.data.workers;
export const selectAllJobRequests = (state: RootState) => state.data.jobRequests;
export const selectAllUsers = (state: RootState) => state.data.users;
export const selectWorkerById = (workerId: string | null) => (state: RootState) => state.data.workers.find(w => w.id === workerId);
export const selectPackagesAndPlans = (state: RootState) => ({
    servicePackages: state.data.servicePackages,
    subscriptionPlans: state.data.subscriptionPlans,
});


export default dataSlice.reducer;
