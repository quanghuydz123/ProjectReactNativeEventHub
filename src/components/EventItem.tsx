import { Button, Text, View } from "react-native"
import React from "react"
import CardComponent from "./CardComponent"
import TextComponent from "./TextComponent"
import { appInfo } from "../constrants/appInfo"
interface Props {
    item:any,
    type: 'card' | 'list'
}
const EventItem = (props:Props)=>{
    const {item,type} = props
  return (
    <CardComponent styles={{width:appInfo.sizes.WIDTH*0.6}} onPress={()=>{}}>
        <TextComponent numberOfLine={1} text="abcasasdsadsadasddadsadaddsdsadads" title size={18}/>
    </CardComponent>
  )
}
export default EventItem;