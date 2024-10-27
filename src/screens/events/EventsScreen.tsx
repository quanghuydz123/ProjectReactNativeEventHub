import React, { useEffect, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, ListVideoComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
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
const EventsScreen = ({ navigation, route }: any) => {
  

 
 

  
  return (

    <ContainerComponent title={"Sự kiện"} isScroll isHiddenSpaceTop bgColor={colors.backgroundBluishWhite}>
      <View style={[{ flex: 1, height: appInfo.sizes.HEIGHT * 0.45 },styles.shadow]}>
        <ImageBackground
          source={{ uri: 'https://salt.tkbcdn.com/ts/ds/0f/a0/6a/a74729358b2962b5d5f0481c00aa34f6.jpeg' }}
          imageStyle={{ flex: 1, objectFit: 'fill' }}
          style={[globalStyles.shadow, { height: '100%' }]}
          blurRadius={4}
        >
          
          <SectionComponent styles={{ paddingTop: 10 }}>
            <CardComponent color={'#38373c'} styles={{ padding: 0, height: '98.5%' }} isShadow>
              <Image source={{ uri: 'https://salt.tkbcdn.com/ts/ds/0f/a0/6a/a74729358b2962b5d5f0481c00aa34f6.jpeg' }} style={{ height: '50%' }} />
              <SectionComponent styles={{ paddingTop: 12 }}>
                <TextComponent text={'SUPERFEST 2024 @QUANG NING '} numberOfLine={2} title size={18} color={colors.white} font={fontFamilies.medium} />
                <SpaceComponent height={8} />
                <RowComponent styles={{}}>
                  <FontAwesome6 name="calendar" size={16} color={colors.white} />
                  <SpaceComponent width={8} />
                  <TextComponent text={`19:00 - 21:30, 22 Tháng 11, 2024`} font={fontFamilies.medium} color={colors.primary} size={12.5} />
                </RowComponent>
                <SpaceComponent height={8} />
                <RowComponent styles={{ alignItems: 'flex-start' }}>
                  <FontAwesome6 size={16} color={colors.white} name="location-dot" style={{}} />
                  <SpaceComponent width={8} />
                  <View style={{ flex: 1 }}>
                    <TextComponent text={'Quảng trường Sun Carnival Hạ Long'} numberOfLine={1} color={colors.primary} font={fontFamilies.semiBold} size={12.5} />
                    <TextComponent numberOfLine={2} text={'88 Hạ Long, Phường Bãi Cháy, Thành Phố Hạ Long, Tỉnh Quảng Ninh'} size={12} color={colors.gray4} />
                    <ButtonComponent
                    text="Xem trên bảng đồ"
                    type="link"
                    textFont={fontFamilies.medium}
                    icon={<ArrowDown2 size={14} color={colors.primary}/>}
                    iconFlex="right"
                    textSize={12}
                    textColor={colors.primary}
                    onPress={()=>console.log("ok")}
                  />
                  </View>
                </RowComponent>
              </SectionComponent>
            </CardComponent>
          </SectionComponent>
        </ImageBackground>
      </View>
      <SectionComponent styles={{paddingTop:14}}>
        <CardComponent>
        <RowComponent justify="center" >
                <ButtonComponent
                  // text={isInterested ? 'Đã quan tâm' : 'Quan tâm'}
                  text='Quan tâm'
                  textFont={'12'} type="primary"
                  width={appInfo.sizes.WIDTH * 0.4}
                  color={colors.white}
                  textColor={colors.background}
                  styles={{ borderWidth: 1, borderColor: colors.background, minHeight: 0, paddingVertical: 12 }}
                  // icon={<FontAwesome name={isInterested ? "star" : "star-o"} size={16} color={colors.primary} />}
                  icon={<FontAwesome name={ "star-o"} color={colors.background}/>}
                  iconFlex="left"
                  mrBottom={0}
                  // onPress={() => handleInterestEvent()}
                />

                <SpaceComponent width={8} />
                <ButtonComponent
                  text={'Mời bạn bè'}
                  textFont={'12'}
                  type="primary"
                  width={appInfo.sizes.WIDTH * 0.4}
                  color={colors.white}
                  textColor={colors.background}
                  styles={{ borderWidth: 1, borderColor: colors.background, minHeight: 0, paddingVertical: 12 }}
                  icon={<Ionicons name="person-add" size={16} color={colors.background} />}
                  iconFlex="left"
                  mrBottom={0}
                  // onPress={() => { setIsOpenModalizeInityUser(true) }}
                />
              </RowComponent>
        </CardComponent>
      </SectionComponent>
      <SectionComponent >
        <CardComponent isShadow title='Giới thiệu'>
          <TextComponent text={'Vượt lên mọi kì vọng của các fan hâm mộ, Siêu nhạc hội Quốc tế 8WONDER HCMC hứa hẹn sẽ trở thành bom tấn khuấy đảo toàn bộ mùa nhạc hội cuối năm của khu vực châu Á, với sự góp mặt của Imagine Dragons – ban nhạc rock đương đại hàng đầu thế giới cùng sự đồng hành của các ngôi sao trẻ thống lĩnh VPOP. '} />
        </CardComponent>
      </SectionComponent>
      <SectionComponent >
        <CardComponent isNoPadding isShadow title='Thông tin vé' sizeTitle={14} colorSpace={colors.background} colorTitle={colors.white} color={colors.background}>
          <ListTicketComponent />
        </CardComponent>
      </SectionComponent>
      <SectionComponent >
        <CardComponent isShadow title='Ban tổ chức'>
          <AvatarItem size={120} photoUrl='https://i.scdn.co/image/ab676161000051745a79a6ca8c60e4ec1440be53'/>
          <TextComponent text={'SÂN KHẤU THIÊN LONG'} paddingVertical={8} size={16} font={fontFamilies.bold}/>
          <TextComponent text={'Mô tả'}/>
        </CardComponent>
      </SectionComponent>
    </ContainerComponent>
  )
}
const styles = StyleSheet.create({
  shadow:{
    shadowColor:'#262626',       // Màu của bóng đổ, sử dụng giá trị RGBA để xác định màu và độ trong suốt.
    shadowOffset:{
        width:0,                         // Độ lệch bóng đổ theo trục X. Giá trị 0 nghĩa là bóng đổ không lệch theo chiều ngang.
        height:4                         // Độ lệch bóng đổ theo trục Y. Giá trị 4 nghĩa là bóng đổ sẽ lệch xuống dưới 4 đơn vị.
    },
    shadowOpacity:0.25,                  // Độ mờ của bóng đổ, giá trị từ 0 đến 1. Giá trị 0.25 nghĩa là bóng đổ sẽ có độ mờ 25%.
    shadowRadius:8,                      // Bán kính mờ của bóng đổ, giá trị lớn hơn sẽ làm bóng đổ trở nên mờ hơn và mềm hơn.
    elevation:8                      // Độ cao của phần tử trên Android, ảnh hưởng đến độ mờ và kích thước của bóng đổ.
},
});

export default EventsScreen;
