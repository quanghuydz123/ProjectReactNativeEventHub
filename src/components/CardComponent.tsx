import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo, ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constrants/color"
import TextComponent from "./TextComponent"
import SpaceComponent from "./SpaceComponent"
import { fontFamilies } from "../constrants/fontFamilies"
interface Props{
    children:ReactNode,
    onPress?:()=>void,
    styles?:StyleProp<ViewStyle>,
    isShadow?:boolean,
    color?:string,
    title?:string,
    colorTitle?:string,
    sizeTitle?:number,
    colorSpace?:string,
    isNoPadding?:boolean,
    ref?:any,
    onLayout?:(event:any)=>void
}
const CardComponent = (props:Props)=>{
    const {children,onPress,styles,isShadow,color,title,colorTitle,sizeTitle,colorSpace,isNoPadding,ref,onLayout} = props
    const localStyle:StyleProp<ViewStyle>[] = [globalStyles.card
      ,isShadow ? globalStyles.shadow : undefined,
      {backgroundColor:color ?? colors.white,padding:isNoPadding ? 0 : 10},
      styles]
  const TouchableOpacityComponent: React.ComponentType<any> = onPress ? TouchableOpacity : View;
  return (
    <TouchableOpacityComponent onLayout={onLayout}  ref={ref} onPress={onPress} style={localStyle}>
      {title && <View style={{paddingHorizontal:isNoPadding ? 10 : 0,paddingTop:isNoPadding ? 10 : 0}}>
          <TextComponent text={title} font={fontFamilies.bold}  color={colorTitle} title size={sizeTitle ?? 18}/>
          <SpaceComponent height={10}/>
          <SpaceComponent height={1} styles={{ }} color={colorSpace ?? colors.gray2} />
          <SpaceComponent height={10}/>
        </View>}
      {children}
    </TouchableOpacityComponent >
  )
}
export default memo(CardComponent);