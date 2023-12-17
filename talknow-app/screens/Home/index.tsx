import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StatusBar} from 'react-native';
// import ScreenName from "../../navigation/screen-name";
import color from '../../constants/color';
// import { navigate } from "../../navigation/navigation-service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Btn from '../../component/Btn';
import {styles} from '../Auth/Register/CreateUserName/styles';
// import { StatusBar } from "expo-status-bar";
import {loginSuccess} from '../../redux/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [storedSecretValue, setStoredSecretValue] = useState(null);
  useEffect(() => {
    const key = 'mySecretKey';
  }, []);
  useEffect(() => {
    // Check for the presence of authentication data (e.g., token) in AsyncStorage
    AsyncStorage.getItem('userToken')
      .then(authData => {
        if (authData) {
          // If authentication data exists, set the user as authenticated
          navigation.reset({
            index: 0,
            routes: [{name: 'BottomNavigation'}], // 'Home' là tên của màn hình chính
          });
        }
      })
      .catch(error => {
        console.error('Error reading authentication data from storage:', error);
      });
  }, []);
  return (
    <View
      // className="pt-10 h-full w-full"
      style={{backgroundColor: 'white', flex: 1, paddingTop: 10}}>
      <StatusBar translucent backgroundColor="white"></StatusBar>

      <View
        // className=" justify-center"
        style={{flex: 10, justifyContent: 'center'}}>
        <Text
          // className="text-3xl font-medium text-center"
          style={{
            color: color.primary,
            fontSize: 30,
            lineHeight: 36,
            fontWeight: '500',
            textAlign: 'center',
          }}>
          TalkNow
        </Text>
      </View>
      <View
        // className="items-center"
        style={{flex: 50, alignItems: 'center'}}>
        <Image
          // className="h-80 w-80"
          style={{height: 320, width: 320, marginBottom: 20}}
          source={require('../../assets/Icon/private-chat.png')}></Image>
        <Text
          // className="text-center"
          style={{
            fontSize: 19,
            color: color.colorScreen,
            textAlign: 'center',
          }}>
          Hãy cùng kết nối bạn bè ngay bây giờ
        </Text>
      </View>

      <View style={{flex: 30, alignItems: 'center'}}>
        <View style={[styles.flexBtn, {width: '100%'}]}>
          <Btn
            title={'Tiếp tục với số điện thoại của bạn'}
            handleFuncion={() => {
              navigation.navigate('Login');
            }}></Btn>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
