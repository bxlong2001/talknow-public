import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const InChatFileTransfer = ({ filePath, style }) => {
  var fileType = "";
  var name = "";
  if (filePath !== undefined) {
    name = filePath.split("/").pop();
    fileType = filePath.split(".").pop();
  }
  return (
    <View style={[styles.container, style]}>
      <View style={styles.frame}>
        <Image
          source={
            fileType === "pdf"
              ? require("../assets/imges/pdf.png")
              : require("../assets/imges/unknown.png")
          }
          style={{ height: 60, width: 60 }}
        />
        <View>
          <Text style={styles.text}>
            {name.replace("%20", "").replace(" ", "")}
          </Text>
          <Text style={styles.textType}>{fileType.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 5,
    justifyContent: "center",
    
  },
  text: {
    color: "black",
    marginTop: 10,
    fontSize: 8,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textType: {
    color: "black",
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  frame: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    padding: 5,
    marginTop: 30,
  },
});
