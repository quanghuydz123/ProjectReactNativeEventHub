import { Button, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo, ReactNode } from "react"
import TextComponent from "./TextComponent"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constrants/color"
import { fontFamilies } from "../constrants/fontFamilies"
import { AsyncStorageStatic } from "@react-native-async-storage/async-storage"
import SpaceComponent from "./SpaceComponent"
import { useSelector } from "react-redux"
import { authSelector } from "../reduxs/reducers/authReducers"
import { useNavigation } from "@react-navigation/native"

interface Props {
    icon?: ReactNode,
    text?: string,
    type?: 'primary' | 'text' | 'link',
    color?: string,
    styles?: StyleProp<ViewStyle>,
    textColor?: string,
    textStyles?: StyleProp<ViewStyle>,
    onPress?: () => void,
    iconFlex?: 'right' | 'left',
    textFont?: string,
    disable?: boolean,
    numberOfLineText?:number,
    textSize?:number,
    width?:any,
    alignItems?:'center' | 'flex-start' | 'flex-end',
    mrBottom?:number,
    isCheckLogin?:boolean,
    colorDisable?:string

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
        disable,
        numberOfLineText,
        textSize,
        width,
        alignItems,
        mrBottom,
        isCheckLogin,
        colorDisable
    } = props
    const auth = useSelector(authSelector)
    
    // const onPessButton = ()=>{
    //     if(isCheckLogin){
    //         if(!auth.accesstoken){
    //             const navigation:any = useNavigation()
    //             navigation.navigate('LoginScreen')
    //             return false
    //           }
    //     }
    //     if (onPress) {
    //         onPress();
    //     }
    // }
    return (
        type === 'primary' ?
            <View style={{ alignItems: alignItems ??  'center' }}>
                
                <TouchableOpacity
                    disabled={disable}
                    onPress={onPress}
                    style={[globalStyles.button, globalStyles.shadow, {
                        backgroundColor: color ? color : disable ? colorDisable ? colorDisable : colors.black  : colors.primary,
                        marginBottom: mrBottom ?? 17,
                        width: width ?? '90%',
                        paddingVertical:disable ? 10 : 10,
                        borderWidth:disable ? 1 : 0,
                        borderColor:disable ? colors.gray4 : ''
                    }, styles]}>
                    {icon && iconFlex === 'left' && icon}
                    {
                        text && <TextComponent size={textSize ?? 14} numberOfLine={numberOfLineText} text={text} color={textColor ??( disable ? colors.gray4 : colors.white)}
                            styles={[{ marginLeft: icon ? 8 : 0, textAlign: 'center' }, textStyles]}
                            flex={icon && iconFlex === 'right' ? 1 : 0
                            }
                            font={textFont ?? fontFamilies.medium}
                        />
                    }
                    {icon && iconFlex === 'right' && icon}
                </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={onPress} disabled={disable} style={[
                {
                    flexDirection:'row',
                    alignItems:'center'

                },styles]} >
                {icon && iconFlex === 'left' && icon}

                {
                    text && <TextComponent size={textSize} text={text} numberOfLine={numberOfLineText} 
                    font={textFont ?? fontFamilies.medium} 
                    color={textColor ?? (disable ? colors.gray4 : colors.link)} 
                    />
                }
                {icon && iconFlex === 'right' && <SpaceComponent width={4}/>}
                {icon && iconFlex === 'right' && icon}

            </TouchableOpacity>
    )
}
export default memo(ButtonComponent);