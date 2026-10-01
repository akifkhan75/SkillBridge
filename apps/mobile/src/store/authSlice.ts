import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser, AuthFlowState } from '@skillbridge/shared';
import * as api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import type { RootState } from './index';

interface AuthState {
  currentUser: IUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  authFlowState: AuthFlowState;
}

const initialState: AuthState = {
  currentUser: null,
  token: null,
  status: 'idle',
  error: null,
  authFlowState: 'LOGIN',
};

export const loginUser = createAsyncThunk<
  { user: IUser; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.login(credentials.email, credentials.password);
    await SecureStore.setItemAsync('authToken', response.token);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk<
  { user: IUser; token: string },
  { name: string; email: string; password: string; type: 'customer' | 'worker' },
  { rejectValue: string }
>('auth/signupUser', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.signup(formData);
    await SecureStore.setItemAsync('authToken', response.token);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

export const restoreSession = createAsyncThunk<
  { user: IUser; token: string } | null,
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (!token) return null;
    // Validate token by fetching current user
    // For now, just restore token (backend validates on API calls)
    return null;
  } catch {
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.authFlowState = 'LOGIN';
      SecureStore.deleteItemAsync('authToken');
    },
    setAuthFlowState: (state, action: PayloadAction<AuthFlowState>) => {
      state.authFlowState = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.authFlowState = 'LOGIN';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.authFlowState = 'LOGIN';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Signup failed';
      });
  },
});

export const { logoutUser, setAuthFlowState, clearAuthError } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthLoading = (state: RootState) => state.auth.status === 'loading';
export const selectAuthFlowState = (state: RootState) => state.auth.authFlowState;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
