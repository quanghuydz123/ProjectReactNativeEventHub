import { FlatList, Text, View } from "react-native"
import React, { ReactNode } from "react"
import SectionComponent from "./SectionComponent"
import { appInfo } from "../constrants/appInfo"
import TextComponent from "./TextComponent"
import LoadingComponent from "./LoadingComponent"
import EmptyComponent from "./EmptyComponent"
interface Props { // phải định nghĩa ra trước
    children:ReactNode,
    isLoading:boolean,
    data:any,
    messageEmpty?:string,
    height?:number
    
}
const DataLoaderComponent = (props: Props) => {
    const {children,isLoading,data ,messageEmpty , height} = props
    console.log("data && data?.length > 0)",data?.length)
    return <View>
    {
        isLoading  ? <LoadingComponent isLoading={isLoading} value={data?.length || 0} height={height}/> 
        : (data && data?.length > 0) ?  children : <EmptyComponent message={messageEmpty ?? "Không có dữ liệu"} height={height}/>
    }
</View>
}
export default DataLoaderComponent;