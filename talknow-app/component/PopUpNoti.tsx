/* eslint-disable prettier/prettier */

import React from "react";
import Modal from "react-native-modal";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import styleAll from "../assets/style/styleAll";
import { MARGIN_BOTTOM } from "../config/const";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { actionPopup } from "../redux/popupSlice";
// import { actionChangePopupNoti } from "../redux/actionCreators";

export default function PopupNoti(props) {
  const popupNoti = useSelector((state) => state.popup);
  console.log('popupNoti',popupNoti)
  // const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onCancel = () => {
    popupNoti?.onCancel?.();
    
    dispatch(actionPopup({}));
  };

  const onConfirm = () => {
    popupNoti?.onConfirm?.();
    dispatch(actionPopup({}));
  };

  const renderButtonClose = () => {
    return <Button label={popupNoti?.cancel || "Đóng"} onPress={onCancel} />;
  };

  const renderButtonConfirm = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Button
          type={"sub"}
          label={popupNoti?.cancel || "Huỷ"}
          style={{ flex: 1 }}
          onPress={onCancel}
        />
        <Button
          label={popupNoti?.confirm || "Đồng ý"}
          style={{ flex: 1, marginLeft: 12 }}
          onPress={onConfirm}
        />
      </View>
    );
  };

  return (
    <Modal
      isVisible={popupNoti?.content || popupNoti?.customize ? true : false}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      backdropTransitionOutTiming={0}
      onBackdropPress={onCancel}
      style={{ margin: 24, padding: 0, flex: 1, justifyContent: "center" }}
      avoidKeyboard={true}
    >
      {popupNoti?.content || popupNoti?.customize ? (
        <View
          style={{
            backgroundColor: "#fff",
            overflow: "hidden",
            borderRadius: 8,
            paddingBottom: 8,
          }}
        >
          <View style={[{ padding: 20, backgroundColor: "#f1f1f1" }]}>
            <Text style={[styleAll.textNormal, styleAll.textCenter]}>
              {popupNoti?.title || "Thông báo"}
            </Text>
          </View>
          <View style={{ padding: 24, alignItems: "center" }}>
            {popupNoti?.customize ? popupNoti?.customize : null}
            {popupNoti?.content ? (
              <Text
                style={[
                  styleAll.textNormal,
                  { padding: 10, textAlign: "center" },
                ]}
              >
                {popupNoti?.content}
              </Text>
            ) : null}
          </View>
          <View style={{ padding: 12 }}>
            {popupNoti?.type === "confirm"
              ? renderButtonConfirm()
              : renderButtonClose()}
          </View>
        </View>
      ) : null}
    </Modal>
  );
}
