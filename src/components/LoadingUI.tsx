import { View, ActivityIndicator } from "react-native"
import { appInfo } from "../constrants/appInfo"
import { colors } from "../constrants/color"

interface Props {
    height?:number,
    bgColor?:string
}
const LoadingUI = (props:Props)=>{
    const {height,bgColor} = props
    return <View style={{ height: height ?? appInfo.sizes.HEIGHT * 0.2, justifyContent: 'center', backgroundColor: bgColor ??  colors.white }}>
    <ActivityIndicator size={20} />
</View>
}

export default LoadingUI