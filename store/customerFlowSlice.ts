import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  type CustomerFlowState,
  type JobRequest,
  type Worker,
  type SubCategory,
  type ServiceAnalysis,
  JobCategory,
  type CustomerPage,
} from '../types';
import { I18nCategory, MAX_MATCHED_WORKERS_TO_SHOW } from '../constants';
import * as apiService from '../services/apiService';
import { analyzeServiceRequestWithGemini } from '../services/geminiService';
import { RootState } from '../app/store';
import { addJobRequest, updateJobRequest } from './dataSlice';

interface CustomerFlow {
  page: CustomerPage;
  customerFlowState: CustomerFlowState;
  currentJobRequestDetails: JobRequest | null;
  matchedWorkersList: Worker[];
  viewingWorkerProfileId: string | null;
  selectedTopCategory: I18nCategory | null;
  selectedSubCategory: SubCategory | null;
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
    { newJobRequest: JobRequest, matches: Worker[] },
    { description: string, location: string },
    { state: RootState, rejectValue: string }
>(
    'customerFlow/analyzeAndMatch',
    async ({ description, location }, { getState, dispatch, rejectWithValue }) => {
        const { auth, data } = getState();
        if (!auth.currentUser || auth.currentUser.type !== 'customer') {
            return rejectWithValue('User is not a customer.');
        }

        try {
            const analysis: ServiceAnalysis = await analyzeServiceRequestWithGemini(description);

            const jobRequestData = {
                customerName: auth.currentUser.name,
                customerId: auth.currentUser.id,
                description,
                location,
                serviceAnalysis: analysis,
                requestedDate: 'ASAP',
            };

            const newJobRequest = await apiService.createJobRequestAPI(jobRequestData as any);
            dispatch(addJobRequest(newJobRequest));
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

            const allWorkers = data.workers;
            const filtered = allWorkers.filter(worker =>
                worker.skills.includes(analysis.jobType as JobCategory) &&
                worker.isOnline &&
                worker.activationStatus === 'ACTIVE'
            );
            const sortedWorkers = filtered.sort((a, b) => {
                if (a.availability === 'Available Now' && b.availability !== 'Available Now') return -1;
                if (a.availability !== 'Available Now' && b.availability === 'Available Now') return 1;
                return (a.distance ?? Infinity) - (b.distance ?? Infinity) || b.rating - a.rating;
            });
            const matches = sortedWorkers.slice(0, MAX_MATCHED_WORKERS_TO_SHOW);
            
            const updatedJobWithMatches = await apiService.updateJobRequestAPI(newJobRequest.id, { status: 'Matches Found' });
            dispatch(updateJobRequest(updatedJobWithMatches));
            
            return { newJobRequest: updatedJobWithMatches, matches };

        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to process service request.');
        }
    }
);

export const requestBooking = createAsyncThunk<
    JobRequest,
    { workerId: string },
    { state: RootState, rejectValue: string }
>(
    'customerFlow/requestBooking',
    async ({ workerId }, { getState, dispatch, rejectWithValue }) => {
        const { customerFlow, auth } = getState();
        const { currentJobRequestDetails } = customerFlow;
        if (!currentJobRequestDetails || !auth.currentUser) {
            return rejectWithValue('No active job request to book or user not logged in.');
        }

        try {
            const updatedJob = await apiService.updateJobRequestAPI(currentJobRequestDetails.id, {
                status: 'Awaiting Worker',
                assignedWorkerId: workerId,
            });

            dispatch(updateJobRequest(updatedJob));
            
            return updatedJob;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);


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
    setTopCategory: (state, action: PayloadAction<I18nCategory>) => {
        state.selectedTopCategory = action.payload;
        state.selectedSubCategory = null;
        state.customerFlowState = 'BROWSING_CATEGORIES';
        state.isServiceFormVisible = false;
        state.viewingWorkerProfileId = null;
    },
    setSubCategory: (state, action: PayloadAction<SubCategory>) => {
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
    }
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
            state.customerFlowState = 'SELECTING_SERVICE'; // Go back to dashboard
             // Reset relevant parts of the flow
            state.matchedWorkersList = [];
            state.viewingWorkerProfileId = null;
            state.selectedTopCategory = null;
            state.selectedSubCategory = null;
            state.isServiceFormVisible = false;
        });
  }
});

export const {
  setCustomerPage,
  setCustomerFlowState,
  resetCustomerFlow,
  setTopCategory,
  setSubCategory,
  setViewWorkerProfile,
  backToPreviousCustomerView,
  backToCategorySelection,
  backFromSubCategoryToTop,
  setSearchTerm,
  setFilterSkill,
  setServiceFormVisibility,
} = customerFlowSlice.actions;

export const selectCustomerFlow = (state: RootState) => state.customerFlow;
export default customerFlowSlice.reducer;