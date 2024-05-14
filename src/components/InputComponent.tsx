import { Button, KeyboardType, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"
import React, { ReactNode, useState } from "react"
import { TouchableOpacity } from "react-native"
import { EyeSlash } from "iconsax-react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from "../constrants/color"
import { globalStyles } from "../styles/globalStyles"
import FontAwesome from "react-native-vector-icons/FontAwesome"
interface Props {
  value: string,
  onChange: (val: string) => void,
  affix?: ReactNode,
  placeholder?: string,
  suffix?: ReactNode,
  isPassword?: boolean,
  allowClear?: boolean,
  type?: KeyboardType

}
//secureTextEntry chuyển thành ****
//ReactNode Có thẻ đóng thẻ mở ví dụ <Text />
//keyboardType gợi tý thay đổi bản phím
const InputComponent = (props: Props) => {
  const { value, onChange, affix, placeholder, suffix, allowClear, isPassword, type } = props
  const [isShowPassword, setIsShowPassword] = useState(isPassword && isPassword)

  return (
    <View style={[styles.inputContainer]}>
      {affix && affix}
      <TextInput style={[styles.input, globalStyles.text]}
        placeholder={placeholder ?? ''}
        onChangeText={val => onChange(val)}
        secureTextEntry={isShowPassword}
        value={value}
        placeholderTextColor={'#747688'}
        keyboardType={type ?? 'default'}
      />
      {suffix && suffix}
      <TouchableOpacity onPress={isPassword ? () => setIsShowPassword(!isShowPassword) : () => onChange('')}>
        {isPassword ? (
          <FontAwesome name={isShowPassword ? 'eye-slash' : 'eye'} size={22} color={colors.gray} />
        ) : value && allowClear && <AntDesign name="close" size={22} color={colors.colorText} />}
      </TouchableOpacity>
    </View>
  )
}
export default InputComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray3,
    width: '100%',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    marginBottom: 19
  },
  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    paddingHorizontal: 14,

  }
})