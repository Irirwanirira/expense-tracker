import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const url = `${API_BASE_URL}/v1/api/categories`;

export const fetchCategories = createAsyncThunk('category/fetch', async () => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log(err);
  }
});

export const postCategory = createAsyncThunk(
  'category/post',
  async (newCatg) => {
    try {
      const res = await axios.post(url, newCatg);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
);

const initialState = {
  data: [],
  isLoading: false,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data || action.payload.categories || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(postCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const newCategory = action.payload.data || action.payload.category;
        if (newCategory) {
          state.data = [...state.data, newCategory];
        }
      });
  },
});

export default categorySlice.reducer;
