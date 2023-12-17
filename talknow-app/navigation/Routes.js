/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import React from 'react';
import LoginScreen from '../screens/Auth/Register/Login';
import CreateUserName from '../screens/Auth/Register/CreateUserName';
import OTPScreen from '../screens/Auth/OTP';
import HomeScreen from '../screens/Home';
import InputPhoneScreen from '../screens/Auth/Register/InputPhone';
import BottomNavigation from '../screens/BottomNavigation';
import ChatScreen from '../screens/Chat/Message';
import Setting from '../screens/Setting';
import ChangePassword from '../screens/ChangePassword';
import ChangeInfor from '../screens/Auth/ChangeInfor/ChangeInfor';
import ForgotPass from '../screens/Auth/ForgetPassword/ForgotPass';
import Contacts from '../screens/Contacts';
import ListFriends from '../screens/Contacts/ListFriends';
import RootView from '../RootView';
const headerOptions = {
  headerShown: false,
};

const AppStack = createNativeStackNavigator();

function AppStackScreen() {
  return (
    <AppStack.Navigator
      screenOptions={{...headerOptions}}
      initialRouteName="Home">
      <AppStack.Screen name="Login" component={LoginScreen} />
      <AppStack.Screen name="CreateUserName" component={CreateUserName} />
      <AppStack.Screen name="OTP" component={OTPScreen} />
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen name="Contacts" component={Contacts} />
      <AppStack.Screen name="ListFriends" component={ListFriends} />
      <AppStack.Screen name="InputPhone" component={InputPhoneScreen} />
      <AppStack.Screen name="BottomNavigation" component={BottomNavigation} />
      <AppStack.Screen name="Chat" component={ChatScreen} />
      <AppStack.Screen name="Setting" component={Setting}></AppStack.Screen>
      <AppStack.Screen
        name="ChangeInfor"
        component={ChangeInfor}></AppStack.Screen>
      <AppStack.Screen
        name="ForgotPass"
        component={ForgotPass}></AppStack.Screen>
      <AppStack.Screen
        name="ChangePassword"
        component={ChangePassword}></AppStack.Screen>
    </AppStack.Navigator>
  );
}

function Routes() {
  const navigatorRef = React.createRef();
  return (
    <NavigationContainer ref={navigatorRef}>
      <RootView navigation={navigatorRef}>
        <AppStackScreen />
      </RootView>
    </NavigationContainer>
  );
}

export {Routes};
