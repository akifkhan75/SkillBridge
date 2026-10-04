import authReducer, { signupUser, loginUser, clearAuthError, logoutUser } from '../store/authSlice';
import { IAuthResponse, IUser, AuthFlowState, UserType } from '@skillbridge/shared';

describe('authSlice', () => {
  const initialState = {
    currentUser: null as IUser | null,
    token: null as string | null,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
    authFlowState: 'LOGIN' as AuthFlowState,
  };

  const mockUser: IUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    type: UserType.CUSTOMER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearAuthError', () => {
    const state = { ...initialState, error: 'Some error' };
    expect(authReducer(state, clearAuthError())).toEqual(initialState);
  });

  it('should handle logoutUser', () => {
    const state = { ...initialState, currentUser: mockUser, token: 'fake-token' };
    expect(authReducer(state, logoutUser())).toEqual(initialState);
  });

  describe('loginUser', () => {
    it('should set status to loading on pending', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should set user and token on fulfilled', () => {
      const payload: IAuthResponse = { user: mockUser, token: 'jwt-token' };
      const action = { type: loginUser.fulfilled.type, payload };
      const state = authReducer(initialState, action);
      
      expect(state.status).toBe('succeeded');
      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe('jwt-token');
      expect(state.error).toBeNull();
    });

    it('should set error on rejected', () => {
      const action = { type: loginUser.rejected.type, payload: 'Invalid credentials' };
      const state = authReducer(initialState, action);
      
      expect(state.status).toBe('failed');
      expect(state.currentUser).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('signupUser', () => {
    it('should set status loading on pending', () => {
      const action = { type: signupUser.pending.type };
      const state = authReducer(initialState, action);
      expect(state.status).toBe('loading');
    });

    it('should set user and token on fulfilled', () => {
      const payload: IAuthResponse = { user: mockUser, token: 'jwt-token-new' };
      const action = { type: signupUser.fulfilled.type, payload };
      const state = authReducer(initialState, action);
      
      expect(state.status).toBe('succeeded');
      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe('jwt-token-new');
    });
  });
});
