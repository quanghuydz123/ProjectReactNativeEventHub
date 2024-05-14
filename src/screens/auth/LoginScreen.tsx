import { Button, Text, View } from "react-native"
import React from "react"
import { ButtonComponent } from "../../components";
import { globalStyles } from "../../styles/globalStyles";

const LoginScreen = ()=>{
  return (
    <View style={[globalStyles.container]}>
      <Text>LoginScreen</Text>
      <ButtonComponent text={'Login'} onPress={()=>{console.log("login")}}/>
    </View>
  )
}
export default LoginScreen;