import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogout = async () => {

  // Xóa token khỏi AsyncStorage
  await AsyncStorage.removeItem('userToken');

  // Tại đây, bạn có thể thực hiện điều hướng người dùng đến trang đăng nhập hoặc trang chính, vv.
};