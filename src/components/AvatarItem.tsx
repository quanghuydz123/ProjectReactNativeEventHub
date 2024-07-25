import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo } from "react"
import { Image } from "react-native"
import TextComponent from "./TextComponent"
import { colors } from "../constrants/color"
import CricleComponent from "./CricleComponent"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
interface Props {
    photoUrl?: string,
    size?: number,
    colorBorderWidth?: string,
    index?: number,
    styles?: StyleProp<ViewStyle>,
    notBorderWidth?: boolean,
    bdRadius?: number,
    onPress?: () => void,
    isShowIconAbsolute?: boolean,
    typeIcon?: 'inviteEvent' | 'message' | 'like' | 'follow' | 'rejectFollow' | 'allowFollow' | 'other'
}
const AvatarItem = (props: Props) => {
    const { photoUrl, size, colorBorderWidth, index, styles, notBorderWidth, bdRadius, onPress, isShowIconAbsolute, typeIcon } = props
    const ml = size ? -(size / 2) : -12
    const TouchableOpacityComponent: React.ComponentType<any> = onPress ? TouchableOpacity : View;
    const renderIconAbsolute = (type?: 'inviteEvent' | 'message' | 'like' | 'follow' | 'rejectFollow' | 'allowFollow' | 'other') => {
        let content = <></>
        switch (type) {
            case 'follow':
                content = <CricleComponent styles={{ position: 'absolute', bottom: 0, right: 0, borderWidth: 1, borderColor: colors.white }} size={24} color={colors.gray5}>
                    <MaterialIcons name="add-a-photo" size={16} color={colors.gray} />
                </CricleComponent>
                break
            default:
                content = <CricleComponent styles={{ position: 'absolute', bottom: 0, right: 0, borderWidth: 1, borderColor: colors.white }} size={24} color={colors.gray5}>
                    <MaterialIcons name="add-a-photo" size={16} color={colors.gray} />
                </CricleComponent>
                break

        }
        return content
    }
    return (
        <TouchableOpacityComponent
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
                    backgroundColor: colors.gray,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><TextComponent title color={colors.white} size={size ? (size / 2) : 12} text="H" /></View>
            }
            {
                isShowIconAbsolute && renderIconAbsolute(typeIcon)
            }
        </TouchableOpacityComponent>
    )
}
export default memo(AvatarItem)