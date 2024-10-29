import { Button, Image, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import React, { memo, useEffect, useState } from "react"
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
import { useSelector } from "react-redux";
import { authSelector, AuthState } from "../reduxs/reducers/authReducers";

interface Props {
  size?: number,
  isShowButton?: boolean,
  users?: [{
    user:UserModel,
    createdAt?:Date
  }],
  styles?:StyleProp<ViewStyle>, 
  onPressInvity?:(event:any)=>void,
  textColor?:string,
  isShowText?:boolean
}
const AvatarGroup = (props: Props) => {
  const { size, isShowButton, users,styles,onPressInvity,textColor,isShowText=true} = props
  const auth:AuthState = useSelector(authSelector)
  const [interestText,setInterestText] = useState('')
  useEffect(()=>{
    const userCount = users?.length || 0;
    const isUserInterested = users?.some(item => item.user._id === auth.id);
    
    setInterestText(isUserInterested
      ? userCount - 1 > 0 
        ? `Bạn và ${userCount - 1} Người khác đã quan tâm`
        : `Bạn đã quan tâm`
      : `${userCount} Người đã quan tâm`)
  },[])
  return (
    <RowComponent styles={[{ marginVertical: (users && users.length > 0) ? 6 : 0},styles]}>
      <RowComponent>
      {
        users && users.length > 0 && (
          <>
            {
              users.slice(0, 3).map((item, index) => (
               <AvatarItem  key={item.user._id}  index={index} photoUrl={item.user.photoUrl} size={size}/>
              ))
            }
            <SpaceComponent width={4} />
            {
              isShowText && (
                <TextComponent
                text={interestText}
                size={12 + (size ? (size - 24) / 12 : 0)}
                color={textColor ?? colors.primary}
                font={fontFamilies.semiBold}
                numberOfLine={1}
                flex={1}
              />
              )
            }
          </>
        )
      }
      </RowComponent>

      {
        isShowButton && (
          <>
            <View style={[{ flex: (users && users.length > 0) ? 0 : 1}]}>
              {/* <TouchableOpacity 
              onPress={onPressInvity}
              style={[globalStyles.shadow, {
                backgroundColor: colors.primary,
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 12,
              }]}>
                <TextComponent textAlign="center" size={12} color={colors.white} text="Mời thêm" />
              </TouchableOpacity> */}
              <ButtonComponent text="Xem tất cả" textSize={10} textFont={fontFamilies.medium}/>
            </View>
          </>
        )
      }
    </RowComponent>
  )
}
export default memo(AvatarGroup);