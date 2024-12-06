import { Button, Image, ImageBackground, Text, View } from "react-native"
import React, { memo } from "react"
import CardComponent from "./CardComponent"
import TextComponent from "./TextComponent"
import { appInfo } from "../constrants/appInfo"
import AvatarGroup from "./AvatarGroup"
import RowComponent from "./RowComponent"
import { Bookmark, Bookmark2, Eye, Location } from "iconsax-react-native"
import { colors } from "../constrants/color"
import SpaceComponent from "./SpaceComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { globalStyles } from "../styles/globalStyles"
import { useNavigation } from "@react-navigation/native"
import { EventModelNew } from "../models/EventModelNew"
import { numberToString } from "../utils/numberToString"
import { useSelector } from "react-redux"
import { authSelector, AuthState } from "../reduxs/reducers/authReducers"
import { FollowModel } from "../models/FollowModel"
import { DateTime } from "../utils/DateTime"
import { convertMoney } from "../utils/convertMoney"
import TagComponent from "./TagComponent"
import Feather from "react-native-vector-icons/Feather"
interface Props {
  item: EventModelNew,
  isShownVertical?: boolean,
  bgColor?:string
}
const EventItem = (props: Props) => {
  const { item,  isShownVertical,bgColor } = props
  const navigation: any = useNavigation()
  const auth:AuthState = useSelector(authSelector)
  return (
    <CardComponent color={bgColor ?? colors.background}  styles={{ width: isShownVertical ? appInfo.sizes.WIDTH * 0.5 : appInfo.sizes.WIDTH * 0.65,paddingRight:isShownVertical ? 10 : 1 }} onPress={() => { navigation.push('EventDetails', {  id: item._id }) }}>
      {
        isShownVertical ? <>
          <View>
            <Image source={{ uri: item.photoUrl }} style={{ width: appInfo.sizes.WIDTH*0.45, height: appInfo.sizes.HEIGHT*0.14, borderRadius: 12, resizeMode: 'stretch' }} />
            {/* <View style={{
              position: 'absolute',
              top: 6,
              left: appInfo.sizes.WIDTH*0.38
            }}>
              {
                auth?.eventsInterested &&
                auth?.eventsInterested.length > 0 && auth?.eventsInterested.some(eventIntersted => eventIntersted.event === item?._id)
                && <FontAwesome name="star" size={18} color={colors.primary} />
              }   
            </View> */}
            {item.statusEvent === 'Ended' &&  <View style={{position:'absolute',
                right:0,
                top:0,
                backgroundColor:colors.warning,
                paddingHorizontal:8,
                paddingVertical:3,
                borderBottomLeftRadius:10,
                borderTopRightRadius:10,
              }}>
                <TextComponent text={'Đã diễn ra'} size={12} font={fontFamilies.medium} color="white"/>
              </View>}
            <SpaceComponent width={12} />
            <View style={{ height: '100%', flex: 1 }}>
             
              <TextComponent numberOfLine={2} text={item.title} title size={14} color={colors.white} />
              <TextComponent text={`Từ  ${convertMoney(item?.showTimes[0]?.typeTickets[item?.showTimes[0].typeTickets?.length - 1]?.price ?? 0)}`} title size={13} color={`${colors.primary}`} />
              <RowComponent styles={{ flexWrap: 'wrap' }}>
                {
                  
                  <View style={{ paddingVertical: 2 }} key={item.category?._id}>
                    <TagComponent
                      bgColor={colors.primary}
                      label={item.category.name}
                      textSize={8}
                      styles={{
                        minWidth: 50,
                        paddingVertical: 2,
                        paddingHorizontal: 2,
                      }}
                    />
                  </View>
                }
              </RowComponent>

              {
                (item.usersInterested && item.usersInterested.length > 0) && <AvatarGroup users={item.usersInterested} />
              }
              <RowComponent>
                <Feather name="calendar" size={12} color={colors.white} />
                <SpaceComponent width={4} />
                <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(item?.showTimes[0]?.startDate ?? Date.now()).getDay())} - ${DateTime.GetDateNew1(item?.showTimes[0]?.startDate ?? new Date(),item?.showTimes[0]?.endDate || new Date())} `} color={colors.white} size={12} />
              </RowComponent>
              <RowComponent justify="space-between" styles={{}}>
                <RowComponent>
                  
                  <TextComponent text={item?.addressDetails?.province?.name ?? ''} font={fontFamilies.medium} numberOfLine={1} color={colors.text2} flex={1} size={12} />
                 
                  <SpaceComponent width={4} />
                  <RowComponent>
                    <FontAwesome name="eye" color={colors.primary} size={16} />
                    <SpaceComponent width={2} />
                    <TextComponent text={item?.viewCount ?? 0} size={12} color={colors.primary} />
                  </RowComponent>
                  <SpaceComponent width={4} />
                </RowComponent>
              

              </RowComponent>
            </View>
          </View>
        </>
          :
          <>
            <ImageBackground style={[{ height: 160, padding: 10, marginBottom: 12, }]} source={{ uri: item.photoUrl }} imageStyle={{
              borderRadius: 12,
              resizeMode: 'stretch',
            }}>
              {/* <RowComponent justify="space-between">
                <CardComponent isShadow styles={{ alignItems: 'center', padding: 10, marginHorizontal: 0, marginVertical: 0, position: 'absolute', top: -22, left: -30 }} color={'#ffffff'}>
                  <TextComponent text={`${numberToString(new Date(item.startAt).getDate())}`} font={fontFamilies.semiBold} color={colors.danger2} size={18} />
                  <TextComponent text={`Tháng ${new Date(item.startAt).getMonth() + 1}`} color={colors.danger2} size={12} />
                </CardComponent>
                {
                  auth?.eventsInterested &&
                  auth?.eventsInterested.length > 0 && auth?.eventsInterested.some(eventIntersted => eventIntersted.event === item._id) && <CardComponent isShadow styles={[globalStyles.noSpaceCard, { position: 'absolute', top: 0, right: 0 }]} color={'#ffffff4D'}>
                    <FontAwesome name="star" size={22} color={colors.primary} />
                  </CardComponent>
                }

              </RowComponent> */}
              {item.statusEvent === 'Ended' &&  <View style={{position:'absolute',
                right:0,
                top:0,
                backgroundColor:colors.warning,
                paddingHorizontal:8,
                paddingVertical:4,
                borderBottomLeftRadius:12,
                borderTopRightRadius:12,
              }}>
                <TextComponent text={'Đã diễn ra'} size={12} font={fontFamilies.medium} color="white"/>
              </View>}
            </ImageBackground>
            <TextComponent numberOfLine={2} text={item.title} title size={15} color={colors.white} />
            <TextComponent text={`Từ  ${convertMoney(item?.showTimes[0]?.typeTickets[item?.showTimes[0].typeTickets?.length - 1]?.price ?? 0)}`} title size={13} color={`${colors.primary}`} />
            <RowComponent styles={{ flexWrap: 'wrap' }}>
              {
                // item.categories.map((category, index) => (
                //   <View style={{ paddingVertical: 2 }} key={category._id}>
                //     <TagComponent
                //       bgColor={colors.danger2}
                //       label={category.name}
                //       textSize={8}
                //       onPress={() => navigation.navigate('SearchEventsScreen', { categoriesSelected: [category._id] })}
                //       styles={{
                //         minWidth: 50,
                //         paddingVertical: 2,
                //         paddingHorizontal: 2,
                //         marginRight: index === item.categories.length - 1 ? 28 : 2
                //       }}
                //     />
                //   </View>
                // ))
                <View style={{ paddingVertical: 2 }} key={item.category?._id}>
                  <TagComponent
                    bgColor={colors.primary}
                    label={item.category.name}
                    textSize={8}
                    styles={{
                      minWidth: 50,
                      paddingVertical: 2,
                      paddingHorizontal: 2,
                      // marginRight: index === item.categories.length - 1 ? 28 : 2
                    }}
                  />
                </View>
              }
            </RowComponent>
            {
                (item.usersInterested && item.usersInterested.length > 0) && <AvatarGroup  users={item.usersInterested} />
              }
            <RowComponent>
              <Feather name="calendar" size={12} color={colors.white} />
              <SpaceComponent width={4} />
              <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(item?.showTimes[0]?.startDate ?? Date.now()).getDay())} - ${DateTime.GetDateNew1(item?.showTimes[0]?.startDate ?? new Date(),item?.showTimes[0]?.endDate || new Date())} `} color={colors.white} size={12} />
            </RowComponent>
            <RowComponent>
              {/* <Location size={18} color={colors.gray2} variant="Bold" />
              <SpaceComponent width={4} /> */}
              <TextComponent text={item?.addressDetails?.province?.name ?? ''}
                numberOfLine={1} size={12}
                font={fontFamilies.medium}
                color={colors.text2} flex={1}
              />
              {/* <RowComponent>
                <FontAwesome name="heart" color={colors.primary} size={16} />
                <SpaceComponent width={2} />
                <TextComponent text={'99999'} size={12} color={colors.primary} />
              </RowComponent> */}
              <SpaceComponent width={4} />
              <RowComponent>
                <FontAwesome name="eye" color={colors.primary} size={16} />
                <SpaceComponent width={2} />
                <TextComponent text={item?.viewCount ?? 0} size={12} color={colors.primary} />
              </RowComponent>
            </RowComponent>
          </>
      }
    </CardComponent>
  )
}
export default memo(EventItem);