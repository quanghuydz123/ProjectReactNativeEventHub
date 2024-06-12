import { Button, FlatList, Text, View } from "react-native"
import React, { ReactNode } from "react"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"

import { colors } from "../constrants/color"
import TagComponent from "./TagComponent"
import { Food, FoodWhite } from "../assets/svgs"
import { CategoryModel } from "../models/CategoryModel"
interface Props{
    isFill?:boolean,

}

const CategoriesList = (props:Props)=>{
    const {isFill} = props
    const categories:CategoryModel[] = [
        {
            key:'sports',
            label:'Thể thao',
            icon:<MaterialIcons name="sports-volleyball" color={isFill ? colors.white :'#F0635A' } size={20}/>,
            color:'#F0635A'
        },
        {
            key:'music',
            label:'Âm nhạc',
            icon:<MaterialIcons name="library-music" color={isFill ? colors.white :'#f59762' } size={20}/>,
            color:'#f59762'
        },
        {
            key:'food',
            label:'Ẩm thực',
            icon:<FoodWhite color={isFill ? colors.white :'#29d697' }/>,
            color:'#29d697'
        },
        {
            key:'art',
            label:'Vân hóa và Nghệ thuật',
            icon:<Ionicons name="color-palette-outline" color={isFill ? colors.white :'#46CDFB' } size={20}/>,
            color:'#46CDFB'
        },
        {
            key:'sports123',
            label:'Thể thao',
            icon:<MaterialIcons name="sports-volleyball" color={isFill ? colors.white :'#46CDFB' } size={20}/>,
            color:'#46CDFB'
        }
    ]
  return (
    <FlatList 
    style={{paddingHorizontal:8}}
    horizontal 
    showsHorizontalScrollIndicator={false}
    data={categories}
    renderItem={({item,index}) => (
        <TagComponent 
        key={index} 
        bgColor={isFill ? item.color : colors.white} 
        icon={item.icon} label={item.label}
        styles={{marginRight:index === categories.length -1 ? 28 : 12}}
        />
    )}
    />
  )
}
export default CategoriesList;