import { Button, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, InputSpinnerComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../../components";
import { EventModelNew } from "../../../models/EventModelNew";
import { convertMoney } from "../../../utils/convertMoney";
import axios from "axios";
import { LoadingModal } from "../../../../modals";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, AuthState } from "../../../reduxs/reducers/authReducers";
import { colors } from "../../../constrants/color";
import { fontFamilies } from "../../../constrants/fontFamilies";
import { useStatusBar } from "../../../hooks/useStatusBar";
import { appInfo } from "../../../constrants/appInfo";
import Svg, { Line } from "react-native-svg";
import CardComponent from "../../../components/CardComponent";
import { Warning2 } from "iconsax-react-native";
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { TypeTicketModel } from "../../../models/TypeTicketModel";
import { ShowTimeModel } from "../../../models/ShowTimeModel";
import { DateTime } from "../../../utils/DateTime";
import RenderHTML from "react-native-render-html";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { addtotalPriceAndTicket, billingSelector, billingState } from "../../../reduxs/reducers/billingReducer";
const ChooseTicketScreen = ({ navigation, route }: any) => {
    // const { showTimes, idEvent, titleEvent, addRessEvent, locationEvent }: { showTimes: ShowTimeModel, idEvent: string, titleEvent: string, addRessEvent: string, locationEvent: string } = route.params
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [ticketChose, setTicketChose] = useState<{ ticket: TypeTicketModel, amount: number }[]>([])
    const auth: AuthState = useSelector(authSelector)
    const modalieRef = useRef<Modalize>()
    const [openModalize, setOpenModalize] = useState(false)
    const [disableButton, setDisableButton] = useState(true)
    const [totalTicketChose, setTotalTicketChose] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const eventChose:billingState = useSelector(billingSelector)
    const dispatch = useDispatch()
    // useStatusBar('light-content')
    useEffect(() => {
        if (paymentUrl) {
            navigation.navigate('PaymentScreen', { url: paymentUrl })
        }
    }, [paymentUrl])
    const createPaymentUrl = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8888/order/create_payment_url', {
                uid: auth.id,
                amount: 20000, // Số tiền cần thanh toán
                language: 'vn',
                bankCode: ''
            });
            setPaymentUrl(response?.data?.url)
        } catch (error: any) {
            console.error('Lỗi khi tạo URL thanh toán:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (ticketChose.length >= 1) {
            setDisableButton(false)
        } else {
            setDisableButton(true)
        }
    }, [ticketChose])
    useEffect(() => {
        if (openModalize) {
            modalieRef.current?.open()
        } else {
            modalieRef.current?.close()
        }
    }, [openModalize])
    const renderTypeTicket = (typeTicket: TypeTicketModel) => {
        const [amountChose, setAmountChose] = useState(0)
        const renderText = () => {
            let text = 'Tạm thời chưa biết'
            if (typeTicket.status === 'Ended') {
                text = "Đã ngừng bán vé onnile"
            } else if (typeTicket.status === 'SoldOut') {
                text = 'Hết vé'
            } else if (typeTicket.status === 'NotStarted') {
                text = `Mở bán từ ${DateTime.GetTime(typeTicket.startSaleTime)} ${DateTime.GetDate1(typeTicket.startSaleTime)}`
            }
            return text
        }
        const renderInputSpinner = () => {
            let context = <InputSpinnerComponent key={typeTicket._id} value={amountChose} setValue={(val) => setAmountChose(val)} />
            if (typeTicket.status === 'NotStarted') {
                context = <TagComponent
                    bgColor={colors.danger2}
                    label={renderText()}
                    textSize={10}
                    font={fontFamilies.medium}
                    textColor={colors.danger}
                    styles={{
                        paddingVertical: 2,
                        minWidth: 20,
                    }}
                />
            } else if (typeTicket.status === 'SoldOut') {
                context = <TagComponent
                    bgColor={colors.danger2}
                    label={renderText()}
                    textSize={12}
                    font={fontFamilies.medium}
                    textColor={colors.danger}
                    styles={{
                        paddingVertical: 2,
                        minWidth: 20,
                    }}
                />
            } else if (typeTicket.status === 'Ended') {
                context = <TagComponent
                    bgColor={colors.danger2}
                    label={renderText()}
                    textSize={10}
                    font={fontFamilies.medium}
                    textColor={colors.danger}
                    styles={{
                        paddingVertical: 2,
                        minWidth: 20,
                    }}
                />
            }
            return context
        }
        useEffect(() => {
            setTicketChose((prevTickets) => {
                let updatedTickets;
                if (amountChose > 0) {
                    const existingIndex = prevTickets.findIndex(item => item.ticket._id === typeTicket._id);
                    if (existingIndex !== -1) {
                        updatedTickets = [...prevTickets];
                        updatedTickets[existingIndex] = { ticket: typeTicket, amount: amountChose };
                    } else {
                        updatedTickets = [...prevTickets, { ticket: typeTicket, amount: amountChose }];
                    }
                } else {
                    updatedTickets = prevTickets.filter(item => item.ticket._id !== typeTicket._id);
                }

                const totalTickets = updatedTickets.reduce((sum, item) => sum + item.amount, 0);
                const totalAmount = updatedTickets.reduce((sum, item) => sum + item.amount * item.ticket.price, 0);

                setTotalTicketChose(totalTickets);
                setTotalPrice(totalAmount);

                return updatedTickets;
            });
        }, [amountChose, typeTicket]);
        return (
            <>
                <RowComponent key={typeTicket.name} justify="space-between" styles={{
                    paddingBottom: 4,
                }}>
                    <View>
                        <TextComponent
                            text={typeTicket.name}
                            color={colors.primary}
                            font={fontFamilies.medium}
                            styles={{ maxWidth: appInfo.sizes.WIDTH * 0.5 }}
                            size={15}
                        />

                        <TextComponent text={convertMoney(typeTicket.price)} size={14} font={fontFamilies.regular} color={colors.white} />
                    </View>
                    {renderInputSpinner()}
                </RowComponent>
                {typeTicket.description ? <>
                    <CardComponent styles={{}}>
                        <RowComponent styles={{ alignItems: 'flex-start', paddingRight: 50 }}>
                            <Feather name="info" size={18} />
                            <SpaceComponent width={4} />
                            <RenderHTML
                                contentWidth={appInfo.sizes.WIDTH - 20}

                                source={{ html: typeTicket.description }}
                                // tagsStyles={{
                                //   h2: { textAlign: 'center', fontWeight: 'bold', fontSize: 24 },
                                //   p: { textAlign: 'center', fontSize: 16, lineHeight: 24 },
                                //   li: { fontSize: 16, lineHeight: 22 },
                                // }}

                                tagsStyles={{


                                    p: {
                                        margin: 0,
                                        color: colors.gray4,
                                        fontSize: 14,
                                    },
                                    ul: {
                                        color: colors.gray4,
                                        paddingLeft: 20,
                                        marginTop: 2
                                    },
                                    span: {
                                        fontSize: 10,
                                        color: colors.gray4,

                                    }
                                }}
                                computeEmbeddedMaxWidth={() => appInfo.sizes.WIDTH - 90}

                            />
                        </RowComponent>
                    </CardComponent>
                    <SpaceComponent height={10} />
                </> : <></>}
                <Svg height="2" width="100%">
                    <Line x1="0" y1="0" x2="100%" y2="0" stroke={colors.gray2} strokeWidth="1" strokeDasharray="3" />
                </Svg>
                <SpaceComponent height={10} />
            </>
        )
    }
    const renderButtonContinue = () => {
        return (
            <SectionComponent styles={{
                height: totalTicketChose > 0 ? 108 : 74, backgroundColor: colors.background,
                justifyContent: 'center',
                paddingBottom: 0,

            }}>
                {totalTicketChose > 0 && <>
                    <RowComponent>
                        <FontAwesome5 name="ticket-alt" color={colors.white} size={26} />
                        <SpaceComponent width={4} />
                        <TextComponent text={`x ${totalTicketChose}`} color={colors.white} font={fontFamilies.bold} />
                    </RowComponent>
                    <SpaceComponent height={10} />
                </>}
                <View>
                    <ButtonComponent type="primary"
                        styles={{ paddingVertical: 10, width: '100%' }}
                        mrBottom={0}
                        disable={disableButton}
                        text={disableButton ? "Vui lòng chọn vé" : `Tiếp tục - ${convertMoney(totalPrice)}`}
                        textSize={16}
                        textFont={fontFamilies.semiBold}
                        onPress={()=>{
                            dispatch(addtotalPriceAndTicket({totalPrice:totalPrice,totalTicketChose:totalTicketChose,ticketChose:ticketChose}))
                            navigation.navigate('QuestionScreen')
                        }}
                    />
                </View>
            </SectionComponent>
        )
    }
    return (
        <>
            <ContainerComponent isScroll back bgColor={colors.black} colorTitle={colors.white} title={'Chọn loại vé'}>
                <SectionComponent>
                    <RowComponent justify="space-between">
                        <TextComponent text={'Loại vé'} font={fontFamilies.medium} size={15} color={colors.white} />
                        <TextComponent text={'Số lượng'} font={fontFamilies.medium} size={15} color={colors.white} />
                    </RowComponent>
                </SectionComponent>
                <SpaceComponent height={12} />
                <SectionComponent>
                    {/* {renderTypeTicket()}
                {renderTypeTicket()} */}
                    {eventChose.showTimes.typeTickets.map((typeTicket) => {
                        return renderTypeTicket(typeTicket)
                    })}

                </SectionComponent>
                <LoadingModal visible={loading} />
            </ContainerComponent>
            <SectionComponent styles={{
                backgroundColor: colors.background1, justifyContent: 'center',
                paddingTop: 8,
                paddingBottom: 8
            }}

            >
                <RowComponent onPress={() => setOpenModalize(true)}>
                    <FontAwesome6 name="angle-up" size={18} color={colors.white} />
                    <SpaceComponent width={12} />
                    <View>
                        <TextComponent
                            text={eventChose.titleEvent ?? 'Chưa biết'}
                            color={colors.white}
                            numberOfLine={1}
                            size={14}
                            font={fontFamilies.bold}
                        />
                        <TextComponent text={`${DateTime.GetTime(eventChose.showTimes.startDate || new Date())} - ${DateTime.GetTime(eventChose.showTimes.endDate || new Date())}, ${DateTime.GetDateNew1(eventChose.showTimes.startDate, eventChose.showTimes.endDate)}`}
                            color={colors.white}
                            size={11.5}
                            numberOfLine={1} />
                    </View>
                </RowComponent>
            </SectionComponent>
            {renderButtonContinue()}
            <Portal>
                <Modalize
                    ref={modalieRef}
                    key={'ModalShowTimes'}
                    onClose={() => setOpenModalize(false)}
                    modalStyle={{
                        backgroundColor: colors.background1,
                    }}
                    modalHeight={appInfo.sizes.HEIGHT * 0.8}
                    FooterComponent={renderButtonContinue()}
                >
                    <View style={{}}>
                        <View style={{}}>
                            <View style={{ paddingVertical: 24, borderBottomWidth: 5, borderColor: colors.background }}>
                                <TextComponent text={eventChose.titleEvent} size={18} font={fontFamilies.medium} color={colors.white} textAlign="center" />
                            </View>
                            <View style={{ paddingVertical: 24, borderBottomWidth: 5, borderColor: colors.background }}>
                                <RowComponent styles={{ alignItems: 'flex-start', paddingHorizontal: 10 }}>
                                    <FontAwesome6 size={16} color={colors.primary} name="location-dot" style={{}} />
                                    <SpaceComponent width={8} />
                                    <TextComponent text={eventChose.locationEvent}
                                        color={colors.white}
                                        size={13}
                                        numberOfLine={1}
                                        font={fontFamilies.medium}
                                    />
                                </RowComponent>
                                <SpaceComponent height={8} />
                                <RowComponent styles={{ alignItems: 'flex-start', paddingHorizontal: 10 }}>
                                    <FontAwesome6 name="calendar" size={16} color={colors.primary} />
                                    <SpaceComponent width={8} />
                                    <TextComponent text={`${DateTime.GetTime(eventChose.showTimes.startDate || new Date())} - ${DateTime.GetTime(eventChose.showTimes.endDate || new Date())}, ${DateTime.GetDateNew1(eventChose.showTimes.startDate, eventChose.showTimes.endDate)}`}
                                        color={colors.white}
                                        size={13}
                                        numberOfLine={1}
                                        font={fontFamilies.medium}
                                    />
                                </RowComponent>

                            </View>
                            <View style={{ paddingVertical: 6, paddingHorizontal: 10 }}>
                                <TextComponent text={'Giá vé'} color={colors.white} font={fontFamilies.medium} size={15} />
                                <SpaceComponent height={10} />
                                {eventChose.showTimes.typeTickets.map((typeTicket) => {
                                    const renderPrice = () => {
                                        let text = convertMoney(typeTicket.price)
                                        const existingIndex = ticketChose.findIndex((item) => item.ticket._id === typeTicket._id)
                                        if (existingIndex !== -1) {
                                            text = `${ticketChose[existingIndex].amount} x ${convertMoney(typeTicket.price)}`
                                        }
                                        return text
                                    }
                                    return <>
                                        <RowComponent justify="space-between" key={typeTicket._id}>
                                            <TextComponent text={typeTicket.name} color={colors.white} />
                                            <TextComponent text={`${renderPrice()}`} color={colors.primary} size={15} font={fontFamilies.medium} />
                                        </RowComponent>
                                        <SpaceComponent height={2} />
                                    </>
                                })}

                            </View>
                        </View>

                    </View>
                </Modalize>
            </Portal>
        </>
    )
}
export default ChooseTicketScreen;