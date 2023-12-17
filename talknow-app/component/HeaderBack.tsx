import React from "react"
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
} from "react-native"
import { Text } from "@ui-kitten/components"
import Icon from "react-native-vector-icons/Entypo"

import R from "@assets/R"
import { getWidth, HEIGHT, WIDTH } from "@configs/functions"
import { goBack } from "@navigation/navigation-service"

import CustomStatusBar from "@common/CustomStatusBar"
import { getStatusBarHeight } from "react-native-status-bar-height"

interface ItemProps {
  title: string
  backIconColor?: string
  lightBarStyle?: boolean
  childrenRight?: any
  onButton?: () => void
  containerStyles?: StyleProp<ViewStyle>
  titleViewStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  isStatusBarAndroidVisible?: boolean
  showImgBackground?: boolean
  hideBackBtn?: boolean
}
const HeaderBack = ({
  title,
  childrenRight,
  onButton,
  containerStyles,
  titleStyle,
  isStatusBarAndroidVisible,
  titleViewStyle,
  showImgBackground,
  backIconColor,
  hideBackBtn,
  lightBarStyle
}: ItemProps) => {
  const height = HEIGHT(58) + getStatusBarHeight(isStatusBarAndroidVisible)

  return (
    <View>
      <CustomStatusBar
        backgroundColor={R.colors.transparent}
        lightBarStyle={lightBarStyle !== false}
        isStatusBarAndroidVisible={isStatusBarAndroidVisible}
      />
      {showImgBackground !== false && <Image
        source={R.images.imageBackgroundHeader}
        resizeMode="stretch"
        style={[styles.img, { height }]}
      />}
      <View style={[styles.container, containerStyles]}>
        {hideBackBtn!== false && <TouchableOpacity hitSlop={R.themes.hitSlop} onPress={onButton || goBack}>
          <Icon size={WIDTH(28)} name="chevron-left" color={backIconColor ?? R.colors.white} />
        </TouchableOpacity>}
        <View style={[styles.titleView, titleViewStyle]}>
          <Text numberOfLines={2} category={"s2"} style={[styles.title, titleStyle]}>
            {title}
          </Text>
        </View>
        <View style={styles.rightView}>{childrenRight}</View>
      </View>
    </View>
  )
}
export default HeaderBack

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: R.colors.transparent,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: WIDTH(16),
    paddingVertical: HEIGHT(12),
    minHeight: 48,
    width: getWidth(),
    position: "relative"
  },
  img: {
    position: "absolute",
    top: 0,
    width: getWidth(),
  },
  rightView: {
    minWidth: WIDTH(36),
    position: "absolute",
    right: 5
  },
  title: {
    color: R.colors.white,
    fontWeight: "800",
  },
  titleView: {
    left: WIDTH(60),
    position: "absolute",
    width: WIDTH(250),

  },
})
