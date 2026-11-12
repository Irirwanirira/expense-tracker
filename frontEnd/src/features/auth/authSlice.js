import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const authUrl = `${API_BASE_URL}/v1/api/auth`;

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${authUrl}/register`, { email, password });
      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', email);

      return { accessToken, refreshToken, email };
    } catch (err) {
      console.error('Register error:', err);
      return rejectWithValue(err.response?.data?.error || 'Failed to register');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${authUrl}/login`, { email, password });
      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', email);

      return { accessToken, refreshToken, email };
    } catch (err) {
      console.error('Login error:', err);
      return rejectWithValue(err.response?.data?.error || 'Invalid credentials');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  return null;
});

const initialState = {
  isAuthenticated: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  userEmail: localStorage.getItem('userEmail'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers(builder) {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userEmail = action.payload.email;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userEmail = action.payload.email;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.userEmail = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
