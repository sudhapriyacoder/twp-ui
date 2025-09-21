import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Async thunk to toggle favorite and update favorites
export const toggleFavorite = createAsyncThunk(
  "user/toggleFavorite",
  async (placeId, { getState }) => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(
      "/api/user/favorites",
      { placeId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data || [];
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    email: null,
    favorites: [],
    cart: [],
  },
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateFavorites: (state, action) => {
      state.favorites = action.payload || [];
    },
    updateCart: (state, action) => {
      state.cart = action.payload || [];
    },
    logoutUser: () => ({
      id: null,
      email: null,
      favorites: [],
      cart: [],
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(toggleFavorite.fulfilled, (state, action) => {
      state.favorites = action.payload;
    });
  },
});

export const { setUser, updateFavorites, updateCart, logoutUser } =
  userSlice.actions;

export default userSlice.reducer;
