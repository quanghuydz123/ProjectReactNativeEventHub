import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
import TextComponent from "./TextComponent"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constrants/color"
import { fontFamilies } from "../constrants/fontFamilies"

interface Props {
    icon?: ReactNode,
    text: string,
    type?: 'primary' | 'text' | 'link',
    color?: string,
    styles?: StyleProp<ViewStyle>,
    textColor?: string,
    textStyles?: StyleProp<ViewStyle>,
    onPress?: () => void,
    iconFlex?: 'right' | 'left',
    textFont?: string,
    disable?:boolean,
}
const ButtonComponent = (props: Props) => {
    const {
        icon,
        text,
        type,
        color,
        styles,
        textColor,
        textStyles,
        iconFlex,
        onPress,
        textFont,
        disable
    } = props
    return (
        type === 'primary' ?
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    disabled={disable}
                    onPress={onPress}
                    style={[globalStyles.button, globalStyles.shadow, {
                        backgroundColor: color ? color : disable ? colors.gray3 : colors.primary,
                        marginBottom: 17,
                        width: '80%'

                    }, styles]}>
                    {icon && iconFlex === 'left' && icon}
                    <TextComponent text={text} color={textColor ?? colors.white}
                        styles={[{ marginLeft: icon ? 12 : 0, fontSize: 16,textAlign:'center'},textStyles]}
                        flex={icon && iconFlex === 'right' ? 1 : 0
                        }
                        font={textFont ?? fontFamilies.medium}
                    />
                    {icon && iconFlex === 'right' && icon}
                </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={onPress}>
                <TextComponent text={text} color={type === 'link' ? colors.link : colors.colorText} />
            </TouchableOpacity>
    )
}
export default ButtonComponent;