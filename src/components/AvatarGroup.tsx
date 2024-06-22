import { Button, Image, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React from "react"
import RowComponent from "./RowComponent";
import TextComponent from "./TextComponent";
import { colors } from "../constrants/color";
import { fontFamilies } from "../constrants/fontFamilies";
import CricleComponent from "./CricleComponent";
import SpaceComponent from "./SpaceComponent";
import ButtonComponent from "./ButtonComponent";
import { UserModel } from "../models/UserModel"
import { globalStyles } from "../styles/globalStyles";
import AvatarItem from "./AvatarItem";

interface Props {
  size?: number,
  isShowButton?: boolean,
  users?: UserModel[],
  styles?:StyleProp<ViewStyle>,

}
const AvatarGroup = (props: Props) => {
  const { size, isShowButton, users,styles } = props
  return (
    <RowComponent styles={[{ marginVertical: (users && users.length > 0) ? 6 : 0 },styles]}>
      {
        users && users.length > 0 && (
          <>
            {
              users.slice(0, 3).map((user, index) => (
               <AvatarItem key={user._id} index={index} photoUrl={user.photoUrl} size={size}/>
              ))
            }
            <SpaceComponent width={4} />
            {
              users && users.length && users.length < 99 ?
                <TextComponent
                  text={`${users.length} người đã tham gia`}
                  size={12 + (size ? (size - 24) / 12 : 0)}
                  color={colors.primary}
                  font={fontFamilies.semiBold}
                /> :
                <TextComponent
                  text={`+${99} người đã tham gia`}
                  size={12 + (size ? (size - 24) / 12 : 0)}
                  color={colors.primary}
                  font={fontFamilies.semiBold}
                />
            }
          </>
        )
      }

      {
        isShowButton && (
          <>
            <SpaceComponent width={(users && users.length > 0) ? 8 : 0} />
            <View style={[{ flex: (users && users.length > 0) ? 0 : 1}]}>
              <TouchableOpacity style={[globalStyles.shadow, {
                backgroundColor: colors.primary,
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 12
              }]}>
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