/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {Platform} from 'react-native';
import {RESULTS, openSettings, requestMultiple} from 'react-native-permissions';
import store from '../redux/store';
import {actionPopup} from '../redux/popupSlice';

export const handlePermissionMultiple = async (
  props: any,
  func: any,
  permissionAndroid: any,
  permissionIos: any,
  callback: any,
) => {
  if (Platform.OS === 'android') {
    requestMultiple(permissionAndroid).then(result => {
      if (
        result &&
        Object.values(result).every(status => status !== 'denied')
      ) {
        func();
      } else {
        console.log('result ,người dùng từ chối');
      }
    });
  } else {
    requestMultiple(permissionIos).then(result => {
      console.log(result);
    });
  }
};
