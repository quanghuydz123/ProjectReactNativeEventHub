import { ActivityIndicator, Button, Modal, StyleProp, Text, View, ViewStyle } from "react-native"
import React from "react"
import { globalStyles } from "../src/styles/globalStyles";
import { RowComponent, TextComponent } from "../src/components";
import { colors } from "../src/constrants/color";
import { appInfo } from "../src/constrants/appInfo";
import LottieView from "lottie-react-native";
import { fontFamilies } from "../src/constrants/fontFamilies";
interface Props {
    visible:boolean,
    notShowContent?:boolean,
    styles?: StyleProp<ViewStyle>,
    message?:string,
    bgColor?:string
}
const LoadingModal = (props:Props)=>{
    const {visible,notShowContent,styles,message,bgColor} = props
  return <Modal visible={visible} style={[globalStyles.container]} transparent statusBarTranslucent>
        <View style={[{flex:1,backgroundColor:notShowContent ? 'rgba(0,0,0,0)' : bgColor ?? 'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'},styles]}>
            {
                <>
                    {/* <ActivityIndicator color={colors.white} size={32}/> */}
                    <LottieView source={require('../src/assets/icon/loading.json')} style={{width:150,height:150}} autoPlay loop />
                    <RowComponent>
                        <TextComponent text={message ? `${message}` : 'Đang tải'} flex={0} size={12} font={fontFamilies.medium}  color={colors.white}/>
                        <LottieView source={require('../src/assets/icon/icon1.json')} style={{width:20,height:20,marginTop:10}} speed={1.5} autoPlay loop />
                    </RowComponent>
                </>
            }
        </View>
  </Modal>
}
export default LoadingModal;