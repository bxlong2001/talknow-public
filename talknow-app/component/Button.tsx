/* eslint-disable prettier/prettier */

import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import styleAll from "../assets/style/styleAll";
import { WIDTH } from "../config/const";

const maxWidth = WIDTH - 20;

export default function Button(props) {
  const {
    onPress = () => {},
    type = "normal", //normal, outline, sub
    size = "normal", //normal, small
    disabled = false,
    prefix = null,
    suffix = null,
    label = "",
    style = {},
    textStyleProps = {},
  } = props;

  const [pressDisable, setPressDisable] = useState(disabled);

  const handlePress = () => {
    setPressDisable(true);
    onPress?.();
    setTimeout(() => {
      setPressDisable(false);
    }, 200);
  };

  const buttonStyle = {
    borderWidth: 1,
    borderRadius: 10,
    height: 60,
    width: "100%",
    maxWidth: maxWidth,
    alignSelf: "center",
    overflow: "hidden",
    color: "#fff",
    backgroundColor: "black",
    borderColor: "black",
  };

  const buttonSmallSize = {
    height: 32,
    width: "auto",
    paddingHorizontal: 16,
  };

  const buttonNormalStyle = {
    color: "#fff",
    backgroundColor: "black",
    borderColor: "black",
  };

  const buttonOutlineStyle = {
    color: "black",
    backgroundColor: "#fff",
    borderColor: "black",
  };

  const buttonSubStyle = {
    color: "white",
    backgroundColor: "#888",
    borderColor: "white",
  };

  const buttonStyleRender = () => {
    let res = [buttonStyle];
    if (type === "outline") {
      res.push(buttonOutlineStyle);
    }
    if (size === "small") {
      res.push(buttonSmallSize);
    }
    if (type === "sub") {
      res.push(buttonSubStyle);
    }
    return res;
  };

  const textStyle = {
    paddingVertical: 5,
    ...styleAll.textNormal,
    ...styleAll.textSemiBold,
    color: "#fff",
    ...textStyleProps,
    // marginHorizontal: 16
  };

  const textStyleOutline = {
    color: "black",
  };

  const textStyleSmall = {
    ...styleAll.textNormal,
    ...styleAll.textSmall,
    color: "#fff",
  };

  const textStyleSub = {
    color: "white",
  };

  const textStyleRender = () => {
    let res = [textStyle];
    if (size === "small") {
      res.push(textStyleSmall);
    }
    if (type === "outline") {
      res.push(textStyleOutline);
    }
    if (type === "sub") {
      res.push(textStyleSub);
    }
    return res;
  };

  const iconStyle = {
    fontSize: 24,
    width: 32,
    textAlign: "left",
    color: "#fff",
  };

  const iconStyleSmall = {
    fontSize: 18,
    width: 24,
  };

  const iconStyleOutline = {
    color: "black",
  };

  const iconStyleSub = {
    color: "white",
  };

  const iconStyleRender = () => {
    let res = [iconStyle];
    if (size === "small") {
      res.push(iconStyleSmall);
    }
    if (type === "outline") {
      res.push(iconStyleOutline);
    }
    if (type === "sub") {
      res.push(iconStyleSub);
    }
    return res;
  };

  return (
    <TouchableOpacity
      onPress={() => handlePress()}
      disabled={pressDisable}
      style={[styleAll.flexRow, styleAll.center, buttonStyleRender(), style]}
    >
      {prefix
        ? { ...prefix, props: { ...prefix.props, style: iconStyleRender() } }
        : null}
      <Text style={[textStyleRender(), { fontSize: 16 }]}>{label}</Text>
      {suffix
        ? {
            ...suffix,
            props: {
              ...suffix.props,
              style: [...iconStyleRender(), { textAlign: "right" }],
            },
          }
        : null}
    </TouchableOpacity>
  );
}
