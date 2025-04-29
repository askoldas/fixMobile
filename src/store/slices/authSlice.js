import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalOpen: false,
  mode: 'login', // 'login' or 'signup'
  user: null, // Will store user data after authentication
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.modalOpen = true;
      state.mode = action.payload || 'login'; // Accepts 'login' or 'signup'
    },
    closeAuthModal: (state) => {
      state.modalOpen = false;
    },
    toggleAuthMode: (state) => {
      state.mode = state.mode === 'login' ? 'signup' : 'login';
    },
    setUser: (state, action) => {
      state.user = action.payload; // Stores user object (e.g., { uid, email, role })
    },
    clearUser: (state) => {
      state.user = null;
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
