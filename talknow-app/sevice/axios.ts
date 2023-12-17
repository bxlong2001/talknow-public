import axios from "axios";
import URL from "../apis/url";
// eslint-disable-next-line prettier/prettier
import AsyncStorage from "@react-native-async-storage/async-storage";

const END_POINT = URL.ROOT_API;
const instance = axios.create({
  baseURL: END_POINT, // Thay đổi thành URL của dịch vụ bạn muốn gọi
  timeout: 10000, // Thời gian tối đa để chờ phản hồi (10 giây trong trường hợp này)
});

instance.interceptors.request.use(
  // eslint-disable-next-line prettier/prettier
  async (config) => {
    const accessToken = await AsyncStorage.getItem("userToken");
    if (accessToken) {
      // config.headers["Authorization"] = `Bearer ${}`;
      axios.defaults.headers.common.Authorization = ` Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    return response; // Trả về phản hồi nếu không có lỗi
  },
  (error) => {
    // Xử lý lỗi ở đây
    console.error("Error in Axios response:", error);
    return Promise.reject(error); // Chuyển lỗi cho phía gọi yêu cầu
  }
);
export default instance;
