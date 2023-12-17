import axios from "./axios";
import URL from "../apis/url";

const urlPostRegister =  `${URL.REGISTER}`; // Đổi thành URL xử lý OTP trên máy chủ

export const registerService = async (dataUser) => {
  try {
    const response = await axios.post(urlPostRegister, dataUser);
    return response.data;
  } catch (error) {
    throw error;
  }
};

