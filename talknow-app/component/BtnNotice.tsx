/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
const COLOR_PRIMARY = '#FF8E00';

const BtnNotice = props => {
  const {title, handleFuncion, style} = props;
  return (
    <TouchableOpacity
      onPress={handleFuncion}
      style={[
        {
          marginTop: 10,
        },
        style,
      ]}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
          textDecorationLine: 'underline',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default BtnNotice;
