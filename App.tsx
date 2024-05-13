import { StatusBar, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { SplashScreen } from "./src/screens"
import MainNavigator from "./src/navigators/MainNavigator"
import AuthNavigator from "./src/navigators/AuthNavigator"
import { NavigationContainer } from "@react-navigation/native"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"

const App = ()=>{
  const [isShowSlash,setIsShowSlash] = useState(true)
  const [accessToken,setAccessToken ] = useState('')
  const {getItem ,setItem} = useAsyncStorage('assetToken');


  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setIsShowSlash(false)
    },1500)

    return ()=>clearTimeout(timeout)
  },[])
  useEffect(()=>{
    checkLogin();
  },[])
  const checkLogin = async ()=>{
    const token = await getItem();
    token && setAccessToken(token)
  }
  return <>
    {/* //hiện thi thanh giờ,pin,... */}
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
    {isShowSlash ? <SplashScreen /> : 
        <NavigationContainer>
        {accessToken ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer> 
    }
  </>
}
export default App;