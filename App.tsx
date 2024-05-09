import { StatusBar, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { SplashScreen } from "./src/screens"
import MainNavigator from "./src/navigators/MainNavigator"
import AuthNavigator from "./src/navigators/AuthNavigator"
import { NavigationContainer } from "@react-navigation/native"

const App = ()=>{
  const [isShowSlash,setIsShowSlash] = useState(true)
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setIsShowSlash(false)
    },1500)

    return ()=>clearTimeout(timeout)
  },[])
  return <>
    {/* //hiện thi thanh giờ,pin,... */}
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
    {isShowSlash ? <SplashScreen /> : <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>  }
  </>
}
export default App;