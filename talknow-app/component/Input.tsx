/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {
  Component,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  InputAccessoryView,
  Image,
} from 'react-native';
// import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import closeCicleIcon from '../assets/Icon/cross.png';
import eye from '../assets/Icon/eye.png';
import eye_ouline from '../assets/Icon/eye_ouline.png';
import styleAll from '../assets/style/styleAll';

interface InputProps {
  showDelete?: boolean;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  prefixLabel?: string;
  prefixIcon?: React.ReactNode | null;
  returnKeyType?: string;
  numberOfLines?: number;
  maxLength?: number | null;
  selectTextOnFocus?: boolean;
  editable?: boolean;
  style?: any;
  textStyle?: any;
  placeholder?: string;
  isPassword?: boolean;
  title?: string;
  subTitle?: string;
  defaultValue?: string;
  rules?: any[];
  required?: boolean;
  oldPass?: any;
  keyboardType?: string;
  wrapStyle?: any;
  onEndEditing?: () => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  multiline?: boolean;
  icon?: string;
  text?: string;
  view?: React.ReactNode;
  isFormatMoney?: boolean;
  value?: string;
}

const Input = forwardRef(({...props}: InputProps, ref) => {
  const {
    showDelete = true,
    onChangeText = () => {},
    onSubmitEditing = () => {},
    prefixLabel = '',
    prefixIcon = null,
    returnKeyType = 'done',
    numberOfLines = 1,
    maxLength = null,
    selectTextOnFocus = false,
    editable = true,
    style = {},
    textStyle = {},
    placeholder = '',
    isPassword = false,
    title = '',
    subTitle = '',
    defaultValue = '',
    rules = [],
    required = false,
    oldPass,
    keyboardType,
    wrapStyle,
    onEndEditing,
    onFocus = () => {},
    autoFocus,
    multiline = false,
    icon,
    text,
    view,
    isFormatMoney,
  } = props;

  const [value, setValue] = useState(defaultValue);
  const [showDeleteState, setShowDeleteState] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState('');

  const refInput = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    validateData() {
      return validateData();
    },
    focus() {
      return focus();
    },
  }));

  useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);

  const validateData = () => {
    let count = 0;
    rules.forEach(e => {
      if (e?.type === 'required' && value === '') {
        setError(e?.message);
        count++;
        return false;
      } else if (e?.type === 'pattern' && !e?.pattern?.test(value)) {
        setError(e?.message);
        count++;
        return false;
      }
    });
    if (count) {
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const onInputChangeText = (inputValue: string) => {
    onChangeText?.(inputValue);
    setValue(inputValue);
  };

  const onInputFocus = () => {
    onFocus?.();
  };

  const resetText = () => {
    onInputChangeText('');
  };

  const focus = () => {
    refInput?.current?.focus();
  };

  return (
    <View style={[{width: '100%', marginVertical: 6}, style]}>
      <View style={[styleAll.flexRow]}>
        {title && (
          <Text
            style={[
              styleAll.textNormal,
              {marginBottom: 10, color: 'rgba(0, 0, 0, 0.8)'},
            ]}>
            {title}
          </Text>
        )}
        {subTitle && (
          <Text
            style={[
              styleAll.textNormal,
              styleAll.textSmall,
              {marginLeft: 8, marginBottom: 8, color: '#888'},
            ]}>
            {subTitle}
          </Text>
        )}
        {required && (
          <Text
            style={[
              styleAll.textNormal,
              styleAll.textSmall,
              {marginLeft: 4, marginBottom: 8, color: '#e74c3c'},
            ]}>
            *
          </Text>
        )}
      </View>
      <View
        style={[
          styleAll.flexRow,
          styleAll.border,
          {borderRadius: 10, overflow: 'hidden'},
          editable ? null : {backgroundColor: '#f1f1f1'},
          wrapStyle,
          error ? {borderColor: 'black'} : null,
        ]}>
        {prefixLabel && (
          <View
            style={[
              styleAll.borderRight,
              {
                paddingHorizontal: 16,
                backgroundColor: '#fff',
                height: 50,
                justifyContent: 'center',
                borderColor: 'black',
              },
            ]}>
            <Text style={[styleAll.textNormal, {color: '#888888'}]}>
              {prefixLabel}
            </Text>
          </View>
        )}
        {prefixIcon && <View style={{paddingLeft: 16}}>{prefixIcon}</View>}

        <TextInput
          ref={refInput}
          style={[
            styleAll.textNormal,
            {
              flex: 1,
              height: 49 * numberOfLines,
              paddingLeft: 16,
              fontSize: 14,
            },
            textStyle,
          ]}
          underlineColorAndroid="transparent"
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType || 'default'}
          autoFocus={autoFocus || false}
          editable={editable}
          onFocus={onFocus}
          onChangeText={text => onInputChangeText(text)}
          value={value}
          returnKeyType={returnKeyType}
          onEndEditing={onEndEditing}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          blurOnSubmit
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          selectTextOnFocus={selectTextOnFocus}
          secureTextEntry={oldPass || (isPassword && !showPass)}
        />
        {showDelete && value ? (
          <TouchableOpacity
            onPress={resetText}
            style={{paddingVertical: 4, paddingHorizontal: 10}}>
            {/* <Ionicons name={'close-circle'} style={{ fontSize: 24, color: '#ccc' }} />
             */}
            <Image
              source={closeCicleIcon}
              style={{height: 24, width: 24}}></Image>
          </TouchableOpacity>
        ) : null}
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            style={{paddingVertical: 4, paddingHorizontal: 16}}>
            {/* <MaterialCommunityIcons
              name={showPass ? "eye-off" : "eye"}
              style={{ fontSize: 22, color: "#888" }}
            /> */}
            {showPass ? (
              <Image
                source={eye_ouline}
                style={{height: 24, width: 24}}></Image>
            ) : (
              <Image source={eye} style={{height: 24, width: 24}}></Image>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text
          style={[
            styleAll.textNormal,
            styleAll.textSmall,
            {color: '#e74c3c', marginLeft: 16, marginTop: 4},
          ]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

export default Input;
