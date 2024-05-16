import { Button, Image, Switch, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { globalStyles } from "../../styles/globalStyles";
import { FolderMinus, Lock, Sms, User } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import { fontFamilies } from "../../constrants/fontFamilies";
import SocialLogin from "./components/SocialLogin";
import { LoadingModal } from "../../../modals";
import authenticationAPI from "../../apis/authApi";
import { Validate } from "../../utils/validate";
import { useDispatch } from "react-redux";
import { addAuth } from "../../reduxs/reducers/authReducers";
import AsyncStorage from "@react-native-async-storage/async-storage";
const initValue = {
  username: '',
  email: '',
  password: '',
  comfirmPassword: ''
}
const SignUpScreen = ({ navigation }: any) => {
  const [values, setValues] = useState(initValue)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useDispatch()
  //ẩn thông báo lổi
  useEffect(() => {
    if (values.email || values.password) {
      setErrorMessage('')
    }
  }, [values.email, values.comfirmPassword, values.password, values.username])
  const handleOnchangeValue = (key: string, value: string) => {
    const data: any = { ...values }
    data[`${key}`] = value
    setValues(data)
  }
  const handleRegister = async () => {
    const { email, password, comfirmPassword, username } = values
    if (email && password && comfirmPassword && username) 
      {
      const emailValidation = Validate.email(email)
      const passwordValidation = Validate.Password(password)
      if (emailValidation && passwordValidation) {
        setErrorMessage('')
        setIsLoading(true)
        try {
          const res = await authenticationAPI.HandleAuthentication('/register', values, 'post')
          //nên kiểm tra các lỗi trước khi thêm vào redux (sau này làm)
          console.log("abc",res)
          dispatch(addAuth(res.data))
          await AsyncStorage.setItem('auth',JSON.stringify(res.data))
          setIsLoading(true)
        }
        catch (error) {
          console.log("error", error)
          setIsLoading(true)
        }
      } else {
        setErrorMessage('Hãy nhập đúng định dạng email')
      }

    } else {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin!')
    }
  }
  return (
    <ContainerComponent isScroll back>
      <SectionComponent>
        <TextComponent text={'Đăng ký'} size={24} font={fontFamilies.medium} />
        <SpaceComponent height={21} />
        <InputComponent value={values.username} onChange={(val) => handleOnchangeValue('username', val)}
          placeholder={'Tên người dùng'}
          affix={<User size={22} color={colors.gray} />}
        />

        <InputComponent value={values.email} onChange={(val) => handleOnchangeValue('email', val)}
          placeholder={'abc@gmail.com'}
          affix={<Sms size={22} color={colors.gray} />}
        />

        <InputComponent value={values.password} onChange={(val) => handleOnchangeValue('password', val)}
          placeholder={'Mật khẩu'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
        />

        <InputComponent value={values.comfirmPassword} onChange={(val) => handleOnchangeValue('comfirmPassword', val)}
          placeholder={'Nhập lại mật khẩu'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
        />
      </SectionComponent>
      {
        errorMessage &&
        <SectionComponent>
          <TextComponent text={errorMessage} color={colors.danger} />
        </SectionComponent>
      }
      <SectionComponent>
        <ButtonComponent onPress={handleRegister} text={'Đăng ký'} type={'primary'} />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn đã có tài khoản?" />
          <ButtonComponent text="Đăng nhập" type="link" onPress={() => navigation.navigate('LoginScreen')} />
        </RowComponent>
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  )
}
export default SignUpScreen;