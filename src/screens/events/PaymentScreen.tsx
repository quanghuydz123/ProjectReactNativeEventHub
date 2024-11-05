import { BackHandler, Button, SafeAreaView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";
import { EventModelNew } from "../../models/EventModelNew";
import WebView from "react-native-webview";
import { io } from "socket.io-client";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import { useSelector } from "react-redux";
import { constantSelector, constantState } from "../../reduxs/reducers/constantReducers";
import { appInfo } from "../../constrants/appInfo";
import { authSelector, AuthState } from "../../reduxs/reducers/authReducers";

const PaymentScreen = ({navigation,route}:{navigation:any,route:any})=>{
    const {url}:{url:string} = route.params
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [count, setCount] = useState(0)
    const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout | null>(null)
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);
    const constant:constantState = useSelector(constantSelector)
    const [uid,setUid] = useState('')
    const auth:AuthState = useSelector(authSelector)
    const resetTimeOut = () => {
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
      const newInterval = setTimeout(() => {
        setCount(0);
      }, 4000);
      setTimeOutId(newInterval);
    };
    useEffect(() => {
      const interval = setTimeout(() => {
        setCount(0)
      }, 4000);
      setTimeOutId(interval);
      return () => {
        if (timeOutId) clearTimeout(timeOutId);
      };
    }, [])
  
    const handleBackButtonClick = () => {
      const state = navigation.getState();
      const routes = state.routes;
      console.log("routes",routes)
      if (count >= 1) {
        navigation.goBack()
      } else {
        // ToastMessaging.Warning({ message: 'Nhấn lần nữa để thoát', visibilityTime: 3000 })
        onToggleSnackBar()
        setCount(prev => prev + 1)
        resetTimeOut()
      }
      return true;
    }
    useEffect(() => {
  
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
      };
    }, [count]);
    useEffect(()=>{
      if(paymentStatus && uid){
        switch(paymentStatus){
          case '00':
            if(uid === auth.id){
              navigation.replace('PaymentSucessScreen')
            }
            break
          case '24':
            if(uid === auth.id){
              navigation.goBack()
            }
            break;
          default:
            if(uid === auth.id){
              navigation.goBack()
            }
            break;
  
        }
      }
    },[paymentStatus,uid,auth])
    useEffect(() => {
      // Kết nối tới server Socket.IO
      const socket = io('http://localhost:8888',{
        reconnection: true,       // Tự động kết nối lại
        reconnectionAttempts: 5,  // Số lần cố gắng kết nối lại
        reconnectionDelay: 1000,  // Thời gian chờ giữa các lần kết nối lại
    }); // Đảm bảo sử dụng địa chỉ IP của server

      // Lắng nghe sự kiện 'payment_status'
      socket.on('payment_status', (data) => {
          setPaymentStatus(data?.code); // Cập nhật trạng thái thanh toán
          setUid(data?.uid)
          console.log('Mã phản hồi thanh toán:', data);
      });

      // Ngắt kết nối khi component bị hủy
      return () => {
          socket.disconnect();
      };
  }, []);
  return (
    <SafeAreaView style={{flex:1,paddingTop:30}}>
        <WebView 
         style={{flex:1}}
         source={{uri:url}}
        />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        // action={{
        //   label: 'Undo',
        //   onPress: () => {
        //     // Do something
        //   },
        // }}
        duration={3000}
        style={{
          position:'absolute',
          bottom:appInfo.sizes.HEIGHT*0.065
        }}
        >
        Bạn muốn hủy thanh toán sao hãy ấn lần nữa để quay lại
      </Snackbar>
    </SafeAreaView>
  )
}
export default PaymentScreen;