import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from '../features/transaction/transactionSlice';
import categoryReducer from '../features/category/categoriesSlice';
import authReducer from '../features/auth/authSlice';

const reducer = combineReducers({
  auth: authReducer,
  transactions: transactionReducer,
  categories: categoryReducer,
});

const store = configureStore({ reducer });

export default store;
