import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../reduxs/reducers/authReducers";
import { SplashScreen } from "../screens";
import NetInfo from "@react-native-community/netinfo";
import { constantSelector, updateNameScreen } from "../reduxs/reducers/constantReducers";
const AppRouters = ({nameScreenPresent}:{nameScreenPresent:string})=>{
    const {getItem} = useAsyncStorage('auth')
    const [isShowSlash,setIsShowSlash] = useState(true)
    const dispatch = useDispatch()
    const [isOnline,setIsOnline] = useState(true)
    const auth = useSelector(authSelector)
    useEffect(()=>{
      checkLogin()
      const timeout = setTimeout(()=>{
        setIsShowSlash(false)
      },1000)
  
      return ()=>clearTimeout(timeout)
    },[])

    useEffect(()=>{
      dispatch(updateNameScreen({nameScreen:nameScreenPresent}))
    },[nameScreenPresent])
    const checkLogin = async ()=>{
        const res = await getItem()
        res && dispatch(addAuth(JSON.parse(res)))
    }
  return (
    <> 
        {/* {isShowSlash ? <SplashScreen /> : auth?.accesstoken ? <MainNavigator /> : <AuthNavigator />} */}
        {isShowSlash ? <SplashScreen /> : <MainNavigator />}
        {/* <SplashScreen /> */}
    </>
  )
}
export default AppRouters;