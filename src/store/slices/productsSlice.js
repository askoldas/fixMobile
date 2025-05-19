// src/store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const querySnapshot = await getDocs(collection(db, 'Products'));
  const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log("✅ Products fetched from Firestore:", data);
  return data;
});

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      const cleanProduct = { ...product };
      delete cleanProduct.id; // 🔥 Firestore doesn't allow undefined fields

      console.log("🚀 Attempting to add product:", cleanProduct);
      const docRef = await addDoc(collection(db, 'Products'), cleanProduct);
      console.log("✅ Product added with ID:", docRef.id);

      return { id: docRef.id, ...cleanProduct };
    } catch (error) {
      console.error("🔥 Firestore add error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product, { rejectWithValue }) => {
    try {
      const { id, ...data } = product;
      const productRef = doc(db, 'Products', id);
      await updateDoc(productRef, data);
      console.log("📝 Product updated:", id);
      return product;
    } catch (error) {
      console.error("🔥 Firestore update error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const productRef = doc(db, 'Products', id);
      await deleteDoc(productRef);
      console.log("🗑️ Product deleted:", id);
      return id;
    } catch (error) {
      console.error("🔥 Firestore delete error:", error);
      return rejectWithValue(error.message);
    }
  }
);

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
        console.log("🆕 addProduct.fulfilled:", action.payload);
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        console.error("❌ addProduct.rejected:", action.payload || action.error.message);
        state.error = action.payload || action.error.message;
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
