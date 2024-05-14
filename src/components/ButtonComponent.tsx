import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
import TextComponent from "./TextComponent"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constrants/color"
import { fontFamilies } from "../constrants/fontFamilies"

interface Props {
    icon ?: ReactNode,
    text: string,
    type?: 'primary' | 'text' | 'link',
    color?: string,
    styles?: StyleProp<ViewStyle>,
    textColor?: string,
    textStyles?:StyleProp<ViewStyle>,
    onPress?: () => void,
    iconFlex?: 'right' | 'left'
}
const ButtonComponent = (props:Props)=>{
    const {
        icon,
        text,
        type,
        color,
        styles,
        textColor,
        textStyles,
        iconFlex,
        onPress
    } = props
  return (
    type === 'primary' ?
    <TouchableOpacity 
    onPress={onPress}
    style={[globalStyles.button,{
        backgroundColor:color ?? colors.primary,

    },styles]}>
        {icon && icon}
        <TextComponent text={text} color={textColor ?? colors.white} 
        styles={[textStyles,{marginLeft: icon ? 12 : 0}]}
        flex={icon && iconFlex === 'right' ? 1 : 0}
        />
        {icon && iconFlex === 'right' && icon}
    </TouchableOpacity>
  :
  <TouchableOpacity>
    <TextComponent text={text} color={type === 'link' ? colors.link : colors.colorText}/>
  </TouchableOpacity>
  )
}
export default ButtonComponent;