import { Image, View } from "react-native"
import { EventModelNew } from "../models/EventModelNew"
import CardComponent from "./CardComponent"
import RowComponent from "./RowComponent"
import { colors } from "../constrants/color"
import TextComponent from "./TextComponent"
import { fontFamilies } from "../constrants/fontFamilies"
import SpaceComponent from "./SpaceComponent"
import { convertMoney, renderPrice } from "../utils/convertMoney"
import TagComponent from "./TagComponent"
import { DateTime } from "../utils/DateTime"
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { appInfo } from "../constrants/appInfo"
import { useNavigation } from "@react-navigation/native"
import { memo } from "react"
interface Props {
    item: EventModelNew,
    bgColor?: string,
    titleColor?:string,
    textCalendarColor?:string,

}
const EventItemHorizontal = (props: Props) => {
    const { item, bgColor,titleColor ,textCalendarColor} = props
    const navigation: any = useNavigation()
    
    return (
        <CardComponent styles={{ paddingVertical: 0, paddingHorizontal: 0, backgroundColor: bgColor ?? colors.white }} onPress={() => { navigation.push('EventDetails', { id: item._id }); }}>
            <RowComponent>
                <View>
                    <Image source={{ uri: item?.photoUrl }} style={{ width: appInfo.sizes.WIDTH * 0.35, height: appInfo.sizes.HEIGHT*0.12, borderRadius: 12, resizeMode: 'stretch' }} />
                    {item.statusEvent === 'Ended' && <View style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        backgroundColor: colors.warning,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderBottomLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}>
                        <TextComponent text={'Đã diễn ra'} size={8} font={fontFamilies.medium} color="white" />
                    </View>}
                </View>
                <SpaceComponent width={8} />
                <View style={{ flex: 1 }}>

                    <TextComponent numberOfLine={1} text={item?.title} title size={14} color={titleColor ??colors.background} />
                    <TextComponent text={renderPrice(item.showTimes[0])} title size={13} color={`${colors.primary}`} />
                    <RowComponent styles={{ flexWrap: 'wrap' }}>
                        {

                            <View style={{ paddingVertical: 2 }} key={item.category?._id}>
                                <TagComponent
                                    bgColor={colors.primary}
                                    label={item.category.name}
                                    textSize={8}
                                    styles={{
                                        minWidth: 50,
                                        paddingVertical: 2,
                                        paddingHorizontal: 2,
                                    }}
                                />
                            </View>
                        }
                    </RowComponent>

                    {/* {
                      (item.usersInterested && item.usersInterested.length > 0) && <AvatarGroup users={item.usersInterested} />
                    } */}
                    <RowComponent>
                        <Feather name="calendar" size={12} color={textCalendarColor ?? colors.background} />
                        <SpaceComponent width={4} />
                        <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(item?.showTimes[0]?.startDate ?? Date.now()).getDay())} - ${DateTime.GetDateNew1(item?.showTimes[0]?.startDate ?? new Date(), item?.showTimes[0]?.endDate || new Date())} `} color={textCalendarColor ?? colors.background} size={12} />
                    </RowComponent>
                    <RowComponent justify="space-between" styles={{}}>
                        <RowComponent>

                            <TextComponent text={item?.addressDetails?.province?.name ?? ''} font={fontFamilies.medium} numberOfLine={1} color={colors.text2} flex={1} size={12} />

                            <SpaceComponent width={4} />
                            <RowComponent>
                                <FontAwesome name="eye" color={colors.primary} size={16} />
                                <SpaceComponent width={2} />
                                <TextComponent text={item?.viewCount ?? 0} size={12} color={colors.primary} />
                            </RowComponent>
                            <SpaceComponent width={4} />
                        </RowComponent>
                    </RowComponent>
                </View>
            </RowComponent>
        </CardComponent>
    )
}

export default memo(EventItemHorizontal)