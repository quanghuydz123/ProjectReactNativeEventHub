import { Button, FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
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
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { KeyWordModel } from "../src/models/KeyWordModel";
interface Props {
    visible: boolean,
    onClose: () => void,
    onComfirm: () => void,
    categories: CategoryModel[],
    selectedCategories: string[],
    onSelectCategories: (val: string[]) => void,
    selectedKeywords: string[],
    onSelectKeywords: (val: string[]) => void,
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
    onEnableSortByView:(val:boolean)=>void,
    onResetFilter:()=>void,
    keywords:KeyWordModel[]
}
const ModalFilterEvent = (props: Props) => {
    const { visible, onClose, categories,isEnabledSortByView,onResetFilter,onEnableSortByView, selectedCategories, selectedAddress, onSelectAddress
        , onSelectCategories, onComfirm,selectedKeywords,onSelectKeywords,onSelectDateTime, selectedDateTime, selectedPriceRenge, onSelectPriceRange,keywords } = props
    // const [allCategory, setAllCategory] = useState<CategoryModel[]>()
    
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
    },
    {
        key: '1month',
        text: 'Trong tháng'
    },
     {
        key: '3month',
        text: '3 tháng tới'
    },
    {
        key: '6month',
        text: '6 Tháng tới'
    }
    ]

    // useEffect(() => {
    //     setAllCategory(categories)

    // }, [categories])

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
        }else if(filterDate === '1month'){
            const now = new Date();

            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const startAt = `${start.getFullYear()}-${numberToString(start.getMonth() + 1)}-${numberToString(start.getDate())}`;
            const endAt = `${end.getFullYear()}-${numberToString(end.getMonth() + 1)}-${numberToString(end.getDate())}`;

            onSelectDateTime({
                startAt: `${startAt} 00:00:00`,
                endAt: `${endAt} 23:59:59`
            });
        }
        else if(filterDate === '3month'){
            const now = new Date();

            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth()+ 3 + 1, 0);

            const startAt = `${start.getFullYear()}-${numberToString(start.getMonth() + 1)}-${numberToString(start.getDate())}`;
            const endAt = `${end.getFullYear()}-${numberToString(end.getMonth() + 1)}-${numberToString(end.getDate())}`;

            onSelectDateTime({
                startAt: `${startAt} 00:00:00`,
                endAt: `${endAt} 23:59:59`
            });
        }
        else if(filterDate === '6month'){
            const now = new Date();

            const start = new Date(now);
            const end = new Date(now.getFullYear(), now.getMonth() + 6 + 1, 0); 

            const startAt = `${start.getFullYear()}-${numberToString(start.getMonth() + 1)}-${numberToString(start.getDate())}`;
            const endAt = `${end.getFullYear()}-${numberToString(end.getMonth() + 1)}-${numberToString(end.getDate())}`;

            onSelectDateTime({
                startAt: `${startAt} 00:00:00`,
                endAt: `${endAt} 23:59:59`
            });
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
     const renderItem = (item:any) => {
        return (
          <View style={styles.item}>
            <Text style={styles.selectedTextStyle}>{item.name}</Text>
            {/* <AntDesign style={styles.icon} color="black" name="Safety" size={20} /> */}
          </View>
        );
      };
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
                        <ButtonComponent onPress={onResetFilter} text="Xóa bộ lọc" type="primary" styles={{ width: '85%', backgroundColor: 'white' }} textColor={colors.colorText} />
                        <ButtonComponent onPress={onComfirm} text="Áp dụng" type="primary" styles={{ width: '85%' }} />
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
                    <TextComponent text={'Theo từ khóa'} title size={14} />
                        <MultiSelect
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={keywords}
                            labelField="name"
                            valueField="_id"
                            placeholder="Chọn từ khóa..."
                            value={selectedKeywords}
                            search
                            searchPlaceholder="Tìm kiếm..."
                            onChange={item => {
                                onSelectKeywords(item);
                            }}
                            showsVerticalScrollIndicator
                            // renderLeftIcon={() => (
                            //   <AntDesign
                            //     style={styles.icon}
                            //     color="black"
                            //     name="Safety"
                            //     size={20}
                            //   />
                            // )}
                            renderItem={renderItem}
                            renderSelectedItem={(item, unSelect) => (
                                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                <View style={styles.selectedStyle}>
                                    <Text style={styles.textSelectedStyle}>{item.name}</Text>
                                    <AntDesign color="black" name="delete" size={17} />
                                </View>
                                </TouchableOpacity>
                            )}
                            />
                    </View>
                    <View>
                        <SpaceComponent height={12} />
                        <TextComponent text={'Thời gian diễn ra'} title size={14} />
                        <RowComponent justify="flex-start" styles={{ marginVertical: 12,flexWrap:'wrap' }}>
                            {
                                timeChoises.map((item, index) => <>
                                    <TouchableOpacity
                                        onPress={() => handleChoiseFilterDate(item.key)}
                                        key={`time${index}`} style={[globalStyles.button,
                                        {
                                            borderColor: colors.gray2, borderWidth: 1, minHeight: 30,minWidth:'33%'
                                            , backgroundColor: selectedDateTime.startAt ? filterDate === item.key ? colors.primary : colors.white : colors.white
                                        }]}>
                                        <TextComponent text={item.text} font={fontFamilies.medium} color={selectedDateTime.startAt ? filterDate === item.key ? colors.white : colors.colorText : colors.colorText} />
                                    </TouchableOpacity>
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
                    
                   
                        
                    
                    <SpaceComponent height={16} />

                </View>
            </Modalize>
            
        </Portal>
    )
}
export default ModalFilterEvent;

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});