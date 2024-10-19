import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { globalStyles } from "../../styles/globalStyles";
import Swiper from "react-native-swiper";
import { appInfo } from "../../constrants/appInfo";
import { colors } from "../../constrants/color";
import { TextComponent } from "../../components";
import { fontFamilies } from "../../constrants/fontFamilies";
//{navigation}: any dùng để diều hướng
const OnboardingScreen = ({navigation}: any)=>{
  const [index,setIndex] = useState(0)
  return (
    <View style={[globalStyles.container]}>
        <Swiper loop={false} onIndexChanged={(num)=>setIndex(num)}
        activeDotColor={colors.white}
        index={index}
        >
            <Image source={require('../../assets/images/ob1.jpg')}
            style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
            />
             <Image source={require('../../assets/images/ob2.jpg')}
            style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
            />
             <Image source={require('../../assets/images/ob3.jpg')}
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
              <TextComponent text="Skip" color={colors.danger2} font={fontFamilies.medium}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => index < 2 ? setIndex(prev => prev+1) : navigation.navigate('LoginScreen')}>
              <TextComponent text="Next" color={colors.danger2} font={fontFamilies.medium}/>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  text:{
    color:colors.white,
    fontSize:16,
    fontWeight:'500'
  }
})