import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomerFlowState, CustomerPage, IJobRequest, IWorker, ISubCategory, JobCategory, JobStatus } from '@fixli/shared';
import type { ICategoryDefinition } from '@fixli/shared';
import { MAX_MATCHED_WORKERS_TO_SHOW } from '@fixli/shared';
import * as api from '../services/api';
import type { RootState } from './index';

interface CustomerFlow {
  page: CustomerPage;
  customerFlowState: CustomerFlowState;
  currentJobRequestDetails: IJobRequest | null;
  matchedWorkersList: IWorker[];
  viewingWorkerProfileId: string | null;
  selectedTopCategory: ICategoryDefinition | null;
  selectedSubCategory: ISubCategory | null;
  searchTerm: string;
  filterSkill: JobCategory | 'all';
  isServiceFormVisible: boolean;
}

const initialState: CustomerFlow = {
  page: 'SERVICE_FLOW',
  customerFlowState: 'SELECTING_SERVICE',
  currentJobRequestDetails: null,
  matchedWorkersList: [],
  viewingWorkerProfileId: null,
  selectedTopCategory: null,
  selectedSubCategory: null,
  searchTerm: '',
  filterSkill: 'all',
  isServiceFormVisible: false,
};

export const analyzeAndMatch = createAsyncThunk<
  { newJobRequest: IJobRequest; matches: IWorker[] },
  { description: string; location: string; imageBase64?: string },
  { state: RootState; rejectValue: string }
>('customerFlow/analyzeAndMatch', async ({ description, location, imageBase64 }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.currentUser || auth.currentUser.type !== 'customer') {
    return rejectWithValue('User is not a customer.');
  }

  try {
    // AI analysis on backend
    const analysis = await api.analyzeServiceRequest(description, imageBase64);

    // Create job request
    const newJob = await api.createJobRequest({
      description,
      location,
      jobType: analysis.jobType as JobCategory,
      urgency: analysis.urgency,
      severity: analysis.severity,
      estimatedDuration: analysis.estimatedDuration,
      priceEstimate: analysis.priceEstimate,
      isEmergency: analysis.isEmergency,
      imageUrl: imageBase64 ? 'provided' : undefined, // In a real app we'd upload to S3 and save URL
      requestedDate: 'ASAP',
    });

    // Fetch matching workers
    const workers = await api.getWorkers({ skill: analysis.jobType });
    const matches = workers.slice(0, MAX_MATCHED_WORKERS_TO_SHOW);

    return { newJobRequest: newJob, matches };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to process service request.');
  }
});

export const requestBooking = createAsyncThunk<
  IJobRequest,
  { workerId: string },
  { state: RootState; rejectValue: string }
>('customerFlow/requestBooking', async ({ workerId }, { getState, rejectWithValue }) => {
  const { customerFlow, auth } = getState();
  const { currentJobRequestDetails } = customerFlow;
  if (!currentJobRequestDetails || !auth.currentUser) {
    return rejectWithValue('No active job request or user not logged in.');
  }

  try {
    const updatedJob = await api.updateJobRequest(currentJobRequestDetails.id, {
      status: 'AWAITING_WORKER' as JobStatus,
      assignedWorkerId: workerId,
    });
    return updatedJob;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const customerFlowSlice = createSlice({
  name: 'customerFlow',
  initialState,
  reducers: {
    setCustomerPage: (state, action: PayloadAction<CustomerPage>) => {
      state.page = action.payload;
      if (action.payload !== 'SERVICE_FLOW') {
        state.customerFlowState = 'SELECTING_SERVICE';
        state.viewingWorkerProfileId = null;
        state.selectedTopCategory = null;
        state.currentJobRequestDetails = null;
        state.matchedWorkersList = [];
      }
    },
    setCustomerFlowState: (state, action: PayloadAction<CustomerFlowState>) => {
      state.customerFlowState = action.payload;
    },
    resetCustomerFlow: (state) => {
      state.customerFlowState = 'SELECTING_SERVICE';
      state.currentJobRequestDetails = null;
      state.matchedWorkersList = [];
      state.viewingWorkerProfileId = null;
      state.selectedTopCategory = null;
      state.selectedSubCategory = null;
      state.isServiceFormVisible = false;
    },
    setTopCategory: (state, action: PayloadAction<ICategoryDefinition>) => {
      state.selectedTopCategory = action.payload;
      state.selectedSubCategory = null;
      state.customerFlowState = 'BROWSING_CATEGORIES';
      state.isServiceFormVisible = false;
      state.viewingWorkerProfileId = null;
    },
    setSubCategory: (state, action: PayloadAction<ISubCategory>) => {
      state.selectedSubCategory = action.payload;
    },
    setViewWorkerProfile: (state, action: PayloadAction<string>) => {
      state.viewingWorkerProfileId = action.payload;
      state.customerFlowState = 'VIEWING_WORKER_PROFILE';
    },
    backToPreviousCustomerView: (state) => {
      state.viewingWorkerProfileId = null;
      if (state.currentJobRequestDetails && state.matchedWorkersList.length > 0) {
        state.customerFlowState = 'SHOWING_MATCHES';
      } else if (state.selectedTopCategory) {
        state.customerFlowState = 'BROWSING_CATEGORIES';
      } else {
        state.customerFlowState = 'SELECTING_SERVICE';
      }
    },
    backToCategorySelection: (state) => {
      state.customerFlowState = 'SELECTING_SERVICE';
      state.selectedTopCategory = null;
      state.selectedSubCategory = null;
      state.currentJobRequestDetails = null;
      state.matchedWorkersList = [];
      state.viewingWorkerProfileId = null;
    },
    backFromSubCategoryToTop: (state) => {
      state.selectedSubCategory = null;
      state.searchTerm = '';
      state.filterSkill = 'all';
      state.viewingWorkerProfileId = null;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterSkill: (state, action: PayloadAction<JobCategory | 'all'>) => {
      state.filterSkill = action.payload;
    },
    setServiceFormVisibility: (state, action: PayloadAction<boolean>) => {
      state.isServiceFormVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeAndMatch.fulfilled, (state, action) => {
        state.currentJobRequestDetails = action.payload.newJobRequest;
        state.matchedWorkersList = action.payload.matches;
        state.customerFlowState = 'SHOWING_MATCHES';
        state.isServiceFormVisible = false;
      })
      .addCase(analyzeAndMatch.rejected, (state) => {
        state.customerFlowState = 'SELECTING_SERVICE';
      })
      .addCase(requestBooking.fulfilled, (state, action) => {
        state.currentJobRequestDetails = action.payload;
        state.customerFlowState = 'SELECTING_SERVICE';
        state.matchedWorkersList = [];
        state.viewingWorkerProfileId = null;
        state.selectedTopCategory = null;
        state.selectedSubCategory = null;
        state.isServiceFormVisible = false;
      });
  },
});

export const {
  setCustomerPage, setCustomerFlowState, resetCustomerFlow,
  setTopCategory, setSubCategory, setViewWorkerProfile,
  backToPreviousCustomerView, backToCategorySelection,
  backFromSubCategoryToTop, setSearchTerm, setFilterSkill,
  setServiceFormVisibility,
} = customerFlowSlice.actions;

export const selectCustomerFlow = (state: RootState) => state.customerFlow;
export default customerFlowSlice.reducer;
