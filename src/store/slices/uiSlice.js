// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    modalOpen: false,
    editingProduct: null,
  },
  reducers: {
    openModal(state, action) {
      state.modalOpen = true;
      state.editingProduct = action.payload || null;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.editingProduct = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
