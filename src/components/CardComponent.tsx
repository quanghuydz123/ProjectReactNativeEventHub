import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo, ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constrants/color"
interface Props{
    children:ReactNode,
    onPress?:()=>void,
    styles?:StyleProp<ViewStyle>,
    isShadow?:boolean,
    color?:string
}
const CardComponent = (props:Props)=>{
    const {children,onPress,styles,isShadow,color} = props
    const localStyle:StyleProp<ViewStyle>[] = [globalStyles.card
      ,isShadow ? globalStyles.shadow : undefined,
      {backgroundColor:color ?? colors.white},
      styles]
  return (
    <TouchableOpacity onPress={onPress} style={localStyle}>
      {children}
    </TouchableOpacity >
  )
}
export default memo(CardComponent);