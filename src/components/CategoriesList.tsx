import { Button, FlatList, Linking, Text, View } from "react-native"
import React, { ReactNode, useEffect, useState } from "react"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"

import { colors } from "../constrants/color"
import TagComponent from "./TagComponent"
import { Food, FoodWhite } from "../assets/svgs"
import { CategoryModel } from "../models/CategoryModel"
interface Props{
    isFill?:boolean,
    values:CategoryModel[]
}

const CategoriesList = (props:Props)=>{
    const {isFill,values} = props
    const [categories,setCategories] = useState<CategoryModel[]>([])
    useEffect(()=>{
        setCategories(values)
    },[values])
  return (
    <FlatList 
    style={{paddingHorizontal:8}}
    horizontal 
    showsHorizontalScrollIndicator={false}
    data={categories}
    renderItem={({item,index}) => (
        <TagComponent 
        key={item._id} 
        bgColor={colors.danger2}
        label={item.name}
        styles={{marginRight:index === categories.length -1 ? 28 : 12}}
        onPress={()=>console.log("ok")}
        />
    )}
    />
  )
}
export default CategoriesList;