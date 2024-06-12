import { Text, View } from "react-native"
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DrawerNavigate from "./DrawerNavigate";
import { EventDetails } from "../screens";

const MainNavigator = ()=>{
const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Main" component={DrawerNavigate} />
    </Stack.Navigator>
  )
}
export default MainNavigator;