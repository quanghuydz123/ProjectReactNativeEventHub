import { Button, RefreshControl, Text, View } from "react-native"
import React, { memo, useCallback } from "react"
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
      showsVerticalScrollIndicator={false}
      data={items} 
      // contentContainerStyle={{flex:1}}
      // refreshControl={
      //   <RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />
      // }
      renderItem={({item})=><EventItem followers={follows} item={item} key={item._id} isShownHorizontal/>}/>
    </View>
  )
}
export default memo(ListEventComponent);