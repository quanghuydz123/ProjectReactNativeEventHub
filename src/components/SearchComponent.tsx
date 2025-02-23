import { Button, StyleProp, Text, View, ViewStyle } from "react-native"
import React, { memo } from "react"
import RowComponent from "./RowComponent";
import { colors } from "../constrants/color";
import { ArrowLeft, SearchNormal } from "iconsax-react-native";
import InputComponent from "./InputComponent";
import SpaceComponent from "./SpaceComponent";
import TextComponent from "./TextComponent";
import { globalStyles } from "../styles/globalStyles";
interface Props {
  value: string,
  onSearch: (val: string) => void,
  onPressArrow?: () => void,
  styles?: StyleProp<ViewStyle>,
  titlePlaceholder?: string,
  isNotShowArrow?: boolean,
  onEnd?:()=>void,
  bgColor?:string,
  textColor?:string,
  onFocus?:()=>void,
  onBlur?:()=>void,
  ref?:any,
  minHeight?:number
}
const SearchComponent = (props: Props) => {
  const { value, onSearch, onPressArrow, styles,onFocus,minHeight, titlePlaceholder, textColor,isNotShowArrow,onEnd,bgColor,onBlur,ref } = props
  return <RowComponent styles={[styles]} justify="flex-end">
    {!isNotShowArrow && (
      <>
        <ArrowLeft color={colors.gray} onPress={onPressArrow} />
        <SpaceComponent width={8} />
      </>
    )}
    <View style={{
      flex: 1,
    }}>
      <InputComponent
        ref={ref}
        
        styles={[{
          marginBottom: 0,
          borderRadius:100,
          backgroundColor:bgColor ?? colors.backgroundSearchInput,
          borderColor:colors.white,
          minHeight:minHeight ? minHeight : 40
        }]}
        
        onBlur={onBlur}
        onFocus={onFocus}
        textColor={textColor}
        affix={<SearchNormal size={20} color={colors.gray} />}
        value={value}
        onEnd={onEnd}
        
        placeholder={titlePlaceholder ?? "Tìm kiếm..."}
        
        allowClear
        onChange={val => onSearch(val)}
      />

    </View>

  </RowComponent>
}
export default memo(SearchComponent);