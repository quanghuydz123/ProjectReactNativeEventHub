import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {EditProfileScreen, ProfileScreen } from "../screens";
import { useStatusBar } from "../hooks/useStatusBar";

const ProfileNavigator = ()=>{
const Stack = createNativeStackNavigator();
useStatusBar('dark-content')
  
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

    </Stack.Navigator>
  )
}
export default ProfileNavigator;