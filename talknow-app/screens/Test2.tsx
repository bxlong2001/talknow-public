/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useRef} from 'react';
import {RNCamera} from 'react-native-camera';
import {View, Text, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';

const Test2 = () => {
  const cameraRef = useRef(null);

  const startRecordingVideo = async () => {
    if (cameraRef.current) {
      const options = {
        quality: RNCamera.Constants.VideoQuality['360p'],
      };
      const data = await cameraRef.current.recordAsync(options);
      RNFS.readFile(data.uri, 'base64')
        .then(async base64String => {
          console.log(base64String);
        })
        .catch(error => {
          console.error('Lỗi khi đọc tệp: ' + error);
        });
    }
  };

  const stopRecordingVideo = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={{flex: 1}}>
      <RNCamera
        ref={cameraRef}
        style={{flex: 1}}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.off}>
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity onPress={startRecordingVideo}>
            <Text style={{color: 'white'}}>Bắt đầu quay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopRecordingVideo}>
            <Text style={{color: 'white'}}>Kết thúc quay</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
    </View>
  );
};

export default Test2;
