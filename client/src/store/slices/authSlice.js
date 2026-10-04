import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await authService.signIn(username, password);
      // Persist to localStorage so token survives page refresh
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email,
        roles: data.roles
      }));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sign in failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signup',
  async (useRouteLoaderData, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email,
        roles: data.roles
      }));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sign Up Failed.');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

// ─── Initial State ────────────────────────────────────────────────────────────

const storedUser = localStorage.getItem('user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          username: action.payload.username,
          email: action.payload.email,
          roles: action.payload.roles
        };
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Sign Up
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          username: action.payload.username,
          email: action.payload.email,
          roles: action.payload.roles
        };
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;