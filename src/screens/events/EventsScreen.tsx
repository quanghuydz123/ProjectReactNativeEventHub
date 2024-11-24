import React, { useEffect, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, InputComponent, ListEventRelatedComponent, ListVideoComponent, RowComponent, SectionComponent, SelectDropdownComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent, TicketComponent } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Animated, Dimensions, FlatList, Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { fontFamilies } from '../../constrants/fontFamilies';
import { BlurView } from '@react-native-community/blur';
import AvatarItem from '../../components/AvatarItem';
import ListTicketComponent from './components/ListTicketComponent';
import { ArrowDown2 } from 'iconsax-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import WebView from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { convertMoney } from '../../utils/convertMoney';
import LottieView from 'lottie-react-native';
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;
const EventsScreen = ({ navigation, route }: any) => {


  const cardRef = useRef(null); // Tạo tham chiếu cho card dưới
  const [cardHeitght, setCardHeitght] = useState(appInfo.sizes.HEIGHT * 0.24); // State để lưu width của card dưới


  return (
    <>
      <ContainerComponent title={'abc'} bgColor={'#f6f5fb'} isScroll>
        <SectionComponent>
          <RowComponent justify='center' >
            <LottieView source={require('../../../src/assets/icon/cat.json')}  style={{width:150,height:150}} autoPlay loop />
          </RowComponent>
          <RowComponent justify='center'>
            <FontAwesome5 name='check-circle' size={50} color={colors.primary}/>
            <SpaceComponent width={12}/>
            <TextComponent text={'Đặt vé thành công'} size={22} font={fontFamilies.bold} color={colors.primary}/>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent >
            <RowComponent justify='space-between' styles={{paddingVertical:12}}>
              <TextComponent text={'Sự kiện'} flex={1} font={fontFamilies.medium}/>
              <TextComponent flex={2} text={'ANH TRAI "SAY HI" HÀ NỘI - CONCERT'} font={fontFamilies.medium}/>
            </RowComponent>
            <SpaceComponent width={'100%'} height={1} color='#e5e5e5'/>
            <RowComponent justify='space-between' styles={{paddingVertical:14}}>
              <TextComponent text={'Thời gian thanh toán'} font={fontFamilies.medium}/>
              <TextComponent  text={`14:51 - 22/10/2024`} font={fontFamilies.medium}/>
            </RowComponent>
            <SpaceComponent width={'100%'} height={1} color='#e5e5e5'/>
            <RowComponent justify='space-between' styles={{paddingVertical:14}}>
              <TextComponent text={'Mã đơn hàng'} font={fontFamilies.medium}/>
              <TextComponent text={'128573129128571'} font={fontFamilies.medium}/>
            </RowComponent>
            
            <SpaceComponent width={'100%'} height={1} color='#e5e5e5'/>
            <RowComponent justify='space-between' styles={{paddingVertical:14}}>
              <TextComponent text={'Tổng tiền'} font={fontFamilies.medium}/>
              <TextComponent  text={convertMoney(500000)} font={fontFamilies.medium} color={colors.primary}/>
            </RowComponent>
            <SpaceComponent width={'100%'} height={1} color='#e5e5e5'/>
            <RowComponent justify='space-between' styles={{paddingVertical:14}}>
              <ButtonComponent mrBottom={0} width={appInfo.sizes.WIDTH * 0.42} color={colors.white} textColor={colors.primary} styles={{borderWidth:1,borderColor:colors.primary,paddingVertical:10}}   text='Trang chủ' type='primary'/>
              <ButtonComponent mrBottom={0} width={appInfo.sizes.WIDTH * 0.42} styles={{paddingVertical:10}}  text='Vé của tôi' type='primary'/>
            </RowComponent>
          </CardComponent>
        </SectionComponent>
        <ListEventRelatedComponent relatedEvents={[]}/>

      </ContainerComponent>
    </>
  )
}


export default EventsScreen;
const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    marginTop:-appInfo.sizes.WIDTH*0.08,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    color: '#151E26',
  },
});