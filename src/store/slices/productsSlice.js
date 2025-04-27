// src/store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const querySnapshot = await getDocs(collection(db, 'Products')); // Capital P
  const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log("✅ Products fetched from Firestore:", data);
  return data;
});

export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
  const docRef = await addDoc(collection(db, 'Products'), product);
  return { id: docRef.id, ...product };
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product) => {
  const { id, ...data } = product;
  const productRef = doc(db, 'Products', id);
  await updateDoc(productRef, data);
  return product;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  const productRef = doc(db, 'Products', id);
  await deleteDoc(productRef);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
