/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import color from '../../../../constants/color';
// import { FontAwesome } from "@expo/vector-icons";
import userIcon from '../../../../assets/Icon/user.png';
import lockIcon from '../../../../assets/Icon/lock.png';
import {useNavigation, useRoute} from '@react-navigation/native';
import {loginSuccess, userInfor} from '../../../../redux/authSlice';
import store, {AppDispatch} from '../../../../redux/store';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import Input from '../../../../component/Input';
import Btn from '../../../../component/Btn';
import BtnNotice from '../../../../component/BtnNotice';
import {actionPopup} from '../../../../redux/popupSlice';
import {getInforUser, loginService} from '../../../../sevice/LoginService';
import {saveItem} from '../../../../sevice/Asy';
// import { StatusBar } from "expo-status-bar";
import EncryptedStorage from 'react-native-encrypted-storage';
import {setPhoneService} from '../../../../sevice/sentOtpService';
import {Crypt, RSA} from 'hybrid-crypto-js';
import crypto from 'crypto';
import Modal from 'react-native-modal';
import {HEIGHT, WIDTH} from '../../../../config/const';
import URL from '../../../../apis/url';
import DeviceInfo from "react-native-device-info"
import OneSignal from "react-native-onesignal"

const LoginScreen = () => {
  const dispatch: AppDispatch = useDispatch();

  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();
  const [p, setP] = useState<string>('');
  const [g, setG] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const modifiedNumber = phone.replace(/^0/, '84');

  useEffect(() => {
    if (!p || !g) getPrime();
  });
  const generateKeyPairAsync = async () => {
    const rsa = new RSA();
    return new Promise((resolve, reject) => {
      rsa.generateKeyPair(function (keyPair: {
        privateKey: any;
        publicKey: any;
      }) {
        if (keyPair) {
          resolve({
            privateKey: keyPair.privateKey,
            publicKey: keyPair.publicKey,
          });
        } else {
          reject(new Error('Failed to generate private key.'));
        }
      },
      2048);
    });
  };

  const getPrime = async () => {
    try {
      const result = await axios.get(`${URL.ROOT_API}${URL.GET_PRIME}`);
      if (!!result?.data?.data?.p && !!result?.data?.data?.g) {
        setP(result?.data?.data?.p);
        setG(result?.data?.data?.g);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const postDataVerify = async () => {
    const data = {
      soDienThoai: modifiedNumber,
    };
    try {
      const response = await setPhoneService(data);
      navigation.navigate('OTP', {
        modifiedNumber,
        reSendOtp: postDataVerify,
        type: 'CreateKey',
      }); // Navigation sau khi yêu cầu POST đã hoàn thành
    } catch (error) {
      console.error(error);
      dispatch(
        actionPopup({
          content: 'Có lỗi xác thực vui lòng thử lại sau',
        }),
      );
      console.error(error);
    }
  };
  const createKey = async (
    userInforData: {
      _id: any;
      dhPublicKey: any;
      rsaPublicKey: any;
      friendsId: any;
      hoTen: any;
      soDienThoai: any;
      role: any;
    },
    token: any,
  ) => {
    setLoading(true);
    const dh = crypto.createDiffieHellman(Buffer.from(p, 'hex'), g);
    const rsa: any = await generateKeyPairAsync();
    const dhPrivateKeyNew = await dh.generateKeys();
    const dhPrivateKey = dhPrivateKeyNew.toString('hex');

    try {
      await EncryptedStorage.setItem('rsaPrivateKey', rsa.privateKey);
      await EncryptedStorage.setItem('dhPrivateKey', dhPrivateKey);
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'BottomNavigation'}], // 'Home' là tên của màn hình chính
      });
      dispatch(
        loginSuccess({
          isLoggedIn: true,
        }),
      );
      dispatch(
        userInfor({
          userId: userInforData._id,
          dhPublicKey: userInforData.dhPublicKey,
          rsaPublicKey: userInforData.rsaPublicKey,
          friendsId: userInforData.friendsId,
          name: userInforData.hoTen,
          token: token,
          phoneNumber: userInforData.soDienThoai,
          isLoggedIn: true,
          role: userInforData.role,
        }),
      );
    } catch (error) {
      console.error(error);
      setLoading(false);

    }
  };
  const sendInfor = async () => {
    const deviceId = await DeviceInfo.getUniqueId()
    const deviceData = await OneSignal.getDeviceState()
    const oneSignalId = deviceData?.userId || deviceId
    const data = {
      username: modifiedNumber,
      password: password,
      deviceId: deviceId,
      oneSignalId
    };
    try {
      const response = await loginService(data);

      console.log('Dữ liệu phản hồi:', response);

      if (!!response.data) {
        const token = response.data.accessToken;
        // thay đổi chỗ lưu token
        await saveItem('userToken', token);
        const userInforResponse = await getInforUser(token);
        const userInforData = userInforResponse.data;
        const privateKey = await EncryptedStorage.getItem('dhPrivateKey');
        const rsaPK = await EncryptedStorage.getItem('rsaPrivateKey');

        if (!!userInforData) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          if (privateKey && rsaPK) {
            navigation.reset({
              index: 0,
              routes: [{name: 'BottomNavigation'}], // 'Home' là tên của màn hình chính
            });
            dispatch(
              loginSuccess({
                isLoggedIn: true,
              }),
            );
            dispatch(
              userInfor({
                userId: userInforData._id,
                dhPublicKey: userInforData.dhPublicKey,
                rsaPublicKey: userInforData.rsaPublicKey,
                friendsId: userInforData.friendsId,
                name: userInforData.hoTen,
                token: token,
                phoneNumber: userInforData.soDienThoai,
                isLoggedIn: true,
                role: userInforData.role,
              }),
            );
          } else {
            store.dispatch(
              actionPopup({
                content:
                  'Bạn đang đăng nhập trên thiết bị mới bạn có muốn đồng bộ dữ liệu cũ ko ?',
                onConfirm: () => {
                  postDataVerify();
                },
                onCancel: async () => {
                  await createKey(userInforData, token);
                },
                cancel: 'Tiếp tục',
                confirm: 'Đồng bộ',
                type: 'confirm',
              }),
            );
          }
        }

      } else {
        // dispatch(loginFailure("Sai tài khoản hoặc mật khẩu."));
        dispatch(actionPopup({content: 'Sai tài khoản hoặc mật khẩu'}));
      }
    } catch (error) {
      // dispatch(loginFailure("Sai tài khoản hoặc mật khẩu."));
      dispatch(actionPopup({content: 'Sai tài khoản hoặc mật khẩu'}));

      console.error(error);
    }
  };
  const handleInputPhone = (text: React.SetStateAction<string>) =>
    setPhone(text);
  const handleInputPassword = (text: React.SetStateAction<string>) =>
    setPassword(text);
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor="white"></StatusBar>
      <ScrollView
        // className=" h-full w-full"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          width: '100%',
        }}>
        <View
          // className=" justify-center" style={{ flex: 30 }}
          style={{justifyContent: 'center', flex: 30}}>
          <Text
            // className="text-2xl font-medium text-center"
            style={{
              color: color.primary,
              fontSize: 24,
              lineHeight: 32,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            Đăng nhập
          </Text>
          {/* <View className="h-7"></View> */}
          <Text
            // className="text-center"
            style={(styles.title, {paddingTop: 30, textAlign: 'center'})}>
            TalkNow kết nối mọi người lại với nhau
          </Text>
        </View>
        <View
          //  className="items-center"
          style={{flex: 30, alignItems: 'center'}}>
          <Input
            prefixIcon={
              // <FontAwesome name="user" size={24} color="black" />
              <Image source={userIcon} style={{height: 24, width: 24}}></Image>
            }
            // title={"Nhập lại mật khẩu mới"}
            value={phone}
            style={{marginTop: 10, width: '90%'}}
            onChangeText={handleInputPhone}
            placeholder={'Nhập số điện thoại'}
            // isPassword
            showDelete={false}
          />
          <View style={{height: 5}}></View>
          <Input
            prefixIcon={
              // <FontAwesome name="lock" size={24} color="black" />
              <Image source={lockIcon} style={{height: 24, width: 24}}></Image>
            }
            // title={"Nhập lại mật khẩu mới"}
            value={password}
            style={{marginTop: 10, width: '90%'}}
            onChangeText={handleInputPassword}
            placeholder="Nhập mật khẩu"
            isPassword
            showDelete={false}
          />
          <View
            style={{
              width: '100%',
              height: 30,
            }}>
            <BtnNotice
              style={{position: 'absolute', right: 30}}
              title={'Quên mật khẩu'}
              handleFuncion={() =>
                navigation.navigate('InputPhone', {type: 'forgotPass'})
              }></BtnNotice>
          </View>
          <View style={{alignItems: 'center', marginTop: 0}}>
            <BtnNotice
              title={' Bạn chưa có tài khoản?'}
              handleFuncion={() =>
                navigation.navigate('InputPhone')
              }></BtnNotice>
          </View>
        </View>

        <View style={[styles.flexBtn, {width: '100%'}]}>
          <Btn title={' Đăng Nhập'} handleFuncion={sendInfor}></Btn>
        </View>
      </ScrollView>
      {loading === true && (
        <Modal isVisible={true}>
          <View style={{flex: 1}}>
            <ActivityIndicator
              style={{
                position: 'absolute',
                top: HEIGHT / 2 - 20,
                left: WIDTH / 2 - 20,
                elevation: 1,
              }}
              size="large"
              color="red"
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
