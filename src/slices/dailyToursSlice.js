import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchDailyTours = createAsyncThunk(
  "dailyTours/fetchDailyTours",
  async (date) => {
    const response = await api.get(`/daily-tours/${date}`);
    return response.data;
  }
);

const dailyToursSlice = createSlice({
  name: "dailyTours",
  initialState: {
    tours: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateStop: (state, action) => {
      const { tourId, stop } = action.payload;
      const tour = state.tours.find((t) => t.id === tourId);
      if (tour && tour.stops) {
        const index = tour.stops.findIndex((s) => s.id === stop.id);
        if (index !== -1) {
          tour.stops[index] = stop;
          const nextStop = tour.stops.find((s) => s.order === stop.order + 1);
          if (nextStop) {
            nextStop.wb1_arrival = stop.wb1_departure;
            nextStop.wb2_arrival = stop.wb2_departure;
          }
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchDailyTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateStop, addStopLocal } = dailyToursSlice.actions;
export default dailyToursSlice.reducer;
