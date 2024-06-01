import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
interface Props{
    children:ReactNode,
    onPress:()=>void,
    styles?:StyleProp<ViewStyle>
}
const CardComponent = (props:Props)=>{
    const {children,onPress,styles} = props
  return (
    <TouchableOpacity onPress={onPress} style={[globalStyles.card,globalStyles.shadow,{},styles]}>
      {children}
    </TouchableOpacity >
  )
}
export default CardComponent;