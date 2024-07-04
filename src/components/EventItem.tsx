import { Button, Image, ImageBackground, Text, View } from "react-native"
import React from "react"
import CardComponent from "./CardComponent"
import TextComponent from "./TextComponent"
import { appInfo } from "../constrants/appInfo"
import AvatarGroup from "./AvatarGroup"
import RowComponent from "./RowComponent"
import { Bookmark, Bookmark2, Location } from "iconsax-react-native"
import { colors } from "../constrants/color"
import SpaceComponent from "./SpaceComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { globalStyles } from "../styles/globalStyles"
import { useNavigation } from "@react-navigation/native"
import { EventModelNew } from "../models/EventModelNew"
import { numberToString } from "../utils/numberToString"
import { useSelector } from "react-redux"
import { authSelector } from "../reduxs/reducers/authReducers"
import { FollowerModel } from "../models/FollowerModel"
import { DateTime } from "../utils/DateTime"
interface Props {
  item: EventModelNew,
  isShownHorizontal?: boolean,
  followers: FollowerModel[]
}
const EventItem = (props: Props) => {
  const { item, followers, isShownHorizontal } = props
  const navigation: any = useNavigation()
  const auth = useSelector(authSelector)
  return (
    <CardComponent isShadow styles={{ width: isShownHorizontal ? appInfo.sizes.WIDTH * 0.93 : appInfo.sizes.WIDTH * 0.7 }} onPress={() => { navigation.navigate('EventDetails', { item, followers, id: item._id }) }} color={colors.white}>
      {
        isShownHorizontal ? <>
          <RowComponent>
            <Image source={{ uri: item.photoUrl }} style={{ width: 100, height: 100, borderRadius: 12, resizeMode: 'stretch' }} />
            <SpaceComponent width={12} />
            <View style={{height:'100%',flex:1}}>
              <RowComponent justify="space-between">
                <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(item?.date ?? Date.now()).getDay())} ${DateTime.GetDateShort(new Date(item?.date ?? Date.now()))} 11:00 - 12:00`}size={12}/>
                {
                  followers && followers.length > 0 && followers.filter(item => item.user._id === auth.id)[0]?.events.some(event => event._id === item._id) &&  <FontAwesome name="bookmark" size={22} color={'red'} />
                }

              </RowComponent>
              <TextComponent flex={1} numberOfLine={2} text={item.title} title size={16} />
              <RowComponent>
                <Location size={18} color={colors.gray2} variant="Bold" />
                <SpaceComponent width={4} />
                <TextComponent text={item.Address} numberOfLine={1} color={colors.text2} flex={1} size={12}/>
              </RowComponent>
            </View>
          </RowComponent>
        </>
          :
          <>
            <ImageBackground style={{ height: 150, padding: 10, marginBottom: 12 }} source={{ uri: item.photoUrl }} imageStyle={{
              borderRadius: 12,
              resizeMode: 'stretch',
            }}>
              <RowComponent justify="space-between">
                <CardComponent isShadow styles={{ alignItems: 'center', padding: 10, marginHorizontal: 0, marginVertical: 0, position: 'absolute', top: -22, left: -30 }} color={'#ffffff'}>
                  <TextComponent text={`${numberToString(new Date(item.date).getDate())}`} font={fontFamilies.semiBold} color={colors.danger2} size={18} />
                  <TextComponent text={`Tháng ${new Date(item.date).getMonth() + 1}`} color={colors.danger2} size={12} />
                </CardComponent>
                {
                  followers && followers.length > 0 && followers.filter(item => item.user._id === auth.id)[0]?.events.some(event => event._id === item._id) && <CardComponent isShadow styles={[globalStyles.noSpaceCard, { position: 'absolute', top: 0, right: 0 }]} color={'#ffffff4D'}>
                    <FontAwesome name="bookmark" size={22} color={'white'} />
                  </CardComponent>
                }

              </RowComponent>
            </ImageBackground>
            <TextComponent numberOfLine={2} text={item.title} title size={18} />
            {
              <AvatarGroup users={item.users} />
            }
            <RowComponent>
              <Location size={18} color={colors.gray2} variant="Bold" />
              <SpaceComponent width={4} />
              <TextComponent text={item.Address} numberOfLine={1} color={colors.text2} flex={1} />
            </RowComponent></>
      }
    </CardComponent>
  )
}
export default EventItem;