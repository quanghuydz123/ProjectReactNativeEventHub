import { Button, FlatList, Text, TouchableOpacity, View } from "react-native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import { ButtonComponent, ChoiceLocationComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../src/components";
import { colors } from "../src/constrants/color";
import { CategoryModel } from "../src/models/CategoryModel";
import { globalStyles } from "../src/styles/globalStyles";
import { FollowerModel } from "../src/models/FollowerModel";
import { fontFamilies } from "../src/constrants/fontFamilies";
import { DateTime } from "../src/utils/DateTime";
import { numberToString } from "../src/utils/numberToString";
import { Address } from "../src/models/LocationModel";
import RnRangeSlider from "rn-range-slider";
interface Props {
    visible: boolean,
    onClose: () => void,
    onComfirm: () => void,
    categories: CategoryModel[],
    selectedCategories: string[],
    onSelectCategories: (val: string[]) => void,
    selectedDateTime: {
        startAt: string,
        endAt: string
    },
    onSelectDateTime: (val: {
        startAt: string,
        endAt: string
    }) => void,
    selectedAddress: string,
    onSelectAddress: (val: Address) => void,
    selectedPriceRenge:{
        low: number,
        high: number
    },
    onSelectPriceRange:(val:{
        low: number,
        high: number
    })=>void
}
const ModalFilterEvent = (props: Props) => {
    const { visible, onClose, categories, selectedCategories, selectedAddress, onSelectAddress
        , onSelectCategories, onComfirm, onSelectDateTime, selectedDateTime,selectedPriceRenge,onSelectPriceRange } = props
    const [allCategory, setAllCategory] = useState<CategoryModel[]>()
    const modalieRef = useRef<Modalize>()
    const [allFollow, setAllFollow] = useState<FollowerModel[]>([])
    const [rangePriceCopy,setRangePriceCopy] = useState<{
        low: number,
        high: number
    }>({
        low:0,
        high:1000000
    })
    const [filterDate, setFilterDate] = useState('')
    const timeChoises = [{
        key: 'today',
        text: 'Hôm nay'
    },
    {
        key: 'tomorrow',
        text: 'Ngày mai'
    },
    {
        key: 'thisWeek',
        text: 'Trong tuần'
    }
    ]

    useEffect(() => {
        setAllCategory(categories)
        
    }, [categories])
    useEffect(() => {
        if (filterDate === 'today') {
            const d = new Date()
            const date = `${d.getFullYear()}-${numberToString(d.getMonth() + 1)}-${numberToString(d.getDate())}`
            onSelectDateTime({
                startAt: `${date} 00:00:00`,
                endAt: `${date} 23:59:59`
            })
        } else if (filterDate === 'tomorrow') {
            const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
            const date = `${d.getFullYear()}-${numberToString(d.getMonth() + 1)}-${numberToString(d.getDate())}`
            onSelectDateTime({
                startAt: `${date} 00:00:00`,
                endAt: `${date} 23:59:59`
            })
        } else if (filterDate === 'thisWeek') {
            const date = new Date();
            var sub = date.getDay() > 0 ? 1 : -6;
            var dStartAt = new Date(date.setDate(date.getDate() - date.getDay() + sub));
            const startAtWeek = `${dStartAt.getFullYear()}-${numberToString(dStartAt.getMonth() + 1)}-${numberToString(dStartAt.getDate())}`
            var dEndAt = new Date(date.setDate(date.getDate() - date.getDay() + sub) + 24 * 60 * 60 * 1000 * 6);
            const endAtWeek = `${dEndAt.getFullYear()}-${numberToString(dEndAt.getMonth() + 1)}-${numberToString(dEndAt.getDate())}`
            onSelectDateTime({
                startAt: `${startAtWeek} 00:00:00`,
                endAt: `${endAtWeek} 23:59:59`
            })
        }
    }, [filterDate])
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
    const handleChoiseFilterDate = (val: string) => {
        if (val === filterDate) {
            setFilterDate('')
            onSelectDateTime({ startAt: '', endAt: '' })
        } else {
            setFilterDate(val)
        }
    }
    const handleOnSelectLocation = (val: Address) => {
        onSelectAddress(val)
    }
    const handleValueChange = useCallback((low: number, high: number) => {
        onSelectPriceRange({ low, high });
    }, []);
        return (
        <Portal>
            <Modalize
                adjustToContentHeight
                ref={modalieRef}
                key={'ModalFilterEvent'}
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

                <View style={{ paddingTop: 10 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            categories && categories.map((item) => <View style={{ paddingVertical: 4, paddingHorizontal: 4 }} key={item._id}>
                                <TagComponent key={item._id} onPress={() => handleFollowerCategory(item._id)} label={item.name}
                                    bgColor={selectedCategories?.some(idCategory => idCategory === item._id) ? colors.primary : colors.white}
                                    textColor={selectedCategories?.some(idCategory => idCategory === item._id) ? colors.white : colors.black}
                                    styles={[globalStyles.shadow, { borderWidth: 1, borderColor: selectedCategories?.some(idCategory => idCategory === item._id) ? colors.primary : colors.gray }]} />

                            </View>)
                        }
                    </View>
                    <SectionComponent styles={{ paddingHorizontal: 0 }}>
                    <RowComponent justify="space-between">
                        <TextComponent text={'Giá (VNĐ)'} title size={14} />
                        {/* <TextComponent text={`0 - 1000000 (VNĐ)`}/> */}
                    </RowComponent>
                    <SpaceComponent height={20  }/>
                        <RowComponent>
                            <View style={{flex:1,paddingHorizontal:4}}>
                            <RnRangeSlider
                                min={0} max={1000000} step={1000}
                                // low={selectedPriceRenge.low}
                                // high={selectedPriceRenge.high}
                                style={{height: 5, backgroundColor: colors.gray2, borderRadius: 10,marginHorizontal:12, justifyContent: 'center' }}
                                renderThumb={(name) => (
                                    <View style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 100,
                                        borderWidth:2,
                                        borderColor:colors.primary,
                                        backgroundColor: colors.white
                                        
                                    }}>
                                        <View style={{
                                            position:'absolute',
                                            right:0,
                                            left:-20,
                                            bottom:16,
                                            width:50,
                                            alignItems:'center'
                                        }}>
                                            <TextComponent size={12} color={colors.gray} text={name === 'low' ? selectedPriceRenge.low : selectedPriceRenge.high}/>
                                        </View>
                                    </View>
                                )}
                                renderRail={() => <></>}
                                renderRailSelected={() => <View style={{
                                    height:5,
                                    backgroundColor:colors.primary,
                                    borderRadius:10,
                                }}></View>}
                                onValueChanged={handleValueChange}

                            />
                            </View>
                        </RowComponent>
                    </SectionComponent >
                    <View>
                        <SpaceComponent height={12} />
                        <TextComponent text={'Thời gian diễn ra'} title size={14} />
                        <RowComponent justify="flex-start" styles={{ marginVertical: 12 }}>
                            {
                                timeChoises.map((item) => <>
                                    <TouchableOpacity
                                        onPress={() => handleChoiseFilterDate(item.key)}
                                        key={item.key} style={[globalStyles.button,
                                        {
                                            borderColor: colors.gray2, borderWidth: 1, minHeight: 30
                                            , backgroundColor: selectedDateTime.startAt ? filterDate === item.key ? colors.primary : colors.white : colors.white
                                        }]}>
                                        <TextComponent text={item.text} font={fontFamilies.medium} color={selectedDateTime.startAt ? filterDate === item.key ? colors.white : colors.colorText : colors.colorText} />
                                    </TouchableOpacity>
                                    <SpaceComponent width={12} />
                                </>
                                )
                            }
                        </RowComponent>
                    </View>
                    <View>
                        <ChoiceLocationComponent title="Vị trí" value={selectedAddress} onSelect={(val: Address) => handleOnSelectLocation(val)} />

                    </View>
                    
                    <SpaceComponent height={16} />

                </View>
            </Modalize>
        </Portal>
    )
}
export default ModalFilterEvent;