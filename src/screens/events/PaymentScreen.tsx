import { BackHandler, Button, SafeAreaView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";
import { EventModelNew } from "../../models/EventModelNew";
import WebView from "react-native-webview";
import { io } from "socket.io-client";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { constantSelector, constantState } from "../../reduxs/reducers/constantReducers";
import { appInfo } from "../../constrants/appInfo";
import { authSelector, AuthState, Invoice, updateInvoices } from "../../reduxs/reducers/authReducers";
import { apis } from "../../constrants/apis";
import invoiceAPI from "../../apis/invoiceAPI";
import { billingSelector, billingState } from "../../reduxs/reducers/billingReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingModal } from "../../../modals";

const PaymentScreen = ({ navigation, route }: { navigation: any, route: any }) => {
  const { url }: { url: string } = route.params
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [count, setCount] = useState(0)
  const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout | null>(null)
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);
  const constant: constantState = useSelector(constantSelector)
  const [uid, setUid] = useState('')
  const auth: AuthState = useSelector(authSelector)
  const billing: billingState = useSelector(billingSelector)
  const [isLoading,setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const [invoices,setInvoices] = useState<Invoice[][]>([])
  useEffect(()=>{
    handleCallAPISearchInvoice()
  },[])
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
  const handleCancelInvoice = async () => {
    try {
      const api = apis.invoice.cancelInvoice()
      const res = await invoiceAPI.HandleInvoice(api, { ticketsReserve: billing.ticketsReserve }, 'delete')
      if (res && res.status === 200) {
        navigation.pop(3)
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("QuestionScreen", errorMessage)
    }
  }
  const handleBackButtonClick = () => {
    const state = navigation.getState();
    const routes = state.routes;
    if (count >= 1) {
      handleCancelInvoice()
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
  const handleCallAPISearchInvoice = async ()=>{
    const api = apis.invoice.getByIdUser({idUser:auth.id})
    setIsLoading(true)
    try {
      const res = await invoiceAPI.HandleInvoice(api)
      if(res && res.data && res.status === 200){
        setInvoices(res.data)
      }
      setIsLoading(false)
    } catch (error:any) {
      setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log("TransactionHistoryScreen", errorMessage.message)
    }
  }
  const handleUpdateInvoice = async ({ idInvoice, createdAt, invoiceCode }: { idInvoice: string, createdAt: Date, invoiceCode: string }) => {
    try {
      // const invoices:Invoice[][] = auth?.invoices ?? [];
      const invoiceNew: Invoice = {
        _id: idInvoice,
        invoiceCode: invoiceCode,
        totalTicket: billing.totalTicket ?? 0,
        totalPrice: billing.totalPrice ?? 0,
        user: auth.id,
        status: "Success",
        createdAt: createdAt,
        titleEvent: billing.titleEvent
      }
      if (invoices.length > 0 && invoices[0].length > 0) {
        const lastInvoiceMonth = new Date(invoices[0][0].createdAt).getMonth();
        const newInvoiceMonth = new Date(invoiceNew.createdAt).getMonth();
        if (lastInvoiceMonth === newInvoiceMonth) {
          invoices[0].unshift(invoiceNew);
        } else {
          invoices.unshift([invoiceNew]);
        }
      } else {
        invoices.unshift([invoiceNew]);
      }
      dispatch(updateInvoices({ invoices: invoices }))
      await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, invoices: invoices }))
      navigation.pop(3)
      navigation.replace('PaymentSucessScreen', { invoiceCode: invoiceCode, createdAt: createdAt })
    } catch (error) {
      console.log("error", error)
    }


  }
  const handleCallAPICreateInvoice = async () => {
    try {
      setIsLoading(true)
      const api = apis.invoice.createInvoice()
      const res = await invoiceAPI.HandleInvoice(api, {
        idUser: auth.id,
        fullname: auth.fullname,
        email: auth.email,
        phoneNumber: auth.phoneNumber,
        totalPrice: billing.totalPrice,
        ticketsReserve: billing.ticketsReserve,
        address: auth.address,
        fullAddress: [
          auth?.address?.houseNumberAndStreet,
          auth?.address?.ward?.name,
          auth?.address?.districts?.name,
          auth?.address?.province?.name].filter(Boolean).join(', '),
          titleEvent:billing.titleEvent,
          showTimeStart:billing.showTimes.startDate,
          addressEvent:billing.addRessEvent,
          location:billing.locationEvent

      }, 'post')
      if (res && res.status === 200 && res.data) {
        handleUpdateInvoice({ idInvoice: res.data._id, createdAt: res.data.createdAt, invoiceCode: res.data.invoiceCode })
      } else {
        handleCancelInvoice()
      }
      setIsLoading(false)
    } catch (error: any) {  
      setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log("PaymentScreen", errorMessage)
    }
  }
  useEffect(() => {
    if (paymentStatus && uid) {
      switch (paymentStatus) {
        case '00':
          if (uid === auth.id) {
            handleCallAPICreateInvoice()
          }
          break
        case '24':
          if (uid === auth.id) {
            handleCancelInvoice()
          }
          break;
        default:
          if (uid === auth.id) {
            handleCancelInvoice()
          }
          break;

      }
    }
  }, [paymentStatus, uid, auth.id])
  useEffect(() => {
    // Kết nối tới server Socket.IO
    const socket = io('http://localhost:8888', {
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
    <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
      <WebView
        style={{ flex: 1 }}
        source={{ uri: url }}
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
          position: 'absolute',
          bottom: appInfo.sizes.HEIGHT * 0.065
        }}
      >
        Bạn muốn hủy thanh toán sao hãy ấn lần nữa để quay lại
      </Snackbar>
      <LoadingModal visible={isLoading} message="Đang xử lý thanh toán"/>
    </SafeAreaView>
  )
}
export default PaymentScreen;