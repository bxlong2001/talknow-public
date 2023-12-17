/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  StatusBar,
} from 'react-native';
import color from '../../../../constants/color';
// import { Fontisto,  } from "@expo/vector-icons";
import {useNavigation, useRoute} from '@react-navigation/native';
import URL from '../../../../apis/url';
import axios from 'axios';
import SeparatorBar from '../../../../component/separatorBar';
import {styles} from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Btn from '../../../../component/Btn';
import BtnNotice from '../../../../component/BtnNotice';
import Input from '../../../../component/Input';
import {actionPopup} from '../../../../redux/popupSlice';
import {useDispatch} from 'react-redux';
import {setPhoneService} from '../../../../sevice/sentOtpService';
import {validatePhone} from '../../../../helper/common';
// import { StatusBar } from "expo-status-bar";
import worldIcon from '../../../../assets/Icon/world.png';
// import { dispatch } from "../../../../navigation/navigation-service";
const InputPhoneScreen = (props: any) => {
  const route = useRoute();

  const type = route.params?.type;

  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [responseText, setResponseText] = useState('');
  const modifiedNumber = phoneNumber.replace(/^0/, '84');
  const [validateMessage, setValidateMessage] = useState('');
  const [keyboard, setKeyboard] = useState(true);
  const dispatch = useDispatch();

  const postData = async () => {
    const url = `${URL.ROOT_API}${URL.REGISTER_PHONE}`; // JSONPlaceholder endpoint
    const data = {
      soDienThoai: modifiedNumber,
    };

    try {
      const response = await setPhoneService(data);
      navigation.navigate('OTP', {
        modifiedNumber,
        reSendOtp: postData,
      });
    } catch (error) {
      console.error(error);
      dispatch(actionPopup({content: 'Có lỗi xác thực vui lòng thử lại sau'}));

      console.error(error);
    }
  };
  const handleSend = async () => {
    if (validatePhone(phoneNumber)) {
      if (type === 'forgotPass') {
        props.navigation.navigate('ForgotPass', {soDienThoai: phoneNumber});
      } else {
        await postData(); // Thực hiện yêu cầu POST trước khi navigation
      }
      setValidateMessage('');
    } else {
      dispatch(actionPopup({content: 'Số điện thoại không hợp lệ'}));
    }
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboard(false);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      event => {
        setKeyboard(true);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  });
  const handlePhoneNumber = (text: React.SetStateAction<string>) =>
    setPhoneNumber(text);
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor="white"></StatusBar>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View style={{flex: 20, justifyContent: 'center'}}>
          <Text
            style={{
              color: color.primary,
              fontSize: 24,
              lineHeight: 32,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            Nhập số điện thoại của bạn
          </Text>
        </View>
        <View style={{marginTop: 28, alignItems: 'center'}}>
          <Input
            prefixIcon={
              <Image source={worldIcon} style={{height: 24, width: 24}}></Image>
            }
            value={phoneNumber}
            style={{marginTop: 10, width: '90%'}}
            onChangeText={handlePhoneNumber}
            placeholder="Nhập số điện thoại của bạn"
            showDelete={false}
          />
          <View style={{alignItems: 'center'}}>
            <BtnNotice
              title={'Đã có tài khoản? Vui lòng đăng nhập tại đây.'}
              handleFuncion={() => navigation.navigate('Login')}></BtnNotice>
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              paddingTop: 15,
              color: 'red',
            }}>
            {validateMessage}
          </Text>
        </View>

        <View style={[styles.flexBtn, {width: '100%'}]}>
          <Btn title={'Tiếp Tục'} handleFuncion={handleSend}></Btn>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InputPhoneScreen;
