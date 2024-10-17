import { Button, StyleProp, Text, View, ViewStyle } from "react-native"
import React from "react"
import RowComponent from "./RowComponent"
import TextComponent from "./TextComponent"
import { TouchableOpacity } from "react-native-gesture-handler"
import { colors } from "../constrants/color"
import { ArrowRight2 } from "iconsax-react-native"
import ButtonComponent from "./ButtonComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import AntDesign from "react-native-vector-icons/AntDesign"
interface Props{
    title:string,
    onPress?:()=>void,
    styles?:StyleProp<ViewStyle>,
    textSizeTitle?:number,
    isNotShowIconRight?:boolean,
    titleRight?:string,
    textColor?:string
}
const TabBarComponent = (props:Props)=>{
    const {title,onPress,styles,textSizeTitle,isNotShowIconRight,titleRight,textColor} = props
  return (
    <RowComponent styles={[{
        paddingHorizontal:10,
        marginBottom:6
    },styles]}>
        <TextComponent color={textColor ?? colors.white} text={title} title flex={1} size={textSizeTitle ?? 16}/>
        {onPress && 
        <RowComponent onPress={onPress}>
            <TextComponent text={titleRight ?? "Xem tất cả"} color={colors.primary} size={14} font={fontFamilies.medium}/>
            {!isNotShowIconRight && <AntDesign size={18} color={colors.primary} name="right"  style={{marginTop:2}}/>  }
        </RowComponent>}
    </RowComponent>
  )
}
export default TabBarComponent;