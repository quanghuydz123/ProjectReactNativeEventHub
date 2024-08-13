import { Button, Text, View } from "react-native"
import React, { memo } from "react"
import { EventModelNew } from "../models/EventModelNew"
import { FlatList } from "react-native-gesture-handler"
import EventItem from "./EventItem"
import { FollowModel } from "../models/FollowModel"
interface Props {
    items:EventModelNew[],
    follows:FollowModel[]
}
const ListEventComponent = (props:Props)=>{
    const {items,follows} = props
  return (
    <View style={{marginBottom:40}}>
      <FlatList
      showsVerticalScrollIndicator={false}
      data={items} 
      renderItem={({item})=><EventItem followers={follows} item={item} key={item._id} isShownHorizontal/>}/>
    </View>
  )
}
export default memo(ListEventComponent);