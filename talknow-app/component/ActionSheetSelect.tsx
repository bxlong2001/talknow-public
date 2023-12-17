/* eslint-disable prettier/prettier */

import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import ActionSheet from 'react-native-actionsheet';

const ActionSheetSelect = forwardRef((props, ref) => {
  // const THEME = useSelector(state => state.saveThemeConfig);
  const {
    title = '',
    options = [],
    cancelButtonIndex = 0,
    onPress = () => {},
  } = props;

  const actionSheetRef = useRef();

  useImperativeHandle(ref, () => ({
    show() {
      return show();
    },
  }));

  const show = () => {
    actionSheetRef.current.show();
  };

  const pressSheet = index => {
    onPress?.(options?.[index]);
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      title={title}
      options={options.map(e => e?.label)}
      cancelButtonIndex={cancelButtonIndex}
      destructiveButtonIndex={-1}
      onPress={index => pressSheet(index)}
    />
  );
});

export default ActionSheetSelect;
