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
        shadowColor:'rgba(0,0,0,0.5)',       // Màu của bóng đổ, sử dụng giá trị RGBA để xác định màu và độ trong suốt.
        shadowOffset:{
            width:0,                         // Độ lệch bóng đổ theo trục X. Giá trị 0 nghĩa là bóng đổ không lệch theo chiều ngang.
            height:6                         // Độ lệch bóng đổ theo trục Y. Giá trị 4 nghĩa là bóng đổ sẽ lệch xuống dưới 4 đơn vị.
        },
        shadowOpacity:0.25,                  // Độ mờ của bóng đổ, giá trị từ 0 đến 1. Giá trị 0.25 nghĩa là bóng đổ sẽ có độ mờ 25%.
        shadowRadius:8,                      // Bán kính mờ của bóng đổ, giá trị lớn hơn sẽ làm bóng đổ trở nên mờ hơn và mềm hơn.
        elevation:8                         // Độ cao của phần tử trên Android, ảnh hưởng đến độ mờ và kích thước của bóng đổ.
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
        marginHorizontal:12,
        marginBottom:16
    },
    noSpaceCard:{
        justifyContent:'center',
        alignItems:'center',
        width:45,
        height:45,
        margin:0,
        padding:0,
        marginVertical:0,
        marginHorizontal:0,
        marginBottom:0
    }
})