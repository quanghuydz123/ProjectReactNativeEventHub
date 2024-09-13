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
import { authSelector } from "../reduxs/reducers/authReducers"
import { FollowModel } from "../models/FollowModel"
import { DateTime } from "../utils/DateTime"
import { convertMoney } from "../utils/convertMoney"
import TagComponent from "./TagComponent"

interface Props {
  item: EventModelNew,
  isShownHorizontal?: boolean,
  followers: FollowModel[]
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
            <View style={{
              position:'absolute',
              top:6,
              left:80
            }}>
              {
                followers &&
                followers.length > 0 && followers.filter(item => item?.user?._id === auth.id)[0]?.events.some(event => event?._id === item?._id)
                && <FontAwesome name="bookmark" size={18} color={colors.white} />
              }
            </View>
            <SpaceComponent width={12} />
            <View style={{ height: '100%', flex: 1 }}>
              <RowComponent justify="space-between" styles={{ }}>
                <RowComponent>
                  {/* <Location size={18} color={colors.gray2} variant="Bold" />
                <SpaceComponent width={4} /> */}
                  <TextComponent text={item.addressDetals.county ?? ''} font={fontFamilies.medium} numberOfLine={1} color={colors.text2} flex={1} size={12} />
                  {/* <RowComponent>
                    <FontAwesome name="eye" color={colors.primary} size={16} />
                    <SpaceComponent width={2} />
                    <TextComponent text={'123'} size={12} color={colors.primary} />
                  </RowComponent> */}
                  <RowComponent>
                    <FontAwesome name="heart" color={colors.primary} size={16} />
                    <SpaceComponent width={2} />
                    <TextComponent text={'78654'} size={12} color={colors.primary} />
                  </RowComponent>
                  <SpaceComponent width={4} />
                  <RowComponent>
                    <FontAwesome name="eye" color={colors.primary} size={16} />
                    <SpaceComponent width={2} />
                    <TextComponent text={'78654'} size={12} color={colors.primary} />
                  </RowComponent>
                  <SpaceComponent width={4} />

                </RowComponent>
                {/* {
                  followers &&
                  followers.length > 0 && followers.filter(item => item?.user?._id === auth.id)[0]?.events.some(event => event?._id === item?._id)
                  && <FontAwesome name="bookmark" size={22} color={colors.primary} />
                } */}

              </RowComponent>
              <TextComponent numberOfLine={2} text={item.title} title size={16} />
              <TextComponent flex={1} text={item?.price ? convertMoney(item?.price) : 'Vào cổng tự do'} title size={14} />
              <RowComponent styles={{ flexWrap: 'wrap' }}>
                {
                  item.categories.map((category, index) => (
                    <View style={{ paddingVertical: 2 }} key={category?._id}>
                      <TagComponent
                        bgColor={colors.danger2}
                        label={category.name}
                        textSize={8}
                        styles={{
                          minWidth: 50,
                          paddingVertical: 2,
                          paddingHorizontal: 2,
                          marginRight: index === item.categories.length - 1 ? 28 : 2
                        }}
                      />
                    </View>
                  ))
                }
              </RowComponent>

              {
                (item.users && item.users.length > 0) && <AvatarGroup users={item.users} />
              }
              <RowComponent styles={{ justifyContent: 'space-between' }}>
                <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(item?.startAt ?? Date.now()).getDay())} ${DateTime.GetDateShort(new Date(item?.startAt ?? Date.now()), new Date(item?.endAt ?? Date.now()))} ${DateTime.GetTime(new Date(item?.startAt ?? Date.now()))} - ${DateTime.GetTime(new Date(item?.endAt ?? Date.now()))}`} size={12} />

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
                  <TextComponent text={`${numberToString(new Date(item.startAt).getDate())}`} font={fontFamilies.semiBold} color={colors.danger2} size={18} />
                  <TextComponent text={`Tháng ${new Date(item.startAt).getMonth() + 1}`} color={colors.danger2} size={12} />
                </CardComponent>
                {
                  followers && followers.length > 0 && followers.filter(item => item.user?._id === auth.id)[0]?.events.some(event => event._id === item._id) && <CardComponent isShadow styles={[globalStyles.noSpaceCard, { position: 'absolute', top: 0, right: 0 }]} color={'#ffffff4D'}>
                    <FontAwesome name="bookmark" size={22} color={'white'} />
                  </CardComponent>
                }

              </RowComponent>
            </ImageBackground>
            <TextComponent numberOfLine={2} text={item.title} title size={18} />
            <TextComponent text={item?.price ? convertMoney(item?.price) : 'Vào cổng tự do'} title size={14} />
            <RowComponent styles={{ flexWrap: 'wrap' }}>
              {
                item.categories.map((category, index) => (
                  <View style={{ paddingVertical: 2 }} key={category._id}>
                    <TagComponent
                      bgColor={colors.danger2}
                      label={category.name}
                      textSize={8}
                      onPress={() => navigation.navigate('SearchEventsScreen', { categoriesSelected: [category._id] })}
                      styles={{
                        minWidth: 50,
                        paddingVertical: 2,
                        paddingHorizontal: 2,
                        marginRight: index === item.categories.length - 1 ? 28 : 2
                      }}
                    />
                  </View>
                ))
              }
            </RowComponent>
            {
              <AvatarGroup users={item.users} />
            }
            <RowComponent>
              {/* <Location size={18} color={colors.gray2} variant="Bold" />
              <SpaceComponent width={4} /> */}
              <TextComponent text={item.addressDetals.county ?? ''}
                numberOfLine={1} size={12}
                font={fontFamilies.medium}
                color={colors.text2} flex={1}
              />
              <RowComponent>
                <FontAwesome name="heart" color={colors.primary} size={16} />
                <SpaceComponent width={2} />
                <TextComponent text={'99999'} size={12} color={colors.primary} />
              </RowComponent>
              <SpaceComponent width={4} />
              <RowComponent>
                <FontAwesome name="eye" color={colors.primary} size={16} />
                <SpaceComponent width={2} />
                <TextComponent text={'99999'} size={12} color={colors.primary} />
              </RowComponent>
            </RowComponent>
          </>
      }
    </CardComponent>
  )
}
export default memo(EventItem);