import { Button, Text, View } from "react-native"
import React from "react"
import { TextComponent } from "../components";

const NewScreen = ()=>{
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <TextComponent text={'Mất kết nối vui lòng kiểm tra lại mạng !!!'} />
    </View>
  )
}
export default NewScreen;