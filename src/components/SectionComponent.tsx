import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo, ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
import SpaceComponent from "./SpaceComponent"
import { colors } from "../constrants/color"

interface Props {
  children: ReactNode,
  styles?: StyleProp<ViewStyle>,
  isSpace?: boolean,
  mgSpaceTop?: number,
  mgSpaceBottom?: number,
  colorSpace?: string,
  isNoPaddingBottom?: boolean,
  bgColor?:string,
  sectionRef?:any,
  onPress?:()=>void

}
const SectionComponent = (props: Props) => {

  const { children, styles, isSpace, mgSpaceTop,onPress, colorSpace, mgSpaceBottom, isNoPaddingBottom,bgColor ,sectionRef} = props
  const TouchableOpacityComponent: React.ComponentType<any> = onPress ? TouchableOpacity : View;

  return (
    <TouchableOpacityComponent 
    ref={sectionRef}
    onPress={onPress}
    style={[{
      paddingHorizontal: 12,
      paddingBottom:isNoPaddingBottom ? 0 : 12,
      backgroundColor:bgColor ? bgColor : ''
    }, styles]}>
      {children}
      {isSpace && <SpaceComponent height={1} styles={{ marginTop: mgSpaceTop ?? 0, marginBottom: mgSpaceBottom ?? 0 }} color={colorSpace ?? colors.gray7} />}
    </TouchableOpacityComponent>
  )
}
export default memo(SectionComponent);