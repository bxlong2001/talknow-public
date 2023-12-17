/* eslint-disable prettier/prettier */
// authSlice.ts
import {createSlice} from '@reduxjs/toolkit';

interface PopupState {
  socket: any | null;
  p: any | null;
  q: any | null;
}

const initialState: PopupState = {
  socket: undefined,
  p: undefined,
  q: undefined,
};

const popupSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    actionSaveSocket: (state, action) => {
      state.socket = action.payload.socket;
    },
    actionSaveP: (state, action) => {
      state.p = action.payload.p;
    },
    actionSaveG: (state, action) => {
      state.q = action.payload.g;
    },
  },
});

export const {actionSaveSocket, actionSaveP, actionSaveG} = popupSlice.actions;

export default popupSlice.reducer;
