
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as apiService from '../services/apiService';
import { type User, type AuthFlowState } from '../types';
import type { SignupFormData } from '../features/auth/SignupPage';
import type { RootState } from '../app/store';

interface AuthState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  authFlowState: AuthFlowState;
}

const initialState: AuthState = {
  currentUser: null,
  status: 'idle',
  error: null,
  authFlowState: 'LOGIN',
};

export const loginUser = createAsyncThunk<User, { email: string, password: string }, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await apiService.loginUserAPI(credentials.email, credentials.password);
      if (user) {
        return user;
      } else {
        return rejectWithValue('Invalid email or password.');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk<User, SignupFormData, { rejectValue: string }>(
    'auth/signupUser',
    async (formData, { rejectWithValue }) => {
        try {
            const user = await apiService.signupUserAPI(formData);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.authFlowState = 'LOGIN';
    },
    setAuthFlowState: (state, action: PayloadAction<AuthFlowState>) => {
        state.authFlowState = action.payload;
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
        state.currentUser = action.payload;
        state.authFlowState = 'LOGIN'; // Reset flow
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
        state.currentUser = action.payload;
        state.authFlowState = 'LOGIN'; // Go to app after signup
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Signup failed';
      });
  },
});

export const { logoutUser, setAuthFlowState } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsAuthLoading = (state: RootState) => state.auth.status === 'loading';
export const selectAuthFlowState = (state: RootState) => state.auth.authFlowState;
export const selectAuthError = (state: RootState) => state.auth.error;


export default authSlice.reducer;
