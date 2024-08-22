import { Text, View } from "react-native"
import React from "react"
import SectionComponent from "./SectionComponent"
import { appInfo } from "../constrants/appInfo"
import TextComponent from "./TextComponent"
interface Props { // phải định nghĩa ra trước
    height?: number,
    message?:string
}
const EmptyComponent = (props: Props) => {
    const { height,message } = props
    return <SectionComponent styles={{
        justifyContent:'center',
        alignItems:'center',
        height:height ?? appInfo.sizes.HEIGHT*0.2
    }}>
        <TextComponent text={message ?? 'Không có dữ liệu'}/>
    </SectionComponent>
}
export default EmptyComponent;