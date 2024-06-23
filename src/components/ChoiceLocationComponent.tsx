import { Button, Text, View } from "react-native"
import React, { useState } from "react"
import RowComponent from "./RowComponent";
import { globalStyles } from "../styles/globalStyles";
import TextComponent from "./TextComponent";
import { ArrowRight2 } from "iconsax-react-native";
import { colors } from "../constrants/color";
import CardComponent from "./CardComponent";
import Ionicons from "react-native-vector-icons/Ionicons"
import SpaceComponent from "./SpaceComponent";
import LocationModal from "../../modals/LocationModal";
interface Props {
    onPress?:() => void,
    value:string,
    onSelect:(val:any)=> void,
    title:string
}
const ChoiceLocationComponent = (props:Props) => {
    const [showModal, setShowModal] = useState(false)
    const {onPress,value,onSelect,title} = props
    return (
        <>
            <TextComponent text={title} title size={14}/>
            <SpaceComponent height={8} />
            <RowComponent 
            onPress={()=>setShowModal(true)}
            styles={[
                globalStyles.inputContainer,
                {
                    paddingHorizontal: 8
                }
            ]}>
                <CardComponent styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]} color={'white'}>
                    <CardComponent styles={[globalStyles.noSpaceCard, { width: 34, height: 34 }]} color={colors.white}>
                        <Ionicons size={22} color={`${colors.primary}80`} name="location-sharp" />
                    </CardComponent>
                </CardComponent>
                <SpaceComponent width={4} />
                <TextComponent text={value} flex={1} numberOfLine={2} />
                <ArrowRight2 size={22} color={colors.primary} />
            </RowComponent>
            <LocationModal visible={showModal} onClose={()=>setShowModal(false)} onConfirm={()=>setShowModal(false)} onSelect={(val)=>onSelect(val)}/>
        </>
    )
}
export default ChoiceLocationComponent;