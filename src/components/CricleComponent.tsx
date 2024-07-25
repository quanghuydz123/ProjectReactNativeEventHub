import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
import { colors } from "../constrants/color"
import { Animated } from "react-native"
interface Props {
  size?: number,
  children: ReactNode,
  color?: string,
  onPress?: () => void,
  styles?: StyleProp<ViewStyle>,
  borderRadius?: number,
  featureIconAnimation?:any

}
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
const CricleComponent = (props: Props) => {
  const { size, children, color, onPress, styles, borderRadius,featureIconAnimation } = props
  const localStyle: StyleProp<ViewStyle> = {
    width: size ?? 40,
    height: size ?? 40,
    backgroundColor: color ?? colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius ?? 100
  }
  const TouchableOpacityComponent: React.ComponentType<any> = featureIconAnimation ? AnimatedTouchableOpacity : onPress ? TouchableOpacity : View;
  return (
    onPress ? <TouchableOpacityComponent  onPress={onPress} style={[localStyle, styles,featureIconAnimation]}>
      {children}
    </TouchableOpacityComponent> : <TouchableOpacityComponent style={[localStyle, styles,featureIconAnimation]}>{children}</TouchableOpacityComponent>
  )
}
export default CricleComponent;