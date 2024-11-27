import { Button, FlatList, Modal, StyleSheet, Text, View } from "react-native"
import React, { memo, useEffect, useMemo, useState } from "react"
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
import ButtonComponent from "./ButtonComponent";

interface Props {
    title?: string,
    selected: string[],
    onSelect: (val: string[]) => void,
    values: CategoryModel[]
}
const DropdownPickerSelect = (props:Props) => {
    const {title,selected,onSelect,values} = props
    const [searchKey, setSearchKey] = useState<string>('')
    const [isOpenModalize,setIsOpenModalize] = useState(false)
    const [selectedItems, setSelectItems] = useState<string[]>([])

    useEffect(()=>{
        selected && setSelectItems(selected)
    },[selected])
    const handleSelectItem = (id:string)=>{
        if(selectedItems.includes(id)){
            const data = selectedItems.filter(item => item !== id);
            setSelectItems(data)
        }else{
            setSelectItems([...selectedItems, id])
        }
    }
    const showText = useMemo(() => {
        if (selected.length === 0) {
          return '';
        }
    
        return values
          .filter(item => selected.includes(item._id))
          .map(item => item.name)
          .join(', ');
      }, [values, selected]);
    return (
        <View>
            <TextComponent text="Thể loại" title size={14}/>
            <SpaceComponent height={8} />
            <RowComponent styles={[globalStyles.inputContainer, { justifyContent: 'flex-start' }]} onPress={() => setIsOpenModalize(true)} >
                <RowComponent>
                    <TextComponent text={showText} flex={1} />
                    <ArrowDown2 size={22} color={colors.gray} />
                </RowComponent>
            </RowComponent>
            <SelectModalize 
            title="Danh sách thể loại"
            
            onSearch={val => setSearchKey(val)}
            valueSearch={searchKey}
            visible={isOpenModalize} 
            adjustToContentHeight
            onClose={()=>{setIsOpenModalize(false),setSearchKey(''),onSelect(selectedItems)}} 
            data={values}
            footerComponent={
               <View style={{
                    paddingBottom:30,
                }}>
                    <ButtonComponent disable={selectedItems.length <= 0} text="Thêm" type="primary" onPress={()=>{onSelect(selectedItems),setIsOpenModalize(false)}}/>
                </View>
            }            // data={values.filter((item)=>item.name.toLowerCase().includes(searchKey.toLowerCase()))}
            renderItem={(item:CategoryModel)=><RowComponent onPress={()=>handleSelectItem(item._id)} key={item._id} styles={{
                flex:1,
                padding:10,
                borderBottomWidth:1,
                borderBlockColor:colors.gray6,
            }}
            
            >
                <TextComponent text={item.name} color={selectedItems.includes(item._id) ? colors.primary : colors.colorText}/>
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

export default memo(DropdownPickerSelect);

