import { Button, FlatList, Modal, StyleSheet, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import RNPickerSelect from 'react-native-picker-select';
import { colors } from "../constrants/color";
import TextComponent from "./TextComponent";
import { globalStyles } from "../styles/globalStyles";
import RowComponent from "./RowComponent";
import { TouchableOpacity } from "react-native";
import { ArrowDown2, ArrowLeft, ArrowLeft2, CloseCircle, SearchNormal } from "iconsax-react-native";
import SpaceComponent from "./SpaceComponent";
import InputComponent from "./InputComponent";
import { CategoryModel } from "../models/CategoryModel";
import { BackHandler } from "react-native";
import SearchComponent from "./SearchComponent";

interface Props {
    title?: string,
    selected: string,
    onSelect: (val: string) => void,
    values: CategoryModel[]
}
const DropdownPickerSelect = (props:Props) => {
    const {title,selected,onSelect,values} = props
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const renderItemCategory = (val:CategoryModel,index:number)=>{
        return <RowComponent key={index} styles={{
            flex:1,
            padding:4,
            marginBottom:8
        }}
        onPress={()=>handleSelect(val)}
        >
            <TextComponent text={val.label} color={selected === val.key ? colors.primary : colors.colorText}/>
        </RowComponent>
    }
    const handleSelect = (val:CategoryModel) =>{
        onSelect(val.key)
        setIsVisibleModal(false)
    }
    
    return (
        <View>
            <TextComponent text="Thể loại" />
            <SpaceComponent height={8} />
            <RowComponent styles={[globalStyles.inputContainer, { justifyContent: 'flex-start' }]} onPress={() => setIsVisibleModal(true)} >
                <RowComponent>
                    <TextComponent text={selected ? `${values.find((item)=>item.key===selected)?.label}` : ''} flex={1} />
                    <ArrowDown2 size={22} color={colors.gray} />
                </RowComponent>
            </RowComponent>
            <Modal transparent statusBarTranslucent animationType="fade" visible={isVisibleModal} style={{
                flex: 1
            }}>
                <View style={[globalStyles.container, {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }]}>
                    <View style={[{
                        backgroundColor: 'white',
                        marginBottom: 20,
                        borderRadius: 12,
                        width: '90%',
                        height: '50%',
                        paddingHorizontal:12,
                        paddingVertical:20
                    }]}>
                        <SearchComponent value={searchKey} onSearch={(val)=>setSearchKey(val)} onPressArrow={()=>setIsVisibleModal(false)}/>
                        <View style={{
                            flex:1,
                            paddingVertical:10
                        }}>
                            <FlatList 
                            showsVerticalScrollIndicator={false}
                            data={values}
                            renderItem={({item,index}) => renderItemCategory(item,index)}

                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DropdownPickerSelect;

