import { Button, ImageBackground, SafeAreaView, ScrollView, Text, View } from "react-native"
import React, { ReactNode } from "react"
import { globalStyles } from "../styles/globalStyles"
interface Props {
    isImageBackgound?: boolean,
    isScroll?: boolean,
    title?: string,
    children: ReactNode
}
const ContainerComponent = (props: Props) => {
    const { children, isScroll, isImageBackgound, title } = props
    const returnContainer = isScroll ? (
        <ScrollView style={{flex:1}}>
            {children}
        </ScrollView>
    ) : (
        <View style={{flex:1}}>
            {children}
        </View>
    )
    return isImageBackgound ? 
    (<ImageBackground source={require('../assets/images/Splash-img.png')} style={{flex:1}} imageStyle={{flex:1}}>
           <SafeAreaView style={{flex:1}}>{returnContainer}</SafeAreaView>
        </ImageBackground>) :
            (
                <SafeAreaView style={[globalStyles.container]}>
                    <View style={{flex:1}}>
                        {returnContainer}
                    </View>
                </SafeAreaView>

            )
}
export default ContainerComponent;