import { StyleSheet } from "react-native";
import { colors } from "../constrants/color";
import { fontFamilies } from "../constrants/fontFamilies";

export const globalStyles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.white,

    },

    text:{
        fontFamily:fontFamilies.regular,
        fontSize:14,
        color:colors.colorText 
    }
    ,
    button:{
        borderRadius:12,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.white,
        paddingHorizontal:16,
        paddingVertical:16,
        minHeight:56,
        flexDirection:'row'
    }
})