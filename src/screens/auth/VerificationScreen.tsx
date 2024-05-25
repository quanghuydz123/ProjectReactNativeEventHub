import { Button, Text, View } from "react-native"
import React from "react"

const VerificationScreen = ({navigation,route}:any)=>{
  const {code,email,password} = route.params //truyền bên navigate
  return (
    <View>
      <Text>{`${password} ${email} ${code}`}</Text>
    </View>
  )
}
export default VerificationScreen;