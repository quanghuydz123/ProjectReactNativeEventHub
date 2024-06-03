import { Button, Image, ImageBackground, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from "../../components";
import { appInfo } from "../../constrants/appInfo";
import { ArrowLeft, ArrowLeft2, ArrowRight, Calendar, Location } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import CardComponent from "../../components/CardComponent";
import { globalStyles } from "../../styles/globalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import AvatarGroup from "../../components/AvatarGroup";
import Ionicons from "react-native-vector-icons/Ionicons"
import { fontFamilies } from "../../constrants/fontFamilies";

const EventDetails = ({ navigation, route }: any) => {
  const { item } = route.params

  console.log("item", item)
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white
    }}>
      <ImageBackground style={{
        flex: 1,
        height: 244,
      }} imageStyle={{
        resizeMode: 'stretch',
        height: 244,
        width: appInfo.sizes.WIDTH,
      }} source={require('../../assets/images/blackPink.png')}>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}>
          <RowComponent styles={{
            padding: 16,
            paddingTop: 42,
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
          paddingTop: 244 - 130,
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
                <AvatarGroup size={36} isShowButton />
              </RowComponent>
            </View>
          </SectionComponent>
          <ScrollView showsHorizontalScrollIndicator={false}>
            <SectionComponent>
              <TextComponent text={item.title} title size={34} font={fontFamilies.regular} />
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
                  <TextComponent text="14 Tháng 2, 2024" font={fontFamilies.medium} size={16} />
                  <TextComponent text="Thứ ba, 4:00PM - 9:00PM" color={colors.gray} />
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
                  height: 48
                }}>
                  <TextComponent text="Sân vân động Mỹ Đình" font={fontFamilies.medium} size={16} />
                  <TextComponent numberOfLine={1} text={item.location.address} color={colors.gray} />
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
                  <TextComponent text="Nguyễn Quang Huy" font={fontFamilies.medium} size={16} />
                  <TextComponent text="Người chủ trì" color={colors.gray} />
                </View>
              </RowComponent>
            </SectionComponent>
            <TabBarComponent title={'Thông tin sự kiện'} />
            <SectionComponent>
              <TextComponent text={item.description} />
              <TextComponent text={item.description} />
              <TextComponent text={item.description} />
              <TextComponent text={item.description} />

            </SectionComponent>
          </ScrollView>
        </View>
      </ImageBackground>

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
          iconFlex="right" />
      </LinearGradient>
    </View>
  )
}
export default EventDetails;