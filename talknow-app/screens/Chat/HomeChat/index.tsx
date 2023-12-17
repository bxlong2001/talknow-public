/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styleAll from '../../../assets/style/styleAll';
import {data} from '../../../data/data';
import moment from 'moment';
import io from 'socket.io-client';
// import ScreenName from '../../../navigation/screen-name';
import color from '../../../constants/color';
// import { StatusBar } from "expo-status-bar";
import {getInforUser} from '../../../sevice/LoginService';
import * as Font from 'expo-font';
import {userInfor} from '../../../redux/authSlice';
import arrowLeftIcon from '../../../assets/Icon/left-arrow.png';
import searchIcon from '../../../assets/Icon/SearchIcon.png';
import NotiIcon from '../../../assets/Icon/notification.png';
import AddUserIcon from '../../../assets/Icon/add-user.png';
import URL from '../../../apis/url';
import axios from 'axios';
import crypto from 'crypto';
import {Crypt, RSA} from 'hybrid-crypto-js';
import {BigInt} from 'jsbi';
import {Buffer} from 'buffer';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Keychain from 'react-native-keychain';
import store from '../../../redux/store';
import {
  actionSaveG,
  actionSaveP,
  actionSaveSocket,
} from '../../../redux/socketSlice';
// import { navigate } from "../../../navigation/navigation-service";
interface Props {
  route: any;
}
const HomeChat: React.FC<Props> = props => {
  const route = useRoute();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const focus = useIsFocused();

  const [viewSearch, setViewSearch] = useState(false);
  const textInputRef = useRef(null);
  const user = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);
  const [dataUser, setDataUser] = useState<Array<any>>([]);
  const [dataSearch, setDataSearch] = useState<Array<any>>([]);

  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getPrime();
  }, []);
  useEffect(() => {
    if (user.userId) {
      const newSocket = io('https://fe05-42-119-158-45.ngrok-free.app', {
        query: {userId: user.userId},
        transports: ['websocket'],
      });
      store.dispatch(actionSaveSocket({socket: newSocket}));

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [user?.userId]);

  useEffect(() => {
    if (!!user.userId) {
      getInfoRoom();
    }
  }, [user, focus]);

  useEffect(() => {
    if (viewSearch) {
      getInfoRoom();
    }
  }, [viewSearch]);


  const getPrime = async () => {
    try {
      const result = await axios.get(`${URL.ROOT_API}${URL.GET_PRIME}`);
      if (!!result?.data?.data?.p && !!result?.data?.data?.g) {
        store.dispatch(actionSaveP({p: result?.data?.data?.p}));
        store.dispatch(actionSaveG({g: result?.data?.data?.g}));
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const getInfoRoom = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${URL.ROOT_API}${URL.GET_PAGEABLE_ROOM}`);
      console.log("result: ", result?.data?.data?.result);
      
      if (result?.data?.data?.result?.length > 0) {
        const rooms = Promise.all(result?.data?.data?.result?.map(async (e: any) => {
          const dsUser = e.danhSachUser.filter((el: any) => {
            return el._id !== user.userId;
          });
          const cond = {
            roomId: e._id,
          }
          const result2 = await axios.get(`${URL.ROOT_API}${URL.GET_MY_MESSAGE}`, {
            params: {
              cond
            }
          });
          const send = result2?.data?.data[0]?.senderId === user.userId
          if(result2?.data?.data?.length > 0) {
            const seen = result2?.data?.data?.filter((r: any) => r.receiverId.includes(user.userId) && !r.seen)
            return {
              lastMessage: result2?.data?.data[0]?.thoiGianGui,
              firstMessage: seen.length > 0 ? seen.length + " tin nhắn mới" : (send ? "Đã gửi" : "Đã xem"),
              roomName: dsUser[0].hoTen,
              receiverId: dsUser,
              roomCode: e.roomCode,
              createdAt: moment(e.createdAt),
            };
          }else {
            return null
          }
        }))
        console.log("rooms: ", await rooms);
        
        const filteredRooms = await rooms?.then((values) => values.filter((value) => value !== null));
        setDataSearch(filteredRooms)
        setData(filteredRooms);
      }
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setLoading(false);
      // console.log('error: ', error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const userInforResponse = await getInforUser(token);
          const userInforData = userInforResponse.data;
          if (!!userInforData) {
            dispatch(
              userInfor({
                friendsId: userInforData.friendsId,
                dhPublicKey: userInforData.dhPublicKey,
                rsaPublicKey: userInforData.rsaPublicKey,
                userId: userInforData._id,
                token: token,
                name: userInforData.hoTen,
                phoneNumber: userInforData.soDienThoai,
                role: userInforData.role,
              }),
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserToken();
  }, [user.token]);


  const handleSearch = (text: any) => {
    try {
      const regexPattern = new RegExp(removeAccent(text), 'i');
      function removeAccent(str: string) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      const filtered = data.filter(item => {
        const roomNameMatch = regexPattern.test(removeAccent(item.roomName));
        return roomNameMatch;
      });
      setDataSearch(filtered);
    } catch (error) {
      console.error('Invalid regex pattern:', error.message);
      setDataSearch([]);
    }
  };

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

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');

    if (names.length === 1) {
      return names[0].slice(0, 2).toUpperCase();
    } else {
      const firstNameInitial = names[0][0].toUpperCase();
      const lastNameInitial = names[names.length - 1][0].toUpperCase();
      return `${firstNameInitial}${lastNameInitial}`;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Bắt đầu quá trình làm mới
    await getInfoRoom();
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#0dbf6f',
          height: 60,
          alignItems: 'center',
        }}>
        <StatusBar translucent backgroundColor="#0dbf6f" />
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              // flex: 0.9,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Image source={searchIcon} style={{height: 24, width: 24}}></Image>
            <TextInput
                placeholder="Tìm Kiếm"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  paddingLeft: 6,
                  fontSize: 12,
                  paddingVertical: 4,
                  flex: 1,
                  color: 'black',
                }}
                onChangeText={(val: any) => handleSearch(val)}
                // onFocus={handleFocus}
                // ref={textInputRef}
                >
              </TextInput>
            </View>
        </TouchableOpacity>
        {/* <View
          style={{
            // justifyContent: 'center',
            // marginRight: 10,
            // alignItems: 'center',
            // backgroundColor: 'white',
            // borderWidth: 0.5,
            // paddingHorizontal: 10,
            height: 50,
            borderRadius: 5,
          }}>
          <TouchableOpacity onPress={handlePress}>
            <Image source={NotiIcon} style={{height: 20, width: 20}}></Image>
          </TouchableOpacity>
        </View> */}
      </View>

      <FlatList
        data={dataSearch}
        renderItem={({item, index}) => {
          const currentDate = new Date(item.lastMessage)
          const startOfWeek = new Date()
          let shortDayName
          startOfWeek.setHours(0, 0, 0, 0)
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          if(currentDate.getTime() < startOfWeek.getTime()) {
            const day = currentDate.getDate();
            const monthAbbreviation = new Intl.DateTimeFormat('en', { month: 'short' }).format(currentDate);
            shortDayName = `${monthAbbreviation} ${day}`
            
          }else {
            const startDate = new Date()
            startDate.setHours(0, 0, 0, 0)
            if(currentDate.getTime() < startDate.getTime()) {
              const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dayIndex = currentDate.getDay();
              shortDayName = daysOfWeek[dayIndex];
            }
          }
          let hours: any = currentDate.getHours();
          let minutes: any = currentDate.getMinutes();
          if(hours < 10)
            hours = `0${hours}`
          if(minutes < 10)
            minutes = `0${minutes}`
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Chat', {
                  receiverId: item.receiverId.map((e: {_id: any}) => e._id),
                  roomCode: item.roomCode,
                  roomName: item.roomName,
                })
              }
              key={index}
              style={{marginVertical: 15, marginHorizontal: 10}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginHorizontal: 10}}>
                  <View
                    style={{
                      height: 55,
                      width: 55,
                      borderRadius: 29,
                      backgroundColor: '#87CEEB',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        fontWeight: '500',
                      }}>
                      {item.roomName && getInitials(item.roomName)}
                    </Text>
                  </View>
                  {item.isOnline && <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: 'green',
                      position: 'absolute',
                      right: 6,
                      bottom: 0,
                    }}></View>}
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '68%',
                      alignItems: 'center'
                    }}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      {item.roomName}
                    </Text>
                    <Text
                      style={{
                        color: color.colorTextChat,
                      }}>{shortDayName ? shortDayName : `${hours}:${minutes}`}</Text>
                  </View>
                  <View>
                    <Text style={(item.firstMessage === "Đã xem" || item.firstMessage === "Đã gửi") ? {color: color.colorTextChat} : {color: color.colorTextChat, fontWeight: 'bold'}}>
                      {item.firstMessage}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default HomeChat;
