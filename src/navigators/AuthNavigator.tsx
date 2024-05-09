import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoginScreen } from "../screens";

const AuthNavigator = ()=>{
    const Stack = createNativeStackNavigator();
  return <Stack.Navigator
    screenOptions={{
        headerShown:false,//ẩn header mặc định
    }}
  >
    <Stack.Screen  name="LoginScreen" component={LoginScreen}/>
  </Stack.Navigator>
}
export default AuthNavigator;