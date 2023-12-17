import React from "react";
import { View } from "react-native";

type Props = {};

const SeparatorBar = (props: Props) => {
  return (
    <View
      style={{ width: 1, marginHorizontal: 10,backgroundColor:'black',height:30 }}
    ></View>
  );
};
export default SeparatorBar;
