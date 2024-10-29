import { StatusBar, Text, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { SplashScreen } from "./src/screens"
import MainNavigator from "./src/navigators/MainNavigator"
import AuthNavigator from "./src/navigators/AuthNavigator"
import { NavigationContainer, useNavigationState } from "@react-navigation/native"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { Provider, useDispatch } from "react-redux"
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
import { Platform, PermissionsAndroid } from 'react-native';
import { PaperProvider } from 'react-native-paper';

const App = () => {
  //GestureHandlerRootView, Host khai báo để sử dụng modalize
  const [nameScreenPresent,setNameScreenPresent] = useState('')
  useEffect(() => {
    HandleNotification.checkNotifitionPersion()
    requestNotificationPermission()
  }, [])
  useEffect(() => {
    const type = DeviceInfo.getDeviceType()
    if (type === 'Handset') {
      Orientation.lockToPortrait() // khóa xoay ngang
    }
  }, [])
 
  const requestNotificationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS').then(
          response => {
            if (!response) {
              PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS', {
                title: 'Notification',
                message:
                  'App needs access to your notification ' +
                  'so you can get Updates',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              })
            }
          }
        ).catch(
          err => {
            console.log("Notification Error=====>", err);
          }
        )
      } catch (err) {
        console.log(err);
      }
    }
  };
  return <>
    {/* //hiện thi thanh giờ,pin,... */}
    <GestureHandlerRootView>
      <Provider store={store}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <Host>
          <NavigationContainer 
            onStateChange={(state:any) => {
              const currentRoute = state.routes[state.index];
              setNameScreenPresent(currentRoute.name)
            }}
            
            
          > 
            <PaperProvider>
              <AppRouters nameScreenPresent={nameScreenPresent}/>
            </PaperProvider>
          </NavigationContainer>
        </Host>
      </Provider>
    </GestureHandlerRootView>
    <Toast />
  </>
}
export default App;