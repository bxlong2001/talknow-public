import axios from './axios';
import URL from '../apis/url';

const urlPost = `${URL.CHANGE_PASS}`; // Đổi thành URL xử lý OTP trên máy chủ

export const changePasswordService = async data => {
  try {
    const response = await axios.post(urlPost, data);
    return response;
  } catch (error) {
    throw error;
  }
};
