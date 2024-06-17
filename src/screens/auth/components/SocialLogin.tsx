import { Button, Text, View } from "react-native"
import React from "react"
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from "../../../components";
import { colors } from "../../../constrants/color";
import { fontFamilies } from "../../../constrants/fontFamilies";
import { Facebook,Google } from "../../../assets/svgs";
import { AlertComponent } from "../../../components/Alert";

const SocialLogin = ()=>{
  return (
    <SectionComponent>
      <TextComponent text="OR" color={colors.gray4} size={16} 
      font={fontFamilies.medium}
      styles={{textAlign:'center'}}
      />
      <SpaceComponent height={16}/>
      <ButtonComponent textFont={fontFamilies.regular} text="Đăng nhập bằng Google" type="primary" color={colors.white}
      textColor={colors.colorText} icon={<Google />} iconFlex="left"
      />

    <ButtonComponent textFont={fontFamilies.regular} text="Đăng nhập bằng Facebook" type="primary" color={colors.white}
      textColor={colors.colorText} icon={<Facebook />} iconFlex="left"
      />
      
    </SectionComponent>
  )
}
export default SocialLogin;