import React, { useEffect, useState } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoginScreen, OnboardingScreen,SignUpScreen,ForgotPasswordScreen,VerificationScreen } from "../screens";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthNavigator = ()=>{
  const [isExisttringUser,setIsExistringUser] = useState(false)
    const Stack = createNativeStackNavigator();
    useEffect(()=>{
      checkUserExisting()
    },[])
    const checkUserExisting = async ()=>{
      const res = await AsyncStorage.getItem('auth')
      res && setIsExistringUser(true)
    }
  return <Stack.Navigator
    screenOptions={{
        headerShown:false,//ẩn header mặc định
    }}
  >
    {
      !isExisttringUser && (
        <Stack.Screen  name="OnboardingScreen" component={OnboardingScreen}/>
      )
    }

    <Stack.Screen  name="LoginScreen" component={LoginScreen}/>
    <Stack.Screen  name="SignUpScreen" component={SignUpScreen}/>
    <Stack.Screen  name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
    <Stack.Screen  name="VerificationScreen" component={VerificationScreen}/>

  </Stack.Navigator>
}
export default AuthNavigator;