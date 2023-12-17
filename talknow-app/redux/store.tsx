/* eslint-disable prettier/prettier */
// store.ts
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import popupReducer from './popupSlice';
import socket from './socketSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
    socket: socket,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
