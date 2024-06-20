import { Button, StyleProp, Text, View, ViewStyle } from "react-native"
import React from "react"
import { Image } from "react-native"
import TextComponent from "./TextComponent"
import { colors } from "../constrants/color"
interface Props {
    photoUrl?: string,
    size?: number,
    colorBorderWidth?: string,
    index: number,
    styles?: StyleProp<ViewStyle>,
}
const AvatarItem = (props: Props) => {
    const { photoUrl, size, colorBorderWidth, index } = props
    const ml = size ? -(size/2) : -12
    return (
        <View>
            {
                photoUrl ? <Image
                    source={{ uri: photoUrl }}
                    style={{
                        width: size ?? 24,
                        height: size ?? 24,
                        borderRadius: 100,
                        borderWidth: 1,
                        borderColor: colorBorderWidth ?? colors.white,
                        marginLeft: index !== 0 ? ml : 0,
                    }}
                /> : <View style={{
                    width: size ?? 24,
                    height: size ?? 24,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: colorBorderWidth ?? colors.white,
                    marginLeft: index !== 0 ? -12 : 0,
                    backgroundColor:colors.gray,
                    justifyContent:'center',
                    alignItems:'center'
                }}><TextComponent title color={colors.white} size={size ? 16 : 12} text="H" /></View>
            }
        </View>
    )
}
export default AvatarItem;