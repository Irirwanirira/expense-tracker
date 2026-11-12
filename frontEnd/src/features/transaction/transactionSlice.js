import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const url = `${API_BASE_URL}/v1/api/transactions`;

// Create axios instance with auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTransactions = createAsyncThunk(
  'transaction/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(url, { headers: getAuthHeader() });
      return res.data.data || [];
    } catch (err) {
      console.error('Fetch transactions error:', err);
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch transactions');
    }
  }
);

export const postTransactions = createAsyncThunk(
  'transaction/post',
  async (newTrans, { rejectWithValue }) => {
    try {
      const res = await axios.post(url, newTrans, { headers: getAuthHeader() });
      return res.data.data;
    } catch (err) {
      console.error('Post transaction error:', err);
      return rejectWithValue(err.response?.data?.error || 'Failed to create transaction');
    }
  }
);

export const deleteTransactions = createAsyncThunk(
  'transaction/delete',
  async (transId, { rejectWithValue }) => {
    try {
      await axios.delete(`${url}/${transId}`, { headers: getAuthHeader() });
      return transId;
    } catch (err) {
      console.error('Delete transaction error:', err);
      return rejectWithValue(err.response?.data?.error || 'Failed to delete transaction');
    }
  }
);

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(postTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.data = [...state.data, action.payload];
        }
        state.error = null;
      })
      .addCase(postTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter((trans) => trans._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
