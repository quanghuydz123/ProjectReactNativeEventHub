import { Button, StyleProp, Text, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
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
  isNoPaddingBottom?: boolean

}
const SectionComponent = (props: Props) => {

  const { children, styles, isSpace, mgSpaceTop, colorSpace, mgSpaceBottom, isNoPaddingBottom } = props
  return (
    <View style={[{
      paddingHorizontal: 10,
      paddingBottom:isNoPaddingBottom ? 0 : 12
    }, styles]}>
      {children}
      {isSpace && <SpaceComponent height={1} styles={{ marginTop: mgSpaceTop ?? 0, marginBottom: mgSpaceBottom ?? 0 }} color={colorSpace ?? colors.gray7} />}
    </View>
  )
}
export default SectionComponent;