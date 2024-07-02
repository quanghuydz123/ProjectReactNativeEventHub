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
import { SelectModalize } from "../../modals";

interface Props {
    title?: string,
    selected: string,
    onSelect: (val: string) => void,
    values: CategoryModel[]
}
const DropdownPickerSelect = (props:Props) => {
    const {title,selected,onSelect,values} = props
    const [searchKey, setSearchKey] = useState<string>('')
    const [isOpenModalize,setIsOpenModalize] = useState(false)
   
    const handleSelect = (val:CategoryModel) =>{
        onSelect(val._id)
        setIsOpenModalize(false)
    }
    
    return (
        <View>
            <TextComponent text="Thể loại" title size={14}/>
            <SpaceComponent height={8} />
            <RowComponent styles={[globalStyles.inputContainer, { justifyContent: 'flex-start' }]} onPress={() => setIsOpenModalize(true)} >
                <RowComponent>
                    <TextComponent text={selected ? `${values.find((item)=>item._id===selected)?.name}` : ''} flex={1} />
                    <ArrowDown2 size={22} color={colors.gray} />
                </RowComponent>
            </RowComponent>
            <SelectModalize 
            title="Danh sách thể loại"
            onSearch={val => setSearchKey(val)}
            valueSearch={searchKey}
            visible={isOpenModalize} 
            adjustToContentHeight
            onClose={()=>{setIsOpenModalize(false),setSearchKey('')}} 
            data={values}
            // data={values.filter((item)=>item.name.toLowerCase().includes(searchKey.toLowerCase()))}
            renderItem={(item:CategoryModel)=><RowComponent onPress={()=>handleSelect(item)} key={item._id} styles={{
                flex:1,
                padding:10,
                borderBottomWidth:1,
                borderBlockColor:colors.gray6,
            }}
            
            >
                <TextComponent text={item.name} color={selected === item._id ? colors.primary : colors.colorText}/>
            </RowComponent>}
            />
            {/* <Modal transparent statusBarTranslucent animationType="fade" visible={isVisibleModal} style={{
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
            </Modal> */}
        </View>
    );
};

export default DropdownPickerSelect;

