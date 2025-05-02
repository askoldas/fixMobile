import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Each item: { productId, name, price, quantity, imageUrl }
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      return action.payload;
    },

    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrls?.[0] || '',
          quantity: 1,
        });
      }

      state.totalQuantity += 1;
      state.totalPrice += product.price;
    },

    removeFromCart(state, action) {
      const productId = action.payload;
      const item = state.items.find(item => item.productId === productId);

      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter(item => item.productId !== productId);
      }
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const item = state.items.find(item => item.productId === productId);

      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.price;
      }
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const item = state.items.find(item => item.productId === productId);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;
      } else {
        cartSlice.caseReducers.removeFromCart(state, { payload: productId });
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
