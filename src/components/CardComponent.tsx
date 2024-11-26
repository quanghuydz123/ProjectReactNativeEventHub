import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { forwardRef, memo, ReactNode } from "react"
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
    onLayout?:(event:any)=>void,
    onLongPress?:()=>void,
    delayLongPress?:number
}
//phải có forwardRef<any, Props> khi sủ dụng ref chú không truyền trên props
const CardComponent =  forwardRef<any, Props>((props:Props,ref:any)=>{
    const {children,onPress,styles,isShadow,color,title,colorTitle,sizeTitle,colorSpace,isNoPadding,onLongPress,onLayout,delayLongPress} = props
    const localStyle:StyleProp<ViewStyle>[] = [globalStyles.card
      ,isShadow ? globalStyles.shadow : undefined,
      {backgroundColor:color ?? colors.white,padding:isNoPadding ? 0 : 10},
      styles]
  const TouchableOpacityComponent: React.ComponentType<any> = (onPress || onLongPress) ? TouchableOpacity : View;
  return (
    <TouchableOpacityComponent onLongPress={onLongPress} activeOpacity={onLongPress ? 1 : 0.2} delayLongPress={delayLongPress ?? 100} onLayout={onLayout}  ref={ref} onPress={onPress} style={localStyle}>
      {title && <View style={{paddingHorizontal:isNoPadding ? 10 : 0,paddingTop:isNoPadding ? 10 : 0}}>
          <TextComponent text={title} font={fontFamilies.bold}  color={colorTitle} title size={sizeTitle ?? 18}/>
          <SpaceComponent height={10}/>
          <SpaceComponent height={1} styles={{ }} color={colorSpace ?? colors.gray2} />
          <SpaceComponent height={10}/>
        </View>}
      {children}
    </TouchableOpacityComponent >
  )
})
export default memo(CardComponent);