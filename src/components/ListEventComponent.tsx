import { Button, Text, View } from "react-native"
import React from "react"
import { EventModelNew } from "../models/EventModelNew"
import { FlatList } from "react-native-gesture-handler"
import EventItem from "./EventItem"
import { FollowerModel } from "../models/FollowerModel"
interface Props {
    items:EventModelNew[],
    follows:FollowerModel[]
}
const ListEventComponent = (props:Props)=>{
    const {items,follows} = props
  return (
    <View>
      <FlatList 
      data={items} 
      renderItem={({item})=><EventItem followers={follows} item={item} key={item._id} isShownHorizontal/>}/>
    </View>
  )
}
export default ListEventComponent;