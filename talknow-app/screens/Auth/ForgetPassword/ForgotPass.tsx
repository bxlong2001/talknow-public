/* eslint-disable prettier/prettier */
/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import color from '../../../constants/color';
import Input from '../../../component/Input';
import BtnNotice from '../../../component/BtnNotice';
import {SafeAreaView} from 'react-native-safe-area-context';
import Btn from '../../../component/Btn';
import {useNavigation, useRoute} from '@react-navigation/native';
import store from '../../../redux/store';
import {actionPopup} from '../../../redux/popupSlice';
import {forgetPasswordService} from '../../../sevice/ForgetPasswordService';
import {validatePassword} from '../../../helper/common';
import {setPhoneService} from '../../../sevice/sentOtpService';

const ForgotPass = (props: any) => {
  const navigation = useNavigation();
  const route = useRoute();
  // const OTP = route.params.OTP;
  const soDienThoai = route.params.soDienThoai;

  const [newPass, setNewPass] = useState('');
  const [reapatePass, setReapatePass] = useState('');

  const handleSendData = async () => {
    console.log('test');

    if (newPass !== reapatePass) {
      store.dispatch(
        actionPopup({
          content: 'Vui lòng nhập mật khẩu xác nhận giống mật khẩu mới',
        }),
      );
      return;
    }
    if (!validatePassword(newPass)) {
      store.dispatch(actionPopup({content: 'Mật khẩu yếu vui lòng nhập lại'}));
      return;
    }

    const response = await setPhoneService({soDienThoai: soDienThoai});
    if (response.statusCode === 200) {
      navigation.navigate('OTP', {
        modifiedNumber: soDienThoai,
        password: newPass,
        reSendOtp: setPhoneService,
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="white"></StatusBar>

      <View style={{flex: 10, justifyContent: 'center'}}>
        <Text
          style={{
            color: color.primary,
            fontSize: 24,
            lineHeight: 32,
            fontWeight: '500',
            textAlign: 'center',
          }}>
          Tạo lại mật khẩu
        </Text>
      </View>
      <View style={{flex: 30, marginTop: 28, alignItems: 'center'}}>
        <Input
          title="Nhập mật khẩu mới"
          isPassword
          style={{width: '90%'}}
          onChangeText={text => setNewPass(text)}
          defaultValue={newPass}
        />
        <Input
          title="Nhập lại mật khẩu"
          style={{width: '90%'}}
          onChangeText={text => setReapatePass(text)}
          isPassword
          defaultValue={reapatePass}
        />
        <View style={[{width: '100%', alignItems: 'center'}]}>
          <Btn title={'Tiếp Tục'} handleFuncion={handleSendData} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPass;
