import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../reduxs/reducers/authReducers";
import { NewScreen, SplashScreen } from "../screens";
import NetInfo from "@react-native-community/netinfo";
const AppRouters = ()=>{
    const {getItem} = useAsyncStorage('auth')
    const [isShowSlash,setIsShowSlash] = useState(true)
    const dispatch = useDispatch()
    const [isOnline,setIsOnline] = useState(true)
    const auth = useSelector(authSelector)
    useEffect(()=>{
      checkLogin()
      const timeout = setTimeout(()=>{
        setIsShowSlash(false)
      },1500)
  
      return ()=>clearTimeout(timeout)
    },[])

    const checkLogin = async ()=>{
        const res = await getItem()
        res && dispatch(addAuth(JSON.parse(res)))
    }
  return (
    <> 
        {isShowSlash ? <SplashScreen /> : auth?.accesstoken ? <MainNavigator /> : <AuthNavigator />}
    </>
  )
}
export default AppRouters;