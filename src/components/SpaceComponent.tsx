import { StyleProp, Text, View, ViewStyle } from "react-native"
import React from "react"
interface Props { // phải định nghĩa ra trước
    width?: any,
    height?: any,
    color?:string,
    styles?: StyleProp<ViewStyle>,

}
const SpaceComponent = (props: Props) => {
    const { width, height,color,styles } = props
    return <View style={[{
        width,
        height,
        backgroundColor:color,
    },styles]} />
}
export default SpaceComponent;