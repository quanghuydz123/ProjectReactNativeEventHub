import { TouchableOpacity } from "react-native"
import RowComponent from "./RowComponent"
import { colors } from "../constrants/color"
import TextComponent from "./TextComponent"
import SpaceComponent from "./SpaceComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import { useEffect, useState } from "react"
interface Props {
    min?:number,
    max?:number,
    value:number,
    setValue:(val:number)=>void
}
const InputSpinnerComponent = (props:Props) => {
    const {min=0,max=5,value,setValue} = props
    const [disableInc,setdisableInc] = useState(false)
    const [disableDec,setdisableDec] = useState(true)
    useEffect(()=>{
        if(value === min){
            setdisableDec(true)
            setdisableInc(false)
        }else if(value === max){
            setdisableInc(true)
        }
    },[value])
    const handleDecValue = ()=>
    {
        if(value <= min){
            setdisableDec(true)
        }else{
            setValue(value - 1)
            setdisableDec(false)
            setdisableInc(false)

        }
    }
    const handleIncValue = ()=>
    {
        if(value >= max){
            setdisableInc(true)
        }else{
            setValue(value + 1)
            setdisableInc(false)
            setdisableDec(false)
        }

    }
    return (
        <RowComponent>
            <TouchableOpacity style={{
                backgroundColor: colors.white, 
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: disableDec ? colors.gray4 : colors.primary,
                height: 40,
            }}
                activeOpacity={1}
                onPress={()=>handleDecValue()}
            >
                <TextComponent text={'-'} size={34} color={disableDec ? colors.gray4 : colors.primary} />
            </TouchableOpacity>
            <SpaceComponent width={4} />
            <TouchableOpacity style={{
                backgroundColor: colors.white, width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: colors.gray4,
                height: 40
            }}
            activeOpacity={1}
            >
                <TextComponent text={value} size={16} color={colors.black} font={fontFamilies.medium} />
            </TouchableOpacity>
            <SpaceComponent width={4} />
            <TouchableOpacity style={{
                backgroundColor: colors.white, 
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: disableInc ? colors.gray4 : colors.primary
                ,
                height: 40
            }}
                activeOpacity={1}
                onPress={()=>handleIncValue()}
            >
                <TextComponent text={'+'} size={34} color={disableInc ? colors.gray4 : colors.primary} />
            </TouchableOpacity>
        </RowComponent>
    )
}

export default InputSpinnerComponent