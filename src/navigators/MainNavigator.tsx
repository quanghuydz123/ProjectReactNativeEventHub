import { Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DrawerNavigate from "./DrawerNavigate";
import { AboutProfile, AboutProfileScreen, AddNewEvent, ChooseTicketScreen, EditProfileScreen, EventDetails, ExploreEvent, ForgotPasswordScreen, InterestedEventScreen, InvoiceComfirmScreen, LoginScreen, NotFound, NotificationsScreen, PaymentScreen, PaymentSucessScreen, PurchasedTicketsDetailsScreen, QrScannerScreen, QuestionScreen, SearchAndListViewScreen, SearchEventsScreen, SignUpScreen, UpdatePasswordScreen, VerificationScreen } from "../screens";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "../reduxs/reducers/authReducers";
import { AlertComponent } from "../components/Alert";
import { HandleNotification } from "../utils/handleNotification";
import EventsNavigator from "./EventsNavigator";
import { useStatusBar } from "../hooks/useStatusBar";
import { TextComponent } from "../components";
import NetInfo from "@react-native-community/netinfo";
import {BackHandler} from 'react-native';
import { GoogleSignin,  } from '@react-native-google-signin/google-signin';
import FriendsNavigate from "./FriendsNavigate";
import TestQrcannerScreen from "../screens/TestQrcannerScreen";
import ViewedEventScreen from "../screens/profiles/ViewedEventScreen";
import OrganizerNavigator from "./OrganizerNavigator";
import TicketNavigator from "./TicketNavigator";
import NewScreen from "../screens/NewScreen";
const MainNavigator = ({navigation}:any) => {
  const { getItem } = useAsyncStorage('auth')
  const { getItem: getRememberItem } = useAsyncStorage('isRemember');
  const { getItem: getPasswordItem } = useAsyncStorage('password');
  const dispatch = useDispatch()
  const [isOnline, setIsOnline] = useState(true)
  const [isRemember, setIsReMember] = useState<boolean>(false)
  const auth = useSelector(authSelector)
  const [password, setPasswored] = useState('')
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [toggle,setToggle] = useState(true)
  useEffect(() => {
    handleCheckToken()
  }, [])
  useEffect(() => {
    checkNetWork()
  }, [])
  const handleCheckToken = async ()=>{
    const res = await AsyncStorage.getItem('auth')
    if(res){
      const interval = setInterval(() => {
        checkToken()
      }, 5000);
      setIntervalId(interval);
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }
  const checkNetWork = () => {
    NetInfo.addEventListener(state => { setIsOnline(state.isConnected ?? false),console.log("state",state) }) //lấy ra thông tin kết nối
  }
  const handleGetItem = async () => {

    const res = await getRememberItem()
    const resPassword = await getPasswordItem()
    resPassword && setPasswored(resPassword)
    setIsReMember(res === 'true')
  }
  const checkToken = async () => {
    const auth = await AsyncStorage.getItem('auth')
    if(auth){
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
  }
  const handleLogout = async () => {
    if(auth.loginMethod === 'google'){
      GoogleSignin.signOut()//đăng xuất google
    }
    const fcmtoken = await AsyncStorage.getItem('fcmtoken')
    if (fcmtoken) {
      if (auth.fcmTokens && auth.fcmTokens.length > 0) {
        const items = [...auth.fcmTokens]
        const index = items.findIndex(item => item === fcmtoken)
        if (index !== -1) {
          items.splice(index, 1)
        }
        await HandleNotification.Update(auth.id, items)
      }
    }
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
  useStatusBar('dark-content')
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}
        
      >
        <Stack.Screen name="Main" component={DrawerNavigate} />
        <Stack.Screen name="EventDetails" component={EventDetails} 
        // options={{
        //   animationTypeForReplace: 'push',
        //   animation:'fade'
        // }}
        />
        <Stack.Screen name="AboutProfileScreen" component={AboutProfileScreen} />
        <Stack.Screen name="NotFound" component={NotFound} />
        <Stack.Screen name="ExploreEvent" component={ExploreEvent} />
        <Stack.Screen name="SearchEventsScreen" component={SearchEventsScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="FriendsScreen" component={FriendsNavigate} />
        <Stack.Screen name="AddEvent" component={AddNewEvent} />
        <Stack.Screen name="QrScannerScreen" component={QrScannerScreen} />
        <Stack.Screen name="TestQrcannerScreen" component={TestQrcannerScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
        <Stack.Screen name="VerificationScreen" component={VerificationScreen}/>
        <Stack.Screen name="ChooseTicketScreen" component={ChooseTicketScreen}/>
        <Stack.Screen name="PaymentSucessScreen" component={PaymentSucessScreen}/>
        <Stack.Screen name="QuestionScreen" component={QuestionScreen}/>
        <Stack.Screen name="InvoiceComfirmScreen" component={InvoiceComfirmScreen}/>
        <Stack.Screen name="ViewedEventScreen" component={ViewedEventScreen}/>
        <Stack.Screen name="SearchAndListViewScreen" component={SearchAndListViewScreen}/>
        <Stack.Screen name="OrganizerNavigator" component={OrganizerNavigator}/>
        <Stack.Screen name="TicketNavigator" component={TicketNavigator}/>
        <Stack.Screen name="PurchasedTicketsDetailsScreen" component={PurchasedTicketsDetailsScreen}/>
        <Stack.Screen name="InterestedEventScreen" component={InterestedEventScreen}/>
        <Stack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen}/>
        <Stack.Screen name="NewScreen" component={NewScreen}/>

      </Stack.Navigator>
      {/* {!isOnline && AlertComponent({title:'Thông báo'
        ,message:'Quý khách vui lòng kiểm tra kết nối Internet/3G/Wifi',
        onConfirm:()=>{BackHandler.exitApp()}})} */}
      </>
  )
}
export default MainNavigator;