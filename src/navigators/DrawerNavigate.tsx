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

const DrawerNavigate = ({ navigation }: any) => {
  const Drawer = createDrawerNavigator()
  const [count, setCount] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(0)
    }, 3000);
    setIntervalId(interval);
    return () => {
      if (intervalId) clearInterval(intervalId);
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
        ToastMessaging.Warning({ message: 'Nhấn lần nữa để thoát', visibilityTime: 3000 })
        setCount(prev => prev + 1)
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
    <Drawer.Navigator screenOptions={{
      headerShown: false,
      drawerPosition: 'left',
    }}
      drawerContent={props => <DrawerCustom {...props} />} // cấu hình giao diện cho drawer
    >
      <Drawer.Screen name="HomeNavigator" component={TabNavigator} />

    </Drawer.Navigator>
  )
}
export default DrawerNavigate;