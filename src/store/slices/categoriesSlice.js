// src/store/slices/categoriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const querySnapshot = await getDocs(collection(db, 'Devices'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;
