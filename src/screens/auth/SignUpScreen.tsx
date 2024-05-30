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
//Object.keys(errorMessage).map duyệt object
// interface ErrorMessage {
//   email:string,
//   password:string,
//   comfirmPassword:string
// }
const initValue = {
  username: '',
  email: '',
  password: '',
  comfirmPassword: ''
}
const SignUpScreen = ({ navigation }: any) => {
  const [values, setValues] = useState(initValue)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<any>()
  const [isDisable,setIsDisable] = useState(true)
  const [error,setError] = useState('')
  const dispatch = useDispatch()  
  //ẩn thông báo lổi
 useEffect(()=>{  
    const { email, password, comfirmPassword, username } = values
    if(!errorMessage || errorMessage && (errorMessage.email || errorMessage.password || errorMessage.comfirmPassword)){
      setIsDisable(true)

    }else{
      if(email && password && comfirmPassword){
        setIsDisable(false)
      }else{
        setIsDisable(true)
      }
    }
 },[errorMessage])
 useEffect(()=>{
  setError('')
 },[values.email])
  const handleOnchangeValue = (key: string, value: string) => {
    const data: any = { ...values }
    data[`${key}`] = value
    setValues(data)
  }
  const formValidator = (key:string) =>{
    let message = ''
    const data = {...errorMessage}
    switch (key){
      case 'email':{
        if(!values.email){
            message = 'Hãy nhập email!!!'
        }else if(!Validate.email(values.email)){
            message = 'Email không đúng định dạng!!!'
        }else{
          message=''
        }
        break;
      }
      case 'password':{
        if(!values.password){
          message = 'Hãy nhập mật khẩu!!!'
        }else if(values.password !== values.comfirmPassword){
          message = 'Mật khẩu nhập lai không giống nhau!!!'
        }else if(values.password === values.comfirmPassword){
          data['comfirmPassword'] = ''
        }else{
          message = ''
        }
        break
      }
      case 'comfirmPassword':{
        if(!values.comfirmPassword){
          message = 'Hãy nhập lại mật khẩu!!!'
        }else if(values.comfirmPassword !== values.password){
          message = 'Mật khẩu nhập lai không giống nhau!!!'
        }else if(values.comfirmPassword ===  values.password){
          data['password'] = ''
        }else{
          message = '' 
        }
        break;
      }
    }
    data[`${key}`] = message
    setErrorMessage(data)
  }


  const handleRegister = async () => {
    const api = '/verification'
    setIsLoading(true)
    try {
      const res = await authenticationAPI.HandleAuthentication(api,{email:values.email},'post')
      navigation.navigate('VerificationScreen',{
        code:res?.data?.code, // truyền qua route
        email:values.email,
        password:values.password,
        username:values.username
      })
      setIsLoading(false)
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      if(errorMessage.statusCode === 402){
        setError(errorMessage.message)
      }else{
        setErrorMessage('Đăng ký thất bại')
      }
      setIsLoading(false)

    }
    // const { email, password, comfirmPassword, username } = values
    // if (email && password && comfirmPassword && username) 
    //   {
    //   const emailValidation = Validate.email(email)
    //   const passwordValidation = Validate.Password(password)
    //   if (emailValidation && passwordValidation) {
    //     setErrorMessage('')
    //     setIsLoading(true)
    //     try {
    //       const res = await authenticationAPI.HandleAuthentication('/register', values, 'post')
    //       //nên kiểm tra các lỗi trước khi thêm vào redux (sau này làm)
    //       dispatch(addAuth(res.data))
    //       await AsyncStorage.setItem('auth',JSON.stringify(res.data))
    //       setIsLoading(true)
    //     }
    //     catch (error) {
    //       console.log("error", error)
    //       setIsLoading(true)
    //     }
    //   } else {
    //     setErrorMessage('Hãy nhập đúng định dạng email')
    //   }

    // } else {
    //   setErrorMessage('Vui lòng nhập đầy đủ thông tin!')
    // }
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
          onEnd={()=> formValidator('email')}
        />

        <InputComponent value={values.password} onChange={(val) => handleOnchangeValue('password', val)}
          placeholder={'Mật khẩu'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
          onEnd={()=> formValidator('password')}

        />

        <InputComponent value={values.comfirmPassword} onChange={(val) => handleOnchangeValue('comfirmPassword', val)}
          placeholder={'Nhập lại mật khẩu'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
          onEnd={()=> formValidator('comfirmPassword')}

        />
      </SectionComponent>
      {
        errorMessage &&
        <SectionComponent>
          {
            Object.keys(errorMessage).map((error,index)=> errorMessage[`${error}`] && (
              <TextComponent styles={{textAlign:'center'}} text={errorMessage[`${error}`]} key={`error${index}`} color={colors.danger} />
            ))
          }
        </SectionComponent>
      }
      {
        error && (
          <>
            <TextComponent text={error} styles={{textAlign:'center'}} color={colors.danger}/>
            <SpaceComponent height={8} />
          </>
        )
      }
      <SectionComponent>
        <ButtonComponent onPress={handleRegister} text={'Đăng ký'} type={'primary'} disable={isDisable}/>
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