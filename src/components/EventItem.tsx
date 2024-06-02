import { Button, ImageBackground, Text, View } from "react-native"
import React from "react"
import CardComponent from "./CardComponent"
import TextComponent from "./TextComponent"
import { appInfo } from "../constrants/appInfo"
import { EventModel } from "../models/EventModel"
import AvatarGroup from "./AvatarGroup"
import RowComponent from "./RowComponent"
import { Bookmark, Bookmark2, Location } from "iconsax-react-native"
import { colors } from "../constrants/color"
import SpaceComponent from "./SpaceComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { globalStyles } from "../styles/globalStyles"
import { useNavigation } from "@react-navigation/native"
interface Props {
    item:EventModel,
    type: 'card' | 'list'
}
const EventItem = (props:Props)=>{
    const {item,type} = props
    const navigation:any = useNavigation()
  return (
    <CardComponent isShadow styles={{width:appInfo.sizes.WIDTH*0.7}} onPress={()=>{navigation.navigate('EventDetails',{item}) }} color={colors.white}>
        <ImageBackground style={{flex:1,height:131,padding:10,marginBottom:12}} source={require('../assets/images/blackPink.png')} imageStyle={{
          borderRadius:12,
          resizeMode:'stretch',
        }}>
          <RowComponent justify="space-between">
            <CardComponent isShadow styles={{alignItems:'center',padding:10,marginHorizontal:0,marginVertical:0,position:'absolute',top:-20,left:-30}} color={'#ffffff'}>
              <TextComponent text="10" font={fontFamilies.semiBold} color={colors.danger2} size={18}/>
              <TextComponent text="Tháng 6" color={colors.danger2} size={12} />
            </CardComponent>
            <CardComponent isShadow styles={[globalStyles.noSpaceCard,{position:'absolute',top:0,right:0}]} color={'#ffffffB3'}>
              <FontAwesome name="bookmark-o" size={22} color={'black'} /> 
            </CardComponent>
          </RowComponent>
        </ImageBackground>
        <TextComponent numberOfLine={1} text={item.title} title size={18}/>
        <AvatarGroup />
        <RowComponent>
          <Location size={18} color={colors.gray2} variant="Bold"/>
          <SpaceComponent width={4} />
          <TextComponent text={item.location.address} numberOfLine={1} color={colors.text2} flex={1}/>
        </RowComponent>
    </CardComponent>
  )
}
export default EventItem;