import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key, value, type) => {
  try {
    if (type === 'JSON') {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } else {
      await AsyncStorage.setItem(key, value.toString());
    }
  } catch (err) {
    console.log(err, 'error setItem');
  }
};

export const getItem = async (key, type) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null && type === 'JSON') {
      return JSON.parse(value);
    } else if (value !== null) {
      return value;
    }
    return '';
  } catch (error) {
    return '';
  }
};
