import { Button, FlatList, Linking, Text, View } from "react-native"
import React, { ReactNode, useEffect, useState } from "react"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"

import { colors } from "../constrants/color"
import TagComponent from "./TagComponent"
import { Food, FoodWhite } from "../assets/svgs"
import { CategoryModel } from "../models/CategoryModel"
import { useNavigation } from "@react-navigation/native"
import AvatarItem from "./AvatarItem"
import { TouchableOpacity } from "react-native"
import { globalStyles } from "../styles/globalStyles"
interface Props{
    isFill?:boolean,
    values:CategoryModel[]
}

const CategoriesList = (props:Props)=>{
    const {isFill,values} = props
    const [categories,setCategories] = useState<CategoryModel[]>([])
    const navigation:any = useNavigation()
    useEffect(()=>{
        setCategories(values)
    },[values])
    const renderItem = (item:CategoryModel,index:number)=>{
      return (
      // <TagComponent 
      //   key={item._id} 
      //   bgColor={colors.danger2}
      //   label={item.name}
      //   styles={{marginRight:index === categories.length -1 ? 28 : 12}}
      //   onPress={()=> navigation.navigate('SearchEventsScreen',{categoriesSelected:[item._id]})}
      //   />
      <TouchableOpacity onPress={()=> navigation.navigate('SearchEventsScreen',{categoriesSelected:[item._id]})}  style={[{marginRight:index === categories.length -1 ? 28 : 8,
        paddingHorizontal:20,
        paddingVertical:4,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#f6f6f3'}]}>
        <AvatarItem 
        size={60} 
        textName={item.name} 
        
        photoUrl={item.image}
        />
      </TouchableOpacity >
      )
    }
  return (
    <FlatList 
    style={{paddingHorizontal:8}}
    horizontal 
    showsHorizontalScrollIndicator={false}
    data={categories}
    renderItem={({item,index}) => (
      renderItem(item,index)
    )}
    />
  )
}
export default CategoriesList;