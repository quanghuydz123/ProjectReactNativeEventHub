import React, { useEffect, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, ListEventRelatedComponent, ListVideoComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';
import { Badge, List } from 'react-native-paper';
import { Switch } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import provinces from '../../constrants/addressVN/provinces';
import Video, { VideoRef } from 'react-native-video';
import { colors } from '../../constrants/color';
import LinearGradient from 'react-native-linear-gradient';
import { appInfo } from '../../constrants/appInfo';
import { globalStyles } from '../../styles/globalStyles';
import CardComponent from '../../components/CardComponent';
import Entypo from 'react-native-vector-icons/Entypo'
import Swiper from 'react-native-swiper';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { fontFamilies } from '../../constrants/fontFamilies';
import { BlurView } from '@react-native-community/blur';
import AvatarItem from '../../components/AvatarItem';
import ListTicketComponent from './components/ListTicketComponent';
import { ArrowDown2 } from 'iconsax-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import WebView from 'react-native-webview';
import { convertMoney } from '../../utils/convertMoney';
import LottieView from 'lottie-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux';
import { billingSelector, billingState } from '../../reduxs/reducers/billingReducer';
import { DateTime } from '../../utils/DateTime';
import { authSelector, AuthState, Invoice, updateInvoices } from '../../reduxs/reducers/authReducers';
import { apis } from '../../constrants/apis';
import invoiceAPI from '../../apis/invoiceAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingModal } from '../../../modals';
const PaymentSucessScreen = ({ navigation, route }: any) => {
  const { invoiceCode, createdAt }: { invoiceCode: string, createdAt: Date } = route.params
  const [invoices, setInvoices] = useState<Invoice[][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const auth: AuthState = useSelector(authSelector)
  const billing: billingState = useSelector(billingSelector)
  const dispatch = useDispatch()
  useEffect(() => {
    handleCallAPISearchInvoice()
  }, [])
  const handleCallAPISearchInvoice = async () => {
    const api = apis.invoice.getByIdUser({ idUser: auth.id })
    setIsLoading(true)
    try {
      const res = await invoiceAPI.HandleInvoice(api)
      if (res && res.data && res.status === 200) {
        dispatch(updateInvoices({ invoices: res.data }))
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, invoices: res.data }))
      }
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log("TransactionHistoryScreen", errorMessage.message)
    }
  }
  return (
    <>
      <ContainerComponent title={'Kết quả giao dịch'} bgColor={'#f6f5fb'} isScroll>
        <SectionComponent>
          <RowComponent justify='center' >
            <LottieView source={require('../../../src/assets/icon/cat.json')} style={{ width: 150, height: 150 }} autoPlay loop />
          </RowComponent>
          <RowComponent justify='center'>
            <FontAwesome5 name='check-circle' size={50} color={colors.primary} />
            <SpaceComponent width={12} />
            <TextComponent text={'Đặt vé thành công'} size={22} font={fontFamilies.bold} color={colors.primary} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent >
            <RowComponent justify='space-between' styles={{ paddingVertical: 12 }}>
              <TextComponent text={'Sự kiện'} flex={1} font={fontFamilies.medium} />
              <TextComponent flex={2} text={billing?.titleEvent ?? ''} font={fontFamilies.medium} />
            </RowComponent>

            <SpaceComponent width={'100%'} height={1} color='#e5e5e5' />
            <RowComponent justify='space-between' styles={{ paddingVertical: 14 }}>
              <TextComponent text={'Thời gian thanh toán'} font={fontFamilies.medium} />
              <TextComponent text={`${DateTime.GetTime(createdAt ?? new Date())} - ${DateTime.GetDate2(createdAt ?? new Date())}`} font={fontFamilies.medium} />
            </RowComponent>
            <SpaceComponent width={'100%'} height={1} color='#e5e5e5' />
            <RowComponent justify='space-between' styles={{ paddingVertical: 14 }}>
              <TextComponent text={'Mã đơn hàng'} font={fontFamilies.medium} />
              <TextComponent text={invoiceCode ?? ''} font={fontFamilies.medium} />
            </RowComponent>
            <SpaceComponent width={'100%'} height={1} color='#e5e5e5' />
            <RowComponent justify='space-between' styles={{ paddingVertical: 14 }}>
              <TextComponent text={'Tổng tiền'} font={fontFamilies.medium} />
              <TextComponent text={convertMoney(billing?.totalPrice ?? 0)} font={fontFamilies.medium} color={colors.primary} />
            </RowComponent>
            <SpaceComponent width={'100%'} height={1} color='#e5e5e5' />
            <RowComponent justify='space-between' styles={{ paddingVertical: 14 }}>
              <ButtonComponent mrBottom={0} width={appInfo.sizes.WIDTH * 0.42} color={colors.white} textColor={colors.primary} styles={{ borderWidth: 1, borderColor: colors.primary, paddingVertical: 10 }} text='Trang chủ' type='primary' onPress={() => navigation.goBack()} />
              <ButtonComponent mrBottom={0} width={appInfo.sizes.WIDTH * 0.42} styles={{ paddingVertical: 10 }} text='Vé của tôi' type='primary' onPress={() => navigation.navigate('TicketNavigator', {
                relatedEvents: billing.relatedEvents,
              })} />
            </RowComponent>
          </CardComponent>
        </SectionComponent>
        <ListEventRelatedComponent relatedEvents={billing?.relatedEvents ?? []} />
          <LoadingModal visible={isLoading}/>
      </ContainerComponent>
    </>
  )
}


export default PaymentSucessScreen;
