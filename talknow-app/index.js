/**
 * @format
 */
// if (global.BigInt === undefined) {
//     const bi = require("big-integer");
//     global.BigInt = (value) => {
//       if (typeof value === "string") {
//         const match = value.match(/^0([xo])([0-9a-f]+)$/i);
//         if (match) {
//           return bi(match[2], match[1].toLowerCase() === "x" ? 16 : 8);
//         }
//       }
//       return bi(value);
//     };
// }
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './shim.js'
import { LogBox } from "react-native"

LogBox.ignoreAllLogs(true)
AppRegistry.registerComponent("ChatApp", () => App);
