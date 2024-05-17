import { StatusBar, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { SplashScreen } from "./src/screens"
import MainNavigator from "./src/navigators/MainNavigator"
import AuthNavigator from "./src/navigators/AuthNavigator"
import { NavigationContainer } from "@react-navigation/native"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { Provider } from "react-redux"
import store from "./src/reduxs/store"
import AppRouters from "./src/navigators/AppRouters"

const App = ()=>{

  return <>
    {/* //hiện thi thanh giờ,pin,... */}
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
    <Provider store={store}>
          <NavigationContainer>
           <AppRouters />
        </NavigationContainer> 
    </Provider>
  </>
}
export default App;