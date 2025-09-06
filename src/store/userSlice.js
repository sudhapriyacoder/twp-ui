import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setUser, updateFavorites, updateCart, logoutUser } =
  userSlice.actions;

export default userSlice.reducer;
