/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import URL from '../../apis/url';
import {loginSuccess, userInfor} from '../../redux/authSlice';
import BarOnline from '../../component/BarOnline';
// import { MaterialIcons, Entypo } from "@expo/vector-icons";
import {handleLogout} from '../../sevice/logoutService';
import {useNavigation} from '@react-navigation/native';
import styleAll from '../../assets/style/styleAll';
import Avatar from '../../assets/imges/Avatar.png';
// import { StatusBar } from "expo-status-bar";
import RNQRGenerator from 'rn-qr-generator';

import Header from '../../component/Header';
import LockIcon from '../../assets/Icon/lock.png';
import UserIcon from '../../assets/Icon/user.png';
import PolicyIcon from '../../assets/Icon/PolicyIcon.png';
import UpdateIcon from '../../assets/Icon/UpdateIcon.png';
import SupportIcon from '../../assets/Icon/SupportIcon.png';
import LogoutIcon from '../../assets/Icon/LogOutIcon.png';
import {getInitials} from '../../helper/common';
import EncryptedStorage from 'react-native-encrypted-storage';
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';

import store from '../../redux/store';
import {
  actionSaveG,
  actionSaveP,
  actionSaveSocket,
} from '../../redux/socketSlice';
const Setting = (props: {navigation?: any; route?: any}) => {
  const {route} = props;
  const user = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [showQr, setShowQr] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [valueQr, setValueQr] = useState(null);
  const logout = async () => {
    await handleLogout();
    dispatch(userInfor({}));
    dispatch(loginSuccess({}));
    store.dispatch(actionSaveSocket({socket: null}));

    store.dispatch(actionSaveP({p: null}));
    store.dispatch(actionSaveG({g: null}));

    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };
  const goBack = () => {
    navigation.goBack();
  };
  const optionData = [
    {
      icon: <Image source={LockIcon} style={{height: 24, width: 24}}></Image>,
      label: 'Đổi mật khẩu',
      Action: () => {
        props.navigation.navigate('ChangePassword');
      },
    },
    {
      icon: <Image source={UserIcon} style={{height: 24, width: 24}}></Image>,
      label: 'Thay đổi thông tin cá nhân',
      Action: () => {
        props.navigation.navigate('ChangeInfor');
      },
    },
    {
      icon: <Image source={UpdateIcon} style={{height: 24, width: 24}}></Image>,
      label: 'Cập nhật ứng dụng',
      // Action: () => sync()
    },
    {
      icon: <Image source={LockIcon} style={{height: 24, width: 24}}></Image>,
      label: 'Đăng xuất',
      Action: () => logout(),
    },
  ];

  const genQr = async () => {
    const privateKey = await EncryptedStorage.getItem('dhPrivateKey');
    const rsaPK = await EncryptedStorage.getItem('rsaPrivateKey');
    const myObject = {privateKey: privateKey, rsaPK: rsaPK};
    const jsonString = JSON.stringify(myObject);
    console.log('myObject', myObject);
    //   RNQRGenerator.generate({
    //     value: `rsaPK:${rsaPK} privateKey:${privateKey}`,
    //     height: 100,
    //     width: 100,
    //     correctionLevel: 'L',
    //     base64: true,
    //   })
    //     .then(response => {
    //       const {uri, width, height, base64} = response;
    //       // this.setState({imageUri: uri});
    //       console.log(response);
    //       setImgUrl(response?.uri);
    //     })
    //     .catch(error => console.log('Cannot create QR code', error));
    setValueQr(jsonString);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <StatusBar backgroundColor="white"></StatusBar> */}

      <Header goBackFunc={goBack} backTitle="Cài đặt"></Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[{flex: 1}, styleAll.bgColor]}>
        <View style={styleAll.fullScreen}>
          {/* <Loading loading={loading}></Loading> */}

          <View style={[styleAll.rowBetwen, styleAll.mv10]}></View>
          <View style={[styleAll.ColCenterLine, styleAll.mv5]}>
            <View style={[styleAll.shadow, {borderRadius: 50}]}>
              {/* <Image
                source={Avatar}
                style={[
                  {
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: '#dbf1ff',
                  },
                ]}></Image> */}
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  backgroundColor: '#87CEEB',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#dbf1ff',
                  borderWidth: 3,
                }}>
                <Text
                  style={{
                    fontSize: 30,
                    color: 'white',
                    fontWeight: '500',
                  }}>
                  {user?.name && getInitials(user?.name)}
                </Text>
              </View>
              {/* {user?.image ? <Image source={{ uri: user?.image }} style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 3, borderColor: '#dbf1ff', position: 'absolute' }} ></Image> : null} */}
            </View>
            <Text
              style={[
                // styleAll.pt4,
                styleAll.textBig,
                styleAll.texColor,
                {marginTop: 10},
              ]}>
              {user?.name}
            </Text>
            <Text
              style={[styleAll.textMedium, styleAll.texColor, {marginTop: 10}]}>
              +{user?.phoneNumber}
            </Text>
          </View>

          <View>
            <Text
              style={[
                styleAll.texColor,
                styleAll.textBig,
                {marginBottom: 15, marginTop: 10},
              ]}>
              Cài đặt chung
            </Text>
            <View>
              {optionData.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={[
                        styleAll.rowBetwen,
                        styleAll.mv5,
                        styleAll.alignCenter,
                        {
                          borderBottomWidth: 0.5,
                          borderBottomColor: '#CCCCCC',
                          paddingBottom: 10,
                        },
                      ]}
                      key={index}
                      onPress={() => item.Action()}>
                      <View style={[styleAll.RowCenterLine]}>
                        <View
                          style={{
                            padding: 10,
                            backgroundColor: '#0dbf6f',
                            borderRadius: 10,
                          }}>
                          {item.icon}
                        </View>
                        <Text style={[styleAll.pl5, styleAll.texColor]}>
                          {item.label}
                        </Text>
                      </View>
                      {/* <NextIcon></NextIcon> */}
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={{height: 30}}></View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        isVisible={showQr}
        style={{alignItems: 'center', justifyContent: 'center'}}
        onBackdropPress={() => setShowQr(false)}>
        {/* <Image style={{height: 300, width: 300}} source={{uri: imgUrl}}></Image> */}
        <QRCode size={300} value={valueQr} />
      </Modal>
    </SafeAreaView>
  );
};

export default Setting;
