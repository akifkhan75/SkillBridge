import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootState } from './index';

export type Appearance = 'system' | 'light' | 'dark';
const KEY = '@fixli/appearance';

interface UiState {
  isInitializing: boolean;
  appError: string | null;
  /** User's choice; "system" follows the phone's light/dark setting. */
  appearance: Appearance;
}

const initialState: UiState = { isInitializing: false, appError: null, appearance: 'system' };

export const loadAppearance = createAsyncThunk<Appearance>('ui/loadAppearance', async () => {
  const saved = await AsyncStorage.getItem(KEY).catch(() => null);
  return saved === 'light' || saved === 'dark' ? saved : 'system';
});

export const setAppearance = createAsyncThunk<Appearance, Appearance>('ui/setAppearance', async (value) => {
  await AsyncStorage.setItem(KEY, value).catch(() => undefined);
  return value;
});

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setInitializing: (state, action: PayloadAction<boolean>) => { state.isInitializing = action.payload; },
    setAppError: (state, action: PayloadAction<string | null>) => { state.appError = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAppearance.fulfilled, (state, a) => { state.appearance = a.payload; })
      .addCase(setAppearance.fulfilled, (state, a) => { state.appearance = a.payload; });
  },
});

export const { setInitializing, setAppError } = uiSlice.actions;
export const selectUiState = (state: RootState) => state.ui;
export const selectAppearance = (state: RootState) => state.ui.appearance;
export default uiSlice.reducer;
