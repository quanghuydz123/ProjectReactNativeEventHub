import { Button, StyleSheet, Text, TextInput, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { ArrowLeft, ArrowRight, Lock, Sms } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import { globalStyles } from "../../styles/globalStyles";
import authenticationAPI from "../../apis/authApi";
import { Validate } from "../../utils/validate";
import { fontFamilies } from "../../constrants/fontFamilies";
import { LoadingModal } from "../../../modals";

const ForgotPasswordScreen = ({navigation}:any) => {
  const [email, setEmail] = useState('')
  const [emailSendVerifition, setEmailSendVerifition] = useState('')
  const [isCheckValidate, setIsCheckValidate] = useState(true)
  const [currentCode, setCurrentCode] = useState('')
  const [time, setTime] = useState<number>(60)
  const [isCheckSendVerification, setIsCheckSendVerification] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [codeValues, setCodeValues] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [comfirmPassword, setComfirmPassword] = useState('')
  const ref1 = useRef<any>()
  const ref2 = useRef<any>()
  const ref3 = useRef<any>()
  const ref4 = useRef<any>()
  const [newCode, setNewCode] = useState('')
  const [isCheckVerification, setIsCheckVerification] = useState(false)
  useEffect(() => {// xử lý check người dùng nhập mã xác nhận
    if (isCheckVerification) 
    {
      setIsCheckVerification(false)
      setCodeValues([])
      setNewCode('')
      setCurrentCode('')
      setTime(0)
    }
    if (email) {
      setIsCheckValidate(false)
    } else {
      setIsCheckValidate(true)
    }
  }, [email])

  useEffect(() => {//xử lý hết hạn mã xác nhận
    if (time && isCheckSendVerification) {
      if (time > 0) {
        const interval = setInterval(() => {//chạy sau mỗi 1s
          setTime(prev => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
      }
    }
  }, [time, isCheckSendVerification])

  const handleOnChange = (val: string) => {
    setEmail(val)
    setErrorMessage('')
  }
  const handleSendVerification = async () => {
    // if(Validate.email(email)){
    //   setIsCheckSendVerification(true)
    //   setTime(60)
    // }else{
    //   setErrorMessage('Hãy nhập đúng định dạng gmail')
    // }
    setCodeValues([])
    setNewCode('')
    setErrorMessage('')
    const api = '/verificationForgotPassword'
    setIsLoading(true)
    try {
      const res: any = await authenticationAPI.HandleAuthentication(api, { email }, 'post')
      setCurrentCode(res?.data?.code)
      setTime(60)
      setEmailSendVerifition(email)
      setIsCheckSendVerification(true)
      ref1.current.focus()
      setIsLoading(false)
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 402) {
        setErrorMessage(errorMessage.message)
      } else {
        setErrorMessage('Gửi mã xác minh thất bại')
      }
      setIsLoading(false)
    }
  }
  useEffect(() => {//Xử lý chuyển mã code từ mảng sang chuỗi
    let code = ''
    codeValues.forEach((val) => code += val)
    setNewCode(code)
  }, [codeValues])

  const handleOnchangeCode = (val: string, index: number) => {
    const data = [...codeValues]
    data[index] = val

    setCodeValues(data)
  }

  useEffect(() => {//so sanh xem người dùng nhập đúng mã xác nhận không
    if (parseInt(newCode) !== parseInt(currentCode)) {
      setIsCheckVerification(false)
    } else {
      if (time > 0) {
        setIsCheckVerification(true)
      } else {
        setErrorMessage('Mã xác thực đã hết hạn vui lòng gửi lại')
      }
    }
  }, [newCode, currentCode])

  const handleOnchangeValue = (key: string, value: string) => {
    if (key === 'password') {
      setPassword(value)
    } else if (key === 'comfirmPassword') {
      setComfirmPassword(value)
    }
  }

  const handleOnChangePassword = async () => {
    const api = '/forgotPassword'
    setIsLoading(true)
    try {
      const res: any = await authenticationAPI.HandleAuthentication(api, { email,password,comfirmPassword }, 'post')
      if(res && res.status ===200){
        navigation.goBack()
      }
      setIsLoading(false)
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 401) {
        setErrorMessage(errorMessage.message)
      }else if(errorMessage.statusCode === 400){
        setErrorMessage(errorMessage.message)
      }
      else {
        setErrorMessage('Đổi mật khẩu thất bại')
      }
      setIsLoading(false)
    }
  }
  return (
    <ContainerComponent back isImageBackgound>
      <SectionComponent>
        <TextComponent text="Quên mật khẩu" title />
        <SpaceComponent height={12} />
        <TextComponent text="Hãy nhập địa chỉ email mà bạn muốn đổi mật khẩu" />
        <SpaceComponent height={26} />
        <InputComponent value={email} onChange={(val) => handleOnChange(val)}
          placeholder={'abc@gmail.com'}
          affix={<Sms size={22} color={colors.gray}
          />}
        />
        {
          (isCheckSendVerification) && (
            !isCheckVerification && (
              <SectionComponent>
                <RowComponent justify="space-around">
                  <TextInput value={codeValues[0]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 0), val && ref2.current.focus() }} placeholder="-" ref={ref1} />
                  <TextInput value={codeValues[1]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 1), val && ref3.current.focus() }} placeholder="-" ref={ref2} />
                  <TextInput value={codeValues[2]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 2), val && ref4.current.focus() }} placeholder="-" ref={ref3} />
                  <TextInput value={codeValues[3]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 3) }} placeholder="-" ref={ref4} />
                </RowComponent>
              </SectionComponent>
            )
          )
        }
        {
          isCheckVerification && (
            <>
              <InputComponent value={password} onChange={(val) => handleOnchangeValue('password', val)}
                placeholder={'Mật khẩu'}
                isPassword
                affix={<Lock size={22} color={colors.gray} />}

              />

              <InputComponent value={comfirmPassword} onChange={(val) => handleOnchangeValue('comfirmPassword', val)}
                placeholder={'Nhập lại mật khẩu'}
                isPassword
                affix={<Lock size={22} color={colors.gray} />}

              />

              <ButtonComponent disable={isCheckValidate} text={'Đổi mật khẩu'} type={'primary'} onPress={handleOnChangePassword} />
            </>
          )

        }
      </SectionComponent>

      {
        errorMessage && <SectionComponent><TextComponent text={errorMessage} color={colors.danger} styles={{ textAlign: 'center' }} /></SectionComponent>
      }
      {
        !isCheckSendVerification && (
          <SectionComponent>
            <ButtonComponent disable={isCheckValidate} text={'Gửi'} type={'primary'} icon={<View style={[globalStyles.iconContainer, { backgroundColor: isCheckValidate ? colors.gray2 : colors.primary }]}><ArrowRight
              size={18}
              color={colors.white}
            /></View>}
              iconFlex="right"
              onPress={handleSendVerification}
            />
          </SectionComponent>
        )
      }
      <SectionComponent>
        {
          (time > 0 && isCheckSendVerification) ?
            (
              !isCheckVerification && (
                <RowComponent justify="center">
                  <TextComponent text="Code hết hiệu lực trong " />
                  <TextComponent text={`00:${time}`} color={colors.link} />
                </RowComponent>
              )
            )
            :
            isCheckSendVerification && (
              !isCheckVerification && (
                <RowComponent justify="center">
                  <ButtonComponent type="link" text="Gửi lại mã xác thực" onPress={handleSendVerification} />
                </RowComponent>
              )
            )
        }
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  )
}

export default ForgotPasswordScreen;

const style = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray2,
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: 'center'
  }
})