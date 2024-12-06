import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native"
import { ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../../components"
import CardComponent from "../../../components/CardComponent"
import { appInfo } from "../../../constrants/appInfo"
import { colors } from "../../../constrants/color"
import { fontFamilies } from "../../../constrants/fontFamilies"
import QRCode from "react-native-qrcode-svg"
import { useEffect, useRef, useState } from "react"
import Swiper from "react-native-swiper"
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { InvoiceDetailsModel, TicketsPurchase } from "../../../models/InvoiceDetailsModel"
import { DateTime } from "../../../utils/DateTime"
import { convertMoney } from "../../../utils/convertMoney"
import { apis } from "../../../constrants/apis"
import ticketAPI from "../../../apis/ticketAPI"
interface Props {
    invoice: InvoiceDetailsModel,
    idInvoice: string
}
const PurchasedTicketsDetailsScreen = ({ navigation, route }: any) => {
    const { invoiceParams, idInvoice }: { invoiceParams: InvoiceDetailsModel, idInvoice: string } = route.params || { invoiceParams: null, idInvoice: null }
    const [invoice, setinvoice] = useState<InvoiceDetailsModel>(invoiceParams)
    const [index, setIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const cardRef = useRef(null); // Tạo tham chiếu cho card dưới
    const [cardHeitght, setCardHeitght] = useState(appInfo.sizes.HEIGHT * 0.5); // State để lưu width của card dưới
    const [ticketPurchased, seTicketPurchased] = useState<TicketsPurchase[][]>([]);
    useEffect(() => {
        if (!invoice) {
            handleCallAPIGetDetails()
        }
    }, [])
    useEffect(() => {
        if (invoice && invoice?.ticketsPurchase && invoice?.ticketsPurchase?.length > 0) {
            const groupedByTypeTicket = invoice?.ticketsPurchase?.reduce((acc: any, ticket) => {
                const { typeTicketDetails } = ticket;
                if (!acc[typeTicketDetails._id]) {
                    acc[typeTicketDetails._id] = [];
                }
                acc[typeTicketDetails._id].push(ticket);
                return acc;
            }, {});

            for (const typeTicket in groupedByTypeTicket) {
                const tickets: TicketsPurchase[] = groupedByTypeTicket[typeTicket];
                seTicketPurchased(prev => [...prev, tickets])
            }
        }
    }, [invoice])

    const handleCallAPIGetDetails = async () => {
        const api = apis.ticket.getByIdInvoice({ idInvoice: idInvoice })
        setIsLoading(true)
        try {
            const res = await ticketAPI.HandleTicket(api)
            if (res && res.data && res.status === 200) {
                setinvoice(res.data[0])
            }
            setIsLoading(false)
        } catch (error: any) {
            setIsLoading(false)
            const errorMessage = JSON.parse(error.message)
            console.log("PurchasedTicketsDetailsScreen", errorMessage.message)
        }
    }
    const renderItem = (ticket: TicketsPurchase) => {
        return <CardComponent color={colors.background3} styles={{ marginVertical: 0 }}
            ref={cardRef} // Gắn ref cho card dưới
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setCardHeitght(height); // Lấy width và gắn vào state
            }}
        >
            {<>
                <TextComponent text={invoice.eventDetails.title} color={colors.white} font={fontFamilies.semiBold} size={14} />
                <SpaceComponent height={6} />
                <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { id: invoice.eventDetails._id })}>
                    <Image source={{ uri: invoice.eventDetails.photoUrl }} style={{
                        height: appInfo.sizes.HEIGHT * 0.23, objectFit: 'fill', borderRadius: 12
                    }}
                    />
                </TouchableOpacity>
                <SpaceComponent height={12} />
                <RowComponent>
                    <View style={{ flex: 1, flexDirection: 'column', paddingRight: 12, height: '100%' }}>
                        <View>
                            <RowComponent>
                                <TextComponent text={'Loại vé'} size={13} color={colors.white} />
                                <SpaceComponent width={12}/>
                                <TagComponent
                                    label={ticket.isCheckIn ? 'Đã Check-in' : 'Chưa Check-in'}
                                    styles={{ paddingVertical: 2, borderWidth: 1, borderColor: ticket.isCheckIn ? colors.primary :colors.warning }}
                                    textSize={11}
                                    font={fontFamilies.medium}
                                    textColor={colors.white}
                                    bgColor={ticket.isCheckIn ? colors.primary : colors.warning}
                                />
                            </RowComponent>
                            <SpaceComponent height={4}/>
                            <TextComponent text={`${ticket.typeTicketDetails.name} - ${convertMoney(ticket.typeTicketDetails.price)}`} color={colors.primary} size={15} font={fontFamilies.medium} />
                        </View>
                        <SpaceComponent height={12} />
                        <View>
                            <TextComponent text={'Thời gian diễn ra'} size={13} color={colors.white} />
                            <TextComponent text={`${DateTime.GetTime(invoice.showTimeDetails.startDate)} - ${DateTime.GetTime(invoice.showTimeDetails.endDate)}`} size={18} font={fontFamilies.medium} color={colors.primary} />
                            <TextComponent text={`${DateTime.GetDateNew1(invoice.showTimeDetails.startDate, invoice.showTimeDetails.endDate)}`} size={18} font={fontFamilies.medium} color={colors.primary} />
                        </View>
                    </View>
                    <View>
                        <View style={{ backgroundColor: colors.white, padding: 16 }}>
                            <QRCode
                                value={`${ticket.qrCode}`}
                                size={120}
                            />
                        </View>
                        <SpaceComponent height={2} />
                        <TextComponent text={`${ticket.qrCode}`} size={12} textAlign="center" color={colors.white} />

                    </View>
                </RowComponent>
                {(invoice && invoice.ticketsPurchase && invoice.ticketsPurchase.length > 1) && <TextComponent text={'Vuốt ngang màn hình để xem'} textAlign="center" color={colors.white} size={11} styles={{ paddingTop: 22 }} />}

                <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', bottom: -16, left: -12 }} />
                <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', bottom: -16, right: -12 }} />
            </>}
        </CardComponent>
    }
    const renderTypeTicket = (ticket: TicketsPurchase, length: number) => {
        return <RowComponent justify="space-between" styles={{ backgroundColor: colors.background1, flex: 1, borderBottomWidth: 1, borderBottomColor: colors.gray4 }}>
            <View style={{ paddingLeft: 6, paddingRight: 10, flex: 3, paddingVertical: 4 }}>
                <RowComponent >

                    <TextComponent text={ticket?.typeTicketDetails?.name} font={fontFamilies.medium} textAlign="left" size={12} color={colors.white} />
                </RowComponent>
                <SpaceComponent height={4} />
                <RowComponent >

                    <TextComponent text={convertMoney(ticket?.price)} font={fontFamilies.medium} textAlign="left" size={12} color={colors.white} />
                </RowComponent>
            </View>

            <View style={{ padding: 8, flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderLeftColor: colors.gray4, borderRightColor: colors.gray4 }}>
                <TextComponent text={length} textAlign="center" flex={1} size={12} color={colors.white} />
            </View>
            <View style={{ padding: 8, flex: 2 }}>
                <TextComponent text={convertMoney(ticket?.price * length)} textAlign="right" size={12} color={colors.white} />
            </View>
        </RowComponent>
    }

    return <>
        <ContainerComponent back title={'Chi tiết vé đã mua'} bgColor={colors.black} isScroll>

            <SectionComponent>
                {<Swiper
                    loop={false}
                    style={{ minHeight: cardHeitght, height: cardHeitght }}
                    // onIndexChanged={(num) => setIndex(num)}
                    activeDotColor={colors.primary}
                    dotColor={colors.white}
                    dotStyle={{ width: 7, height: 7, borderRadius: 100 }}
                    activeDotStyle={{ width: 10, height: 10, borderRadius: 100 }}
                    // index={index
                    paginationStyle={{ bottom: 26 }}

                >
                    {
                        (invoice && invoice.ticketsPurchase && invoice.ticketsPurchase.length > 0) ? invoice?.ticketsPurchase.map((ticket) => {
                            return renderItem(ticket)
                        }) : <View style={{ height: appInfo.sizes.HEIGHT * 0.5, justifyContent: 'center', backgroundColor: colors.background3 }}>
                            <ActivityIndicator size={20} />
                        </View>
                    }


                </Swiper>}

                <CardComponent color={colors.background3} styles={{ minHeight: appInfo.sizes.HEIGHT * 0.5 }}>
                    {isLoading ? <View style={{ height: appInfo.sizes.HEIGHT * 0.5, justifyContent: 'center' }}>
                        <ActivityIndicator size={20} />
                    </View> : <>
                        <RowComponent>
                            <FontAwesome6 name="ticket-simple" color={colors.white} size={14} />
                            <SpaceComponent width={6} />
                            <TextComponent text={`Đơn hàng: ${invoice?.invoiceDetails?.invoiceCode}`} color={colors.white} font={fontFamilies.semiBold} size={13} />
                        </RowComponent>
                        <SpaceComponent height={16} />
                        <View style={{ borderWidth: 1, borderColor: colors.black }} >
                            <RowComponent justify="space-between" styles={{ borderBottomWidth: 1, borderColor: colors.black, backgroundColor: colors.background2 }}>
                                <TextComponent text={'Ngày đặt vé'} font={fontFamilies.medium} styles={{ padding: 8 }} textAlign="center" flex={1} size={12} color={colors.white} />
                                <TextComponent text={'Phương thức thanh toán'} font={fontFamilies.medium} styles={{ padding: 8, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.black }} flex={1} size={12} color={colors.white} />
                                <TextComponent text={'Tình trạng đơn hàng'} font={fontFamilies.medium} styles={{ padding: 8 }} flex={1} size={12} color={colors.white} />
                            </RowComponent>
                            <RowComponent justify="space-between" styles={{ backgroundColor: colors.background1 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 22, flex: 1, paddingVertical: 4 }}>
                                    <RowComponent>
                                        <Feather name="clock" color={colors.white} size={13} />
                                        <SpaceComponent width={4} />
                                        <TextComponent text={DateTime.GetTime(invoice?.invoiceDetails?.createdAt)} flex={1} textAlign="left" size={12} color={colors.white} />
                                    </RowComponent>
                                    <RowComponent>
                                        <Feather name="calendar" color={colors.white} size={13} />
                                        <SpaceComponent width={4} />
                                        <TextComponent text={DateTime.GetDate2(invoice?.invoiceDetails?.createdAt ?? new Date())} flex={1} textAlign="left" size={12} color={colors.white} />
                                    </RowComponent>
                                </View>
                                <TextComponent text={invoice?.invoiceDetails?.paymentMethod ?? ''} styles={{ padding: 16, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.black }} textAlign="center" flex={1} size={12} color={colors.white} />
                                <TextComponent text={'Thành công'} styles={{ padding: 16 }} textAlign="center" flex={1} size={12} color={colors.white} />
                            </RowComponent>
                        </View>
                        <SpaceComponent height={16} />
                        <RowComponent>
                            <FontAwesome name="user-circle-o" color={colors.white} size={14} />
                            <SpaceComponent width={6} />
                            <TextComponent text={'Thông tin người mua'} color={colors.white} font={fontFamilies.semiBold} size={13} />
                        </RowComponent>
                        <SpaceComponent height={16} />
                        <View style={{ borderWidth: 1, borderColor: colors.black }}>
                            <RowComponent styles={{ borderBottomWidth: 1, borderColor: colors.black }}>
                                <TextComponent text={'Tên'} font={fontFamilies.medium} styles={{ minWidth: appInfo.sizes.WIDTH * 0.3, padding: 8, backgroundColor: colors.background2, }} color={colors.white} size={12} />
                                <TextComponent text={invoice?.invoiceDetails?.fullname ?? ''} styles={{ flex: 1, padding: 8, backgroundColor: colors.background1, borderLeftWidth: 1, borderLeftColor: colors.black }} color={colors.white} size={12} />
                            </RowComponent>
                            <RowComponent styles={{ borderBottomWidth: 1, borderColor: colors.black, backgroundColor: colors.background2 }}>
                                <TextComponent text={'Email'} font={fontFamilies.medium} styles={{ minWidth: appInfo.sizes.WIDTH * 0.3, padding: 8, backgroundColor: colors.background2, }} color={colors.white} size={12} />
                                <TextComponent text={invoice?.invoiceDetails?.email ?? ''} styles={{ flex: 1, padding: 8, backgroundColor: colors.background1, borderLeftWidth: 1, borderLeftColor: colors.black }} color={colors.white} size={12} />
                            </RowComponent>
                            <RowComponent styles={{ borderBottomWidth: 1, borderColor: colors.black }}>
                                <TextComponent text={'Số điện thoại'} font={fontFamilies.medium} styles={{ minWidth: appInfo.sizes.WIDTH * 0.3, padding: 8, backgroundColor: colors.background2, }} color={colors.white} size={12} />
                                <TextComponent text={invoice?.invoiceDetails?.phoneNumber ?? ''} styles={{ flex: 1, padding: 8, backgroundColor: colors.background1, borderLeftWidth: 1, borderLeftColor: colors.black }} color={colors.white} size={12} />
                            </RowComponent>
                            <RowComponent styles={{ backgroundColor: colors.background2 }}>
                                <TextComponent text={'Địa chỉ'} font={fontFamilies.medium} styles={{ minWidth: appInfo.sizes.WIDTH * 0.3, padding: 8, }} color={colors.white} size={12} />
                                <TextComponent text={invoice?.invoiceDetails?.fullAddress ?? ''} styles={{ flex: 1, padding: 8, backgroundColor: colors.background1, borderLeftWidth: 1, borderLeftColor: colors.black }} color={colors.white} size={12} />
                            </RowComponent>
                        </View>
                        <SpaceComponent height={16} />
                        <View style={{ borderWidth: 1, borderColor: colors.gray4, flex: 1 }} >
                            <RowComponent justify="space-between" styles={{ borderBottomWidth: 1, borderColor: colors.gray4, backgroundColor: colors.background2, flex: 1 }}>
                                <TextComponent text={'Loại vé'} font={fontFamilies.medium} styles={{ padding: 8 }} textAlign="center" flex={3} size={12} color={colors.white} />
                                <TextComponent text={'Số lượng'} font={fontFamilies.medium} styles={{ padding: 8, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.gray4 }} textAlign="center" flex={1} size={12} color={colors.white} />
                                <TextComponent text={'Thành tiền'} font={fontFamilies.medium} textAlign="center" styles={{ padding: 8 }} flex={2} size={12} color={colors.white} />
                            </RowComponent>

                            {
                                ticketPurchased.map((ticket) => {
                                    return renderTypeTicket(ticket[0], ticket.length)
                                })
                            }
                            <RowComponent styles={{ backgroundColor: colors.background1, flex: 1, borderBottomWidth: 1, borderBottomColor: colors.gray4 }}>
                                <View style={{ flex: 4 }}>
                                    <TextComponent text={'Tạm tính tổng'} font={fontFamilies.medium} styles={{ padding: 8 }} color={colors.white} size={12} />
                                </View>

                                <View style={{ flex: 2, borderLeftWidth: 1, borderLeftColor: colors.gray4 }}>
                                    <TextComponent text={convertMoney(invoice?.invoiceDetails?.totalPrice ?? 0)} styles={{ padding: 8, backgroundColor: colors.background1 }} textAlign="right" color={colors.white} size={12} />
                                </View>
                            </RowComponent>
                            <RowComponent styles={{ backgroundColor: colors.background1, flex: 1, borderBottomWidth: 1, borderBottomColor: colors.gray4 }}>
                                <View style={{ flex: 4 }}>
                                    <TextComponent text={'Giảm Giá'} font={fontFamilies.medium} styles={{ padding: 8 }} color={colors.white} size={12} />
                                </View>

                                <View style={{ flex: 2, borderLeftWidth: 1, borderLeftColor: colors.gray4 }}>
                                    <TextComponent text={'0 đ'} styles={{ padding: 8, backgroundColor: colors.background1 }} textAlign="right" color={colors.white} size={12} />
                                </View>
                            </RowComponent>
                            <RowComponent styles={{ backgroundColor: colors.background1, flex: 1 }}>
                                <View style={{ flex: 4 }}>
                                    <TextComponent text={'Tổng tiền'} font={fontFamilies.medium} styles={{ padding: 8 }} color={colors.white} size={12} />
                                </View>

                                <View style={{ flex: 2, borderLeftWidth: 1, borderLeftColor: colors.gray4 }}>
                                    <TextComponent text={convertMoney(invoice?.invoiceDetails?.totalPrice ?? 0)} styles={{ padding: 8, backgroundColor: colors.background1 }} textAlign="right" color={colors.white} size={12} />
                                </View>
                            </RowComponent>
                        </View>

                    </>}
                    <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', top: -16, left: -12 }} />
                    <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', top: -16, right: -12 }} />
                </CardComponent>
            </SectionComponent>
        </ContainerComponent>
    </>
}


export default PurchasedTicketsDetailsScreen