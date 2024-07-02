import { ActivityIndicator, Button, Modal, Text, View } from "react-native"
import React from "react"
import { globalStyles } from "../src/styles/globalStyles";
import { TextComponent } from "../src/components";
import { colors } from "../src/constrants/color";
interface Props {
    visible:boolean,
    mess?:string,
    notShowContent?:boolean
}
const LoadingModal = (props:Props)=>{
    const {visible,mess,notShowContent} = props
  return <Modal visible={visible} style={[globalStyles.container]} transparent statusBarTranslucent>
        <View style={{flex:1,backgroundColor:notShowContent ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
            {
                notShowContent ? <></> :<><ActivityIndicator color={colors.white} size={32}/>
                <TextComponent text="" flex={0} color={colors.white}/></>
            }
        </View>
  </Modal>
}
export default LoadingModal;