/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {View, Text, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Btn from '../../component/Btn';
// import Input from '../../components/CJ/Setting/Input'
import styleAll from '../../assets/style/styleAll';
// import { changePasswordApi } from "../../services/changePasswordSevice";
import {useSelector} from 'react-redux';
import Input from '../../component/Input';
import Header from '../../component/Header';
import store from '../../redux/store';
import {actionPopup} from '../../redux/popupSlice';
import {validatePassword} from '../../helper/common';
import { changePasswordService } from '../../sevice/ChangePasswordService';
// import { clearSessionLogout } from "../../helper/AppCommon";
// import Input from "../../components/Input";
// import LockIcon from "../../assets/images/setting/lock.svg";
// import Header from "../../components/CJ/Header";
// import { actionPopup } from "../../redux/actionCreators";
// import store from "../../redux/store";
// import { changePasswordCj } from "../../services/accountService";
// import Loading from "../../components/Loading";

const ChangePassword = (props: { navigation: any; route: any; }) => {
  const {navigation, route} = props;
  //   const user = useSelector((state) => state.saveUser);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeateNewPassword, setRepeateNewPassword] = useState('');
  const handleSetOldPassword = (text: React.SetStateAction<string>) => setOldPassword(text);
  const handleSetNewPassword = (text: React.SetStateAction<string>) => setNewPassword(text);
  const handleSetRepeateNewPassword = (text: React.SetStateAction<string>) => setRepeateNewPassword(text);

  const data = {
    // username: user?.username,
    oldPassword: oldPassword,
    newPassword: newPassword,
  };
  
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !repeateNewPassword) {
      store.dispatch(
        actionPopup({
          content: 'Bạn nhập trống một trong các trường',
        }),
      );
      return;
    }

    if (newPassword !== repeateNewPassword) {
      store.dispatch(
        actionPopup({
          content: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau',
        }),
      );
      return;
    }

    if (!validatePassword(newPassword)) {
      store.dispatch(
        actionPopup({
          content: 'Mật khẩu yếu vui lòng nhập lại',
        }),
      );
      return;
    }

    try {
      // setLoading(true);
      let response = await changePasswordService(data);
      
      // setLoading(false);
      if (response?.status === 201) {
        store.dispatch(
          actionPopup({
            content: 'Đổi mật khẩu thành công',
            onConfirm: () => {
              navigation.goBack();
            },
          }),
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error(error)
      // setLoading(false);
    }
  };
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <ScrollView style={[{flex: 1}, styleAll.bgColor, {paddingTop: 28}]}>
        <Header goBackFunc={goBack} backTitle="Cài đặt"></Header>

        <View style={[styleAll.fullScreen, {alignItems: 'center'}]}>
          <View style={{width: '90%', marginTop: 20}}>
          <Input
            onChangeText={handleSetOldPassword}
            title="Nhập mật khẩu cũ"
            isPassword
            defaultValue={oldPassword}></Input>
          <Input
            title="Nhập mật khẩu mới"
            isPassword
            onChangeText={handleSetNewPassword}
            defaultValue={newPassword}></Input>
          <Input
            title="Nhập lại mật khẩu"
            onChangeText={handleSetRepeateNewPassword}
            isPassword
            defaultValue={repeateNewPassword}></Input>
        </View>

          <Btn
            title={'Xác Nhận'}
            handleFuncion={''}
            style={{width: '90%'}}
            handleFuncion={() => handleChangePassword()}
          ></Btn>
        </View>
      </ScrollView>
    </>
  );
};

export default ChangePassword;
