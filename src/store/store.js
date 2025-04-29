// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice'; // Add this line

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    ui: uiReducer,
    auth: authReducer, // Add auth slice here
  },
});

export default store;
