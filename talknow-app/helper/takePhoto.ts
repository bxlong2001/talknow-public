/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// import ImageCropPicker from "react-native-image-crop-picker";
import {SetStateAction} from 'react';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
export const chosePhotoFromLibrary = (
  callback: {
    (image: SetStateAction<string>): Promise<void>;
    ():
      | ((value: ImageOrVideo) => ImageOrVideo | PromiseLike<ImageOrVideo>)
      | null
      | undefined;
  },
  type: string,
) => {
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: type === 'SEND' ? false : true,
    mediaType: 'photo',
    cropperCircleOverlay: true,
    showCropGuidelines: false,
    showCropFrame: false,
    includeBase64: true,
    hideBottomControls: true,
    cropperToolbarTitle: 'Chọn Vị trí bạn muốn',
  })
    .then(image => {
      callback?.(image);
    })
    .catch(err => console.log(err));
};

export const takePhotoFromCamera = (
  callback: {
    (image: SetStateAction<string>): Promise<void>;
    (arg0: ImageOrVideo): void;
  },
  type: string,
) => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: type === 'SEND' ? false : true,
    cropperCircleOverlay: true,
    showCropGuidelines: false,
    showCropFrame: false,
    includeBase64: true,
    hideBottomControls: true,
    cropperToolbarTitle: 'Chọn Vị trí bạn muốn',
  }).then(image => {
    callback?.(image);
  });
};

export const choseVideoFromLibrary = callback => {
  ImagePicker.openCamera({
    mediaType: 'video',
  }).then(image => {
    console.log(image);
  });
};
