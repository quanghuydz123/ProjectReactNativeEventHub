import { Button, ImageBackground, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React, { ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
import { useNavigation } from "@react-navigation/native"
import RowComponent from "./RowComponent"
import ButtonComponent from "./ButtonComponent"
import { ArrowLeft } from "iconsax-react-native"
import { colors } from "../constrants/color"
import TextComponent from "./TextComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import LinearGradient from "react-native-linear-gradient"
interface Props {
    isImageBackgound?: boolean,
    isScroll?: boolean,
    title?: string,
    children: ReactNode,
    back?: boolean,
    right?:ReactNode
}
//showsVerticalScrollIndicator ẩn thanh trượt xuống
const ContainerComponent = (props: Props) => {
    const { children, isScroll, isImageBackgound, title,back ,right} = props
    const navigation:any = useNavigation()  
    
    const returnContainer = isScroll ? (
        <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
            {children}
        </ScrollView>
    ) : (
            <View style={{flex:1}}>
            {children}
        </View>
    )

    const headerComponent = ()=>{
        return <View style={{flex:1,paddingTop:30}}>
            {(title || back || right) &&  
            <RowComponent styles={{paddingHorizontal:16
                ,paddingVertical:10,
                minWidth:48,
                minHeight:48
                }}>
               {back &&  
               <TouchableOpacity onPress={()=>navigation.goBack()} 
               style={{marginRight:12}}
                >
                    <ArrowLeft size={24} color={colors.colorText}/>
                </TouchableOpacity>
                }
                <View style={{flex:1}}>{title && <TextComponent text={title} font={fontFamilies.medium} size={20}/>}</View>
                {right && right}
            </RowComponent>}
            {returnContainer}
            </View>
    }
    return isImageBackgound ? 
    (<ImageBackground source={require('../assets/images/Splash-img.png')} style={{flex:1}} imageStyle={{flex:1}}>
           <SafeAreaView style={{flex:1}}>{headerComponent()}</SafeAreaView>
        </ImageBackground>) :
            (
                <SafeAreaView style={[globalStyles.container]}>
                    <StatusBar barStyle={'dark-content'} />
                    <View style={{flex:1}}>
                        {headerComponent()}
                    </View>
                </SafeAreaView>

            )
}
export default ContainerComponent;