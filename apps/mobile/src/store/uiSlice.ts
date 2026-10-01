import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

interface UiState {
  isInitializing: boolean;
  appError: string | null;
  themeMode: 'dark' | 'light';
}

const initialState: UiState = {
  isInitializing: false,
  appError: null,
  themeMode: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    },
    setAppError: (state, action: PayloadAction<string | null>) => {
      state.appError = action.payload;
    },
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
    },
    setThemeMode: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setInitializing, setAppError, toggleTheme, setThemeMode } = uiSlice.actions;
export const selectUiState = (state: RootState) => state.ui;
export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export default uiSlice.reducer;
