// src/store/taxonomySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


// Single API call → returns continent → countries → states → cities
export const fetchTaxonomy = createAsyncThunk("taxonomy/fetchAll", async () => {
  const res = await axiosInstance.get(`/api/taxonomy/all`);
  return res.data;
});

const taxonomySlice = createSlice({
  name: "taxonomy",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxonomy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxonomy.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaxonomy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default taxonomySlice.reducer;
