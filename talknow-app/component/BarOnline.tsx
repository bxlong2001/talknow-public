/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Image} from 'react-native';
import {getInitials} from '../helper/common';

type Props = {
  roomName: string;
  isOnline: boolean;
  lastOnlineAt: Date;
};

const BarOnline = (props: Props) => {
  const {roomName, isOnline, lastOnlineAt} = props;

  let status = '';

  if (!isOnline) {
    const now = new Date();
    const offlineDuration = now.getTime() - new Date(lastOnlineAt).getTime();
    let minutes = Math.floor(offlineDuration / (1000 * 60));
    const hours = Math.floor(offlineDuration / (1000 * 60 * 60));

    if (minutes < 60) {
      if(minutes < 1) {
        minutes = 1
      }
      status = `Truy cập ${minutes} phút trước`;
    } else {
      status = `Truy cập ${hours} giờ trước`;
    }
  } else {
    status = 'Đang hoạt động';
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      <View style={{marginRight: 10}}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 30,
            backgroundColor: '#87CEEB',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              fontWeight: '500',
            }}>
            {roomName && getInitials(roomName)}
          </Text>
        </View>
      </View>
      <View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
          }}>{roomName}</Text>
        <Text style={{color: 'green', fontSize: 12}}>{status}</Text>
      </View>
    </View>
  );
};

export default BarOnline;
