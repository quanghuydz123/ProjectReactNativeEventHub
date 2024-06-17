import { Button, FlatList, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect } from "react"
import RowComponent from "./RowComponent";
import ButtonComponent from "./ButtonComponent";
import TextComponent from "./TextComponent";
import { globalStyles } from "../styles/globalStyles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import SpaceComponent from "./SpaceComponent";
import { useSelector } from "react-redux";
import { authSelector } from "../reduxs/reducers/authReducers";
import { colors } from "../constrants/color";
import { Bookmark2, Calendar, Logout, Message2, MessageQuestion, Setting2, Sms, User } from "iconsax-react-native";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {removeAuth } from "../reduxs/reducers/authReducers";

const DrawerCustom = ({navigation}:any)=>{
  const user = useSelector(authSelector)
const [isRemember,setIsReMember] = useState<boolean>(false)
const [password,setPasswored] = useState('')
const { getItem: getRememberItem } = useAsyncStorage('isRemember');
const { getItem: getPasswordItem } = useAsyncStorage('password');
const auth = useSelector(authSelector)
const dispatch = useDispatch()
  const size = 24
  const color = colors.gray
  const Menu = [
    {key:'MyProfile',title:'Hồ sơ',icon:<User size={size} color={color}/>},
    {key:'Message',title:'Tin nhắn',icon:<Message2 size={size} color={color}/>},
    {key:'Calendar',title:'Lịch',icon:<Calendar size={size} color={color}/>},
    {key:'Bookmark',title:'Đánh dấu',icon:<Bookmark2 size={size} color={color}/>},
    {key:'Contactus',title:'Liên lạc',icon:<Sms size={size} color={color}/>},
    {key:'Setting',title:'Cài đặt',icon:<Setting2  size={size} color={color}/>},
    {key:'HelpAndFAQs',title:'Giúp đỡ',icon:<MessageQuestion size={size} color={color}/>},
    {key:'SignOut',title:'Đăng xuất',icon:<Logout size={size} color={color}/>},
  ]
  useEffect(()=>{
    handleGetItem()
  },[])
  const handleGetItem = async ()=>{
    const res = await getRememberItem()
    const resPassword = await getPasswordItem()
    resPassword && setPasswored(resPassword)
    setIsReMember(res === 'true')
  }
  const handleLogout = async ()=> {
    if(isRemember===true){
      await AsyncStorage.setItem('auth',JSON.stringify({email:auth.email,password:password}))
      dispatch(removeAuth())
    }else{
      await AsyncStorage.setItem('auth',JSON.stringify({email:'',password:''}))
      await AsyncStorage.removeItem('isRemember')
      await AsyncStorage.removeItem('password')
      dispatch(removeAuth())    
    }
  }
  const handleClickItemMenu = (key:string) => {
      console.log(key)
      if(key === 'SignOut'){
        handleLogout()
      }
  }
  return (
    <View style={[localStyles.container]}>
        <TouchableOpacity 
        activeOpacity={0.9}
        onPress={()=>
          {
            navigation.closeDrawer()
            navigation.navigate('Profile',{
              screen:'ProfileScreen'
            })// screen chọn màn hỉnh để chuyển qua trong ProfileNavigator
          }
          }>
            {
              !user?.photoUrl 
              ? <View style={[localStyles.avartar,{backgroundColor:colors.gray}]}><TextComponent title color={colors.white} text="H"/></View> 
              : <Image style={[localStyles.avartar]} source={{uri:'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'}}/>

            }
            <TextComponent text={user?.fullname} title size={18}/>
        </TouchableOpacity >
        <FlatList 
        showsVerticalScrollIndicator={false}
        data={Menu} style={{marginVertical:20,flex:1}}
            renderItem={({item,index})=>(
              <RowComponent styles={[localStyles.listItem]} onPress={()=>handleClickItemMenu(item?.key)}>
                {item?.icon}
                <TextComponent styles={[localStyles.listItemText]} text={item?.title}/>
              </RowComponent>
              )}
        />
        <RowComponent>
            {/* <ButtonComponent textColor="#00F8FF" text="Nâng cấp tài khoản" color="#00F8FF33" type="primary"/> */}
            <TouchableOpacity style={[globalStyles.button,{backgroundColor:'#00F8FF22'}]}>
              <FontAwesome5 name="crown" size={22} color="#00F8FF"/>
              <SpaceComponent width={8}/>
               <TextComponent text="Nâng cấp tài khoản" color="#00F8FF"/>
            </TouchableOpacity>
        </RowComponent>
    </View>
  )
}
export default DrawerCustom;

const localStyles = StyleSheet.create({
  container:{
    padding:16,
    paddingVertical :Platform.OS === 'android' ? StatusBar.currentHeight : 48,
    flex:1
  },
  avartar:{
    width:52,
    height:52,
    borderRadius:100,
    marginBottom:12,justifyContent:'center',alignItems:'center'

  },
  listItem:{
    paddingVertical:12
  },
  listItemText:{
    paddingLeft:12
  }
})