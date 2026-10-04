import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

interface Coordinates {
  latitude: number;
  longitude: number;
  heading?: number;
}

interface TrackingState {
  isTracking: boolean;
  trackedWorkerId: string | null;
  workerLocation: Coordinates | null;
  customerLocation: Coordinates | null;
  etaString: string | null;
}

const initialState: TrackingState = {
  isTracking: false,
  trackedWorkerId: null,
  workerLocation: null,
  customerLocation: null,
  etaString: null,
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    startTracking: (state, action: PayloadAction<{ workerId: string; customerLocation: Coordinates }>) => {
      state.isTracking = true;
      state.trackedWorkerId = action.payload.workerId;
      state.customerLocation = action.payload.customerLocation;
      state.workerLocation = null;
      state.etaString = 'Calculating...';
    },
    stopTracking: (state) => {
      state.isTracking = false;
      state.trackedWorkerId = null;
      state.workerLocation = null;
      state.etaString = null;
    },
    updateWorkerLocation: (state, action: PayloadAction<Coordinates>) => {
      state.workerLocation = action.payload;
      // Simple mock ETA calculation based on direct distance could go here
      // Real app would use Google Maps Matrix API
      if (state.customerLocation && state.workerLocation) {
        state.etaString = '15 mins'; // Mock string for now
      }
    },
    updateCustomerLocation: (state, action: PayloadAction<Coordinates>) => {
      state.customerLocation = action.payload;
    }
  },
});

export const { startTracking, stopTracking, updateWorkerLocation, updateCustomerLocation } = trackingSlice.actions;
export const selectTrackingState = (state: RootState) => state.tracking;
export default trackingSlice.reducer;
