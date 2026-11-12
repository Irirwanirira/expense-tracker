import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const url = `${API_BASE_URL}/v1/api/categories`;

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCategories = createAsyncThunk(
  'category/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(url, { headers: getAuthHeader() });
      return res.data.data || res.data.categories || [];
    } catch (err) {
      console.error('Fetch categories error:', err);
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const postCategory = createAsyncThunk(
  'category/post',
  async (newCatg, { rejectWithValue }) => {
    try {
      const res = await axios.post(url, newCatg, { headers: getAuthHeader() });
      return res.data.data || res.data.category;
    } catch (err) {
      console.error('Post category error:', err);
      return rejectWithValue(err.response?.data?.error || 'Failed to create category');
    }
  }
);

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(postCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.data = [...state.data, action.payload];
        }
        state.error = null;
      })
      .addCase(postCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
