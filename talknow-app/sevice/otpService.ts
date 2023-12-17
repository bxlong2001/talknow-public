import axios from "./axios";
import URL from "../apis/url";

const urlPostOtp = `${URL.VERIFY}`; // Đổi thành URL xử lý OTP trên máy chủ

export const otpService = async (data) => {
  try {
    const response = await axios.post(urlPostOtp, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
