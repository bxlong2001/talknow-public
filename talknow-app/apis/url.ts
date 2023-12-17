const ROOT = "https://9730-42-119-158-45.ngrok-free.app"
console.warn(ROOT)
const ROOT_API = ROOT
const URL = {
  ROOT_API,
  VERIFY: "/auth/verify",
  REGISTER: "/user",
  REGISTER_PHONE: "/auth/register",
  LOGIN: "/auth/login/mobile",
  FORGOT_PASSWORD: "/auth/forgot",
  GET_USER: "/user/me",
  GET_MY_MESSAGE: "/chat/my-message",
  GET_PAGEABLE_CHAT: "/chat/pageable",
  GET_PAGEABLE_ROOM: "/chat/room/pageable",
  GET_PAGEABLE_USER: "/user",
  GET_PRIME: "/dh",
  VERIFY_SIGNATURE: "/chat/verify",
  CHANGE_PASS: "/user/me/change/password",
  ADD_FRIEND: "/user/add-friend",
  GET_FRIEND_REQUEST: "/user/friend-request",
}
export default URL
