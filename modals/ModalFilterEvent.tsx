import { Button, FlatList, Switch, Text, TouchableOpacity, View } from "react-native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import { ButtonComponent, ChoiceLocationComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../src/components";
import { colors } from "../src/constrants/color";
import { CategoryModel } from "../src/models/CategoryModel";
import { globalStyles } from "../src/styles/globalStyles";
import { FollowModel } from "../src/models/FollowModel";
import { fontFamilies } from "../src/constrants/fontFamilies";
import { DateTime } from "../src/utils/DateTime";
import { numberToString } from "../src/utils/numberToString";
import { Address } from "../src/models/LocationModel";
import RnRangeSlider from "rn-range-slider";
import Slider from "@react-native-community/slider";
import { appInfo } from "../src/constrants/appInfo";
import { convertMoney } from "../src/utils/convertMoney";
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
    onSelectAddress: (val: string) => void,
    selectedPriceRenge: {
        low: number,
        high: number
    },
    onSelectPriceRange: (val: {
        low: number,
        high: number
    }) => void,
    isEnabledSortByView:boolean,
    onEnableSortByView:(val:boolean)=>void
}
const ModalFilterEvent = (props: Props) => {
    const { visible, onClose, categories,isEnabledSortByView,onEnableSortByView, selectedCategories, selectedAddress, onSelectAddress
        , onSelectCategories, onComfirm, onSelectDateTime, selectedDateTime, selectedPriceRenge, onSelectPriceRange } = props
    const [allCategory, setAllCategory] = useState<CategoryModel[]>()
    const modalieRef = useRef<Modalize>()
    
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
    const handleOnSelectLocation = (val: string) => {
        onSelectAddress(val)
    }
    const handleValueChange = useCallback((low: number, high: number) => {
        onSelectPriceRange({ low, high });
    }, []);
    // const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => {
    //     setIsEnabled(previousState => !previousState);
    // }
    return (
        <Portal>
            <Modalize
                adjustToContentHeight
                ref={modalieRef}
                
                key={'ModalFilterEvent'}
                onClose={() => onClose()}
                modalStyle={{
                    paddingHorizontal: 12,
                    paddingTop: 20,
                }}
                
                FooterComponent={
                    <RowComponent justify="center">
                        <ButtonComponent onPress={onClose} text="Hủy lưu" type="primary" styles={{ width: '85%', backgroundColor: 'white' }} textColor={colors.colorText} />
                        <ButtonComponent onPress={onComfirm} text="Đồng ý" type="primary" styles={{ width: '85%' }} />
                    </RowComponent>
                }
                // HeaderComponent={
                //     <View>
                //         <TextComponent text={'Lọc sự kiện'} title size={16} />
                //     </View>
                // }

            >

                <View style={{ paddingTop: 10 }}>
                    <TextComponent text={'Lọc theo thể loại'} title size={14}/>
                    <SpaceComponent height={4}/>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            categories && categories.map((item, index) => <View style={{ paddingVertical: 4, paddingHorizontal: 4 }} key={`categoriesModalFilter${index}`}>
                                <TagComponent key={item._id} onPress={() => handleFollowerCategory(item._id)} label={item.name}
                                    bgColor={selectedCategories?.some(idCategory => idCategory === item._id) ? colors.primary : colors.white}
                                    textColor={selectedCategories?.some(idCategory => idCategory === item._id) ? colors.white : colors.black}
                                    styles={[globalStyles.shadow, { borderWidth: 1, borderColor: selectedCategories?.some(idCategory => idCategory === item._id) ? colors.primary : colors.gray }]} />

                            </View>)
                        }
                    </View>
                    <SpaceComponent height={12}/>
                    <View style={{flex:1}}>
                        <TextComponent text={'Sắp theo theo'} title size={14}/>
                        <RowComponent styles={{}}>
                            <TextComponent text={'Lượt xem'}/>
                            <SpaceComponent width={12}/>
                            <Switch
                                trackColor={{false: '#767577', true: colors.primary}}
                                thumbColor={isEnabledSortByView ? colors.backgroundBluishWhite : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                                onValueChange={()=>onEnableSortByView(!isEnabledSortByView)}
                                
                                value={isEnabledSortByView}
                            />
                        </RowComponent>
                    </View>
                    <View>
                        <SpaceComponent height={12} />
                        <TextComponent text={'Thời gian diễn ra'} title size={14} />
                        <RowComponent justify="flex-start" styles={{ marginVertical: 12 }}>
                            {
                                timeChoises.map((item, index) => <>
                                    <TouchableOpacity
                                        onPress={() => handleChoiseFilterDate(item.key)}
                                        key={`time${index}`} style={[globalStyles.button,
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
                    <SectionComponent styles={{ paddingHorizontal: 0 }}>
                        <RowComponent justify="space-between">
                            <TextComponent text={'Lọc theo giá'} title size={14} />
                        </RowComponent>
                        <SpaceComponent height={24} />
                        <RowComponent>
                            <View style={{ flex: 1, paddingHorizontal: 4 }}>
                                <RnRangeSlider
                                    min={0} max={5000000} step={10000}
                               
                                    style={{ height: 5, backgroundColor: colors.gray2, borderRadius: 10, marginHorizontal: 12, justifyContent: 'center' }}
                                    renderThumb={(name) => (
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 100,
                                            borderWidth: 2,
                                            borderColor: colors.primary,
                                            backgroundColor: colors.white

                                        }}>
                                            <View style={{
                                                position: 'absolute',
                                                right: 0,
                                                left: name === 'low' ? -26 : -50,
                                                bottom: 16,
                                                width: 70,
                                                alignItems: 'center'
                                            }}>
                                                <TextComponent size={12} color={colors.gray} text={name === 'low' ? convertMoney(selectedPriceRenge.low) : convertMoney( selectedPriceRenge.high)} />
                                            </View>
                                        </View>
                                    )}
                                    renderRail={() => <></>}
                                    renderRailSelected={() => <View style={{
                                        height: 5,
                                        backgroundColor: colors.primary,
                                        borderRadius: 10,
                                    }}></View>}
                                    onValueChanged={handleValueChange}

                                />
                            </View>
                        </RowComponent>
                    </SectionComponent >
                    <View>
                        <ChoiceLocationComponent title="Vị trí" value={selectedAddress} onSelect={(val: string) => handleOnSelectLocation(val)} />
                    </View>
                    {/* <TextComponent text={`Giá ${selectedPriceRenge.low} - ${selectedPriceRenge.high} (VNĐ)`} title size={14} /> */}
                   {/* <RowComponent>
                    <View>
                            <Slider
                                    style={{ width: appInfo.sizes.WIDTH/2 -20, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={500000}
                                    minimumTrackTintColor={colors.primary}
                                    step={10000}
                                    value={selectedPriceRenge.low}
                                    maximumTrackTintColor={colors.background}
                                    onValueChange={(value:number)=>onSelectPriceRange({low:value,high:selectedPriceRenge.high})}
                                    
                                />
                        </View>
                        <View>
                            <Slider
                                style={{ width: appInfo.sizes.WIDTH/2 -20, height: 40 }}
                                minimumValue={500000}
                                maximumValue={1000000}
                                minimumTrackTintColor={`${colors.gray2}`}
                                maximumTrackTintColor={`${colors.primary}`}
                                
                                value={selectedPriceRenge.high}
                                onValueChange={(value:number)=>onSelectPriceRange({low:selectedPriceRenge.low,high:value})}
                                step={10000}
                                
                            />
                            
                        </View>
                   </RowComponent> */}
                        
                    
                    <SpaceComponent height={16} />

                </View>
            </Modalize>
            
        </Portal>
    )
}
export default ModalFilterEvent;