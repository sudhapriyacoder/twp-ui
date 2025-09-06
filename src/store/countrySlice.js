import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


// Fetch all countries
export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async () => {
    const res = await axiosInstance.get('/api/countries');
    return res.data;
  }
);

// Create country
export const createCountry = createAsyncThunk(
  "countries/createCountry",
  async (country) => {
    const res = await axiosInstance.post('/api/countries', country);
    return res.data;
  }
);

// Update country
export const updateCountry = createAsyncThunk(
  "countries/updateCountry",
  async ({ id, country }) => {
    const res = await axiosInstance.put(`/api/countries/${id}`, country);
    return res.data;
  }
);

// Delete country
export const deleteCountry = createAsyncThunk(
  "countries/deleteCountry",
  async (id) => {
    await axiosInstance.delete(`/api/countries/${id}`);
    return id;
  }
);

const countrySlice = createSlice({
  name: "countries",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCountry.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      });
  },
});

export default countrySlice.reducer;
