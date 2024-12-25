import { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, CricleComponent, DataLoaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent, TicketComponent } from "../components"
import { EventModelNew } from "../models/EventModelNew"
import { FollowModel } from "../models/FollowModel"
import { OrganizerModel } from "../models/OrganizerModel"
import SearchComponent from "../components/SearchComponent"
import { colors } from "../constrants/color"
import { FlatList, View } from "react-native"
import EventItemHorizontal from "../components/EventItemHorizontal"
import { ToastMessaging } from "../utils/showToast"
import { appInfo } from "../constrants/appInfo"
import { useSelector } from "react-redux"
import { authSelector, AuthState } from "../reduxs/reducers/authReducers"
import AvatarItem from "../components/AvatarItem"
import { fontFamilies } from "../constrants/fontFamilies"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { sizeGlobal } from "../constrants/sizeGlobal"
import { UserModel } from "../models/UserModel"
import { InvoiceDetailsModel } from "../models/InvoiceDetailsModel"
import React from "react"
const SearchAndListViewScreen = ({ navigation, route }: any) => {
    const { items, type, title, bgColor,pdH,titleChild }: {
        items: EventModelNew[] | OrganizerModel[] |
        UserModel[] | InvoiceDetailsModel[], type: 'event' | 'organizer' | 'following' | 'ticketPurchased', title?: string, bgColor: string,
        pdH?:number,
        titleChild:string
    } = route.params || {}
    const [searchKey, setSearchKey] = useState('');
    const auth: AuthState = useSelector(authSelector)
    const [fillterItem, setFillterItem] = useState(items)
    const removeVietnameseTones = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };
    useEffect(() => {
        if (type === 'following') {
            const filterCopy: UserModel[] = items.filter((item): item is UserModel => {
                return 'fullname' in item; // Kiểm tra xem item có thuộc tính fullname không
            }).filter((item) => {
                const normalizedSearchKey = removeVietnameseTones(searchKey).toLowerCase();
                const normalizedTitle = removeVietnameseTones(item.fullname).toLowerCase();
                return normalizedTitle.includes(normalizedSearchKey);
            });
            setFillterItem(filterCopy)
        }else if(type === 'ticketPurchased'){
            const filterCopy: InvoiceDetailsModel[] = items.filter((item): item is InvoiceDetailsModel => {
                return 'eventDetails' in item;
            }).filter((item) => {
                const normalizedSearchKey = removeVietnameseTones(searchKey).toLowerCase();
                const normalizedTitle = removeVietnameseTones(item.eventDetails.title).toLowerCase();
                return normalizedTitle.includes(normalizedSearchKey);
            });
            setFillterItem(filterCopy)
        }
    }, [searchKey])
    const renderContent = () => {
        switch (type) {
            case 'event':
                return <>
                    <DataLoaderComponent
                        isFlex
                        data={fillterItem as EventModelNew[]}
                        isLoading={false}
                        messageEmpty="Không có sự kiện nào phù hợp"
                        messTextColor={colors.black}

                        children={
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={fillterItem as EventModelNew[]}
                                keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
                                renderItem={({ item }) => (
                                    <EventItemHorizontal item={item} bgColor={colors.white} textCalendarColor={colors.background} titleColor={colors.background} />
                                )}
                            />
                        }
                    />
                </>
            case 'organizer':
                return <>
                    <DataLoaderComponent
                        isFlex
                        data={fillterItem as OrganizerModel[]}
                        isLoading={false}
                        messageEmpty="Không có sự kiện nào phù hợp"
                        messTextColor={colors.black}

                        children={
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={fillterItem as OrganizerModel[]}
                                keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
                                renderItem={({ item }) => (
                                    <>
                                        <RowComponent justify='space-between' key={item.user._id}>
                                            <RowComponent styles={{ alignItems: 'flex-start', width: appInfo.sizes.WIDTH * 0.72 }} onPress={() => {
                                                if (item?.user._id === auth.id) {
                                                    { ToastMessaging.Warning({ message: 'Đó là bạn mà', visibilityTime: 2000 }) }
                                                }
                                                else {
                                                    navigation.navigate("AboutProfileScreen", { uid: item?.user._id, organizer: item })
                                                }
                                            }}>
                                                <AvatarItem size={80} photoUrl={item.user.photoUrl} colorBorderWidth={colors.gray} />
                                                <SpaceComponent width={8} />
                                                <View style={{ flex: 1 }}>
                                                    <TextComponent text={item.user.fullname} font={fontFamilies.medium} numberOfLine={1} color={colors.white} />
                                                    <TextComponent text={`${item.user.numberOfFollowers} người đang theo dõi`} size={12} color={colors.gray8} />
                                                    <TextComponent text={item.user.bio ?? ''} size={10} numberOfLine={2} color={colors.gray4} />
                                                </View>
                                            </RowComponent>
                                            <ButtonComponent text='Theo dõi' type='primary' textSize={12} styles={{ paddingVertical: 8, paddingHorizontal: 8 }} mrBottom={0} width={appInfo.sizes.WIDTH * 0.2} />
                                        </RowComponent>
                                        <SpaceComponent height={16} />
                                    </>
                                )}
                            />
                        }
                    />
                </>
            case 'following':
                return <>
                    <DataLoaderComponent
                        isFlex
                        data={fillterItem as UserModel[]}
                        isLoading={false}
                        messageEmpty="Không có người dùng nào phù hợp"
                        messTextColor={colors.black}

                        children={
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={fillterItem as UserModel[]}
                                keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
                                renderItem={({ item }) => (
                                    <RowComponent key={item?.createAt} styles={{ paddingBottom: 10 }} >
                                        <RowComponent onPress={() => navigation.navigate("AboutProfileScreen", { uid: item._id, user: item })}>
                                            <AvatarItem size={sizeGlobal.avatarItem - 4} photoUrl={item?.photoUrl} />
                                            <SpaceComponent width={6} />
                                            <View style={{ flex: 1 }}>
                                                <TextComponent text={item?.fullname} title size={15} />
                                                <TextComponent text={'22 người theo dõi chung'} size={13} color={colors.gray} />
                                            </View>
                                            <RowComponent styles={{ alignItems: 'flex-start' }}>
                                                <CricleComponent color={colors.backgroundSearchInput} borderRadius={10} size={44}
                                                    onPress={() => console.log("ok")}
                                                >
                                                    <MaterialCommunityIcons name="facebook-messenger" size={22} color={colors.black} />
                                                </CricleComponent>
                                                <SpaceComponent width={4} />
                                                <ButtonComponent
                                                    onPress={() => console.log("ok")}
                                                    styles={{ paddingLeft: 8 }}
                                                    icon={<Entypo name="dots-three-horizontal" size={18} color={colors.gray} />}
                                                    iconFlex="right" />
                                            </RowComponent>
                                        </RowComponent>
                                    </RowComponent>
                                )}
                            />
                        }
                    />
                </>
            case 'ticketPurchased':
                return <DataLoaderComponent
                    isFlex
                    data={fillterItem as InvoiceDetailsModel[]}
                    isLoading={false}
                    messageEmpty="Không có người dùng nào phù hợp"
                    messTextColor={colors.black}

                    children={
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={fillterItem as InvoiceDetailsModel[]}
                            keyExtractor={(item) => item.invoiceDetails._id} // đảm bảo mỗi item có một key duy nhất
                            renderItem={({ item }) => {
                                return <TicketComponent invoice={item} key={item.invoiceDetails?._id} />
                            }}
                        />
                    }
                />
            default:
                return <></>
        }
    }
    return (
        <ContainerComponent back title={title ?? 'Danh sách'} bgColor={bgColor ?? colors.white}>
            <SectionComponent styles={{ paddingBottom: 8 }}>
                <SearchComponent
                    isNotShowArrow
                    onSearch={(val) => setSearchKey(val)}
                    value={searchKey}
                    onEnd={() => console.log('ok')}
                    bgColor={bgColor ? colors.background : colors.gray8}
                    textColor={bgColor ? colors.white : colors.black}
                />
            </SectionComponent>
            {titleChild && <View style={{paddingHorizontal:12}}>
                <TextComponent color={bgColor ? colors.white : colors.black} text={titleChild} size={20} font={fontFamilies.medium}/>
            </View>}
            <SpaceComponent height={12} />
            <SectionComponent styles={{ flex: 1,paddingHorizontal: pdH ? 0 : 12 }}>
                {renderContent()}
            </SectionComponent>
        </ContainerComponent>
    )
}

export default SearchAndListViewScreen