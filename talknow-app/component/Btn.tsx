/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
const COLOR_PRIMARY = '#0dbf6f';

const Btn = props => {
  const {title, handleFuncion, style} = props;
  return (
    <View style={[{alignItems: 'center', width: '75%'}, style]}>
      <TouchableOpacity
        onPress={handleFuncion}
        style={{
          marginTop: 20,
          borderRadius: 10,
          backgroundColor: COLOR_PRIMARY,
          width: '100%',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500', // Use 'normal' or 'bold'
            color: '#FFFFFFE5',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Btn;
