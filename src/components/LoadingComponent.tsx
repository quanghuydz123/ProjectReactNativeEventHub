import { ActivityIndicator, Button, Text, View } from "react-native"
import React from "react"
import TextComponent from "./TextComponent"
interface Props{
    value?:number,
    isLoading:boolean,
    message?:string
}
const LoadingComponent = (props:Props)=>{
    const {value, isLoading, message} = props 
  return (
    <View style={{
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:20,
        paddingVertical:75,
    }}>
      {
        isLoading ? <ActivityIndicator /> : value === 0 && <TextComponent text={message ? message : 'Không có dữ liệu'}/>
      }
    </View>
  )
}
export default LoadingComponent;