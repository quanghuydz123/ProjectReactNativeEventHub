import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React from "react"
import { Image } from "react-native"
import TextComponent from "./TextComponent"
import { colors } from "../constrants/color"
interface Props {
    photoUrl?: string,
    size?: number,
    colorBorderWidth?: string,
    index?: number,
    styles?: StyleProp<ViewStyle>,
    notBorderWidth?:boolean,
    bdRadius?:number,
    onPress?:()=>void
}
const AvatarItem = (props: Props) => {
    const { photoUrl, size, colorBorderWidth, index,styles,notBorderWidth,bdRadius,onPress} = props
    const ml = size ? -(size/2) : -12
    return (
        <TouchableOpacity
        onPress={onPress}
        style={[styles]}>
            {
                photoUrl ? <Image
                    source={{ uri: photoUrl }}
                    style={{
                        width: size ?? 24,
                        height: size ?? 24,
                        borderRadius: bdRadius ?? 100,
                        borderWidth: notBorderWidth ? 0 : 1,
                        borderColor: colorBorderWidth ?? colors.white,
                        marginLeft: (index && index !== 0) ? ml : 0,
                    }}
                /> : <View style={{
                    width: size ?? 24,
                    height: size ?? 24,
                    borderRadius: bdRadius ?? 100,
                    borderWidth: notBorderWidth ? 0 : 1,
                    borderColor: colorBorderWidth ?? colors.white,
                    marginLeft: (index && index !== 0) ? ml : 0,
                    backgroundColor:colors.gray,
                    justifyContent:'center',
                    alignItems:'center'
                }}><TextComponent title color={colors.white} size={size ? (size/2) : 12} text="H" /></View>
            }
        </TouchableOpacity>
    )
}
export default AvatarItem;