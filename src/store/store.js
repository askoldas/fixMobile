// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    ui: uiReducer,
  },
});

export default store;
