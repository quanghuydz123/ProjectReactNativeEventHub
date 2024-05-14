import { Button, Text, View } from "react-native"
import React, { useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { ArrowLeft, ArrowRight, Sms } from "iconsax-react-native";
import { colors } from "../../constrants/color";

const ForgotPasswordScreen = ()=>{
    const [email,setEmail] = useState('')

  return (
   <ContainerComponent back isImageBackgound>
        <SectionComponent>
            <TextComponent text="Quên mật khẩu" title/>
            <TextComponent text="Hãy nhập địa chỉ email mà bạn muốn đổi mật khẩu" />
            <SpaceComponent height={26}/>
            <InputComponent value={email} onChange={(val) => setEmail(val)}
          placeholder={'abc@gmail.com'}
          affix={<Sms size={22} color={colors.gray} />}
        />
        </SectionComponent>
        <SectionComponent>
            <ButtonComponent text={'Gửi'} type={'primary'} icon={<ArrowRight 
            size={20} 
            color={colors.white}/>}
            iconFlex="right"
            />
        </SectionComponent>
   </ContainerComponent>
  )
}
export default ForgotPasswordScreen;