import { Button, FlatList, Image, Platform, StatusBar, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import React, { ReactElement, ReactNode, lazy, useEffect, useRef, useState } from "react"

import { ArrowDown2, ArrowLeft, ArrowLeft2, SearchNormal } from "iconsax-react-native";

import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";

import Feather from "react-native-vector-icons/Feather"
import AntDesign from "react-native-vector-icons/AntDesign"
import { SelectModel } from "../src/models/SelectModel";
import { ButtonComponent, RowComponent, SpaceComponent, TextComponent } from "../src/components";
import { colors } from "../src/constrants/color";
import { fontFamilies } from "../src/constrants/fontFamilies";
import { globalStyles } from "../src/styles/globalStyles";
import AvatarGroup from "../src/components/AvatarGroup";
import SearchComponent from "../src/components/SearchComponent";
import { CategoryModel } from "../src/models/CategoryModel";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface Props {
    // values: SelectModel[],
    // selected?:string[],
    // onSelected: (val: string | string[]) => void,
    multibale?: boolean,
    visible:boolean,
    onClose:()=>void,
    // onCofirm:()=>void,
    data:any[],
    renderItem:(val:any)=>ReactElement,
    hidenHeader?:boolean,
    adjustToContentHeight?:boolean,
    onSearch:(val:string)=>void,
    valueSearch:string,
    title?:string,
    styles?: StyleProp<ViewStyle>,
    footerComponent?:ReactNode

}
const SelectModalize = (props: Props) => {
    const {multibale,visible,onClose,data,renderItem,hidenHeader,styles,adjustToContentHeight,onSearch ,valueSearch,title,footerComponent} = props
    // const [isVisibleModalize, setIsVisibleModalize] = useState(false)
    const modalieRef = useRef<Modalize>()
    // const [selectedItems, setSelectItems] = useState<string[]>([])
    // useEffect(()=>{
    //     selected && setSelectItems(selected)
    // },[selected])
    useEffect(() => {
        if (visible) {
            modalieRef.current?.open()
        } else {
            modalieRef.current?.close()
        }
    }, [visible])
    // const renderSelectItem = (item: SelectModel) => {
    //     return <RowComponent
    //     onPress={multibale ? ()=>handleSelectItem(item.value) : () => onSelected(item.value)}
    //      key={item.value} styles={[
    //         localStyles.listItem,
    //         {
    //             paddingVertical:10,
    //             borderBottomWidth:1,
    //             borderBlockColor:colors.gray6,
    //             paddingHorizontal:10,
    //         }
    //     ]}
    //     >
    //         {
    //           !item?.photoUrl 
    //           ? <View style={[localStyles.avartar,{backgroundColor:colors.gray}]}><TextComponent title color={colors.white} size={16} text="H"/></View> 
    //           : <Image style={[localStyles.avartar]} source={{uri:item.photoUrl}}/>

    //         }
    //         <SpaceComponent width={8}/>
    //        <View style={{
    //         flex:1,

    //        }}>
    //             <TextComponent 
    //             color={selectedItems.includes(item.value) ? 
    //             colors.primary : colors.colorText} 
    //             text={`${item.name} (${item.email})`} 
    //             flex={1} 
    //             font={fontFamilies.regular}
    //                 styles={{
    //                     textAlignVertical:'center'
    //                 }}
    //              />
    //        </View>
    //        {selectedItems.includes(item.value) ? <AntDesign color={colors.primary} size={18} name="checkcircle" /> : <AntDesign color={colors.gray} size={18} name="checkcircle" />}
    //     </RowComponent>
    // }

    // const handleSelectItem = (id:string)=>{
    //     if(selectedItems.includes(id)){
    //         const data = selectedItems.filter(item => item !== id);
    //         setSelectItems(data)
    //     }else{
    //         setSelectItems([...selectedItems, id])
    //     }
    // }
    
    return (
        
        // <Portal>
        //         <Modalize
        //             onClosed={()=>{onClose()}}
        //             adjustToContentHeight={adjustToContentHeight}
        //             flatListProps={{
        //                 data:data,
        //                 keyExtractor:item=> item._id,
        //                 showsVerticalScrollIndicator:false,
        //                 renderItem:(item)=>renderItem(item),
                        
        //             }}
        //             HeaderComponent={
        //                 <View style={{paddingTop:20,paddingHorizontal:12}}>
        //                     <TextComponent text={title ?? 'Danh sách'}  title size={15}/>
        //                     <SpaceComponent height={8}/>
        //                {
        //                  !hidenHeader && <SearchComponent value={valueSearch} onSearch={(val)=>onSearch(val)} onPressArrow={()=>modalieRef.current?.close()}  />
        //                }
        //                 </View>
        //             }
                    
        //             FooterComponent={
        //                 footerComponent
        //             }
        //             handlePosition="inside" ref={modalieRef} onClose={() => onClose()}/>
                    
        //     </Portal>
        <Portal>
                <Modalize
                    onClosed={()=>{onClose()}}
                    adjustToContentHeight={adjustToContentHeight}
                    scrollViewProps={{ showsVerticalScrollIndicator: false }}
                    HeaderComponent={
                        <View style={{paddingTop:20,paddingHorizontal:12}}>
                            <TextComponent text={title ?? 'Danh sách'}  title size={16}/>
                            <SpaceComponent height={8}/>
                       {
                         !hidenHeader && <SearchComponent value={valueSearch} onSearch={(val)=>onSearch(val)} onPressArrow={()=>modalieRef.current?.close()}  />
                       }
                        </View>
                    }
                    
                    FooterComponent={
                        footerComponent
                    }
                    handlePosition="inside" ref={modalieRef} onClose={() => onClose()}>
                    <View style={[{
                        paddingVertical: 10,
                        paddingHorizontal:12,
                    },styles]}>
                        {
                            data.map((item)=>renderItem(item))
                        }
                        
                    </View>
                </Modalize>
            </Portal>
    )
}
export default SelectModalize;

// const localStyles = StyleSheet.create({
    
//     avartar:{
//       width:30,
//       height:30,
//       borderRadius:100,
//       justifyContent:'center',alignItems:'center'
  
//     },
//     listItem:{
//       paddingVertical:12
//     },
//     listItemText:{
//       paddingLeft:12
//     }
//   })