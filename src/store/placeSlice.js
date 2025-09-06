import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// API Base URL


// ─── Async Thunks ──────────────────────────────

// Fetch All Places
export const fetchPlaces = createAsyncThunk("places/fetch", async () => {
  const res = await axiosInstance.get('/api/places/');
  return res.data;
});

// Add Place
export const addPlace = createAsyncThunk("places/add", async (placeData) => {
  const res = await axiosInstance.post('/api/places/', placeData);
  return res.data;
});

// Update Place
export const updatePlace = createAsyncThunk(
  "places/update",
  async ({ id, updatedData }) => {
    const res = await axiosInstance.put(`/api/places/${id}`, updatedData);
    return res.data;
  }
);

// Delete Place
export const deletePlace = createAsyncThunk("places/delete", async (id) => {
  await axiosInstance.delete(`/api/places/${id}`);
  return id;
});

// ─── Slice ──────────────────────────────
const placeSlice = createSlice({
  name: "places",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPlaces.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add
      .addCase(addPlace.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updatePlace.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      // Delete
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export default placeSlice.reducer;
