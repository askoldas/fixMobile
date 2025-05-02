import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    modalOpen: false,
    editingProduct: null,
    cartOpen: false, // 🆕 for cart drawer visibility
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
    openCart(state) {
      state.cartOpen = true;
    },
    closeCart(state) {
      state.cartOpen = false;
    },
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },
  },
});

export const {
  openModal,
  closeModal,
  openCart,
  closeCart,
  toggleCart,
} = uiSlice.actions;

export default uiSlice.reducer;
