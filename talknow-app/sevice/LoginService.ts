import axios from "./axios";
import URL from "../apis/url";

const urlPost = `${URL.LOGIN}`; // Đổi thành URL xử lý OTP trên máy chủ
const urlGetUser = `${URL.GET_USER}`; // Đổi thành URL xử lý OTP trên máy chủ

export const loginService = async (dataUser) => {
  try {
    const response = await axios.post(urlPost, dataUser);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInforUser = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.get(urlGetUser, { headers });
    return response.data;
  } catch (error) {
    // throw error;
    console.error(error);
  }
};
