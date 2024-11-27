import { Alert, Button, Image, Switch, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { globalStyles } from "../../styles/globalStyles";
import { FolderMinus, Lock, Sms } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import { fontFamilies } from "../../constrants/fontFamilies";
import SocialLogin from "./components/SocialLogin";
import authenticationAPI from "../../apis/authApi";
import { Validate } from "../../utils/validate";
import { useDispatch } from "react-redux";
import { addAuth } from "../../reduxs/reducers/authReducers";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { LoadingModal } from "../../../modals";
import { EventHubLogo } from "../../assets/svgs";
import { appInfo } from "../../constrants/appInfo";
import { apis } from "../../constrants/apis";
import { ToastMessaging } from "../../utils/showToast";
import { HandleNotification } from "../../utils/handleNotification";

const LoginScreen = ({ navigation,route }: any) => {
  const { emailRoute, passwordRoute, status }:{ emailRoute: string, passwordRoute: string, status: number } = route.params || {}
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRemember, setIsReMember] = useState(true)
  const [errorMessage,setErrorMessage] = useState('')
  const { getItem } = useAsyncStorage('auth')

  const [isLoading,setIsLoading] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    if(emailRoute && passwordRoute && status === 200){ //xử lý người dùng đăng ký tài khoản thành công
      setEmail(emailRoute)
      setPassword(passwordRoute)
      ToastMessaging.Success({message:'Đăng ký thành công hãy đăng nhập đi nào',visibilityTime:2000})
    }
  }, [route])
  useEffect(()=>{
    saveEmail()
  },[])
  const saveEmail = async () => {
    const res:any = await getItem()
    const resParse = JSON.parse(res)
    res && (setEmail(resParse?.email) , setPassword(resParse?.password))
  }
  useEffect(()=>{
    setErrorMessage('')
  },[email,password])
  const handleLogin = async () => {
    const emailValidation = Validate.email(email)
    if(email && password){
      if (emailValidation) {
        setIsLoading(true)
        try {
          const res:any = await authenticationAPI.HandleAuthentication(apis.auth.login(), { email, password }, 'post');

          // if (isRemember) {
          //   await AsyncStorage.setItem('isRemember', 'true')
          //   await AsyncStorage.setItem('auth', JSON.stringify({...res.data,loginMethod:'account'}))
          //   await AsyncStorage.setItem('password', password)
          // } else {
          //   await AsyncStorage.setItem('isRemember', 'false')
          //   await AsyncStorage.setItem('auth', JSON.stringify({...res.data,loginMethod:'account'}))
          // }
          if(res && res.status===200){
            await AsyncStorage.setItem('auth', JSON.stringify({...res.data,loginMethod:'account'}))
            dispatch(addAuth({...res.data,loginMethod:'account'}))
            HandleNotification.checkNotifitionPersion()
            navigation.goBack()
          }
          setIsLoading(false)
        } catch (error:any) {
          setIsLoading(false)
          const errorMessage = JSON.parse(error.message)
          if(errorMessage.statusCode === 403){
            setErrorMessage(errorMessage.message)
          }else{
            setErrorMessage('Đăng nhập thất bại')
          }
        }
      }
      else {
        setErrorMessage('Email không đúng dịnh dạng!!!')
      }
    }
    else {
      setErrorMessage('Hãy nhập đầy đủ thông tin')
    }
    

  }
  return (
    <ContainerComponent isScroll back title={'Đăng nhập'}>
      <SectionComponent styles={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
        <EventHubLogo width={appInfo.sizes.WIDTH*0.8}/>
        <SpaceComponent height={16}/>
      </SectionComponent>
      <SectionComponent>
        <TextComponent text={'Đăng nhập'} size={24} font={fontFamilies.medium} />
        <SpaceComponent height={21} />
        <InputComponent value={email} onChange={(val) => setEmail(val)}
          placeholder={'abc@gmail.com'}
          affix={<Sms size={22} color={colors.gray} />}
        />

        <InputComponent value={password} onChange={(val) => setPassword(val)}
          placeholder={'Password'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
        />
        <RowComponent justify={'flex-end'}>
          {/* <RowComponent onPress={() => setIsReMember(!isRemember)}>
            <Switch thumbColor={colors.white} trackColor={{ true: colors.primary }} value={isRemember} onChange={() => setIsReMember(!isRemember)} />
            <SpaceComponent width={4} />
            <TextComponent text={'Lưu thông tin đăng nhập'} />
          </RowComponent> */}
          <ButtonComponent text="Quên mật khẩu" onPress={() => navigation.navigate('ForgotPasswordScreen')} type={'link'} />
        </RowComponent>
      </SectionComponent>
      {
        errorMessage && 
        (
          <>
            <TextComponent text={errorMessage} styles={{textAlign:'center',paddingHorizontal:12}} color={colors.danger}/>
          </>
        )
      }
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent onPress={handleLogin} text={'Đăng nhập'} type={'primary'} />
      </SectionComponent>
      <SocialLogin setIsLoading={(val:boolean)=>setIsLoading(val)}/>
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn chưa có tài khoản? " />
          <ButtonComponent text="Đăng ký" type="link" onPress={() => navigation.navigate('SignUpScreen')} />
        </RowComponent>
      </SectionComponent>
      <LoadingModal visible={isLoading}/>
    </ContainerComponent>
  )
}
export default LoginScreen;