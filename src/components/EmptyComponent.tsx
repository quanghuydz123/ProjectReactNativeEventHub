import { Text, View } from "react-native"
import React from "react"
import SectionComponent from "./SectionComponent"
import { appInfo } from "../constrants/appInfo"
import TextComponent from "./TextComponent"
interface Props { // phải định nghĩa ra trước
    height?: number,
    message?:string,
    textColor?:string
}
const EmptyComponent = (props: Props) => {
    const { height,message,textColor} = props
    return <SectionComponent styles={{
        justifyContent:'center',
        alignItems:'center',
        height:height ?? appInfo.sizes.HEIGHT*0.2,

    }}>
        <TextComponent color={textColor} text={message ?? 'Không có dữ liệu'}/>
    </SectionComponent>
}
export default EmptyComponent;