import { Button, ImageBackground, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, } from "react-native"
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
import SpaceComponent from "./SpaceComponent"
interface Props {
    isImageBackgound?: boolean,
    isScroll?: boolean,
    title?: string | ReactNode,
    children: ReactNode,
    back?: boolean,
    right?: ReactNode,
    onPressRight?: () => void,
    bgColor?: string,
    colorTitle?: string,
    bgColorTitle?: string,
    isCenterTitle?:boolean,
    pdTop?:number,
    isHiddenSpaceTop?:boolean,
    scrollRef?:any,
    onPressBack?:()=>void
}
//showsVerticalScrollIndicator ẩn thanh trượt xuống
const ContainerComponent = (props: Props) => {
    const { children, isScroll,scrollRef, isImageBackgound, title, back, right,isHiddenSpaceTop,pdTop,onPressBack, onPressRight, bgColor, isCenterTitle,colorTitle, bgColorTitle } = props
    const navigation: any = useNavigation()
    const RightComponent: React.ComponentType<any> = onPressRight ? TouchableOpacity : View;
    const returnContainer = isScroll ? (
        <ScrollView ref={scrollRef} bounces={false} style={{ flex: 1, backgroundColor: bgColor ?? 'white' }} showsVerticalScrollIndicator={false}>
            {children}
        </ScrollView>
    ) : (
        <View style={{ flex: 1, backgroundColor: bgColor ?? 'white' }}>
            {children}
        </View>
    )

    const headerComponent = () => {
        return <View style={{ flex: 1 }}>
            <View style={{ paddingTop:pdTop ?? Platform.OS === 'ios' ? 0 : 30, backgroundColor: bgColorTitle ?? colors.primary }}>
                {(title || back || right) &&
                    <RowComponent styles={{
                        paddingHorizontal: 16
                        , paddingVertical: 12,
                        minWidth: 48,
                        minHeight: 48,
                    }}>
                        {back &&
                            <TouchableOpacity onPress={onPressBack ? onPressBack : () => navigation.goBack()}
                                style={{ marginRight: 12 }}
                            >
                                <ArrowLeft size={24} color={colorTitle ??colors.white} />
                            </TouchableOpacity>
                        }
                        <View style={{ flex: 1 }}>{typeof title === 'string' ? <TextComponent text={title} textAlign={isCenterTitle ? 'center' : 'left'} color={colorTitle ?? colors.white} font={fontFamilies.medium} size={18} /> : title}
                        </View>
                        {right && <RightComponent  onPress={onPressRight}>{right}</RightComponent>}
                    </RowComponent>}
            </View>
            {!isHiddenSpaceTop && <SpaceComponent height={10} color={bgColor ?? colors.white}/>}
            {returnContainer}
        </View>

    }
    return isImageBackgound ?
        (<ImageBackground source={require('../assets/images/Splash-img.png')} style={{ flex: 1 }} imageStyle={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>{headerComponent()}</SafeAreaView>
        </ImageBackground>) :
        (
            <>
                <SafeAreaView style={{ backgroundColor:colors.primary }}>
                    <StatusBar barStyle="dark-content"  />
                </SafeAreaView>
                <View style={{ flex: 1,backgroundColor:colors.white }}>
                    {headerComponent()}
                </View>
            </>
         

        )
}
export default ContainerComponent;