import { Button, Platform, StyleProp, Text, TextStyle, View } from "react-native"
import React, { RefObject } from "react"
import { colors } from "../constrants/color";
import { fontFamilies } from "../constrants/fontFamilies";
import { globalStyles } from "../styles/globalStyles";
//numberOfLine hiện thị tối đa bao nhiêu dòng
interface Props{
    text:string,
    color?: string,
    size?: number,
    flex?: number,
    font?: string,
    styles?: StyleProp<TextStyle>,
    title?: boolean,
    numberOfLine?:number,
    textAlign?: 'center' | 'left'| 'auto' | 'right' | 'justify'
  
}
const TextComponent = (props:Props)=>{
    const {text,size,flex,font,color,styles,title,numberOfLine,textAlign} = props
    const fontSizeDefault = Platform.OS === 'ios' ? 16 : 14
    const lineHeight = size && size + 6
  return <Text style={[
    globalStyles.text,
    {
    color: color ?? colors.colorText,
    flex: flex ?? 0,
    fontSize: size ? size : title ? 24 : fontSizeDefault,
    fontFamily: font ? font : title ? fontFamilies.medium : fontFamilies.regular,
    lineHeight:lineHeight ? lineHeight : title ? 30 : Platform.OS === 'ios' ? 20 : 18,
    textAlign:textAlign ? textAlign : 'left'
  },styles]} numberOfLines={numberOfLine}>{text}</Text>
}
export default TextComponent;