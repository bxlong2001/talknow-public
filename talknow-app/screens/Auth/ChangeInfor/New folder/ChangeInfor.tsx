/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styleAll? */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, {useState, useRef, Fragment} from 'react';
import styleAll from '../../../assets/style/styleAll';
import Input from '../../../component/Input';
import ActionSheetSelect from '../../../component/ActionSheetSelect';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import UserIcon from '../../../assets/Icon/user.png';
import {useSelector} from 'react-redux';
import Avatar from '../../../assets/imges/Avatar.png';
import BtnChangeAvatar from '../../../assets/images/setting/Subtract.svg';

import {
  chosePhotoFromLibrary,
  takePhotoFromCamera,
} from '../../../helper/takePhoto';
import Header from '../../../component/Header';
import Button from '../../../component/Button';

const ChangeInfor = props => {
  const {navigation, route} = props;
  const user = useSelector((state: any) => state.auth);

  //   const token = useSelector(state => state.saveToken);
  //   const loading = useSelector(state => state.showLoading);
  const selectTypeAvatarRef = useRef();

  const [name, setName] = useState(user?.name);
  //   const [imgUrl, setImgUrl] = useState('');
  const [dataImg, setDataImg] = useState('');
  const imgBase64 = `data:${dataImg?.mime};base64,${dataImg?.data}`;
  const handleSetName = text => setName(text);

  const takePhotoFromLibaryFunc = async (
    image: React.SetStateAction<string>,
  ) => {
    setDataImg(image);
  };
  const takePhotoFromCameraFunc = async (
    image: React.SetStateAction<string>,
  ) => {
    setDataImg(image);
  };

  const selectTypeAvatar = (option: {value: string}) => {
    if (option.value === 'photo') {
      chosePhotoFromLibrary(takePhotoFromLibaryFunc, null);
    } else if (option.value === 'camera') {
      takePhotoFromCamera(takePhotoFromCameraFunc, null);
    }
  };
  const dataUser = {
    name: name,
  };

  const handleInforUser = async () => {};
  //   const navToHome = () => {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'Setting'}],
  //     });
  //   };

  return (
    <View
      //extraHeight={180}
      style={{flex: 1, height: '100%', backgroundColor: '#ffff'}}>
      <Header
        goBackFunc={() => {
          props.navigation.goBack();
        }}
        style={{marginTop: 28}}
        backTitle={'Quay lại'}></Header>

      <View style={styleAll?.fullScreen}>
        <View style={[styleAll?.rowBetwen, styleAll?.mv10]}></View>
        <View style={[styleAll?.ColCenterLine, styleAll?.mv5]}>
          <View
            style={[
              styleAll?.shadowImg,
              {borderRadius: 50, alignItems: 'center'},
            ]}>
            <Image
              source={
                dataImg?.data !== undefined ? {uri: `${imgBase64}`} : Avatar
              }
              style={[
                {
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: '#dbf1ff',
                },
              ]}></Image>
            {user?.image ? (
              <Image
                source={{
                  uri:
                    dataImg?.data !== undefined ? `${imgBase64}` : user?.image,
                }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: '#dbf1ff',
                  position: 'absolute',
                }}></Image>
            ) : null}
            <TouchableOpacity
              style={{position: 'absolute', bottom: 3, paddingTop: 30}}
              onPress={() => selectTypeAvatarRef.current.show()}>
              <View style={{alignItems: 'center'}}>
                <BtnChangeAvatar></BtnChangeAvatar>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 10,
                    color: '#FFFFFF',
                    fontWeight: '500',
                    position: 'absolute',
                  }}>
                  Đổi Avatar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styleAll?.pt4,
              styleAll?.textBig,
              styleAll?.texColor,
              {marginTop: 10},
            ]}>
            {user?.name}
          </Text>
        </View>
        <Input
          // prefixIcon={<UserIcon width={20} height={20}></UserIcon>}
          title={'Họ Tên'}
          defaultValue={name}
          onChangeText={handleSetName}
          placeholder={'Nhập Họ Tên'}
          style={{width: '90%'}}

          // showDelete={false}
        />

        <View style={{alignItems: 'center', backgroundColor: ''}}>
          {/* <Button
            label={'Xác Nhận'}
            style={{marginTop: 20, position: 'absolute', bottom: 30}}
            onPress={() => {
              handleInforUser();
            }}></Button> */}
        </View>
      </View>
      <View style={{height: 20}}></View>

      <ActionSheetSelect
        ref={selectTypeAvatarRef}
        title={'Chọn ảnh'}
        options={[
          {label: 'Chọn từ ảnh của bạn', value: 'photo'},
          {label: 'Chụp ảnh từ camera', value: 'camera'},
          {label: 'Huỷ'},
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={-1}
        onPress={selectTypeAvatar}
      />
      <View
        style={{
          alignItems: 'center',
          //   flex: 1,
          position: 'absolute',
          height: 200,
          width: '100%',
          bottom: 10,
          zIndex: 1000,
        }}>
        <Button
          label={'Xác Nhận'}
          style={{marginTop: 20, position: 'absolute', bottom: 30}}
          onPress={() => {
            //   handleInforUser();
          }}></Button>
      </View>
    </View>
  );
};

export default ChangeInfor;
