import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoginScreen, OnboardingScreen,SignUpScreen,ForgotPasswordScreen,VerticationScreen } from "../screens";

const AuthNavigator = ()=>{
    const Stack = createNativeStackNavigator();
  return <Stack.Navigator
    screenOptions={{
        headerShown:false,//ẩn header mặc định
    }}
  >
    <Stack.Screen  name="OnboardingScreen" component={OnboardingScreen}/>
    <Stack.Screen  name="LoginScreen" component={LoginScreen}/>
    <Stack.Screen  name="SignUpScreen" component={SignUpScreen}/>
    <Stack.Screen  name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
    <Stack.Screen  name="VerticationScreen" component={VerticationScreen}/>

  </Stack.Navigator>
}
export default AuthNavigator;