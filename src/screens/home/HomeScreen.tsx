import { Button, Text, View } from "react-native"
import React from "react"
import { useDispatch } from "react-redux"
import { removeAuth } from "../../reduxs/reducers/authReducers"

const HomeScreen = ()=>{
  const dispatch = useDispatch()
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>HomeScreen</Text>
      <Button title="Đăng xuất" onPress={()=> dispatch(removeAuth({}))}/>
    </View>
  )
}
export default HomeScreen;