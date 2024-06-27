import { Button, Image, Platform, StatusBar, StyleSheet, Text, View } from "react-native"
import React, { lazy, useEffect, useRef, useState } from "react"
import { SelectModel } from "../models/SelectModel";
import TextComponent from "./TextComponent";
import SpaceComponent from "./SpaceComponent";
import RowComponent from "./RowComponent";
import { ArrowDown2, ArrowLeft, ArrowLeft2, SearchNormal } from "iconsax-react-native";
import { colors } from "../constrants/color";
import { globalStyles } from "../styles/globalStyles";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { fontFamilies } from "../constrants/fontFamilies";
import AvatarGroup from "./AvatarGroup";
import Feather from "react-native-vector-icons/Feather"
import AntDesign from "react-native-vector-icons/AntDesign"

import SearchComponent from "./SearchComponent";
interface Props {
    label?: string,
    values: SelectModel[],
    // selected?: string | string[],
    selected?:string[],
    onSelected: (val: string | string[]) => void,
    multibale?: boolean
}
const DropdownPicker = (props: Props) => {
    const { label, values, selected, onSelected, multibale } = props
    const [isVisibleModalize, setIsVisibleModalize] = useState(false)
    const modalieRef = useRef<Modalize>()
    const [searchKey, setSearchKey] = useState('')
    const [selectedItems, setSelectItems] = useState<string[]>([])
    useEffect(()=>{
        selected && setSelectItems(selected)
    },[selected])
    useEffect(() => {
        if (isVisibleModalize) {
            modalieRef.current?.open()
        } else {
            modalieRef.current?.close()
        }
    }, [isVisibleModalize])
    // useEffect(()=>{//set rỗng giá trị khi mở modal
    //     if(isVisibleModalize && selected && selected.length > 0 ){
    //         setSelectItems(selected as string[])
    //     }
    // },[isVisibleModalize,selected])
    const renderSelectItem = (item: SelectModel) => {
        return <RowComponent 
        onPress={multibale ? ()=>handleSelectItem(item.value) : () => onSelected(item.value)}
         key={item.email} styles={[
            localStyles.listItem,
            {
                paddingVertical:10,
                borderBottomWidth:1,
                borderBlockColor:colors.gray6,
                paddingHorizontal:10,
            }
        ]}
        >
            {
              !item?.photoUrl 
              ? <View style={[localStyles.avartar,{backgroundColor:colors.gray}]}><TextComponent title color={colors.white} size={16} text="H"/></View> 
              : <Image style={[localStyles.avartar]} source={{uri:item.photoUrl}}/>

            }
            <SpaceComponent width={8}/>
           <View style={{
            flex:1,

           }}>
                <TextComponent 
                color={selectedItems.includes(item.value) ? 
                colors.primary : colors.colorText} 
                text={`${item.name} (${item.email})`} 
                flex={1} 
                font={fontFamilies.regular}
                    styles={{
                        textAlignVertical:'center'
                    }}
                 />
           </View>
           {selectedItems.includes(item.value) ? <AntDesign color={colors.primary} size={18} name="checkcircle" /> : <AntDesign color={colors.gray} size={18} name="checkcircle" />}
        </RowComponent>
    }

    const handleSelectItem = (id:string)=>{
        if(selectedItems.includes(id)){
            const data = selectedItems.filter(item => item !== id);
            setSelectItems(data)
        }else{
            setSelectItems([...selectedItems, id])
        }
    }
    return (
        <View style={{
            marginBottom: 0
        }}>
            {
                label &&
                <>
                    <TextComponent text={label} title size={14}/>
                    <SpaceComponent height={8} />
                </>
            }
            <RowComponent styles={[
                globalStyles.inputContainer
            ]}
                onPress={() => setIsVisibleModalize(true)}
            >
                <RowComponent styles={{
                    flex: 1
                }}

                >
                 {
                    selected && selected?.length > 0 ? <AvatarGroup  /> : <TextComponent text="Chưa có ai..."/>
                 }
                </RowComponent>
                <ArrowDown2 size={22} color={colors.gray} />
            </RowComponent>
            {/* Portal chiếm hết chiều rộng màn hình*/}
            <Portal>
                <Modalize
                    onClosed={()=>{onSelected(selectedItems),setIsVisibleModalize(false)}}
                    scrollViewProps={{ showsVerticalScrollIndicator: false }}
                    HeaderComponent={
                  
                   <View style={{
                    paddingTop:20,
                    paddingHorizontal:12
                }} >
                    <TextComponent text="Danh sách người dùng"  title size={15}/>
                    <SpaceComponent height={8}/>
                     <SearchComponent value={searchKey} onSearch={(val)=>setSearchKey(val)} onPressArrow={()=>modalieRef.current?.close()} />
                   </View>
                    }
                    FooterComponent={
                        multibale && <View style={{
                            paddingHorizontal:10,
                            paddingBottom:30
                        }}>
                            <ButtonComponent text="Thêm" type="primary" onPress={()=>{onSelected(selectedItems),setIsVisibleModalize(false)}}/>
                        </View>
                    }
                    handlePosition="inside" ref={modalieRef} onClose={() => setIsVisibleModalize(false)}>
                    <View style={{
                        paddingVertical: 10
                    }}>
                        {values.map((item) => renderSelectItem(item))}
                    </View>
                </Modalize>
            </Portal>
        </View>
    )
}
export default DropdownPicker;

const localStyles = StyleSheet.create({
    
    avartar:{
      width:30,
      height:30,
      borderRadius:100,
      justifyContent:'center',alignItems:'center'
  
    },
    listItem:{
      paddingVertical:12
    },
    listItemText:{
      paddingLeft:12
    }
  })