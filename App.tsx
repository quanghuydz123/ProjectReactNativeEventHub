import { StatusBar, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { SplashScreen } from "./src/screens"
import MainNavigator from "./src/navigators/MainNavigator"
import AuthNavigator from "./src/navigators/AuthNavigator"
import { NavigationContainer } from "@react-navigation/native"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { Provider } from "react-redux"
import store from "./src/reduxs/store"
import AppRouters from "./src/navigators/AppRouters"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Host } from "react-native-portalize";
import socket from "./src/utils/socket"
import { HandleNotification } from "./src/utils/handleNotification"
import Toast from "react-native-toast-message"
import linking from "./src/linking"
import DeviceInfo from "react-native-device-info"
import Orientation from "react-native-orientation-locker"
const App = () => {
//GestureHandlerRootView, Host khai báo để sử dụng modalize
  useEffect(()=>{
    HandleNotification.checkNotifitionPersion()
  },[])
  useEffect(()=>{
    const type = DeviceInfo.getDeviceType()
    if(type === 'Handset'){
      Orientation.lockToPortrait() // khóa xoay ngang
    }
  },[])
  return <>
    {/* //hiện thi thanh giờ,pin,... */}
    <GestureHandlerRootView>
      
        <Provider store={store}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          <Host>
            <NavigationContainer linking={linking}>
              <AppRouters />
            </NavigationContainer>
          </Host>
        </Provider>
    </GestureHandlerRootView>
    <Toast />
  </>
}
export default App;