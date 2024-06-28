import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
import TextComponent from "./TextComponent"
import SpaceComponent from "./SpaceComponent"
import { colors } from "../constrants/color"
import { fontFamilies } from "../constrants/fontFamilies"
interface Props {
    onPress?:()=>void,
    label:string,
    icon?:ReactNode,
    textColor?:string,
    bgColor?:string,
    styles?:StyleProp<ViewStyle>,
    font?:string,
    textStyles?:StyleProp<ViewStyle>,

}
const TagComponent = (props:Props)=>{
    const {onPress,label,icon,textColor,bgColor, styles,font,textStyles} = props
  return (
    <TouchableOpacity onPress={onPress} style={[globalStyles.row,globalStyles.tab, {
      backgroundColor:bgColor ?? colors.white,
      minWidth:82,
      justifyContent:'center'
      
    },styles]}>
        {icon && icon}
        {icon && <SpaceComponent width={8}/>}
        <TextComponent 
        font={font ?? fontFamilies.medium} 
        text={label} 
        color={textColor ? textColor : bgColor ? colors.white : colors.gray}
        styles={[textStyles]}
        />
    </TouchableOpacity>
  )
}
export default TagComponent;