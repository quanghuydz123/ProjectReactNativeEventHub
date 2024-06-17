import { Button, Image, ImageBackground, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React, { Ref, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from "../../components";
import { appInfo } from "../../constrants/appInfo";
import { ArrowLeft, ArrowLeft2, ArrowRight, Calendar, Data, Location } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import CardComponent from "../../components/CardComponent";
import { globalStyles } from "../../styles/globalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import AvatarGroup from "../../components/AvatarGroup";
import Ionicons from "react-native-vector-icons/Ionicons"
import { fontFamilies } from "../../constrants/fontFamilies";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { EventModelNew } from "../../models/EventModelNew";
import { DateTime } from "../../utils/DateTime";
import { convertMoney } from "../../utils/convertMoney";
const EventDetails = ({ navigation, route }: any) => {
  
  const { item }:{item:EventModelNew} = route.params
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [heightButton, setHeightButton] = useState(0);

  const handleScroll = (event:any) => {//khi scroll tới cuối cùng thì bằng true
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 0; // Khoảng cách từ cuối mà bạn muốn nhận biết
    const y = isAtEnd ? layoutMeasurement.height + contentOffset.y + heightButton : layoutMeasurement.height + contentOffset.y
    const isScrollEnd = y  >= contentSize.height - paddingToBottom;
    setIsAtEnd(isScrollEnd);
  };
  const onLayout = (event:any) => {//Lấy ra height
    const { height,width } = event.nativeEvent.layout;
    setHeightButton(height)
  };
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white
    }}>
      <ImageBackground style={{
        flex: 1,
        height: 260,
      }} imageStyle={{
        resizeMode: 'stretch',
        height: 260,
        width: appInfo.sizes.WIDTH,
      }} source={{uri:item.photoUrl}}>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}>
          <RowComponent styles={{
            padding: 16,
            paddingTop: 30  ,
          }} justify="space-between" >
            <RowComponent styles={{ flex: 1 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}
                style={{ minHeight: 48, minWidth: 48, justifyContent: 'center' }}
              >
                <ArrowLeft size={24} color={colors.white} />
              </TouchableOpacity>
              <TextComponent flex={1} text="Chi tiết sự kiện" size={24} title color={colors.white} />
            </RowComponent>
            <CardComponent isShadow styles={[globalStyles.noSpaceCard]} color={'#ffffff4D'}>
              <FontAwesome name="bookmark-o" size={22} color={'black'} />
            </CardComponent>
          </RowComponent>
        </LinearGradient>
        <View style={{
          flex: 1,
          paddingTop: 244 - 100,
        }}>
          <SectionComponent>
            <View style={{
              marginTop: 0,
              justifyContent: 'center',
              alignItems: 'center',

            }}>
              <RowComponent styles={[{
                backgroundColor: colors.white, borderRadius: 100, paddingHorizontal: 12,
                width: '96%'
              }, globalStyles.shadow]}>
                <AvatarGroup size={36} isShowButton users={item.users} />
              </RowComponent>
            </View>
          </SectionComponent>
          <ScrollView 
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
          >
            <SectionComponent>
              <TextComponent text={item.title} title size={30} font={fontFamilies.semiBold} />
            </SectionComponent>
            <SectionComponent>
              <RowComponent>
                <CardComponent styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]} color={`${colors.primary}20`}>
                  <MaterialIcons size={30} color={colors.primary} name="attach-money" />
                </CardComponent>
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48
                }}>
                  <TextComponent text={convertMoney(item.price)} font={fontFamilies.medium} size={16} />
                  <TextComponent text="Áp dụng mã giảm giá ngay !" color={colors.gray} />
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent>
                <CardComponent styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]} color={`${colors.primary}20`}>
                  <Calendar size={30} color={colors.primary} variant="Bold" />
                </CardComponent>
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48
                }}>
                  <TextComponent text={DateTime.GetDate(new Date(item.date))} font={fontFamilies.medium} size={16} />
                  <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(item.date).getDay())}, ${DateTime.GetTime(new Date(item.startAt))} - ${DateTime.GetTime(new Date(item.endAt))}`} color={colors.gray} />
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent>
                <CardComponent styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]} color={`${colors.primary}20`}>
                  <Ionicons size={30} color={colors.primary} name="location-sharp" />
                </CardComponent>
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48,
                }}>
                  <TextComponent text={item.Location} numberOfLine={1} font={fontFamilies.medium} size={16} />
                  <TextComponent numberOfLine={1} text={item.Address} color={colors.gray}/>
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent>
                <Image source={require('../../assets/images/huy.jpg')} style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12
                }} />
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48
                }}>
                  <TextComponent text={item.authorId.fullname} font={fontFamilies.medium} size={16} />
                  <TextComponent text="Người chủ trì" color={colors.gray} />
                </View>
              </RowComponent>
            </SectionComponent>
            <TabBarComponent title={'Thông tin sự kiện'} />
            <SectionComponent>
              <TextComponent text={item.description ? item.description : ''} />

            </SectionComponent>
          </ScrollView>
        </View>
      </ImageBackground>

      {
        isAtEnd ? 
          <View onLayout={onLayout} style={{
            padding:12
          }}>
            <ButtonComponent text="Mua vé ngay" type="primary"
            icon={<View style={[globalStyles.iconContainer, { backgroundColor: colors.primary }]}>
              <ArrowRight
                size={18}
                color={colors.white}
              /></View>}
            iconFlex="right" 
            onPress={()=>console.log("mua vé")}
            />
          </View>
        :
        <LinearGradient colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,1)']} style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding:12
        }}>
          <ButtonComponent text="Mua vé ngay" type="primary"
            icon={<View style={[globalStyles.iconContainer, { backgroundColor: colors.primary }]}>
              <ArrowRight
                size={18}
                color={colors.white}
              /></View>}
            iconFlex="right" 
            onPress={()=>console.log("mua vé")}
            />
        </LinearGradient>
      }
    </View>
  )
}
export default EventDetails;