/* eslint-disable prettier/prettier */

import { StyleSheet, Platform, Dimensions, PixelRatio } from "react-native";
import { MARGIN_BOTTOM, MARGIN_TOP } from "../../config/const";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 375;
export function normalize(size) {
  return Math.round(size * scale);
}

const styleAll = StyleSheet.create({
  bgColor: {
    backgroundColor: "#fff",
  },

  bgColorSub: {
    backgroundColor: "#f1f1f1",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  bottom: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  textCenter: {
    textAlign: "center",
  },

  textBold: {
    // fontSize: 14,
    // color:'#242424',
    fontWeight: '700',
    // fontFamily: "OpenSans-Semibold",
    fontFamily: "Inter-Bold",
  },

  textSemiBold: {
    // fontSize: 14,
    // color:'#242424',
    fontWeight: "600",
    // fontFamily: "OpenSans-Semibold",
    fontFamily: "Inter-SemiBold",
  },
  textSemiBoldFs18: {
    // fontSize: 14,
    // color:'#242424',
    fontWeight: "600",
    // fontFamily: "OpenSans-Semibold",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },

  textMedium: {
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },

  textNormal: {
    fontSize: normalize(14),
    lineHeight: normalize(18),
    fontFamily: "Inter-Regular",
    // fontFamily: "OpenSans-Regular",
    backgroundColor: "transparent",
    fontWeight: "400",
    color: "#292929",
    // lineHeight: normalize(14) + 12,
  },
  textNormalNews: {
    fontSize: normalize(14),
    lineHeight: normalize(18),
    fontFamily: "Inter-Regular",
    // fontFamily: "OpenSans-Regular",
    backgroundColor: "transparent",
    fontWeight: "400",
    color: "#888888",
    // lineHeight: normalize(14) + 12,
  },

  textSmall: {
    fontSize: normalize(12),
  },

  textSuperSmall: {
    fontSize: normalize(10),
  },

  textLarge: {
    fontSize: normalize(16),
    lineHeight: normalize(22),
  },
  textBig: {
    fontSize: normalize(18),
  },
  textSuperBig: {
    fontSize: normalize(22),
  },

  textLight: {
    // fontFamily: "OpenSans-Light",
  },

  textRegular: {
    // fontFamily: "OpenSans-Regular",
  },

  textUnderline: {
    textDecorationLine: "underline",
  },

  textItalic: {
    fontStyle: "italic",
  },

  textWrap: {
    flexWrap: "wrap",
  },

  borderBottom: {
    borderBottomWidth: 0.5,
    borderColor: "#dedede",
  },

  borderTop: {
    borderTopWidth: 0.5,
    borderColor: "#dedede",
  },

  borderLeft: {
    borderLeftWidth: 0.5,
    borderColor: "#dedede",
  },

  borderRight: {
    borderRightWidth: 0.5,
    borderColor: "#dedede",
  },

  border: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },

  shadow: Platform.select({
    ios: {
      shadowColor: "#aaa",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 2,
    },
    android: {
      shadowOffset: { width: 0, height: 2 },
      shadowColor: "black",
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 3,
      // background color must be set
      // backgroundColor : "#fff" // invisible color
    },
  }),

  shadowTop: Platform.select({
    ios: {
      shadowColor: "#aaa",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 2,
    },
    android: {
      shadowOffset: { width: 10, height: -10 },
      shadowColor: "black",
      shadowOpacity: 1,
      elevation: 3,
      // background color must be set
      backgroundColor: "#0000", // invisible color
    },
  }),
  buttonTextSub: {
    backgroundColor: "#fff",
    color: "#FA971B",
    fontSize: 14,
    textAlign: "center",
    borderRadius: 8,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: "Inter-SemiBold",
    borderColor: "#FA971B",
    borderWidth: 1,
  },

  buttonText: {
    backgroundColor: "#FA971B",
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    borderRadius: 8,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 10,
    // height: 40,
    fontFamily: "Inter-SemiBold",
  },
  // setting

  fullScreen: {
    flex: 1,
    marginHorizontal: 10,
  },
  rowBetwen: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  texColor: {
    color: "#292929",
  },
  RowCenterLine: {
    alignItems: "center",
    flexDirection: "row",
  },
  RowEndLine: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
  RowStartLine: {
    alignItems: "flex-start",
    flexDirection: "row",
  },

  mv10: { marginVertical: 10 },
  mv5: {
    marginVertical: 5,
  },
  shadowImg: {
    shadowColor: "#AAB2C8",
    shadowOffset: {
      width: 2.075754165649414,
      height: 8.303016662597656,
    },
    shadowOpacity: 1,
    shadowRadius: 20.757539749145508,
    elevation: 5,
  },
  ColCenterLine: {
    alignItems: "center",
  },

  pt4: { paddingTop: 4 },
  alignCenterColum: {
    justifyContent: "center",
  },

  pl5: {
    paddingLeft: 5,
  },
  p10: { padding: 10 },
  alignCenter: { alignItems: "center" },
  pv10: { paddingVertical: 10 },
  ph20: { paddingHorizontal: 20 },
  //
  TextInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 30,
    alignItems: "center",
    paddingLeft: 20,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },

  flexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mt: { marginTop: MARGIN_TOP },
  mbt: { marginTop: MARGIN_BOTTOM },
  pt: { paddingTop: MARGIN_TOP },
  pbt: { paddingTop: MARGIN_BOTTOM },

  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  ml8: { marginLeft: 8 },
  ml12: { marginLeft: 12 },
  ml16: { marginLeft: 16 },
  ml24: { marginLeft: 24 },
  mr8: { marginRight: 8 },
  mr12: { marginRight: 12 },
  pd12: { padding: 12 },
  pd16: { padding: 16 },
  pd24: { padding: 24 },
  pt24: { paddingTop: 24 },
  pt12: { paddingTop: 12 },
  mg12: { margin: 12 },
  mg16: { margin: 16 },
  mg24: { margin: 24 },
});

export const tagsStyles = {
  p: { fontFamily: "Inter-Regular", lineHeight: 20 },
  a: { fontFamily: "Inter-Regular" },
  span: { fontFamily: "Inter-Regular" },
};

export default styleAll;
