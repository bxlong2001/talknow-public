/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  Composer,
  LeftRightStyle,
  Send,
  Bubble,
  BubbleProps,
  QuickRepliesProps,
  RenderMessageAudioProps,
  RenderMessageImageProps,
  RenderMessageTextProps,
  RenderMessageVideoProps,
  Reply,
  TimeProps,
  User,
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleProp,
  TextStyle,
  ViewStyle,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BarOnline from '../../../component/BarOnline';
import styles from './styles';
import {useSelector} from 'react-redux';
import axios from 'axios';
import URL from '../../../apis/url';
import moment from 'moment';
import InChatFileTransfer from '../../../component/InChatFileTransfer';
import InChatViewFile from '../../../component/InChatViewFile';
import DownIcon from '../../../assets/Icon/DownIcon.png';
import SendIcon from '../../../assets/Icon/SendIcon.png';
import MicIcon from '../../../assets/Icon/MicIcon.png';
import CameraIcon from '../../../assets/Icon/CameraIcon.png';
import FileIcon from '../../../assets/Icon/FileIcon.png';
import {Buffer} from 'buffer';
import CryptoJS from 'react-native-crypto-js';
import cloneDeep from 'lodash/cloneDeep';
import ActionSheetSelect from '../../../component/ActionSheetSelect';
import ImagePicker from 'react-native-image-crop-picker';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import OnMicIcon from '../../../assets/Icon/onMicIcon.png';
import BtnIconVideo from '../../../assets/Icon/btnIconVideo.png';
import crypto from 'crypto';
import {
  handlePermissionMultiple,
  togglePermissionFunc,
} from '../../../sevice/HandAllowPermison';
import {PERMISSIONS} from 'react-native-permissions';
import {getItem, saveItem} from '../../../sevice/Asy';
import ImageBlur from '../../../assets/images/imgBlur.jpg';

import {
  chosePhotoFromLibrary,
  takePhotoFromCamera,
} from '../../../helper/takePhoto';
import {InferProps, Validator, Requireable} from 'prop-types';
import {Crypt, RSA} from 'hybrid-crypto-js';
import PasueIcon from '../../../assets/Icon/pause.png';
import PlayIcon from '../../../assets/Icon/play.png';
import {RNCamera} from 'react-native-camera';
import PlayVideoIcon from '../../../assets/Icon/playvideo.png';
import RecordingVideoIcon from '../../../assets/Icon/record.png';
import StopRecordinVideoIcon from '../../../assets/Icon/stopRecord.png';
import CloseBlackIcon from '../../../assets/Icon/cross.png';
import Video from 'react-native-video';
import {getInitials} from '../../../helper/common';
import DocumentPicker from 'react-native-document-picker';
import imagePdf from '../../../assets/images/pdf.png';
import Pdf from 'react-native-pdf';
import ImageResizer from 'react-native-image-resizer';
import {HEIGHT, WIDTH} from '../../../config/const';
import {BackHandler} from 'react-native';
import Modal from 'react-native-modal';
import EncryptedStorage from 'react-native-encrypted-storage';
// import from '@env'
type ChatProps = {
  navigation: any;
  route: {
    params: {
      socket: any;
      receiverId: string[];
      roomCode?: string;
      roomName?: string;
      p: string;
      g: string;
    };
  };
};

