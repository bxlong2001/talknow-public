/* eslint-disable prettier/prettier */
import URL from '../apis/url';
import axios from './axios';

const urlPost = URL.FORGOT_PASSWORD; // Đổi thành URL xử lý OTP trên máy chủ

export const forgetPasswordService = async (data: any) => {
  try {
    const response = await axios.post(urlPost, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
