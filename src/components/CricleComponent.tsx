import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
import { colors } from "../constrants/color"
interface Props {
    size?:number,
    children:ReactNode,
    color?:string,
    onPress?:()=>void,
    styles?:StyleProp<ViewStyle>

}
const CricleComponent = (props:Props)=>{
    const {size,children,color,onPress,styles} = props
    const localStyle:StyleProp<ViewStyle> = {
      width:size ?? 40,
      height:size ?? 40,
      backgroundColor:color ?? colors.primary,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:100
      }
  return (
    onPress ? <TouchableOpacity onPress={onPress} style={[localStyle,styles]}>
        {children}
    </TouchableOpacity> : <View style={[localStyle,styles]}>{children}</View>
  )
}
export default CricleComponent;