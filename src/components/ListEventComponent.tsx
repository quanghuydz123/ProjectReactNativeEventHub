import { Button, RefreshControl, Text, View } from "react-native"
import React, { memo, useCallback } from "react"
import { EventModelNew } from "../models/EventModelNew"
import { FlatList } from "react-native-gesture-handler"
import EventItem from "./EventItem"
import { FollowModel } from "../models/FollowModel"
import RowComponent from "./RowComponent"
import { colors } from "../constrants/color"
interface Props {
    items:EventModelNew[],
    isShownVertical?:boolean,
    bgColor?:string
}
const ListEventComponent = (props:Props)=>{
    const {items,isShownVertical,bgColor} = props
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      console.log("ok")
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);
  return (
    <View style={{flex:1}}>
      <FlatList
      // style={{flex:1}}
      key={items[0]?._id}
      showsVerticalScrollIndicator={false}
      data={items} 
      // contentContainerStyle={{flex:1}}
      // refreshControl={
      //   <RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />
      // }
      numColumns={2}
      renderItem={({item})=>{
        return <EventItem  
        bgColor={bgColor}  item={item} key={item._id} isShownVertical={isShownVertical}/>
      }}/>
    </View>
  )
}
export default memo(ListEventComponent);