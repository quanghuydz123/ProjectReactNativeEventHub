import { Button, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authSelector, removeAuth } from "../../reduxs/reducers/authReducers"
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../constrants/color"
import { CricleComponent, RowComponent, TextComponent } from "../../components"
import { ArrowDown, HambergerMenu, Notification } from "iconsax-react-native"
import { fontFamilies } from "../../constrants/fontFamilies"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
const HomeScreen = ({navigation}:any)=>{
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
  const handleLogout = async ()=> {
    if(isRemember===true){
      await AsyncStorage.setItem('auth',auth.email)
      dispatch(removeAuth({}))
    }else{
      await AsyncStorage.removeItem('auth')
      dispatch(removeAuth({}))    
    }
  }
  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
        <View style={{
          height:179,
          backgroundColor:colors.primary,
          borderBottomLeftRadius:40,
          borderBottomRightRadius:40,
          paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 52,
          paddingHorizontal:16
        }}>
          <RowComponent>
              <TouchableOpacity onPress={()=>navigation.openDrawer()} >
                <HambergerMenu size={24} color={colors.white}/>
              </TouchableOpacity>
              <View style={[{flex:1,alignItems:'center'}]}>
                  <RowComponent>
                    <TextComponent text="Current Location" color={colors.white2} size={12}/>
                    <MaterialIcons name="arrow-drop-down" size={18} color={colors.white2}/>
                  </RowComponent>
                  <TextComponent text={'Ho Chi Minh'} size={13} color={colors.white2} font={fontFamilies.medium}/>
              </View>
              <CricleComponent color={'#524CE0'} size={36}>
                  <View>
                    <Notification size={18} color={colors.white}/>
                    <View style={{
                      backgroundColor:'#02E9FE',
                      width:8,
                      height:8,
                      borderRadius:4,
                      borderWidth:1,
                      borderColor:'#02E9FE',
                      position:'absolute',
                      top:0,
                      right:0
                    }}/>
                  </View>
              </CricleComponent>
          </RowComponent>
        </View>
        <View style={[{flex:1,backgroundColor:colors.white}]}>
          
        </View>
    </View>
  )
}
export default HomeScreen;