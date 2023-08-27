import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const url = 'http://localhost:5000/v1/api/transactions';
// const url = 'https://expense-tracker-pdh7.onrender.com/v1/api/transactions';

export const fetchTransactions = createAsyncThunk(
  'transaction/fetch',
  async () => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const postTransactions = createAsyncThunk(
  'transaction/post',
  async (newTrans) => {
    try {
      const res = await axios.post(url, newTrans);
      console.log(newTrans);

      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const deleteTransactions = createAsyncThunk(
  'transaction/delete',
  async (transId) => {
    try {
      const res = await axios.delete(`${url}/${transId}`);
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

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.transactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(postTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [...state.data, action.payload.newTrans];
      })
      .addCase(deleteTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(
          (trans) => trans._id !== action.payload.id
        );
      });
  },
});

export default transactionSlice.reducer;
