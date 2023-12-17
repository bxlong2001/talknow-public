/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  StatusBar,
} from 'react-native';
import color from '../../../constants/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import URL from '../../../apis/url';
import {styles} from './styles';
// import ScreenName from '../../../navigation/screen-name';
import Btn from '../../../component/Btn';
import {actionPopup} from '../../../redux/popupSlice';
import {useDispatch} from 'react-redux';
import {otpService} from '../../../sevice/otpService';
// import {  } from "expo-status-bar";
import styleAll from '../../../assets/style/styleAll';
import {formatTime} from '../../../helper/common';
import {forgetPasswordService} from '../../../sevice/ForgetPasswordService';
import store from '../../../redux/store';
const OTPScreen = (props: any) => {
  const dispatch = useDispatch();
  const type = props.route.params?.type;

  const [countdown, setCountdown] = useState(60);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpString = otpValues.join('');

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else {
      dispatch(
        actionPopup({
          content: 'Đã quá thời gian chờ',
        }),
      );
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [countdown]);

  const focusNextInput = (index: number) => {
    if (index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleInputChange = (text: string | any[], index: number) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text;
    setOtpValues(newOtpValues);

    if (text.length === 1) {
      focusNextInput(index);
    }
  };
  const navigation = useNavigation();
  const [responseText, setResponseText] = useState('');
  const OTP = otpString;
  const route = useRoute();
  const phoneNumber = route.params?.modifiedNumber;
  const newPassword = route.params?.password;
  const resentOtp = route.params?.reSendOtp;
  // console.log(route.params)
  // console.log(responseText);
  const sendOTP = async (props: any) => {
    const data = {
      otp: OTP,
      soDienThoai: phoneNumber,
    };
    try {
      const response = await otpService(data);
      console.log('Dữ liệu phản hồi:', response);
      if (response.statusCode === 200) {
        navigation.navigate('CreateUserName', {phoneNumber});
      } else {
        dispatch(
          actionPopup({
            content: 'Xác thực mã OTP thất bại.',
          }),
        );
      }
    } catch (error) {
      dispatch(
        actionPopup({
          content: 'Xác thực mã OTP thất bại.',
        }),
      );
      console.error(error);
    }
  };

  const handleSendDataForgot = async () => {
    const data = {
      soDienThoai: phoneNumber.replace(/^0/, '84'),
      otpCode: OTP,
      password: newPassword,
    };
    const response = await forgetPasswordService(data);
    if (response.statusCode == 200) {
      props.navigation.navigate('Login');
    }
  };
  return (
    <SafeAreaView
      // className="pt-10 h-full w-full"
      style={{
        backgroundColor: 'white',
        flex: 1,
        width: '100%',
        paddingTop: 10,
      }}>
      <StatusBar backgroundColor="white"></StatusBar>
      <View style={{flex: 20, justifyContent: 'center'}}>
        <Text
          style={[
            {color: color.primary, textAlign: 'center'},
            styleAll.textSuperBig,
          ]}>
          Nhập Mã OTP
        </Text>
        <Text style={(styleAll.textBig, {height: 28, textAlign: 'center'})}>
          Mã OTP đã được gửi đến điện thoại của bạn
        </Text>
      </View>
      <View
        // className="items-center"
        style={{flex: 50, alignItems: 'center'}}>
        <View style={styles.containerOtp}>
          {inputRefs.map((inputRef, index) => (
            <View key={index} style={styles.circle}>
              <TextInput
                maxLength={1}
                value={otpValues[index]}
                ref={inputRef}
                style={styles.InputOtp}
                keyboardType="numeric"
                onChangeText={text => handleInputChange(text, index)}
                onKeyPress={({nativeEvent}) => {
                  if (nativeEvent.key === 'Backspace' && index > 0) {
                    inputRefs[index - 1].current.focus();
                  }
                }}
              />
            </View>
          ))}
        </View>
        <Text style={{textAlign: 'center', paddingTop: 10}}>
          {' '}
          {formatTime(countdown)}
        </Text>
        <View
          // className=" flex-row"
          style={{flexDirection: 'row'}}>
          <Text
            // className="text-center"
            style={(styleAll.textMedium, {textAlign: 'center'})}>
            Bạn nhận được chưa ?
          </Text>
          <TouchableOpacity
            onPress={async () => {
              if (newPassword) {
                await resentOtp({soDienThoai: phoneNumber.replace(/^0/, '84')}),
                  setCountdown(60);
              } else {
                resentOtp(), setCountdown(60);
              }
            }}
            // className="ml-1"
            style={{marginLeft: 4}}>
            <Text style={styleAll.textBold}>Gửi lại</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.flexBtn, {width: '100%'}]}>
        <Btn
          title={' Xác nhận mã OTP'}
          handleFuncion={() => {
            if (newPassword) {
              handleSendDataForgot();
            } else {
              sendOTP();
            }
          }}></Btn>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
