import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo } from "react"
import { Image } from "react-native"
import TextComponent from "./TextComponent"
import { colors } from "../constrants/color"
import CricleComponent from "./CricleComponent"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
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
            case 'inviteEvent':
                content = <CricleComponent styles={{ position: 'absolute', bottom: -7, right: 0, borderWidth: 0.5, borderColor: colors.gray5 }} size={26} color={colors.orange}>
                    <Entypo name="calendar" size={14} color={colors.white} />
                </CricleComponent>
                break
            case 'follow':
                content = <CricleComponent styles={{ position: 'absolute', bottom: -7, right: 0, borderWidth: 0.5, borderColor: colors.gray5 }} size={26} color={colors.blue}>
                    <FontAwesome5 name="user-alt" size={12} color={colors.white} />
                </CricleComponent>
                break
            case 'rejectFollow':
                content = <CricleComponent styles={{ position: 'absolute', bottom: -7, right: 0, borderWidth: 0.5, borderColor: colors.gray5 }} size={26} color={colors.danger2}>
                    <FontAwesome5 name="user-alt" size={12} color={colors.white} />
                </CricleComponent>
                break
            case 'allowFollow':
                content = <CricleComponent styles={{ position: 'absolute', bottom: -7, right: 0, borderWidth: 0.5, borderColor: colors.gray5 }} size={26} color={colors.green}>
                    <FontAwesome5 name="user-alt" size={12} color={colors.white} />
                </CricleComponent>
                break
            default:
                content = <CricleComponent styles={{ position: 'absolute', bottom: 0, right: 0, borderWidth: 0.5, borderColor: colors.white }} size={26} color={colors.gray5}>
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
                /> : <Image
                    source={{ uri: 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745' }}
                    style={{
                        width: size ?? 24,
                        height: size ?? 24,
                        borderRadius: bdRadius ?? 100,
                        borderWidth: notBorderWidth ? 0 : 1,
                        borderColor: colorBorderWidth ?? colors.white,
                        marginLeft: (index && index !== 0) ? ml : 0,
                    }}
                />
            }
            {
                isShowIconAbsolute && renderIconAbsolute(typeIcon)
            }
        </TouchableOpacityComponent>
    )
}
export default memo(AvatarItem)