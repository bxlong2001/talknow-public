/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import OneSignal, { OSNotification } from 'react-native-onesignal';
// import { refreshNotification } from "@redux/actions/notificationAction"
import {StyleSheet, View} from 'react-native';

class RootView extends Component<{
  refreshNotification?: (defaultBody: any) => void;
}> {
  timeout: any;
  constructor(props) {
    super(props);
    this.state = {};

    OneSignal.setAppId('95c05e0b-807d-49be-9f24-e741d6a427a6');
    OneSignal.setLogLevel(6, 0);

    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      console.log(
        'OneSignal: notification will show in foreground:',
        notifReceivedEvent,
      );
      const notif = notifReceivedEvent.getNotification();
      const data = notif.additionalData;
      console.log('additionalData: ', data);
      this.onReceived(notif);
      notifReceivedEvent.complete(notif);
    });
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
      this.onOpened(notification);
    });
    this.timeout = null;
  }

  onReceived = (notification: OSNotification) => {
    // console.log("notification_notification", notification)
    this.props.refreshNotification?.({page: 1, limit: 10});
    switch (notification?.additionalData?.type) {
      default:
        break;
    }
  };

  onOpened = async ({notification, action}) => {
    const navigation = this.props.navigation.current;
    console.log({
      roomCode: notification?.additionalData?.roomCode,
      roomName: notification?.additionalData?.roomName,
      receiverId: notification?.additionalData?.receiverId
    });
    
    switch (notification?.additionalData?.type) {
      case 'mess':
        navigation.navigate('Chat', {
          roomCode: notification?.additionalData?.roomCode,
          roomName: notification?.additionalData?.roomName,
          receiverId: notification?.additionalData?.receiverId
        })
        break;
      case 'friend':
        if(!notification?.additionalData?.status) {
          navigation.navigate('Contacts');
        }else {
          navigation.navigate('ListFriends', {
            status: notification?.additionalData?.status
          });
        }
        break;
      default:
        break;
    }
  };

  render() {
    return <View style={styles.container}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function mapStateToProps(state) {
  return {};
}

export default connect<any, any, any>(mapStateToProps, {
  //   refreshNotification
})(RootView);
