import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo, ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
interface Props{
    justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined,
    styles?: StyleProp<ViewStyle>,
    children:ReactNode,
    onPress?: ()=>void,

}
//activeOpacity click button không bị mờ
const RowComponent = (props:Props)=>{
    const {justify,styles,children,onPress} = props
    const localStyle = [
      globalStyles.row,{justifyContent:justify},styles
    ]
  return onPress ? ( <TouchableOpacity activeOpacity={0.9} style={[localStyle]} onPress={onPress}>
    {children}
  </TouchableOpacity> ) :
  (
    <View style={localStyle}>
      {children}
    </View>
  )
}
export default memo(RowComponent);