import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// API Base URL
const API_URL = "https://twp-server.onrender.com/api/continents/";

// Thunks
export const fetchContinents = createAsyncThunk(
  "continents/fetch",
  async () => {
    const res = await axiosInstance.get(API_URL);
    return res.data;
  }
);

export const addContinent = createAsyncThunk(
  "continents/add",
  async (name) => {
    const res = await axiosInstance.post(API_URL, { name });
    return res.data;
  }
);

export const updateContinent = createAsyncThunk(
  "continents/update",
  async ({ id, name }) => {
    const res = await axiosInstance.put(`${API_URL}${id}`, { name });
    return res.data;
  }
);

export const deleteContinent = createAsyncThunk(
  "continents/delete",
  async (id) => {
    await axiosInstance.delete(`${API_URL}${id}`);
    return id;
  }
);

// Slice
const continentSlice = createSlice({
  name: "continents",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContinents.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addContinent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateContinent.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteContinent.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      });
  },
});

export default continentSlice.reducer;
