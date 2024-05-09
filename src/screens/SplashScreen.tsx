import { ActivityIndicator, Image, ImageBackground, Text, View } from "react-native"
import React from "react"
import { appInfo } from "../constrants/appInfo";
import { SpaceComponent } from "../components";
import { color } from "../constrants/color";
//ActivityIndicator hiện thị vòng quay quay (loading)
const SplashScreen = ()=>{
  return (
    <ImageBackground source={require('../assets/images/Splash-img.png')} 
    style={{flex:1,justifyContent:'center',alignItems:'center'}} imageStyle={{flex:1}}>
      <Image source={require('../assets/images/logo.png')} style={{
        width:appInfo.sizes.WIDTH*0.8,
        resizeMode:'contain'
      }}/>
      <SpaceComponent height={16}/>
      <ActivityIndicator color={color.gray} size={22}/>
   </ImageBackground>

  )
}
export default SplashScreen;