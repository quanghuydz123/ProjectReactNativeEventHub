import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo, ReactNode } from "react"
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
    textSize?:number
}
const TagComponent = (props:Props)=>{
  const {onPress,label,icon,textColor,bgColor, styles,font,textStyles,textSize} = props
  const TouchableOpacityComponent: React.ComponentType<any> = onPress ? TouchableOpacity : View;

  return (
    <TouchableOpacityComponent onPress={onPress} style={[globalStyles.row,globalStyles.tab, {
      backgroundColor:bgColor ?? colors.white,
      minWidth:82,
      justifyContent:'center'
      
    },styles]}>
        {icon && icon}
        {icon && <SpaceComponent width={8}/>}
        <TextComponent 
        font={font ?? fontFamilies.medium} 
        text={label} 
        size={textSize}
        color={textColor ? textColor : bgColor ? colors.white : colors.gray}
        styles={[textStyles]}
        />
    </TouchableOpacityComponent>
  )
}
export default memo(TagComponent);