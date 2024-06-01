import { Button, Text, View } from "react-native"
import React from "react"

const SearchEventsScreen = ({navigation, route}:any)=>{
    const {isFilter}:{isFilter:boolean} = route.params
    console.log("isFilter",isFilter)
  return (
    <View>
      <Text>SearchEventsScreen</Text>
    </View>
  )
}
export default SearchEventsScreen;