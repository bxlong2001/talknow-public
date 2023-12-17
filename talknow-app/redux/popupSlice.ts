/* eslint-disable prettier/prettier */
// authSlice.ts
import {createSlice} from '@reduxjs/toolkit';

interface PopupState {
  content: string | null;
  cancel: string | null;
  confirm: string | null;
  onConfirm: string | null;
  onCancel: string | null;
  customize: string | null;
  type: string | null;
}

const initialState: PopupState = {
  content: null,
  cancel: null,
  confirm: null,
  onConfirm: null,
  onCancel: null,
  customize: null,
  type: null
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    actionPopup: (state, action) => {
      state.content = action.payload.content;
      state.cancel = action.payload.cancel;
      state.confirm = action.payload.confirm;
      state.onCancel = action.payload.onCancel;
      state.onConfirm = action.payload.onConfirm;
      state.customize = action.payload.customize;
      state.type = action.payload.type;
    },
  },
});

export const {actionPopup} = popupSlice.actions;

export default popupSlice.reducer;