const ChatScreen: React.FC<ChatProps> = props => {
  const {route} = props;
  const now = new Date();
  const timestamp = now.getTime();

  // route
  const user = useSelector((state: any) => state.auth);
  const socket = useSelector((state: any) => state?.socket?.socket);
  const p = useSelector((state: any) => state?.socket?.p);
  const g = useSelector((state: any) => state?.socket?.g);
  // ref
  const cameraRef = useRef(null);
  const selectVideoRef = useRef(null);
  const selectTypeAvatarRef = useRef();

  // state
  const [selectedFile, setSelectedFile] = useState(null);
  const [sharedSecretKey, setSharedSecretKey] = useState('');
  const [rsaPrivateKey, setRSAPrivateKey] = useState('');
  const [fileVisible, setFileVisible] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  const receiverId = route.params.receiverId;
  // const receiver = route.params.receiver;
  const roomCode = route.params.roomCode;
  // const isOnline = route.params.isOnline || true;
  // const lastOnlineAt = route.params.lastOnlineAt;
  const roomName = route.params.roomName ? route.params.roomName : '';

  // state
  const [roomId, setRoomId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [dataImg, setDataImg] = useState();
  const [errorMess, setErrorMess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState();
  const [openCamera, setOpenCamera] = useState(false);
  const [stopRecordVideo, setStopRecordVideo] = useState(false);
  const [playVideo, SetPlayVideo] = useState(false);
  const [fileBase64, setFileBase64] = useState(null);
  const [openFile, setOpenFile] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [receiver, setReceiver] = useState<any>()
  // const crypt = useRef(
  //   new Crypt({
  //     md: 'md5', // Options: sha1, sha256, sha384, sha512, and md5
  //   }),
  // );
  const timerRef = useRef();
  useEffect(() => {
    getReceiver();
  }, [])

  useEffect(() => {
    if(receiver?.length > 0) {
      // getSharedSercetKey();
      console.log("roomCode: ", roomCode);
      
      const listUser = [...receiverId];
      listUser.push(user.userId);
      socket.emit('joinRoom', {
        roomCode,
        listUser,
      });
  
      socket.on('room', (data: any) => {
        setRoomId(data.roomId);
      });
  
      return () => {
        socket.off('room');
      };
    }
  }, [receiver]);

  useEffect(() => {
    if (!!sharedSecretKey && !!rsaPrivateKey) {
      socket.on('connect', (data: any) => console.log('data: ', data));
      socket.on('chatMessage', async (data: any) => {
        if (data.newMessage.senderId !== user._id) {
          console.log('===>>> Tin nhắn được mã hóa và chưa được xác minh: ', data.newMessage.content);
            await axios.put(
              `${URL.ROOT_API}${URL.VERIFY_SIGNATURE}/${data.newMessage._id}`,
              {content: data.newMessage.content},
            );
            // console.log('===>>> Tin nhắn được giải mã: ', originalText);
            if (data.type !== 'mess') {
                  let newwMessage: IMessage;
                  if (data.type === 'img') {
                    newwMessage = {
                      _id: data.newMessage.id,
                      text: '',
                      createdAt: data.newMessage.createdAt,
                      user: {
                        _id: data.newMessage.senderId,
                      },
                      // image: resultBase64,
                    } as IMessage;
                    handleReceivedMessage(newwMessage);
                  } else if (data.type === 'audio') {
                    // setAudioBase64(resultBase64);
                    newwMessage = {
                      _id: data.newMessage.id,
                      text: '',
                      createdAt: data.newMessage.createdAt,
                      user: {
                        _id: data.newMessage.senderId,
                      },
                      // audio: resultBase64,
                    } as IMessage;
                    handleReceivedMessage(newwMessage);
                  } else if (data.type === 'video') {
                    newwMessage = {
                      _id: data.newMessage.id,
                      text: '',
                      createdAt: data.newMessage.createdAt,
                      user: {
                        _id: data.newMessage.senderId,
                      },
                      // video: resultBase64,
                    } as IMessage;

                    handleReceivedMessage(newwMessage);
                  } else if (data.type === 'file') {
                    // const fileName = originalText?.split('/');
                    newwMessage = {
                      _id: data.newMessage.id,
                      text: '',
                      createdAt: data.newMessage.createdAt,
                      user: {
                        _id: data.newMessage.senderId,
                      },
                      file: {
                        // fileName: fileName[2],
                        // url: resultBase64,
                      },
                    } as IMessage;
                    handleReceivedMessage(newwMessage);
                  }
            } else if (data.type === 'mess') {
              const newwMessage = {
                _id: data.newMessage.id,
                text: data.newMessage.content,
                createdAt: data.newMessage.createdAt,
                user: {
                  _id: data.newMessage.senderId,
                },
              } as IMessage;
              handleReceivedMessage(newwMessage);
            }
          }
      });
    }
    return () => {
      socket.off('chatMessage');
    };
  });

  useEffect(() => {
    if (receiver?.length > 0 && roomId) {
      loadMessages();
    }
  }, [receiver, roomId]);

  useEffect(() => {
    const handleBackPress = () => {
      if (openFile == true) {
        setOpenFile(false);
      } else if (openCamera == true) {
        setOpenCamera(false);
      } else if (playVideo == true) {
        SetPlayVideo(false);
      }
      if (isRecording == true) {
        setIsRecording(false);
      } else {
        setLoading(false);
        console.log('openCamera', openCamera);
        props.navigation.goBack();
      }
      return true;
    };
    // Thêm sự kiện lắng nghe khi component được mount
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    // Xóa sự kiện lắng nghe khi component unmount để tránh memory leak
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [openFile, openCamera, playVideo, isRecording, props.navigation, loading]);

  const getReceiver = async () => {
    const res = await axios.get(`${URL.ROOT_API}${URL.GET_PAGEABLE_USER}`, {
      params: {
        cond: {
          _id: {$in: receiverId}
        }
      }
    })

    setReceiver(res?.data?.data?.result)
  }

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`${URL.ROOT_API}${URL.GET_PAGEABLE_CHAT}`, {
        params: {
          page: 1,
          limit: 10,
          cond: {
            roomId: roomId,
          },
        },
      });
      if (!!data?.data?.data?.result) {
        const result = data?.data?.data?.result;
        const historyMessages = (await Promise.all(
          result.map(async (e: any) => {
              console.log('===>>> Tin nhắn được mã hóa và chưa được xác minh: ', e.content);
              
            // let cleanedText = originalText.replace(/^"(.+)"$/, '$1');
            if (!!e.content) {
              if (e.type !== 'mess') {
                let newwMessage;
                // await Decry(cleanedText)
                  // .then((resultBase64: any) => {
                    if (e.type === 'img') {
                      newwMessage = {
                        _id: e?._id,
                        text: '',
                        createdAt: moment(e.thoiGianGui).toDate(),
                        user: {_id: e.senderId._id},
                        // image: resultBase64,
                      } as IMessage;
                    } else if (e.type === 'audio') {
                      // setAudioBase64(resultBase64);
                      newwMessage = {
                        _id: e?._id,
                        text: '',
                        createdAt: moment(e.thoiGianGui).toDate(),
                        user: {_id: e.senderId._id},
                        // audio: resultBase64,
                      } as IMessage;
                    } else if (e.type === 'video') {
                      newwMessage = {
                        _id: e?._id,
                        text: '',
                        createdAt: moment(e?.thoiGianGui).toDate(),
                        user: {_id: e.senderId._id},
                        // video: resultBase64,
                      } as IMessage;
                    } else if (e.type === 'file') {
                      // const fileName = cleanedText.split('/');
                      newwMessage = {
                        _id: e?._id,
                        text: '',
                        createdAt: moment(e?.thoiGianGui).toDate(),
                        user: {_id: e.senderId._id},
                        file: {
                          // fileName: fileName[2],
                          // url: resultBase64,
                        },
                      } as IMessage;
                    }
                    return newwMessage;
                  }
              } else {
                return {
                  _id: e?._id,
                  createdAt: moment(e.thoiGianGui).toDate(),
                  text: e.content,
                  user: {_id: e.senderId._id},
                };
              }
            }
          // }),
        )) as IMessage[];
        if (!!historyMessages && historyMessages.length > 0)
          setMessages(historyMessages);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error: ', error);
    }
  };

  const onSend = async (
    newMessages: IMessage[],
    receiverId: string[],
    type?: string,
    nameFile?: string,
  ) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
    try {
      const cloneNewMessages = cloneDeep(newMessages);
      socket.emit('chatMessage', {
        message: cloneNewMessages,
        roomId,
        receiverId,
        senderId: user.userId,
        // senderRSAPublicKey: user.rsaPublicKey,
        type,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReceivedMessage = (message: IMessage) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, [message]));
  };

  async function pickAndConvertToBase64() {
    try {
      setLoading(true);
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileName = result[0].name;
      const fileUri = result[0].fileCopyUri;
      const fileContent = await RNFS.readFile(fileUri, 'base64');
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      const newMessage = [
        {
          _id: +messages[0]._id + 1,
          createdAt: new Date(),
          user: {
            _id: user.userId,
            avatar: '',
          },
          file: {
            fileName: fileName,
            url: fileContent,
          },
        },
      ];
      let cipherAudio = await CryptoJS.AES.encrypt(
        fileContent,
        sharedSecretKey,
      ).toString();
      const resultPdf = await uploadFileToAws3(
        'myuploadfile',
        `/file/${fileName}.pdf`,
        cipherAudio,
      );
      onSend(newMessage, receiverId, 'file', await resultPdf?.key);
      setLoading(false);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        setLoading(false);
        // Người dùng đã hủy chọn tệp tin
        console.log('Chọn tệp tin bị hủy');
      } else {
        setLoading(false);
        throw error;
      }
    }
  }

  const startRecording = async () => {
  };

  const PlayAudio = (
    type: string,
    name: string,
    base64: string | undefined,
  ) => {
  };
  const chooseVideoFromLibrary = async () => {
  };
  const startRecordingVideo = async () => {
  };

  const stopRecordingVideo = () => {
  };

  const downloadToFile = (base64: any, contentId: any) => {
    const path = `file://${RNFS.DocumentDirectoryPath}/${contentId}.mp4`;
    RNFS.writeFile(path, base64, 'base64')
      .then((success: any) => {
        console.log('FILE WRITTEN: ', success);
      })
      .catch((err: {message: any}) => {
        console.log('File Write Error: ', err.message);
      });
  };

  const uploadFileToAws3 = (
    buketName: string,
    fileName: string,
    filePath: string,
  ) => {
  };
  const handleImageCapture = async (data: any) => {
    // try {
    //   setLoading(true);
    //   // Lấy đường dẫn tạm thời của ảnh
    //   const tempImagePath = data?.path;
    //   // Kích thước mới và chất lượng sau khi thay đổi kích thước
    //   const newWidth = 800;
    //   const newHeight = 600;
    //   const quality = 80;

    //   // Thực hiện thay đổi kích thước và nén ảnh
    //   const resizedImage = await ImageResizer.createResizedImage(
    //     tempImagePath,
    //     newWidth,
    //     newHeight,
    //     'JPEG',
    //     quality,
    //   );
    //   setImgUrl(resizedImage.uri);
    //   setDataImg(resizedImage);
    //   // Bạn có thể sử dụng đường dẫn này để hiển thị hoặc lưu trữ ảnh.
    //   const file = {
    //     uri: data.path,
    //     name: `${data?.modificationDate}.JPG`,
    //     type: data.mime,
    //   };
      
    //     onSend(newMessage, receiverId, 'img', await result.key);
    //     setLoading(false);
    //   } catch (error) {
    //     console.log('error', error);
    //     setLoading(false);
    //   }
    // } catch (error) {
    //   console.error('Lỗi khi xử lý ảnh:', error);
    //   setLoading(false);
    // }
  };
  const takePhotoFromLibaryFunc = async (
    image: React.SetStateAction<string>,
  ) => {
    handleImageCapture(image);
  };
  const takePhotoFromCameraFunc = async (
    image: React.SetStateAction<string>,
  ) => {
    handleImageCapture(image);
  };

  const selectTypeAvatar = (option: {value: string}) => {
    // if (option.value === 'photo') {
    //   chosePhotoFromLibrary(takePhotoFromLibaryFunc, 'SEND');
    // } else if (option.value === 'camera') {
    //   takePhotoFromCamera(takePhotoFromCameraFunc, 'SEND');
    // }
  };
  const selectVideo = (option: {value: string}) => {
    if (option.value === 'photo') {
      chooseVideoFromLibrary();
    } else if (option.value === 'camera') {
      setOpenCamera(true);
    }
  };

  const renderAvatar = (props: any) => (
    <View
      style={{
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#87CEEB',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 16,
          color: 'white',
          fontWeight: '500',
        }}>
        {roomName && getInitials(roomName)}
      </Text>
    </View>
  );
  const renderBubble = (
    props: React.JSX.IntrinsicAttributes &
      React.JSX.IntrinsicClassAttributes<Bubble<IMessage>> &
      Pick<
        Pick<Readonly<BubbleProps<IMessage>>, keyof BubbleProps<IMessage>> &
          Pick<
            InferProps<{
              user: Validator<object>;
              touchableProps: Requireable<object>;
              onLongPress: Requireable<(...args: any[]) => any>;
              renderMessageImage: Requireable<(...args: any[]) => any>;
              renderMessageVideo: Requireable<(...args: any[]) => any>;
              renderMessageAudio: Requireable<(...args: any[]) => any>;
              renderMessageText: Requireable<(...args: any[]) => any>;
              renderCustomView: Requireable<(...args: any[]) => any>;
              isCustomViewBottom: Requireable<boolean>;
              renderUsernameOnMessage: Requireable<boolean>;
              renderUsername: Requireable<(...args: any[]) => any>;
              // ref
              renderTime: Requireable<(...args: any[]) => any>;
              renderTicks: Requireable<(...args: any[]) => any>;
              renderQuickReplies: Requireable<(...args: any[]) => any>;
              onQuickReply: Requireable<(...args: any[]) => any>;
              position: Requireable<string>;
              optionTitles: Requireable<(string | null | undefined)[]>;
              currentMessage: Requireable<object>;
              nextMessage: Requireable<object>;
              previousMessage: Requireable<object>;
              containerStyle: Requireable<
                InferProps<{
                  left: Requireable<number | boolean | object>;
                  right: Requireable<number | boolean | object>;
                }>
              >;
              wrapperStyle: Requireable<
                InferProps<{
                  left: Requireable<number | boolean | object>;
                  right: Requireable<number | boolean | object>;
                }>
              >;
              bottomContainerStyle: Requireable<
                InferProps<{
                  left: Requireable<number | boolean | object>;
                  right: Requireable<number | boolean | object>;
                }>
              >;
              tickStyle: Requireable<number | boolean | object>;
              usernameStyle: Requireable<number | boolean | object>;
              containerToNextStyle: Requireable<
                InferProps<{
                  left: Requireable<number | boolean | object>;
                  right: Requireable<number | boolean | object>;
                }>
              >;
              containerToPreviousStyle: Requireable<
                InferProps<{
                  left: Requireable<number | boolean | object>;
                  right: Requireable<number | boolean | object>;
                }>
              >;
            }>,
            never
          > &
          Pick<
            Readonly<BubbleProps<IMessage>>,
            | 'onPress'
            | 'inverted'
            | 'textStyle'
            | 'quickReplyStyle'
            | 'quickReplyTextStyle'
            | 'renderQuickReplySend'
          >,
        | 'user'
        | 'isCustomViewBottom'
        | 'renderUsernameOnMessage'
        | 'inverted'
        | 'textStyle'
        | 'quickReplyStyle'
        | 'quickReplyTextStyle'
        | 'renderQuickReplySend'
      > & {
        readonly position?: 'left' | 'right' | undefined;
        readonly currentMessage?: IMessage | undefined;
        readonly onLongPress?:
          | ((context?: any, message?: any) => void)
          | undefined;
        readonly onPress?: ((context?: any, message?: any) => void) | undefined;
        readonly touchableProps?: object | undefined;
        readonly renderMessageImage?:
          | ((props: RenderMessageImageProps<IMessage>) => React.ReactNode)
          | undefined;
        readonly renderMessageVideo?:
          | ((props: RenderMessageVideoProps<IMessage>) => React.ReactNode)
          | undefined;
        readonly renderMessageAudio?:
          | ((props: RenderMessageAudioProps<IMessage>) => React.ReactNode)
          | undefined;
        readonly renderMessageText?:
          | ((props: RenderMessageTextProps<IMessage>) => React.ReactNode)
          | undefined;
        readonly renderCustomView?:
          | ((bubbleProps: BubbleProps<IMessage>) => React.ReactNode)
          | undefined;
        readonly renderUsername?:
          | ((user?: User | undefined) => React.ReactNode)
          | undefined;
        readonly renderTime?:
          | ((timeProps: TimeProps<IMessage>) => React.ReactNode)
          | undefined;
        readonly renderTicks?:
          | ((currentMessage: IMessage) => React.ReactNode)
          | undefined;
        readonly renderQuickReplies?:
          | ((quickReplies: QuickRepliesProps<IMessage>) => React.ReactNode)
          | undefined;
        readonly onQuickReply?: ((replies: Reply[]) => void) | undefined;
        readonly optionTitles?: string[] | undefined;
        readonly nextMessage?: IMessage | undefined;
        readonly previousMessage?: IMessage | undefined;
        readonly containerStyle?: LeftRightStyle<ViewStyle> | undefined;
        readonly wrapperStyle?: LeftRightStyle<ViewStyle> | undefined;
        readonly bottomContainerStyle?: LeftRightStyle<ViewStyle> | undefined;
        readonly tickStyle?: StyleProp<TextStyle>;
        readonly usernameStyle?: TextStyle | undefined;
        readonly containerToNextStyle?: LeftRightStyle<ViewStyle> | undefined;
        readonly containerToPreviousStyle?:
          | LeftRightStyle<ViewStyle>
          | undefined;
      } & {},
  ) => {
    const {currentMessage} = props;
    if (currentMessage.file && currentMessage.file.url) {
      return (
        <TouchableOpacity
          onPress={() => {
            setFileBase64(currentMessage.file.url);
            setOpenFile(true);
          }}
          style={{
            // ...styles.fileContainer,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            width: '45%',
            backgroundColor:
              props?.currentMessage?.user._id === currentMessage?.user._id
                ? '#2e64e5'
                : '#efefef',
            borderBottomLeftRadius:
              props?.currentMessage?.user._id === currentMessage?.user._id
                ? 15
                : 15,
            borderTopLeftRadius:
              props?.currentMessage?.user._id === currentMessage?.user._id
                ? 15
                : 15,
            borderTopRightRadius:
              props?.currentMessage?.user._id === currentMessage?.user._id
                ? 15
                : 15,
            borderBottomRightRadius:
              props?.currentMessage?.user._id === currentMessage?.user._id
                ? 15
                : 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              width: '80%',
              marginHorizontal: 20,
            }}>
            <Image source={imagePdf} style={{width: 30, height: 30}}></Image>
            <Text style={{fontSize: 14, marginLeft: 10, color: 'white'}}>
              {currentMessage?.file?.fileName}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (currentMessage?.audio && currentMessage) {
      return (
        <View
          style={{
            // ...styles.fileContainer,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            width: '45%',
            backgroundColor:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? '#2e64e5'
                : '#efefef',
            borderBottomLeftRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
            borderTopLeftRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
            borderTopRightRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
            borderBottomRightRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}>
            <TouchableOpacity
              onPress={async () => {
                await setPlayAudio(true);
                await setAudio(currentMessage?.audio);
              }}>
              <Image
                source={PlayIcon}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: 10,
                  marginLeft: 15,
                }}></Image>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                width: '30%',
                backgroundColor: 'white',
                height: 0.5,
                marginRight: 10,
              }}></View>
            {/* <Text style={{color: 'white', fontSize: 12}}>1:00</Text> */}
          </View>
          <View style={{flexDirection: 'column'}}></View>
        </View>
      );
    }
    if (currentMessage?.video && currentMessage) {
      return (
        <TouchableOpacity
          style={{
            // ...styles.fileContainer,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            width: '45%',
            backgroundColor:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? '#2e64e5'
                : '#efefef',
            borderBottomLeftRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
            borderTopLeftRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
            borderTopRightRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
            borderBottomRightRadius:
              props?.currentMessage?.user._id === currentMessage.user._id
                ? 15
                : 15,
          }}
          onPress={async () => {
            await downloadToFile(currentMessage?.video, 'name');
            SetPlayVideo(true);
          }}>
          <Image
            style={{height: 100, width: '100%', borderRadius: 15}}
            source={ImageBlur}></Image>
          <Image
            source={PlayVideoIcon}
            style={{
              height: 50,
              width: 50,
              position: 'absolute',
              top: 25,
            }}></Image>
        </TouchableOpacity>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#efefef',
          },
        }}
      />
    );
  };
  const scrollToBottomComponent = () => {
    return <Image source={DownIcon} style={{height: 22, width: 22}}></Image>;
  };
  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View style={styles.chatFooter}>
          <Image source={{uri: imagePath}} style={{height: 60, width: 60}} />
          <TouchableOpacity onPress={() => setImagePath('')}>
            <Text style={styles.textFooterChat}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (filePath) {
      return (
        <View style={styles.chatFooter}>
          <Image source={{uri: imagePath}} style={{height: 60, width: 60}} />
          <TouchableOpacity onPress={() => setFilePath('')}>
            <Text style={styles.textFooterChat}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath]);

  return (
    <React.Fragment>
      {openFile ? (
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              setOpenFile(false);
            }}
            style={{position: 'absolute', top: 35, left: 15, zIndex: 1000}}>
            <Image
              source={CloseBlackIcon}
              style={{
                height: 30,
                width: 30,
              }}></Image>
          </TouchableOpacity>
          <View style={stylesPdf.container}>
            <Pdf
              trustAllCerts={false}
              source={{uri: `data:application/pdf;base64,${fileBase64}`}}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={stylesPdf.pdf}
            />
          </View>
        </View>
      ) : !playVideo ? (
        openCamera ? (
          <View style={{flex: 1}}>
            <RNCamera
              ref={cameraRef}
              style={{flex: 1}}
              type={RNCamera.Constants.Type.front}
              flashMode={RNCamera.Constants.FlashMode.off}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                {!stopRecordVideo ? (
                  <TouchableOpacity onPress={startRecordingVideo}>
                    <Image
                      source={RecordingVideoIcon}
                      style={{height: 80, width: 80}}></Image>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={stopRecordingVideo}>
                    <Image
                      source={StopRecordinVideoIcon}
                      style={{height: 80, width: 80}}></Image>
                  </TouchableOpacity>
                )}
                {/*  */}
              </View>
              <TouchableOpacity
                onPress={() => setOpenCamera(false)}
                style={{position: 'absolute', top: 30, left: 10}}>
                <Image
                  source={CloseBlackIcon}
                  style={{
                    height: 30,
                    width: 30,
                  }}></Image>
              </TouchableOpacity>
            </RNCamera>
          </View>
        ) : (
          <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="white"></StatusBar>
            {loading === true && (
              <Modal isVisible={true}>
                <View style={{flex: 1}}>
                  <ActivityIndicator
                    style={{
                      position: 'absolute',
                      top: HEIGHT / 2 - 20,
                      left: WIDTH / 2 - 20,
                      elevation: 1,
                    }}
                    size="large"
                    color="red"
                  />
                </View>
              </Modal>
            )}
            <View style={{marginHorizontal: 10}}>
              <BarOnline
                roomName={roomName}
                isOnline={receiver?.length > 0 ? receiver[0]?.isOnline : true}
                lastOnlineAt={receiver?.length > 0 ? receiver[0]?.lastOnlineAt : new Date()}></BarOnline>
              <View
                style={{
                  backgroundColor: 'gray',
                  height: 0.5,
                  marginVertical: 10,
                }}></View>
            </View>
            <GiftedChat
              alwaysShowSend={true}
              renderBubble={renderBubble}
              messages={messages}
              onSend={messages => onSend(messages, receiverId, 'mess')}
              user={{
                _id: user.userId,
              }}
              renderInputToolbar={props => (
                <React.Fragment>
                  {isRecording && (
                    <View
                      style={{
                        backgroundColor: '#2e64e5',
                        width: '100%',
                        position: 'absolute',
                        height: 80,
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                        bottom: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {/* <Text style={{}}>{`Recording Time: ${time} seconds`}</Text> */}
                      <TouchableOpacity
                        onPress={() => {
                          startRecording();
                        }}>
                        <Image
                          source={OnMicIcon}
                          style={{height: 40, width: 40}}></Image>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: 'white',
                        }}>
                        Bạn đang ghi âm
                      </Text>
                    </View>
                  )}
                  <InputToolbar
                    containerStyle={{paddingBottom: 10, height: 50}}
                    {...props}
                  />
                </React.Fragment>
              )}
              renderSend={props => (
                <Send {...props}>
                  <View style={{marginVertical: 5, marginHorizontal: 10}}>
                    <Image
                      source={SendIcon}
                      style={{height: 20, width: 20}}></Image>
                  </View>
                </Send>
              )}
              renderActions={() => (
                <View style={{marginVertical: 12, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => {
                      handlePermissionMultiple(
                        props,
                        startRecording,
                        [PERMISSIONS.ANDROID.RECORD_AUDIO],
                        [PERMISSIONS.IOS.MICROPHONE],
                        null,
                      );
                    }}
                    style={{height: 25, paddingHorizontal: 10}}>
                    <Image
                      source={MicIcon}
                      style={{height: 20, width: 20}}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => selectTypeAvatarRef.current.show()}
                    style={{height: 25, paddingHorizontal: 10}}>
                    <Image
                      source={CameraIcon}
                      style={{height: 20, width: 20}}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      selectVideoRef.current.show();
                    }}
                    style={{height: 25, paddingHorizontal: 10}}>
                    <Image
                      source={BtnIconVideo}
                      style={{height: 20, width: 20}}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickAndConvertToBase64}
                    style={{height: 25, paddingHorizontal: 10}}>
                    <Image
                      source={FileIcon}
                      style={{height: 20, width: 20}}></Image>
                  </TouchableOpacity>
                </View>
              )}
              scrollToBottomComponent={scrollToBottomComponent}
              renderChatFooter={renderChatFooter}
              renderAvatar={renderAvatar}
            />
            <ActionSheetSelect
              ref={selectTypeAvatarRef}
              title={'Chọn ảnh'}
              options={[
                {label: 'Chọn ảnh từ thư viện của bạn', value: 'photo'},
                {label: 'Chụp ảnh từ camera', value: 'camera'},
                {label: 'Huỷ'},
              ]}
              cancelButtonIndex={2}
              destructiveButtonIndex={-1}
              onPress={selectTypeAvatar}
            />
            <ActionSheetSelect
              ref={selectVideoRef}
              title={'Chọn video'}
              options={[
                {label: 'Chọn video từ thư viện của bạn', value: 'photo'},
                {label: 'Chụp video từ camera', value: 'camera'},
                {label: 'Huỷ'},
              ]}
              cancelButtonIndex={2}
              destructiveButtonIndex={-1}
              onPress={selectVideo}
            />
          </SafeAreaView>
        )
      ) : (
        <Modal
          isVisible={true}
          onBackdropPress={() => {
            SetPlayVideo(false);
          }}>
          <Video
            source={{
              uri: `file://${RNFS.DocumentDirectoryPath}/${`name`}.mp4`,
            }}
            style={{width: '100%', height: '100%'}}
            controls={true}
            resizeMode="cover"
            repeat={true}
          />
        </Modal>
      )}
      <Modal
        isVisible={playAudio}
        style={{justifyContent: 'center', alignItems: 'center'}}
        onBackdropPress={() => {
          setPlayAudio(false);
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {playingAudio ? (
            <Image style={{height: 30, width: 30}} source={PasueIcon} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                PlayAudio('PLAY', 'name', audio);
              }}>
              <Image style={{height: 30, width: 30}} source={PlayIcon} />
            </TouchableOpacity>
          )}
          <View
            style={{
              height: 1,
              width: 100,
              backgroundColor: 'red',
              marginLeft: 20,
            }}></View>
          <Text style={{fontSize: 12, paddingLeft: 12, color: 'white'}}>
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </Text>
        </View>
      </Modal>
    </React.Fragment>
  );
};

export default ChatScreen;
const stylesPdf = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#DDD',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
