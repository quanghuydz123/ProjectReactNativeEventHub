import { Button, StyleProp, Text, View, ViewStyle } from "react-native"
import React from "react"
import RowComponent from "./RowComponent";
import { colors } from "../constrants/color";
import { ArrowLeft, SearchNormal } from "iconsax-react-native";
import InputComponent from "./InputComponent";
import SpaceComponent from "./SpaceComponent";
interface Props {
    value:string,
    onSearch:(val:string)=>void,
    onPressArrow:()=>void,
    styles?:StyleProp<ViewStyle>,
    titlePlaceholder?:string
}
const SearchComponent = (props:Props)=>{
    const {value,onSearch,onPressArrow,styles,titlePlaceholder} = props
  return <RowComponent styles={[styles]} justify="flex-end">
    <ArrowLeft color={colors.gray}  onPress={() => onPressArrow()} />
                    <SpaceComponent width={8} />
      <View style={{
        flex:1
      }}>
        <InputComponent 
        styles={{
          marginBottom:0
        }}
        affix={<SearchNormal size={20} color={colors.gray}/>}
        
        value={value} 
        placeholder={titlePlaceholder ?? "Tìm kiếm..."}
        allowClear
        onChange={val => onSearch(val)}
        />
        
      </View>
     
  </RowComponent>
}
export default SearchComponent;