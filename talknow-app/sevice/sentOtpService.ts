// import axios from "axios";
// import URL from "../apis/url";

// const urlPostdata =  `${URL.ROOT_API}${URL.REGISTER_PHONE}`; // Đổi thành URL xử lý OTP trên máy chủ

// export const sentOtpService = async (data) => {
//   try {
//     const response = await axios.post(urlPostdata, data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

import axios from "./axios";
import URL from "../apis/url";

const urlPostOtp = `${URL.REGISTER_PHONE}`; // Đổi thành URL xử lý OTP trên máy chủ
export const setPhoneService = async (data) => {
  try {
    const response = await axios.post(urlPostOtp, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
