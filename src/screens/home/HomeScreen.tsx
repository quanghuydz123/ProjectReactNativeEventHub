import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authSelector, removeAuth } from "../../reduxs/reducers/authReducers"
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage"

const HomeScreen = ()=>{
  const dispatch = useDispatch()
  const auth = useSelector(authSelector)
  const [isRemember,setIsReMember] = useState<boolean>(false)
  const { getItem } = useAsyncStorage('isRemember')
  useEffect(()=>{
    handleGetItem()
  },[])

  const handleGetItem = async ()=>{
    const res = await getItem()
    setIsReMember(res === 'true')
  }
  console.log("abc",isRemember)
  const handleLogout = async ()=> {
    if(isRemember===true){
      console.log("ok1")
      await AsyncStorage.setItem('auth',auth.email)
      dispatch(removeAuth({}))
    }else{
      console.log("ok2")
      await AsyncStorage.removeItem('auth')
      dispatch(removeAuth({}))    
    }
  }
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>HomeScreen</Text>
      <Button title="Đăng xuất" onPress={handleLogout}/>
    </View>
  )
}
export default HomeScreen;