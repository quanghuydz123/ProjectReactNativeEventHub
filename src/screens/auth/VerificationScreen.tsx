import { Button, StyleSheet, Text, TextInput, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components"
import { colors } from "../../constrants/color"
import { fontFamilies } from "../../constrants/fontFamilies"
import { ArrowRight } from "iconsax-react-native"
import { globalStyles } from "../../styles/globalStyles"
import authenticationAPI from "../../apis/authApi"
import { LoadingModal } from "../../../modals"
import { useDispatch } from "react-redux"
import { addAuth } from "../../reduxs/reducers/authReducers"
import AsyncStorage from "@react-native-async-storage/async-storage"

const VerificationScreen = ({ navigation, route }: any) => {
  const { code, email, password, username } = route.params //truyền bên navigate
  const [codeValues, setCodeValues] = useState<string[]>([])
  const [newCode, setNewCode] = useState('')
  const [time, setTime] = useState<number>(60)
  const [isLoading, setIsLoading] = useState(false)
  const [currentCode, setCurrentCode] = useState(code)
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useDispatch()
  const [checkRepeatSendVerification, setCheckRepeatSendVerification] = useState(true)
  const ref1 = useRef<any>()
  const ref2 = useRef<any>()
  const ref3 = useRef<any>()
  const ref4 = useRef<any>()

  useEffect(() => {//khi người dùng mới vào thì select đầu tiên ngay ô này
    ref1.current.focus()
  }, [])

  useEffect(() => {
    if (time > 0) {
      const interval = setInterval(() => {//chạy sau mỗi 1s
        setTime(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [time])

  useEffect(() => {
    let code = ''
    codeValues.forEach((val) => code += val)
    setNewCode(code)
  }, [codeValues])

  const handleOnchangeCode = (val: string, index: number) => {
    const data = [...codeValues]
    data[index] = val

    setCodeValues(data)
  }
  const handleSendVerification = async () => {
    setCodeValues([])
    setNewCode('')
    setErrorMessage('')
    const api = '/verification'
    setIsLoading(true)
    try {
      const res: any = await authenticationAPI.HandleAuthentication(api, { email }, 'post')
      console.log("res", res)
      setTime(60)
      setCurrentCode(res?.data?.code)
      setIsLoading(false)

    } catch (error) {
      console.log(`Gửi mã xác thực không thành công ${error}`)
      setIsLoading(false)
    }
  }
  const handleVerification = async () => {
    setErrorMessage('')
    if (time > 0) {
      if (parseInt(newCode) !== parseInt(currentCode)) {
        setErrorMessage("Mã xác thực không chính xác")
      } else {
        const api = '/register'
        const data = {
          email, password, username: username ?? 'Người dùng', isAdmin: false
        }
        try {
          const res = await authenticationAPI.HandleAuthentication(api, data, 'post')
          dispatch(addAuth(res.data))
          await AsyncStorage.setItem('auth', JSON.stringify(res.data))
        } catch (error) {
          setErrorMessage("Đăng ký thất bại")
          console.log(`Đăng ký thất bại ${error}`)
        }
      }
    } else {
      setErrorMessage('Mã xác thực đã hết hạn vui lòng gửi lại mã xác nhận !!')
    }
  }
  return (
    <ContainerComponent back isImageBackgound isScroll>
      <SectionComponent>
        <TextComponent text="Xác minh" title />
        <SpaceComponent height={12} />
        <TextComponent text={`Chúng tôi sẽ gửi mã xác nhận vào email ${email.replace(/.{1,5/, (m: any) => '*'.repeat(m.length))}`} />
        <SpaceComponent height={26} />
        <RowComponent justify="space-around">
          <TextInput value={codeValues[0]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 0), val && ref2.current.focus() }} placeholder="-" ref={ref1} />
          <TextInput value={codeValues[1]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 1), val && ref3.current.focus() }} placeholder="-" ref={ref2} />
          <TextInput value={codeValues[2]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 2), val && ref4.current.focus() }} placeholder="-" ref={ref3} />
          <TextInput value={codeValues[3]} keyboardType="number-pad" style={[style.input]} maxLength={1} onChangeText={(val) => { handleOnchangeCode(val, 3) }} placeholder="-" ref={ref4} />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{ marginTop: 40 }}>
        <ButtonComponent
          disable={newCode.length === 4 ? false : true}
          type="primary"
          text="Tiếp tục"
          iconFlex="right"
          onPress={handleVerification}
          styles={{ marginBottom: 0 }}
          icon={<View style={[globalStyles.iconContainer, { backgroundColor: newCode.length !== 4 ? colors.gray2 : colors.primary }]}><ArrowRight color={colors.white} size={18} /></View>}
        />
      </SectionComponent>
      {
        errorMessage && <SectionComponent><TextComponent text={errorMessage} color={colors.danger} styles={{ textAlign: 'center' }} /></SectionComponent>
      }
      <SectionComponent>
        {
          time > 0 ?
            <RowComponent justify="center">
              <TextComponent text="Code hết hiệu lực trong " />
              <TextComponent text={`00:${time}`} color={colors.link} />
            </RowComponent>
            :
            <RowComponent justify="center">
              <ButtonComponent type="link" text="Gửi lại mã xác thực" onPress={handleSendVerification} />
            </RowComponent>
        }
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  )
}
export default VerificationScreen;


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