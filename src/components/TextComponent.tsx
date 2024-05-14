import { Button, StyleProp, Text, TextStyle, View } from "react-native"
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
  return <Text style={[
    globalStyles.text,
    {
    color: color ?? colors.colorText,
    flex: flex ?? 0,
    fontSize: size ?? title ? 24 : 14,
    fontFamily: font ?? title ? fontFamilies.bold : fontFamilies.regular
  },styles]}>{text}</Text>
}
export default TextComponent;