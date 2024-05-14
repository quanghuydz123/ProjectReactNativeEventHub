import { Button, Image, Switch, Text, View } from "react-native"
import React, { useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { globalStyles } from "../../styles/globalStyles";
import { FolderMinus, Lock, Sms, User } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import { fontFamilies } from "../../constrants/fontFamilies";
import SocialLogin from "./components/SocialLogin";
const initValue = {
  username:'',
  email:'',
  password:'',
  comfirmPassword:''
}
const SignUpScreen = ({ navigation }: any) => {
  const [values,setValues] = useState(initValue)

  const handleOnchangeValue = (key:string, value:string)=>{
    const data:any = {...values}
    data[`${key}`] = value
    setValues(data)
  }
  return (
    <ContainerComponent isScroll back>
      <SectionComponent>
        <TextComponent text={'Đăng ký'} size={24} font={fontFamilies.medium} />
        <SpaceComponent height={21} />
        <InputComponent value={values.username} onChange={(val) => handleOnchangeValue('username',val)}
          placeholder={'Tên người dùng'}
          affix={<User size={22} color={colors.gray} />}
        />

        <InputComponent value={values.email} onChange={(val) => handleOnchangeValue('email',val)}
          placeholder={'abc@gmail.com'}
          affix={<Sms size={22} color={colors.gray} />}
        />

        <InputComponent value={values.password} onChange={(val) => handleOnchangeValue('password',val)}
          placeholder={'Mật khẩu'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
        />

      <InputComponent value={values.comfirmPassword} onChange={(val) => handleOnchangeValue('comfirmPassword',val)}
          placeholder={'Nhập lại mật khẩu'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
        />

      </SectionComponent>
      <SectionComponent>
        <ButtonComponent text={'Đăng ký'} type={'primary'} />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn đã có tài khoản?" />
          <ButtonComponent text="Đăng nhập" type="link" onPress={() => navigation.navigate('LoginScreen')} />
        </RowComponent>
      </SectionComponent>

    </ContainerComponent>
  )
}
export default SignUpScreen;