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
    },
    section:{
        paddingHorizontal:16,
        paddingBottom:12
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        
    },
    shadow:{
        shadowColor:'rgba(0,0,0,0.5)',
        shadowOffset:{
            width:0,
            height:4
        },
        shadowOpacity:0.25,
        shadowRadius:8,
        elevation:6
    },
    iconContainer:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#3D56F0',
        width:30,
        height:30,
        borderRadius:100
    },
    tab:{
        paddingHorizontal:12,
        paddingVertical:6,
        borderRadius:50
    },
    card:{
        borderRadius:12,
        backgroundColor:colors.white,
        padding:12,
        marginVertical:6,
        marginHorizontal:12
    }
})