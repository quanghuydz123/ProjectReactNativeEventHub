import { Button, Platform, StyleProp, Text, TextStyle, View } from "react-native"
import React from "react"
import { colors } from "../constrants/color";
import { fontFamilies } from "../constrants/fontFamilies";
import { globalStyles } from "../styles/globalStyles";

interface Props{
    text:string,
    color?: string,
    size?: number,
    flex?: number,
    font?: string,
    styles?: StyleProp<TextStyle>,
    title?: boolean
}
const TextComponent = (props:Props)=>{
    const {text,size,flex,font,color,styles,title} = props
    const fontSizeDefault = Platform.OS === 'ios' ? 16 : 14
  return <Text style={[
    globalStyles.text,
    {
    color: color ?? colors.colorText,
    flex: flex ?? 0,
    fontSize: size ? size : title ? 24 : fontSizeDefault,
    fontFamily: font ? font : title ? fontFamilies.medium : fontFamilies.regular
  },styles]}>{text}</Text>
}
export default TextComponent;