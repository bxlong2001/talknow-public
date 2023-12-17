import React from "react";
import { View, Image, ScrollView, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Entypo, Ionicons } from "@expo/vector-icons";
import ContactsIcon from "../../assets/Icon/contacts.png";
import ContactsOutlineIcon from "../../assets/Icon/contacts_outline.png";
import HomeIcon from "../../assets/Icon/home.png";
import Home_outlineIcon from "../../assets/Icon/home_outline.png";
import SettingsIcon from "../../assets/Icon/gear.png";
import Setting_outline_icon from "../../assets/Icon/Setting_outline_icon.png";
import HomeChat from "../Chat/HomeChat";
import Setting from "../Setting";
import Contacts from "../Contacts";
type Props = {};
const Tab = createBottomTabNavigator();
const BottomNavigation = (props: Props) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 50,
        },
      }}
    >
      <Tab.Screen
        name="HomeChat"
        component={HomeChat}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontWeight: focused ? "500" : "100",
                fontSize: 12,
              }}
            >
              Trang chủ
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              // <Entypo name="home" size={24} color="#0dbf6f" />
              <Image
                source={HomeIcon}
                style={{ height: 24, width: 24 }}
              ></Image>
            ) : (
              // <Ionicons name="home-outline" size={24} color="#0dbf6f" />
              <Image
                source={Home_outlineIcon}
                style={{ height: 24, width: 24 }}
              ></Image>
            ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontWeight: focused ? "500" : "100",
                fontSize: 12,
              }}
            >
              Liên hệ
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              // <Entypo name="home" size={24} color="#0dbf6f" />
              <Image
                source={ContactsIcon}
                style={{ height: 24, width: 24 }}
              ></Image>
            ) : (
              // <Ionicons name="home-outline" size={24} color="#0dbf6f" />
              <Image
                source={ContactsOutlineIcon}
                style={{ height: 24, width: 24 }}
              ></Image>
            ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: focused ? "500" : "100",
              }}
            >
              Cài đặt
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              // <Ionicons name="settings" size={24} color="#0dbf6f" />
              <Image
                source={SettingsIcon}
                style={{ height: 24, width: 24 }}
              ></Image>
            ) : (
              // <Ionicons name="settings-outline" size={24} color="#0dbf6f" />
              <Image
                source={Setting_outline_icon}
                style={{ height: 24, width: 24 }}
              ></Image>
            ),
        }}
      />
    </Tab.Navigator>
  );
};
export default BottomNavigation;
