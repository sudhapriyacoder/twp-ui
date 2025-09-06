import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const exists = state.items.find((p) => p._id === item._id);
      if (exists) {
        state.items = state.items.filter((p) => p._id !== item._id);
      } else {
        state.items.push(item);
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((p) => p._id !== id);
    },
  },
});

export const { toggleFavorite, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
