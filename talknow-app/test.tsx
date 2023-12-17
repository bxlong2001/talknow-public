/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {Touchable} from 'react-native';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
type Props = {};

const App = (props: Props) => {
  const [uriBase64, setUriBase64] = useState(null);
  async function pickAndConvertToBase64() {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      // Đọc nội dung tệp
      const fileContent = await RNFS.readFile(result[0].uri, 'base64');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //  dùng đã hủy chọn tệp
      } else {
        throw err;
      }
    }
  }
  const source = {uri: `data:application/pdf;base64,${uriBase64}`};
  return (
    <React.Fragment>
      {uriBase64 ? (
        <View style={styles.container}>
          <Pdf
            trustAllCerts={false}
            source={source}
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
            style={styles.pdf}
          />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#FAFAFA',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{backgroundColor: 'green', padding: 10, borderRadius: 4}}
            onPress={pickAndConvertToBase64}>
            <Text>Chọn file</Text>
          </TouchableOpacity>
        </View>
      )}
    </React.Fragment>
  );
};

export default App;

const styles = StyleSheet.create({
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
