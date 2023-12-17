/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  StatusBar,
  TextInput,
  FlatList,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import styleAll from '../../assets/style/styleAll';
// import { StatusBar } from "expo-status-bar";
import Header from '../../component/Header';
import {getInitials} from '../../helper/common';
import color from '../../constants/color';
import URL from '../../apis/url';
import searchIcon from '../../assets/Icon/SearchIcon.png';
import arrowLeftIcon from '../../assets/Icon/left-arrow.png';
import AddUserIcon from '../../assets/Icon/add-user.png';
import AddFriendIcon from '../../assets/Icon/add.png';
import PendingIcon from '../../assets/Icon/pending.png';
import Pending2Icon from '../../assets/Icon/pending2.png';
import AcceptUserIcon from '../../assets/Icon/check.png';
// import { Route, TabBar, TabView } from "react-native-tab-view"
import styles from './styles';

const Contacts = (props: {navigation?: any; route?: any; socket?: any}) => {
  // const {socket} = props;
  const user = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [dataUser, setDataUser] = useState<Array<any>>([]);
  const [dataSearch, setDataSearch] = useState<Array<any>>([]);
  const [dataFriends, setDataFriends] = useState<Array<any>>([]);
  const textInputRef = useRef(null);
  const [viewSearch, setViewSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingSearch, setRefreshingSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrSent, setSent] = useState([]);
  const [arrReceived, setReceived] = useState([]);
  const focus = useIsFocused();
  const routes = [
    {key: 'friends', title: 'Bạn bè'},
    {key: 'group', title: 'Nhóm'},
  ];
  const [index, setIndex] = React.useState<any>(0);
  const layout = useWindowDimensions();
  useEffect(() => {
    getFriendRequest();
  }, [focus]);
  useEffect(() => {
    if (!viewSearch) {
      handleRefresh();
    } else {
      getFriendRequest();
    }
  }, [viewSearch]);
  const getFriendRequest = async () => {
    try {
      const result1 = await axios.get(
        `${URL.ROOT_API}${URL.GET_FRIEND_REQUEST}`,
        {
          params: {
            cond: {
              status: 'sent',
            },
          },
        },
      );
      const result2 = await axios.get(
        `${URL.ROOT_API}${URL.GET_FRIEND_REQUEST}`,
        {
          params: {
            cond: {
              status: 'received',
            },
          },
        },
      );
      if (!!result1?.data?.data) {
        setSent(result1?.data?.data);
      }
      if (!!result2?.data?.data) {
        setReceived(result2?.data?.data);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
    if (user.userId) {
      const cond = {
        friendsId: {$elemMatch: {$eq: user.userId}},
      };
      getUser(cond);
    }
  }, [user, viewSearch, focus]);

  const goBack = () => {
    setDataSearch(dataFriends);
    navigation.goBack();
  };

  const getUser = async (cond: any) => {
    setLoading(true);
    try {
      const result = await axios.get(`${URL.ROOT_API}${URL.GET_PAGEABLE_USER}`);
      if (!!result?.data?.data?.result) {
        const dsUser = result?.data?.data?.result.filter((el: any) => {
          return el._id !== user.userId;
        });
        setDataUser(dsUser);
      }

      const result2 = await axios.get(
        `${URL.ROOT_API}${URL.GET_PAGEABLE_USER}`,
        {
          params: {
            cond,
          },
        },
      );
      if (!!result2?.data?.data?.result) {
        const dsFriend = result2?.data?.data?.result;
        setDataFriends(dsFriend);
        setDataSearch(dsFriend);
      }
      setLoading(false);
      setRefreshing(false);
      setRefreshingSearch(false);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
      setRefreshingSearch(false);
      console.log('error: ', error);
    }
  };

  const handleSearch = (text: string) => {
    try {
      const isPhoneNumber = /^\d+$/.test(text);
      const regexPattern = new RegExp(removeAccent(text), 'i');
      function removeAccent(str: string) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      let data;
      if (!!isPhoneNumber && text.length === 10) {
        data = dataUser;
      } else {
        data = dataFriends;
      }
      const filtered = data.filter(item => {
        const hoTenMatch = regexPattern.test(removeAccent(item.hoTen));
        const formattedPhoneNumber = item.soDienThoai.replace(/^84/, '0');
        const sdtMatch = regexPattern.test(removeAccent(formattedPhoneNumber));
        if (isPhoneNumber && item.friendsId.includes(text)) {
          return true;
        }

        return hoTenMatch || sdtMatch;
      });

      setDataSearch(filtered);
    } catch (error: any) {
      console.error('Invalid regex pattern:', error.message);
      setDataSearch([]);
    }
  };

  const handleAddFriend = async (id: string, status: string) => {
    setLoading(true);
    try {
      const result = await axios.put(`${URL.ROOT_API}${URL.ADD_FRIEND}/${id}`, {
        status,
      });
      console.log('result: ', result);
      if (!!result?.data?.data?.result) {
        handleRefreshSearch();
      }
      if (result.status === 200) {
        textInputRef.current.clear();
        // props.navigation.goBack();
        setViewSearch(false);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log('error: ', error);
    }
  };

  const handleFocus = () => {
    setViewSearch(true);
  };

  const handleBlur = () => {
    if (textInputRef.current) {
      if (viewSearch) {
        textInputRef.current.clear();
        textInputRef.current.blur();
      } else {
        textInputRef.current.focus();
      }
    }
    setViewSearch(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const cond = {
      friendsId: {$elemMatch: {$eq: user.userId}},
    };
    await getUser(cond);
    await getFriendRequest();
  };

  const handleRefreshSearch = async () => {
    setRefreshingSearch(true);
    if (user.userId) {
      const cond = {
        friendsId: {$elemMatch: {$eq: user.userId}},
      };
      await getUser(cond);
    }
  };

  const renderLabel = ({route, focused}) => {
    const color = focused ? R.colors.primary : R.colors.colorPlaceholder;
    return <Text style={[styles.labelStyle, {color}]}>{route.title}</Text>;
  };

  // const renderTabBar = (props) => (
  //   <TabBar
  //     {...props}
  //     style={styles.tabBar}
  //     indicatorStyle={styles.indicatorStyle}
  //     renderLabel={renderLabel}
  //   />
  // )

  const handleViewListFriends = (status: string) => {
    return props.navigation.navigate('ListFriends', {
      status,
    });
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

        {viewSearch ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // eslint-disable-next-line prettier/prettier
              // eslint-disable-next-line prettier/prettier
            }}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={handleBlur}>
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
                backgroundColor: 'white',
                borderRadius: 10,
              }}>
              <Image
                source={searchIcon}
                style={{height: 20, width: 20, marginLeft: 10}}></Image>
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
                onFocus={handleFocus}
                ref={textInputRef}></TextInput>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleFocus}
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <Image source={searchIcon} style={{height: 24, width: 24}}></Image>
            <Text
              style={{color: 'white', flex: 1, fontSize: 14, paddingLeft: 15}}>
              Tìm Kiếm{' '}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {viewSearch ? (
        <FlatList
          data={dataSearch}
          refreshControl={
            <RefreshControl
              refreshing={refreshingSearch}
              onRefresh={handleRefreshSearch}
            />
          }
          renderItem={({item, index}) => {
            const listFriends = item?.friendsId?.map(e => e.toString());
            const isFriend = listFriends?.includes(user.userId.toString());

            const isSent = arrSent.find((e: any) => e.receiverId === item._id);
            const isReceived = arrReceived.find(
              (e: any) => e.senderId === item._id,
            );
            return (
              <TouchableOpacity
                onPress={() => {
                  if (isFriend)
                    props.navigation.navigate('Chat', {
                      receiverId: [item._id],
                      roomCode: `${Math.abs(
                        Number(item.soDienThoai) - Number(user.phoneNumber),
                      )}`,
                      roomName: item.hoTen,
                    });
                }}
                key={index}
                style={{marginVertical: 15}}>
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
                          {getInitials(item.hoTen)}
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
                          {item.hoTen}
                        </Text>
                      </View>
                      <View>
                        <View></View>
                        <Text style={{color: color.colorTextChat}}>
                          {`+` + item.soDienThoai}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {isSent ? (
                    <TouchableOpacity
                      onPress={() => handleAddFriend(item._id, 'rejected')}>
                      <Image
                        style={{height: 30, width: 30, marginRight: 10}}
                        source={PendingIcon}></Image>
                    </TouchableOpacity>
                  ) : isReceived ? (
                    <TouchableOpacity
                      onPress={() =>
                        handleAddFriend(item.senderId, 'accepted')
                      }>
                      <Image
                        style={{height: 24, width: 24, marginRight: 10}}
                        source={AcceptUserIcon}></Image>
                    </TouchableOpacity>
                  ) : !isFriend ? (
                    <TouchableOpacity
                      onPress={() => handleAddFriend(item._id, 'pending')}>
                      <Image
                        style={{height: 24, width: 24, marginRight: 10}}
                        source={AddUserIcon}></Image>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            onPress={() => handleViewListFriends('received')}>
            <Image
              source={AddFriendIcon}
              style={{height: 24, width: 24, marginRight: 5}}></Image>
            <Text>Lời mời kết bạn</Text>
            {arrReceived.length > 0 && (
              <View
                style={{
                  marginLeft: 'auto',
                  backgroundColor: '#87CEEB',
                  paddingHorizontal: 5,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'black', fontSize: 13, lineHeight: 18}}>
                  {arrReceived.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 10,
              borderBottomColor: 'silver',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            onPress={() => handleViewListFriends('sent')}>
            <Image
              source={PendingIcon}
              style={{height: 24, width: 24, marginRight: 5}}></Image>
            <Text>Lời mời kết bạn đã gửi</Text>
            {arrSent.length > 0 && (
              <View
                style={{
                  marginLeft: 'auto',
                  backgroundColor: '#87CEEB',
                  paddingHorizontal: 5,
                  borderRadius: 5,
                }}>
                <Text>{arrSent.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <FlatList
            data={dataFriends}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Chat', {
                      receiverId: [item._id],
                      roomCode: `${Math.abs(
                        Number(item.soDienThoai) - Number(user.phoneNumber),
                      )}`,
                      roomName: item.hoTen,
                    })
                  }
                  key={index}
                  style={{marginVertical: 15, marginHorizontal: 10}}>
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
                            {getInitials(item.hoTen)}
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
                            {item.hoTen}
                          </Text>
                        </View>
                        <View>
                          <View></View>
                          <Text style={{color: color.colorTextChat}}>
                            {'+' + item.soDienThoai}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      {/* <TabView
        lazy
        renderTabBar={renderTabBar}
        navigationState={{
          index,
          routes,
        }}
        swipeEnabled={false}
        renderScene={renderScene}
        initialLayout={{ width: layout.width }}
        onIndexChange={(index: number) => setIndex(index)}
      /> */}
    </SafeAreaView>
  );
};

export default Contacts;
