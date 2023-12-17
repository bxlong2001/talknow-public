import { StyleSheet } from "react-native";
import color from "../../../../constants/color";
const CIRCLE_SIZE = 50;
const CIRCLE_MARGIN = 4; // Khoảng cách giữa các khối tròn

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mt10: { marginTop: 10 },
  mh: {
    marginHorizontal: 10,
  },
  separatorBar: {
    width: 2,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 19,
    color: color.colorScreen,
  },
  containerOtp: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between", // space-between để cách đều các khối tròn
    alignItems: "center",
    height: CIRCLE_SIZE,
    // width:30
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#D9D9D9", // Thay đổi màu sắc tại đây nếu muốn
    marginHorizontal: CIRCLE_MARGIN, // Áp dụng margin để cách đều các khối tròn
    justifyContent: "center",
    alignItems: "center",
  },
  InputOtp: {
    fontSize: 15,
    fontWeight: "bold",
  },
  reSentCode: {
    fontSize: 19,
    fontWeight: "bold",
  },
  textButton: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  smallDividerBar: {
    backgroundColor: "gray",
    height: 0.5,
    marginVertical: 10,
  },
  iconSendMess: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  mh5: {
    marginHorizontal: 5,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 30,
    alignItems: "center",
    paddingLeft: 20,
  },
  fontSizeTextInputInfor: {
    marginBottom: 0,
  },
  radius30: {
    borderRadius: 30,
  },
  flexBtn: {
    flex: 40,
    alignItems: "center",
  },
});
