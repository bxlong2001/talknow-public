/* eslint-disable prettier/prettier */

import {Dimensions, Platform, StatusBar, Text} from 'react-native';
// import {isIphoneXorAbove} from "../helper/Helpers";

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export const isIphoneXorAbove = () => {
    const dimen = Dimensions.get('window');
    // console.log('dimen -----> ', dimen);
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (
            (dimen.height === 812 || dimen.width === 812) ||
            (dimen.height === 896 || dimen.width === 896) ||
            (dimen.height === 926 || dimen.width === 926) ||
            (dimen.height === 844 || dimen.width === 844) ||
            (dimen.height === 852 || dimen.width === 852) ||
            (dimen.height === 932 || dimen.width === 932)
        )
    );
};

export const MARGIN_TOP_IOS = isIphoneXorAbove() && Platform.OS === 'ios' ? 50 : (Platform.OS === 'ios' ? 32 : STATUS_BAR_HEIGHT_ANDROID + 10);

export const MARGIN_BOTTOM_IOS = isIphoneXorAbove() && Platform.OS === 'ios' ? 10 : 0;

export const STATUS_BAR_HEIGHT_ANDROID = StatusBar.currentHeight;

export const MARGIN_TOP = isIphoneXorAbove() && Platform.OS === 'ios' ? 60 : (Platform.OS === 'ios' ? 32 : STATUS_BAR_HEIGHT_ANDROID + 10);

export const MARGIN_BOTTOM = isIphoneXorAbove() && Platform.OS === 'ios' ? 32 : 10;

export const TIME_OTP = 120;

export const VERSION_APP = 1.2;

export const SOCIAL_LINK = {
	ZALO: 'https://zalo.me/0902624006',
	PHONE: '0902624006',
	MESSENGER: 'https://m.me/ungdungsspa',
	FANPAGE: 'https://www.facebook.com/ungdungsspa'
};

export const QR_TYPE={
	CHECK_IN:"check_in",
	SCAN_PRODUCT:"scan_product",
	PRODUCT:"product"
}

