/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import {Routes} from "./Routes";
import PopupNoti from "../component/PopUpNoti";
export default function MyApp(props) {
  

    return (
        <>
        <PopupNoti />
        <Routes />
        </>
    );
}