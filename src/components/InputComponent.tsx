import { Button, KeyboardType, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native"
import React, { forwardRef, memo, ReactNode, useState } from "react"
import { TouchableOpacity } from "react-native"
import { EyeSlash } from "iconsax-react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from "../constrants/color"
import { globalStyles } from "../styles/globalStyles"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import TextComponent from "./TextComponent"
import SpaceComponent from "./SpaceComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import RowComponent from "./RowComponent"
interface Props {
  value: string,
  onChange: (val: string) => void,
  affix?: ReactNode,
  placeholder?: string,
  suffix?: ReactNode,
  isPassword?: boolean,
  allowClear?: boolean,
  type?: KeyboardType,
  onEnd?: () => void,
  disabled?: boolean,
  multiline?: boolean,
  numberOfLines?: number,
  styles?: StyleProp<ViewStyle>,
  title?:string,
  textColor?:string,
  bgColor?:string,
  borderColor?:string,
  colorTitle?:string,
  require?:boolean,
  onBlur?:()=>void,
  onFocus?:()=>void
}
//secureTextEntry chuyển thành ****
//ReactNode Có thẻ đóng thẻ mở ví dụ <Text />
//keyboardType gợi tý thay đổi bản phím
//autoCapitalize bỏ tự động viết 
//onEndEditing khi ngừng nhập
const InputComponent = forwardRef<any, Props>((props:Props,ref:any) => {
  const { value, onChange, affix, placeholder,onBlur,onFocus,colorTitle, suffix,require,borderColor,bgColor,allowClear, isPassword,title, styles, type, onEnd, disabled, multiline, numberOfLines,textColor } = props
  const [isShowPassword, setIsShowPassword] = useState(isPassword && isPassword)

  return (
    <View>
      {
        title && (
          <>
            <RowComponent>
              <TextComponent text={title} title size={14} color={colorTitle}/>
              {require && <>
                <SpaceComponent width={2}/>
                <TextComponent text={'*'} color="red" size={14}/>
              </>}
            </RowComponent>
            <SpaceComponent height={8} />
          </>
        )
      }
      <View style={[globalStyles.inputContainer, {
        alignItems: multiline ? 'flex-start' : 'center',backgroundColor: bgColor ?? colors.white, borderColor: borderColor ??  colors.gray3,
      }, styles]}>
        {affix && affix}
        <TextInput ref={ref} style={[globalStyles.input, globalStyles.text, { paddingHorizontal: affix || suffix ? 14 : 0 ,textAlignVertical:multiline ? 'top' : 'auto',color:textColor ?? colors.colorText}]}
          placeholder={placeholder ?? ''}
          multiline={multiline}
          onChangeText={val => onChange(val)}
          secureTextEntry={isShowPassword}
          value={value}
          placeholderTextColor={'#747688'}
          keyboardType={type ?? 'default'}
          autoCapitalize="none"
          onEndEditing={onEnd}
          editable={disabled}
          numberOfLines={numberOfLines}
          onBlur={onBlur}
          onFocus={onFocus}
          
          
        />
        {suffix && suffix}
        <TouchableOpacity onPress={isPassword ? () => setIsShowPassword(!isShowPassword) : () => onChange('')}>
          {isPassword ? (
            <FontAwesome name={isShowPassword ? 'eye-slash' : 'eye'} size={22} color={colors.gray} />
          ) : value && allowClear && <AntDesign  style={{ marginTop: multiline ? 4 : 0,backgroundColor:colors.gray4,borderRadius:100,padding:4 }} name="close" size={12} color={colors.white} />}
        </TouchableOpacity>
      </View>
    </View>
  )
})
export default memo(InputComponent);

