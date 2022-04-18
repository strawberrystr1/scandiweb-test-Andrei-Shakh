import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './stateSlices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
