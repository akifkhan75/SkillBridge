
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { JobRequest, CustomerFlowState } from '../types';
import { loginUser, signupUser } from './authSlice';
import { fetchInitialData } from './dataSlice';
import { analyzeAndMatch } from './customerFlowSlice';

interface UiState {
  appError: string | null;
  isInitializing: boolean;
  isPageLoading: boolean;
  isSubmittingServiceRequest: boolean;
  isWorkerDrawerOpen: boolean;
  customerFlowState: CustomerFlowState; // Duplicating for the animation trigger
  currentJobRequestDetailsForAnimation: JobRequest | null;
  modals: {
    isEditBasicInfoModalOpen: boolean;
    isManageEquipmentModalOpen: boolean;
    isEquipmentChartModalOpen: boolean;
  };
}

const initialState: UiState = {
  appError: null,
  isInitializing: true,
  isPageLoading: false,
  isSubmittingServiceRequest: false,
  isWorkerDrawerOpen: false,
  customerFlowState: 'SELECTING_SERVICE',
  currentJobRequestDetailsForAnimation: null,
  modals: {
    isEditBasicInfoModalOpen: false,
    isManageEquipmentModalOpen: false,
    isEquipmentChartModalOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<string | null>) => {
      state.appError = action.payload;
    },
    clearAppError: (state) => {
        state.appError = null;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.isPageLoading = action.payload;
    },
    toggleWorkerDrawer: (state) => {
      state.isWorkerDrawerOpen = !state.isWorkerDrawerOpen;
    },
    closeWorkerDrawer: (state) => {
        state.isWorkerDrawerOpen = false;
    },
    openModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle loading states from other slices
      .addCase(fetchInitialData.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(fetchInitialData.fulfilled, (state) => {
        state.isInitializing = false;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.isInitializing = false;
        state.appError = action.payload as string;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.appError = action.payload ?? 'Login failed';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.appError = action.payload ?? 'Signup failed';
      })
      .addCase(analyzeAndMatch.pending, (state, action) => {
        state.customerFlowState = 'AI_ANALYZING';
        state.appError = null;
        state.currentJobRequestDetailsForAnimation = {
            id: '',
            customerName: '',
            customerId: '',
            description: action.meta.arg.description,
            createdAt: new Date(),
            location: action.meta.arg.location,
            status: 'AI Analyzing'
        };
      })
      .addCase(analyzeAndMatch.fulfilled, (state) => {
        state.customerFlowState = 'SHOWING_MATCHES';
        state.currentJobRequestDetailsForAnimation = null;
      })
      .addCase(analyzeAndMatch.rejected, (state, action) => {
        state.customerFlowState = 'SELECTING_SERVICE';
        state.appError = action.payload as string;
        state.currentJobRequestDetailsForAnimation = null;
      });
  },
});

export const { setAppError, clearAppError, setPageLoading, toggleWorkerDrawer, closeWorkerDrawer, openModal, closeModal } = uiSlice.actions;

export const selectUiState = (state: RootState) => ({
    ...state.ui,
    customerFlowState: state.customerFlow.customerFlowState
});

export default uiSlice.reducer;
