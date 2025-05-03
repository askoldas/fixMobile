import { createSlice } from '@reduxjs/toolkit';
import { clearCart } from '@/store/slices/cartSlice'; // Adjust path if needed
import { signOut } from 'firebase/auth'; // Firebase
import { auth } from '@/lib/firebase'; // Adjust path if needed

const initialState = {
  modalOpen: false,
  mode: 'login',
  user: null,
  loading: true,
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
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
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

// --- Thunk: Logout + Cleanup ---
export const logoutUser = () => async (dispatch) => {
  try {
    localStorage.removeItem('cart');
    await signOut(auth);
    dispatch(clearCart());
    dispatch(clearUser());
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
