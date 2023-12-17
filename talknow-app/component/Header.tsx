/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Platform,
} from "react-native";
import React, { Fragment } from "react";
import { SCREEN_HEIGHT } from "../assets/style/styleAll";
import arrowLeftIcon from "../assets/Icon/left-arrow.png";
import { useSelector } from "react-redux";
// import { AntDesign } from "@expo/vector-icons";

const Header = (props) => {
  const { back, goBackFunc, RightButton, backTitle ,style} = props;
  return (
    <View
      style={[{
        backgroundColor: "#0dbf6f",
        flexDirection: "row",
        height: SCREEN_HEIGHT * 0.08,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
      },style]}
    >
      <StatusBar translucent backgroundColor="#0dbf6f" />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => goBackFunc()}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {/* <AntDesign
            style={{ marginHorizontal: 4 }}
            name="arrowleft"
            size={24}
            color="white"
          /> */}
          <Image
            source={arrowLeftIcon}
            style={{ height: 24, width: 24 }}
          ></Image>
          <Text style={{ paddingLeft: 5, fontSize: 16, color: "#FFFFFF" }}>
            {backTitle}
          </Text>
        </TouchableOpacity>
        {RightButton ? <RightButton /> : null}
      </View>
    </View>
  );
};

export default Header;
