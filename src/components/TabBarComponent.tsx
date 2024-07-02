import { Button, Text, View } from "react-native"
import React from "react"
import RowComponent from "./RowComponent"
import TextComponent from "./TextComponent"
import { TouchableOpacity } from "react-native-gesture-handler"
import { colors } from "../constrants/color"
import { ArrowRight2 } from "iconsax-react-native"
import ButtonComponent from "./ButtonComponent"
interface Props{
    title:string,
    onPress?:()=>void
}
const TabBarComponent = (props:Props)=>{
    const {title,onPress} = props
  return (
    <RowComponent styles={{
        paddingHorizontal:16,
        marginBottom:10
    }}>
        <TextComponent text={title} title flex={1} size={18}/>
        {onPress && 
        <RowComponent>
            <ButtonComponent text="Xem tất cả" color={colors.text2} onPress={onPress} textSize={12}/>
            <ArrowRight2 size={14} color={colors.text2} variant="Bold" style={{marginTop:2}}/>
        </RowComponent>}
    </RowComponent>
  )
}
export default TabBarComponent;