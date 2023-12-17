/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import * as storage from './utils/storage';
import {Provider} from 'react-redux';
import store from './redux/store';
import PopupNoti from './component/PopUpNoti';
import MyApp from './navigation/MyApp';
import RootView from './RootView';

function App() {
  return (
    <Provider store={store}>
      <PopupNoti></PopupNoti>
      <MyApp></MyApp>
    </Provider>
  );
}

export default App;
