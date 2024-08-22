import { ActivityIndicator, Button, Text, View } from "react-native"
import React from "react"
import TextComponent from "./TextComponent"
import { appInfo } from "../constrants/appInfo"
interface Props{
    value?:number,
    isLoading:boolean,
    message?:string,
    height?:number
}
const LoadingComponent = (props:Props)=>{
    const {value, isLoading, message,height} = props 
  return (
    <View style={{
        justifyContent:'center',
        alignItems:'center',
        height:height ?? appInfo.sizes.HEIGHT*0.2
    }}>
      {
        isLoading ? <ActivityIndicator /> 
        : value === 0 && <TextComponent text={message ? message : 'Không có dữ liệu'}/>
      }
    </View>
  )
}
export default LoadingComponent;