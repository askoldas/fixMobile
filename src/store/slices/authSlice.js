import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalOpen: false,
  mode: 'login', // 'login' or 'signup'
  user: null, // Will store user data after authentication
  loading: true, // ✅ Track whether auth state is being resolved
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.modalOpen = true;
      state.mode = action.payload || 'login';
    },
    closeAuthModal: (state) => {
      state.modalOpen = false;
    },
    toggleAuthMode: (state) => {
      state.mode = state.mode === 'login' ? 'signup' : 'login';
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false; // ✅ Mark as loaded after successful login
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false; // ✅ Also mark as loaded even if user is unauthenticated
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  toggleAuthMode,
  setUser,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;
