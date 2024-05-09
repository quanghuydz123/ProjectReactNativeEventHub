import { Text, View } from "react-native"
import React from "react"
interface Props { // phải định nghĩa ra trước
    width?: number,
    height?: number
}
const SpaceComponent = (props: Props) => {
    const { width, height } = props
    return <View style={{
        width,
        height
    }} />
}
export default SpaceComponent;