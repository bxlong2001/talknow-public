
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import color from '../../../../constants/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import {styles} from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Input from '../../../../component/Input';
import Btn from '../../../../component/Btn';
import {useDispatch} from 'react-redux';
import {actionPopup} from '../../../../redux/popupSlice';
import {registerService} from '../../../../sevice/registerService';
import {validatePassword} from '../../../../helper/common';
import userIcon from '../../../../assets/Icon/user.png';
import lockIcon from '../../../../assets/Icon/lock.png';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import URL from '../../../../apis/url';
import crypto from 'crypto';
import {Crypt, RSA} from 'hybrid-crypto-js';
import store from '../../../../redux/store';
import {Buffer} from 'buffer';

const CreateUserName = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();
  const route = useRoute();
  const phoneNumber = route?.params?.phoneNumber;
  const [p, setP] = useState<string>('');
  const [g, setG] = useState<string>('');
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!p || !g) getPrime();
  // });

  // const getPrime = async () => {
  //   try {
  //     const result = await axios.get(`${URL.ROOT_API}${URL.GET_PRIME}`);
  //     if (!!result?.data?.data?.p && !!result?.data?.data?.g) {
  //       setP(result?.data?.data?.p);
  //       setG(result?.data?.data?.g);
  //     }
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // };

  const sendInfor = async () => {
    if (!validatePassword(password)) {
      dispatch(
        actionPopup({
          content:
            'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái thường, một chữ cái hoa, một số và một ký tự đặc biệt.',
        }),
      );

      return;
    } else {
            
      const data = {
        soDienThoai: phoneNumber,
        password: password,
        hoTen: name,
        role: 'user',
      };

      try {
        const response = await registerService(data);
        if (response.statusCode === 200) {
          // lưu khóa bí mật
          try {
            store.dispatch(actionPopup({content: 'Đăng ký thành công'}));

            navigation.navigate('Login');
          } catch (error) {
            console.log('lưu Thất bại dhPrivateKey: ', error);
          }
        } else {
          dispatch(
            actionPopup({
              content: 'Đăng ký thất bại',
            }),
          );
        }
      } catch (error) {
        dispatch(
          actionPopup({
            content: 'Đang có lỗi hệ thông vui lòng thử lại sau.',
          }),
        );
        console.error(error);
      }
    }
  };
  const handleName = (text: string) => setName(text);
  const handlePassword = (text: string) => setPassword(text);
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor="white"></StatusBar>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View
          style={{flex: 20, justifyContent: 'center'}}>
          <Text
            style={{
              color: color.primary,
              fontSize: 30,
              lineHeight: 36,
              textAlign: 'center',
              fontWeight: '500',
            }}>
            Đăng Ký
          </Text>
          <Text style={(styles.title, {paddingTop: 30, textAlign: 'center'})}>
            Tạo tài khoản để trò chuyện
          </Text>
        </View>
        <View style={{flex: 30, alignItems: 'center'}}>
          <Input
            prefixIcon={
              <Image source={userIcon} style={{height: 24, width: 24}}></Image>
            }
            value={name}
            style={{marginTop: 10, width: '90%'}}
            onChangeText={handleName}
            placeholder={'Nhập Tên của bạn'}
            showDelete={false}
          />

          <Input
            prefixIcon={
              <Image source={lockIcon} style={{height: 24, width: 24}}></Image>
            }
            // title={"Nhập lại mật khẩu mới"}
            value={password}
            style={{marginTop: 10, width: '90%'}}
            onChangeText={handlePassword}
            placeholder={'Nhập Mật Khẩu'}
            isPassword
            showDelete={false}
          />
        </View>

        <View style={[styles.flexBtn, {width: '100%'}]}>
          <Btn title={' Đăng Ký'} handleFuncion={sendInfor}></Btn>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateUserName;
