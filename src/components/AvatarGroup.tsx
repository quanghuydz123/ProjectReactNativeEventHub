import { Button, Image, Text, View } from "react-native"
import React from "react"
import RowComponent from "./RowComponent";
import TextComponent from "./TextComponent";
import { colors } from "../constrants/color";
import { fontFamilies } from "../constrants/fontFamilies";
import CricleComponent from "./CricleComponent";
import SpaceComponent from "./SpaceComponent";

const AvatarGroup = ()=>{
  const photoUrl = 'https://gamek.mediacdn.vn/133514250583805952/2021/5/3/kai4-1620038475845741932232.jpg'
  return (
    <RowComponent styles={{marginVertical:10}}>
      {
        Array.from({length:3}).map((item,index)=>(
        <Image key={index} source={{uri:photoUrl}} style={{
            width:24,
            height:24,
            borderRadius:100,
            borderWidth:1,
            borderColor:'white',
            marginLeft:index != 0 ? -8 : 0
          }}/>
        ))
      }
      <SpaceComponent width={4} />
      <TextComponent text="+20 người đã tham gia" size={12} color={colors.primary} font={fontFamilies.semiBold}/>
    </RowComponent>
  )
}
export default AvatarGroup;