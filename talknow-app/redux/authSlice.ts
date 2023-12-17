/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
// authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userId: string | undefined
  token: string | undefined;
  name: string | undefined;
  phoneNumber: string | undefined;
  role: string | undefined;
  isLoggedIn: boolean | undefined;
  dhPublicKey: string | undefined;
  rsaPublicKey: string | undefined;
  error: string | undefined;
  friendsId: any | undefined;
}

const initialState: AuthState = {
  userId: undefined,
  token: undefined,
  name: undefined,
  phoneNumber: undefined,
  role: undefined,
  isLoggedIn: undefined,
  error: undefined,
  dhPublicKey: undefined,
  rsaPublicKey: undefined,
  friendsId: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userInfor: (state, action) => {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.dhPublicKey = action.payload.dhPublicKey;
      state.rsaPublicKey = action.payload.rsaPublicKey;
      state.friendsId = action.payload.friendsId;
    },
    loginSuccess: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state) => {
      state.token = undefined;
      state.name = undefined;
      state.phoneNumber = undefined;
      state.role = undefined;
      state.userId = undefined;
      state.dhPublicKey = undefined;
      state.rsaPublicKey = undefined;
      state.friendsId = undefined;
    },
    loginFailure: (state, action) => {
      state.error = action.payload; // Cập nhật trạng thái lỗi
    },
  
  },
});

export const { loginSuccess, logout, loginFailure, userInfor,token } =
  authSlice.actions;

export default authSlice.reducer;
