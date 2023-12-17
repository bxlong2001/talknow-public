import axios from "./axios";
import URL from "../apis/url";

const urlGetFriendRequest =  `${URL.GET_FRIEND_REQUEST}`;

export const getFriendRequestService = async (status: string) => {
  try {
    const response = await axios.get(urlGetFriendRequest)
    return response.data;
  } catch (error) {
    throw error;
  }
};