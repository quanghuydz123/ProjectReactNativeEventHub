import { Button, Text, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import { ButtonComponent, RowComponent, TagComponent, TextComponent } from "../src/components";
import { colors } from "../src/constrants/color";
import { CategoryModel } from "../src/models/CategoryModel";
import { globalStyles } from "../src/styles/globalStyles";
import { FollowerModel } from "../src/models/FollowerModel";
import { fontFamilies } from "../src/constrants/fontFamilies";
interface Props {
    visible: boolean,
    onClose: () => void,
    onComfirm:()=>void,
    categories: CategoryModel[],
    selectedCategories:string[],
    onSelectCategories:(val:string[])=>void
}
const ModalFilterEvent = (props: Props) => {
    const { visible, onClose, categories ,selectedCategories,onSelectCategories,onComfirm} = props
    const [allCategory, setAllCategory] = useState<CategoryModel[]>()
    const modalieRef = useRef<Modalize>()
    const [allFollow, setAllFollow] = useState<FollowerModel[]>([])


    useEffect(() => {
        setAllCategory(categories)
    }, [categories])

    useEffect(() => {
        if (visible) {
            modalieRef.current?.open()
        } else {
            modalieRef.current?.close()
        }
    }, [visible])
    const handleFollowerCategory = (id: string) => {
        const idsCategory = [...selectedCategories]
        const index = selectedCategories.findIndex(item => item.toString() === id.toString())
        if (index != -1) {
            idsCategory.splice(index, 1)
            onSelectCategories(idsCategory)
        } else {
            idsCategory.push(id)
            onSelectCategories(idsCategory)

        }
    }
    return (
        <Portal>
            <Modalize
                adjustToContentHeight
                ref={modalieRef}
                onClose={() => onClose()}
                modalStyle={{
                    paddingHorizontal: 12,
                    paddingTop: 20
                }}
                FooterComponent={
                    <RowComponent justify="center">
                        <ButtonComponent onPress={onClose} text="Hủy lưu" type="primary" styles={{ width: '85%', backgroundColor: 'white' }} textColor={colors.colorText} />
                        <ButtonComponent onPress={onComfirm} text="Đồng ý" type="primary" styles={{ width: '85%' }} />
                    </RowComponent>
                }
                HeaderComponent={
                    <View>
                        <TextComponent text={'Lọc sự kiện'} title size={16} />
                    </View>
                }

            >

                <View style={{paddingTop:10}}>
                   <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                   {
                        categories && categories.map((item) => <View style={{ paddingVertical: 4, paddingHorizontal: 4 }} key={item._id}>
                            <TagComponent key={item._id} onPress={() => handleFollowerCategory(item._id)} label={item.name}
                                bgColor={selectedCategories?.some(idCategory => idCategory === item._id) ? colors.primary : colors.white}
                                textColor={selectedCategories?.some(idCategory => idCategory === item._id) ? colors.white : colors.black}
                                styles={[globalStyles.shadow, { borderWidth: 1, borderColor: selectedCategories?.some(idCategory => idCategory === item._id) ? colors.primary : colors.gray }]} />

                        </View>)
                    }
                   </View>
                   <View>
                   <TextComponent text={'Thời gian'} size={14}/>
                   <RowComponent justify="center">
                    <ButtonComponent text="text1" type="primary" color="white" textColor={colors.colorText}/>
                    <ButtonComponent text="text1"  type="primary"  color="white" textColor={colors.colorText}/>

                   </RowComponent>
                   </View>
                    
                </View>
            </Modalize>
        </Portal>
    )
}
export default ModalFilterEvent;