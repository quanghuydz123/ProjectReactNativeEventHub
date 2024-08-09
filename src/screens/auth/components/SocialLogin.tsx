import { Button, Text, View } from "react-native"
import React from "react"
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from "../../../components";
import { colors } from "../../../constrants/color";
import { fontFamilies } from "../../../constrants/fontFamilies";
import { Facebook,Google } from "../../../assets/svgs";
import { AlertComponent } from "../../../components/Alert";
import {GoogleSignin} from '@react-native-google-signin/google-signin'
GoogleSignin.configure({
  webClientId:'989926603372-v1lppokn36b1mf2g203libf01c3bbhj9.apps.googleusercontent.com', //lấy trên api console
  scopes: ['profile', 'email'],
  offlineAccess: true,
  
})
const SocialLogin = ()=>{
  const handleLoginGoogle = async ()=>{
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog:true,// hiện bảng đăng nhập
    })
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      console.log("abc",userInfo)
    } catch (error) {
      console.log("erer,",error)
    }
  }
  return (
    <SectionComponent>
      <TextComponent text="OR" color={colors.gray4} size={16} 
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