import { Button, Text, View } from "react-native"
import React, { useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, TextComponent } from "../../components";
import { globalStyles } from "../../styles/globalStyles";
import { Lock, Sms } from "iconsax-react-native";
import { colors } from "../../constrants/color";

const LoginScreen = ()=>{
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  return (
    <ContainerComponent>
      {/* <InputComponent value={email} onChange={(val) => setEmail(val)} 
        placeholder={'Email'}
        affix={<Sms size={22} color={colors.gray}/>}
        />

        <InputComponent value={password} onChange={(val) => setPassword(val)} 
        placeholder={'Password'}
        isPassword
        affix={<Lock size={22} color={colors.gray}/>}
        /> */}
        <TextComponent text={"abc"}/>
    </ContainerComponent>
  )
}
export default LoginScreen;