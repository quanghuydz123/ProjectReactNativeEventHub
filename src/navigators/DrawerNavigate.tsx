import { Button, Text, View } from "react-native"
import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import ExploreNavigator from "./ExploreNavigator"
import DrawerCustom from "../components/DrawerCustom"
import TabNavigator from "./TabNavigator"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AboutProfile, EventDetails } from "../screens"
import { useStatusBar } from "../hooks/useStatusBar"

const DrawerNavigate = ()=>{
    const Drawer = createDrawerNavigator()
    const Stack = createNativeStackNavigator();
  return (
    <Drawer.Navigator screenOptions={{
        headerShown:false,
        drawerPosition:'left',
    }}
    drawerContent={props => <DrawerCustom {...props}/>} // cấu hình giao diện cho drawer
    >
        <Drawer.Screen name="HomeNavigator" component={TabNavigator}/>
        
    </Drawer.Navigator>
  )
}
export default DrawerNavigate;