import { Button, Text, View } from "react-native"
import React from "react"
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from "../../../components";
import { colors } from "../../../constrants/color";
import { fontFamilies } from "../../../constrants/fontFamilies";
import { Facebook,Google } from "../../../assets/svgs";
import { AlertComponent } from "../../../components/Alert";
import { GoogleSignin,GoogleSigninButton  } from '@react-native-google-signin/google-signin';
import authenticationAPI from "../../../apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAuth } from "../../../reduxs/reducers/authReducers";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { HandleNotification } from "../../../utils/handleNotification";
GoogleSignin.configure({
  webClientId:'989926603372-o490b46k8a8o4qrticlharlh7nf290hf.apps.googleusercontent.com', //lấy trên api console
  scopes: ['profile', 'email'],
  offlineAccess: true,  
  
})
interface Props{
  setIsLoading:(val:boolean)=>void
}
const SocialLogin = (props:Props)=>{
  const {setIsLoading} = props
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const handleLoginGoogle = async ()=>{
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog:true,// hiện bảng đăng nhập
    })
    const api = '/login-with-google'
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      const user = userInfo.user
      setIsLoading(true)
      const res:any = await authenticationAPI.HandleAuthentication(api,user,'post')
      console.log("res",res)
      if(res && res.data && res.status===200){
        await AsyncStorage.setItem('auth', JSON.stringify({...res.data,loginMethod:'google'}))
        dispatch(addAuth({...res.data,loginMethod:'google'}))
        HandleNotification.checkNotifitionPersion()
        navigation.goBack()
      }
      setIsLoading(false)

    } catch (error) {
      console.log("erer,",error)
      setIsLoading(false)

    }
  }
  
  return (
    <SectionComponent>
      <TextComponent text="Hoặc" color={colors.gray4} size={16} 
      font={fontFamilies.medium}
      styles={{textAlign:'center'}}
      />
      <SpaceComponent height={16}/>
      <ButtonComponent 
      textFont={fontFamilies.regular} 
      text="Đăng nhập bằng Google" 
      onPress={()=>handleLoginGoogle()}
      type="primary" 
      color={colors.white}
      textColor={colors.colorText} 
      icon={<Google />} iconFlex="left"
      />
    {/* <ButtonComponent textFont={fontFamilies.regular} text="Đăng nhập bằng Facebook" type="primary" color={colors.white}
      textColor={colors.colorText} icon={<Facebook />} iconFlex="left"
      /> */}
      
    </SectionComponent>
  )
}
export default SocialLogin;