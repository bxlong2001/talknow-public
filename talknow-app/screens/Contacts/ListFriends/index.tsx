/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getInitials} from '../../../helper/common';
import color from '../../../constants/color';
import AcceptUserIcon from '../../../assets/Icon/check.png';
import {useEffect, useState} from 'react';
import {getInforUser} from '../../../sevice/LoginService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import arrowLeftIcon from '../../../assets/Icon/left-arrow.png';
import {getFriendRequestService} from '../../../sevice/contractService';
import axios from 'axios';
import URL from '../../../apis/url';
import {useIsFocused} from '@react-navigation/native';

const ListFriends = (props: {navigation?: any; route?: any}) => {
  const status = props.route.params.status;
  const [refreshingSearch, setRefreshingSearch] = useState(false);
  const [list, setList] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const focus = useIsFocused();

  useEffect(() => {
    if (focus) {
      getCurrentUser();
    }
  }, [focus]);

  const getCurrentUser = async () => {
    const res = await axios.get(`${URL.ROOT_API}${URL.GET_FRIEND_REQUEST}`, {
      params: {
        cond: {
          status,
        },
      },
    });
    const userInforResponse = res.data.data;

    setList(userInforResponse);
    setRefreshing(false);
  };

  const handleAddFriend = async (id: string, status: string) => {
    try {
      const result = await axios.put(`${URL.ROOT_API}${URL.ADD_FRIEND}/${id}`, {
        status,
      });
      if (!!result?.data?.data?.result) {
        // props.navigation.goBack();
      }
      if (result.status === 200) {
        props.navigation.goBack();
      }
    } catch (error: any) {
      console.log('error: ', error);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true); // Bắt đầu quá trình làm mới
    await getCurrentUser();
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

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{flexDirection: 'row'}}>
            <Image
              source={arrowLeftIcon}
              style={{height: 24, width: 24, paddingRight: 15}}></Image>
            <View style={{width: 5}}></View>
          </TouchableOpacity>
          <View
            style={{
              flex: 0.9,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{color: 'white', flex: 1, fontSize: 14, paddingLeft: 15}}>
              {`Danh sách ${
                status === 'sent' ? 'đã gửi lời mời kết bạn' : 'lời mời kết bạn'
              }`}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={list}
        refreshControl={
          <RefreshControl
            refreshing={refreshingSearch}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              {status === 'received'
                ? 'Bạn chưa nhận được lời mời kết bạn nào'
                : 'Bạn chưa gửi lời mời kết bạn nào'}
            </Text>
          </View>
        }
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity key={index} style={{marginVertical: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginHorizontal: 10}}>
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
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
                        {getInitials(
                          status !== 'sent'
                            ? item.sender?.hoTen
                            : item.receiver.hoTen,
                        )}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                        {status !== 'sent'
                          ? item.sender.hoTen
                          : item.receiver.hoTen}
                      </Text>
                    </View>
                    <View>
                      <View></View>
                      <Text style={{color: color.colorTextChat}}>
                        {status !== 'sent'
                          ? '+' + item.sender.soDienThoai
                          : '+' + item.receiver.soDienThoai}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleAddFriend(item.senderId, 'accepted');
                  }}>
                  <Image
                    style={{height: 24, width: 24, marginRight: 10}}
                    source={AcceptUserIcon}></Image>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        // eslint-disable-next-line prettier/prettier
      />
    </SafeAreaView>
  );
};

export default ListFriends;
