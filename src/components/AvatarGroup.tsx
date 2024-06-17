import { Button, Image, Text, TouchableOpacity, View } from "react-native"
import React from "react"
import RowComponent from "./RowComponent";
import TextComponent from "./TextComponent";
import { colors } from "../constrants/color";
import { fontFamilies } from "../constrants/fontFamilies";
import CricleComponent from "./CricleComponent";
import SpaceComponent from "./SpaceComponent";
import ButtonComponent from "./ButtonComponent";
import { UserModel } from "../models/UserModel"

interface Props {
  size?: number,
  isShowButton?: boolean,
  users?:UserModel[]
}
const AvatarGroup = (props: Props) => {
  const photoUrl = 'https://gamek.mediacdn.vn/133514250583805952/2021/5/3/kai4-1620038475845741932232.jpg'
  const { size, isShowButton, users } = props
  return (
    <RowComponent styles={{ marginVertical: (users && users.length > 0) ? 10 : 4 }}>
      {
        users && users.length > 0 && (
          <>
            {Array.from({ length: 3 }).map((item, index) => (
              <Image
                key={index}
                source={{ uri: photoUrl }}
                style={{
                  width: size ?? 24,
                  height: size ?? 24,
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: 'white',
                  marginLeft: index !== 0 ? -12 : 0,
                }}
              />
            ))}
            <SpaceComponent width={4} />
            <TextComponent
              text="+20 người đã tham gia"
              size={12 + (size ? (size - 24) / 12 : 0)}
              color={colors.primary}
              font={fontFamilies.semiBold}
            />
          </>
        )
      }
      
      {
        isShowButton && (
         <>
          <SpaceComponent width={(users && users.length > 0) ? 8 : 0} />
          <View style={{flex:(users && users.length > 0) ? 0 : 1}}>
            <TouchableOpacity style={{
              backgroundColor: colors.primary,
              borderRadius: 100,
              paddingHorizontal: 20,
              paddingVertical: 10
            }}>
              <TextComponent textAlign="center" size={12} color={colors.white} text="Mời thêm" />
            </TouchableOpacity>
          </View>
         </>
        )
      }
    </RowComponent>
  )
}
export default AvatarGroup;