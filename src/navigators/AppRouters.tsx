import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector, AuthState } from "../reduxs/reducers/authReducers";
import { SplashScreen } from "../screens";
import NetInfo from "@react-native-community/netinfo";
import { constantSelector, updateNameScreen } from "../reduxs/reducers/constantReducers";
import { apis } from "../constrants/apis";
import userAPI from "../apis/userApi";
const AppRouters = ({ nameScreenPresent }: { nameScreenPresent: string }) => {
  const { getItem } = useAsyncStorage('auth')
  const [isShowSlash, setIsShowSlash] = useState(true)
  const dispatch = useDispatch()
  const [isOnline, setIsOnline] = useState(true)
  const auth: AuthState = useSelector(authSelector)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSlash(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])
  useEffect(() => {
    checkLogin()
  }, [isOnline])
  useEffect(() => {
    checkNetWork()
  }, [])
  useEffect(() => {
    dispatch(updateNameScreen({ nameScreen: nameScreenPresent }))
  }, [nameScreenPresent])
  const checkNetWork = () => {
    NetInfo.addEventListener(state => { setIsOnline(state.isConnected ?? false), console.log("state", state) }) //lấy ra thông tin kết nối
  }
  const checkLogin = async () => {
    const res: any = await getItem()
    if (isOnline) {
      try {
        if (res) {
          const api = apis.user.getById(JSON.parse(res).id)
          const user = await userAPI.HandleUser(api)
          if (user && user.status === 200 && user.data) {
            await AsyncStorage.setItem('auth', JSON.stringify({ ...user.data, accesstoken: JSON.parse(res).accesstoken,loginMethod:JSON.parse(res).loginMethod }))
            dispatch(addAuth({ ...user.data, accesstoken: JSON.parse(res).accesstoken,loginMethod:JSON.parse(res).loginMethod  }))
          }
        }
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("errorMessage", errorMessage)
      }
    } else {
      res && dispatch(addAuth(JSON.parse(res)))
    }
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