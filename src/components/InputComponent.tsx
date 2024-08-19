import { Button, KeyboardType, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native"
import React, { memo, ReactNode, useState } from "react"
import { TouchableOpacity } from "react-native"
import { EyeSlash } from "iconsax-react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from "../constrants/color"
import { globalStyles } from "../styles/globalStyles"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import TextComponent from "./TextComponent"
import SpaceComponent from "./SpaceComponent"
import { fontFamilies } from "../constrants/fontFamilies"
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
  title?:string
}
//secureTextEntry chuyển thành ****
//ReactNode Có thẻ đóng thẻ mở ví dụ <Text />
//keyboardType gợi tý thay đổi bản phím
//autoCapitalize bỏ tự động viết 
//onEndEditing khi ngừng nhập
const InputComponent = (props: Props) => {
  const { value, onChange, affix, placeholder, suffix, allowClear, isPassword,title, styles, type, onEnd, disabled, multiline, numberOfLines } = props
  const [isShowPassword, setIsShowPassword] = useState(isPassword && isPassword)

  return (
    <View>
      {
        title && (
          <>
            <TextComponent text={title} title size={14} />
            <SpaceComponent height={8} />
          </>
        )
      }
      <View style={[globalStyles.inputContainer, {
        alignItems: multiline ? 'flex-start' : 'center'
      }, styles]}>
        {affix && affix}
        <TextInput style={[globalStyles.input, globalStyles.text, { paddingHorizontal: affix || suffix ? 14 : 0 ,textAlignVertical:multiline ? 'top' : 'auto'}]}
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
          
        />
        {suffix && suffix}
        <TouchableOpacity onPress={isPassword ? () => setIsShowPassword(!isShowPassword) : () => onChange('')}>
          {isPassword ? (
            <FontAwesome name={isShowPassword ? 'eye-slash' : 'eye'} size={22} color={colors.gray} />
          ) : value && allowClear && <AntDesign style={{ marginTop: multiline ? 4 : 0,backgroundColor:colors.gray2,borderRadius:100,padding:4 }} name="close" size={12} color={colors.white} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default memo(InputComponent);

