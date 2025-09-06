// store/stateSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


// ✅ Fetch States
export const fetchStates = createAsyncThunk("states/fetchStates", async () => {
  const res = await axiosInstance.get('/api/states');
  return res.data;
});

// ✅ Create State
export const createState = createAsyncThunk("states/createState", async (state) => {
  const res = await axiosInstance.post('/api/states', state);
  return res.data;
});

// ✅ Update State
export const updateState = createAsyncThunk("states/updateState", async ({ id, state }) => {
  const res = await axiosInstance.put(`/api/states/${id}`, state);
  return res.data;
});

// ✅ Delete State
export const deleteState = createAsyncThunk("states/deleteState", async (id) => {
  await axiosInstance.delete(`/api/states/${id}`);
  return id;
});

const stateSlice = createSlice({
  name: "states",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateState.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      });
  },
});

export default stateSlice.reducer;
