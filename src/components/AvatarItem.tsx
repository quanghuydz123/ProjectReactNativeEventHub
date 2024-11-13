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
    borderWidth?: number,
    bdRadius?: number,
    onPress?: () => void,
    isShowIconAbsolute?: boolean,
    typeIcon?: 'inviteEvent' | 'message' | 'like' | 'follow' | 'rejectFollow' | 'allowFollow' | 'other',
    textName?:string,
    bgColor?:string,
    sizeName?:number,
    textColor?:string
}
const AvatarItem = (props: Props) => {
    const { photoUrl, size, colorBorderWidth, index,textColor, styles, borderWidth,bgColor, bdRadius,sizeName, onPress,textName, isShowIconAbsolute, typeIcon } = props
    const ml = size ? -(size / 2)+4 : -12
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
        <View style={textName ? {justifyContent:'center',alignItems:'center'} : {}}>
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
                            borderWidth: borderWidth ?? 1,
                            borderColor: colorBorderWidth ?? colors.white,
                            marginLeft: (index && index !== 0) ? ml : 0,
                            backgroundColor:bgColor
                        }}
                    /> : <Image
                        source={{ uri: 'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg' }}
                        style={{
                            width: size ?? 24,
                            height: size ?? 24,
                            borderRadius: bdRadius ?? 100,
                            borderWidth: borderWidth ?? 1,
                            borderColor: colorBorderWidth ?? colors.white,
                            marginLeft: (index && index !== 0) ? ml : 0,
                        }}
                    />
                }
                {
                    isShowIconAbsolute && renderIconAbsolute(typeIcon)
                }
            </TouchableOpacityComponent>
            {textName && <TextComponent styles={{maxWidth:200}} color={textColor} numberOfLine={1}  text={textName} title size={sizeName ?? 12} textAlign="center"/>}
        </View>
    )
}
export default memo(AvatarItem)