import { Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DrawerNavigate from "./DrawerNavigate";
import { EventDetails } from "../screens";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "../reduxs/reducers/authReducers";
import { AlertComponent } from "../components/Alert";

const MainNavigator = () => {
  const { getItem } = useAsyncStorage('auth')
  const { getItem: getRememberItem } = useAsyncStorage('isRemember');
  const { getItem: getPasswordItem } = useAsyncStorage('password');
  const dispatch = useDispatch()
  const [isRemember, setIsReMember] = useState<boolean>(false)
  const auth = useSelector(authSelector)
  const [password, setPasswored] = useState('')
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      checkToken()
    }, 30000);
    setIntervalId(interval);
    return () => clearInterval(interval);
  }, [])
  const handleGetItem = async () => {
    const res = await getRememberItem()
    const resPassword = await getPasswordItem()
    resPassword && setPasswored(resPassword)
    setIsReMember(res === 'true')
  }
  const checkToken = async () => {
    await handleGetItem()
    const res = await getItem()
    let token = res && JSON.parse(res).accesstoken;
    let decodedToken = jwtDecode(token);
    let currentDate = new Date();

    // JWT exp is in seconds
    if (decodedToken.exp && decodedToken.exp * 1000 < currentDate.getTime()) {
      { AlertComponent({ title: 'Thông báo', message: 'Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại !', onConfirm: () => handleLogout() }) }
    } 
  }
  const handleLogout = async () => {
    if (isRemember === true) {
      await AsyncStorage.setItem('auth', JSON.stringify({ email: auth.email, password: password }))
      dispatch(removeAuth())
    } else {
      await AsyncStorage.setItem('auth', JSON.stringify({ email: '', password: '' }))
      await AsyncStorage.removeItem('isRemember')
      await AsyncStorage.removeItem('password')
      dispatch(removeAuth())
    }
  }
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}

    >
      <Stack.Screen name="Main" component={DrawerNavigate} />
    </Stack.Navigator>
  )
}
export default MainNavigator;