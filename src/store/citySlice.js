import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const fetchCities = createAsyncThunk("cities/fetch", async () => {
  const res = await axiosInstance.get('/api/cities');
  return res.data;
});

export const addCity = createAsyncThunk("cities/add", async (city) => {
  const res = await axiosInstance.post('/api/cities', city);
  return res.data;
});

export const updateCity = createAsyncThunk("cities/update", async ({ id, data }) => {
  const res = await axiosInstance.put(`/api/cities/${id}`, data);
  return res.data;
});

export const deleteCity = createAsyncThunk("cities/delete", async (id) => {
  await axiosInstance.delete(`/api/cities/${id}`);
  return id;
});

const citySlice = createSlice({
  name: "cities",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx > -1) {
          state.list[idx] = { ...state.list[idx], ...action.payload }; // ✅ merge properly
        }
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      });
  },
});

export default citySlice.reducer;
