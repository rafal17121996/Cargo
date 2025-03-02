import { configureStore } from '@reduxjs/toolkit';
import dailyToursReducer from './slices/dailyToursSlice';

const store = configureStore({
  reducer: {
    dailyTours: dailyToursReducer,
  },
});

export default store;