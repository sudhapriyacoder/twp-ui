import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ─── Async Thunks ──────────────────────────────

// Fetch Places by City ID
export const fetchPlacesById = createAsyncThunk(
  "selection/fetchById",
  async (id) => {
    const res = await axiosInstance.get(`/api/place/${id}`);
    return res.data; // assuming API returns { places: [...] }
  }
);

// ─── Slice ──────────────────────────────
const selectionSlice = createSlice({
  name: "selection",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch by CityId
      .addCase(fetchPlacesById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlacesById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchPlacesById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default selectionSlice.reducer;
