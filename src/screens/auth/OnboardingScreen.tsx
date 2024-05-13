import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { globalStyles } from "../../styles/globalStyles";
import Swiper from "react-native-swiper";
import { appInfo } from "../../constrants/appInfo";
import { color } from "../../constrants/color";
//{navigation}: any dùng để diều hướng
const OnboardingScreen = ({navigation}: any)=>{
  const [index,setIndex] = useState(0)
  return (
    <View style={[globalStyles.container]}>
        <Swiper style={{}} loop={false} onIndexChanged={(num)=>setIndex(num)}
        activeDotColor={color.white}
        index={index}
        >
            <Image source={require('../../assets/images/Onboarding1.png')}
            style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
            />
             <Image source={require('../../assets/images/Onboarding2.png')}
            style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
            />
             <Image source={require('../../assets/images/Onboarding3.png')}
            style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
            />
        </Swiper>
        <View
          style={[{
            paddingHorizontal:16,
            paddingVertical:20,
            position:'absolute',
            bottom:0,
            right:0,
            left:0,
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
          }]}
        >
         
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={[styles.text,{color:color.gray2}]}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => index < 2 ? setIndex(prev => prev+1) : navigation.navigate('LoginScreen')}>
                <Text style={[styles.text,{color:color.gray2}]}>Next</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  text:{
    color:color.white,
    fontSize:16,
    fontWeight:'bold'
  }
})