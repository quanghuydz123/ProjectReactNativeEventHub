import { BackHandler, Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import ExploreNavigator from "./ExploreNavigator"
import DrawerCustom from "../components/DrawerCustom"
import TabNavigator from "./TabNavigator"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AboutProfile, EventDetails } from "../screens"
import { useStatusBar } from "../hooks/useStatusBar"
import { ToastMessaging } from "../utils/showToast"
import { Snackbar } from "react-native-paper"
import { appInfo } from "../constrants/appInfo"

const DrawerNavigate = ({ navigation }: any) => {
  const Drawer = createDrawerNavigator()
  const [count, setCount] = useState(0)
  const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout | null>(null)
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);
  const resetTimeOut = () => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    const newInterval = setTimeout(() => {
      setCount(0);
    }, 4000);
    setTimeOutId(newInterval);
  };
  useEffect(() => {
    const interval = setTimeout(() => {
      setCount(0)
    }, 4000);
    setTimeOutId(interval);
    return () => {
      if (timeOutId) clearTimeout(timeOutId);
    };
  }, [])

  const handleBackButtonClick = () => {
    const state = navigation.getState();
    const routes = state.routes;
    if (routes.length > 1) {
      const prevRoute = routes[routes.length - 2]; // Lấy route trước đó
      console.log("prevRoute.name", prevRoute.name);
      navigation.goBack();
    } else {
      // Nếu không có màn hình trước đó, thoát ứng dụng
      if (count >= 1) {
        BackHandler.exitApp();
      } else {
        // ToastMessaging.Warning({ message: 'Nhấn lần nữa để thoát', visibilityTime: 3000 })
        onToggleSnackBar()
        setCount(prev => prev + 1)
        resetTimeOut()
      }
    }
    return true;
  }
  console.log("c", count)
  useEffect(() => {

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, [count]);
  return (
    <>
      <Drawer.Navigator screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
      }}
        drawerContent={props => <DrawerCustom {...props} />} // cấu hình giao diện cho drawer
      >
        <Drawer.Screen name="HomeNavigator" component={TabNavigator} />
      </Drawer.Navigator>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        // action={{
        //   label: 'Undo',
        //   onPress: () => {
        //     // Do something
        //   },
        // }}
        duration={3000}
        style={{
          position:'absolute',
          bottom:appInfo.sizes.HEIGHT*0.065
        }}
        >
        Nhấn lần nữa để thoát
      </Snackbar>
    </>
  )
}
export default DrawerNavigate;