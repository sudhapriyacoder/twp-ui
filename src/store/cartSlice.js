// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


// --- Async actions ---
export const fetchCart = createAsyncThunk(
  "cart/fetchCart", async (userId) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get(`/api/user/${userId}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, placeId }) => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(
      `/api/user/${userId}/cart`,
      { userId, placeId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, placeId }) => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.delete(
      `/api/user/${userId}/cart/${placeId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId) => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(
      `/api/cart/clear`,
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

// --- Slice ---
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload; // backend returns updated cart
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
