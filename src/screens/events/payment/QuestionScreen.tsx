import { BackHandler, TouchableOpacity, View } from "react-native"
import { ButtonComponent, ContainerComponent, CricleComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../../components"
import { colors } from "../../../constrants/color"
import Fontisto from 'react-native-vector-icons/Fontisto'
import { fontFamilies } from "../../../constrants/fontFamilies"
import LinearGradient from "react-native-linear-gradient"
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import CardComponent from "../../../components/CardComponent"
import { appInfo } from "../../../constrants/appInfo"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { billingSelector, billingState } from "../../../reduxs/reducers/billingReducer"
import { useSelector } from "react-redux"
import { DateTime } from "../../../utils/DateTime"
import { convertMoney, renderPriceTypeTicket } from "../../../utils/convertMoney"
import { TypeTicketModel } from "../../../models/TypeTicketModel"
import { Portal } from "react-native-portalize"
import { Modalize } from "react-native-modalize"
import { useCallback, useEffect, useRef, useState } from "react"
import { AlertComponent } from "../../../components/Alert"
import { constantSelector, constantState } from "../../../reduxs/reducers/constantReducers"
import { apis } from "../../../constrants/apis"
import invoiceAPI from "../../../apis/invoiceAPI"
import { LoadingModal } from "../../../../modals"
import TimeDownComponent from "./TimeDownComponent"
const QuestionScreen = ({ navigation, route }: any) => {

    const showTimeChose: billingState = useSelector(billingSelector)
    const [openModalize, setOpenModalize] = useState(false)
    const modalieRef = useRef<Modalize>()
    // const [count, setCount] = useState(0)
    const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout | null>(null)
    const constant: constantState = useSelector(constantSelector)
    // const [nameScreen,setNameScreen] = useState(constant.nameScreen)
    const billing: billingState = useSelector(billingSelector)
    const [isLoading,setIsLoading] = useState(false)
    useEffect(() => {
        if (openModalize) {
            modalieRef.current?.open()
        } else {
            modalieRef.current?.close()
        }
    }, [openModalize])
    const constantRef = useRef(constant);

    // Update the ref whenever the constant changes
    useEffect(() => {
        constantRef.current = constant;
    }, [constant]);
    const handleCancelInvoice = async () => {
        try {
            setIsLoading(true)
            const api = apis.invoice.cancelInvoice()
            const res = await invoiceAPI.HandleInvoice(api, { ticketsReserve: billing.ticketsReserve }, 'delete')
            if (res && res.status === 200) {
                navigation.goBack()
            }
            setIsLoading(false)
        } catch (error: any) {
            setIsLoading(false)
            // navigation.goBack()
            const errorMessage = JSON.parse(error.message)
            console.log("QuestionScreen", errorMessage)
        }
    }
    const alertCencelInvoice = ()=>{
        AlertComponent({
            title: 'Hủy đơn hàng',
            message: 'Bạn sẽ mất vị trí mình đã lựa chọn. Đơn hàng đang trong qua trình thanh toán cũng bị ảnh hưởng',
            onCancel: () => console.log("oke"),
            onConfirm: () => {
                handleCancelInvoice()
            }
        })
    }
    const handleBackButtonClick = () => {
        if (constantRef.current.nameScreen === 'QuestionScreen') {
            {
                alertCencelInvoice()
            }
        } else {
            navigation.goBack()
        }

        return true;
    }
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, []);
    const renderTypeTicket = useCallback((item: { ticket: TypeTicketModel, amount: number }) => {
        return (
            <>
                <RowComponent justify='space-between' key={item.ticket._id}>
                    <View>
                        <TextComponent text={item.ticket.name} size={16} font={fontFamilies.medium} />
                        <TextComponent text={convertMoney(renderPriceTypeTicket(item.ticket))} />
                    </View>
                    <View>
                        <TextComponent text={item.amount} textAlign='right' />
                        <TextComponent text={convertMoney(renderPriceTypeTicket(item.ticket) * item.amount)} />
                    </View>
                </RowComponent>
                <SpaceComponent height={6} />
            </>
        )
    },[])

    return (
        <>
            <ContainerComponent back title={'Bảng câu hỏi'} bgColor={colors.black} isScroll isHiddenSpaceTop onPressBack={() => handleBackButtonClick()}  >
                <RowComponent justify='space-between' styles={{ paddingHorizontal: 30, backgroundColor: colors.background1, height: appInfo.sizes.HEIGHT * 0.08 }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CricleComponent children={<><Fontisto name='check' size={8} color={colors.black} /></>} size={16} color={colors.white} styles={{ borderWidth: 0.5, borderColor: colors.gray }} />
                        <SpaceComponent height={4} />
                        <TextComponent text={'Chọn vé'} color={colors.white} size={12} />
                    </View>
                    <SpaceComponent width={20} color={colors.gray} height={2} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CricleComponent children={<></>} size={16} color={colors.background1} styles={{ borderWidth: 1.5, borderColor: colors.yellow }} />
                        <SpaceComponent height={4} />
                        <TextComponent text={'Bảng câu hỏi'} color={colors.yellow} font={fontFamilies.semiBold} size={12} />
                    </View>
                    <SpaceComponent width={20} color={colors.gray} height={2} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CricleComponent children={<></>} size={16} color={colors.background1} styles={{ borderWidth: 1.5, borderColor: colors.gray }} />
                        <SpaceComponent height={4} />
                        <TextComponent text={'Thanh toán'} color={colors.gray4} size={12} />
                    </View>
                </RowComponent>
                <LinearGradient colors={['rgba(76,55,74,1)', 'rgba(43,80,62,1)']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} >
                    <View>
                        <SectionComponent>
                            <View style={{ paddingVertical: 14 }}>
                                <TextComponent text={showTimeChose.titleEvent} size={18} font={fontFamilies.medium} color={colors.white} />
                            </View>
                            <SpaceComponent height={1} color={colors.gray3} />
                            <SpaceComponent height={16} />
                            <View style={{}}>
                                <RowComponent styles={{ alignItems: 'flex-start' }}>
                                    <FontAwesome6 size={16} color={colors.white} name="location-dot" style={{}} />
                                    <SpaceComponent width={8} />
                                    <View>
                                        <TextComponent text={showTimeChose.locationEvent}
                                            color={colors.white}
                                            size={13}
                                            numberOfLine={1}
                                            font={fontFamilies.medium}
                                        />
                                        <TextComponent text={showTimeChose.addRessEvent}
                                            color={colors.white}
                                            size={12}
                                            numberOfLine={1}
                                            font={fontFamilies.regular}
                                        />
                                    </View>
                                </RowComponent>
                                <SpaceComponent height={8} />
                                <RowComponent styles={{ alignItems: 'flex-start' }}>
                                    <FontAwesome6 name="calendar" size={16} color={colors.white} />
                                    <SpaceComponent width={8} />
                                    <TextComponent text={`${DateTime.GetTime(showTimeChose.showTimes.startDate || new Date())} - ${DateTime.GetTime(showTimeChose.showTimes.endDate || new Date())}, ${DateTime.GetDateNew1(showTimeChose.showTimes.startDate, showTimeChose.showTimes.endDate)}`}
                                        color={colors.white}
                                        size={13}
                                        numberOfLine={1}
                                        font={fontFamilies.medium}
                                    />
                                </RowComponent>
                            </View>
                            <SpaceComponent height={10} />
                            <View>
                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: colors.white, paddingVertical: 16, paddingHorizontal: 10 }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <TextComponent text={'Hoàn tất đặt vé trong'} size={13} font={fontFamilies.medium} textAlign='center' color={colors.white} />
                                        <SpaceComponent height={6} />
                                        <TimeDownComponent />
                                    </View>
                                </View>
                            </View>
                        </SectionComponent>
                    </View>
                </LinearGradient>
                <SpaceComponent height={8} />
                <SectionComponent>
                    <TextComponent text={'BẢNG CÂU HỎI'} font={fontFamilies.bold} size={20} color={colors.primary} />
                    <CardComponent color={colors.background1}>
                        <TextComponent text={'Tôi đồng ý cho EventHub & BTC sử dụng thông tin đặt vé nhằm mục đích vận hành sự kiện'} color={colors.white} font={fontFamilies.medium} size={14} />
                        <SpaceComponent height={8} />
                        <InputComponent value={''} borderColor={colors.gray4} require bgColor={colors.background2} title="Họ tên" colorTitle={colors.white} allowClear onChange={val => console.log(val)} />

                        <InputComponent value={''} borderColor={colors.gray4} bgColor={colors.background2} title="Làm sao bạn biết đến sự kiện này ? " colorTitle={colors.white} allowClear onChange={val => console.log(val)} />

                        <InputComponent value={''} borderColor={colors.gray4} bgColor={colors.background2} title="Bạn có câu hỏi gì cho BTC không ? " colorTitle={colors.white} allowClear onChange={val => console.log(val)} />

                        <InputComponent value={''} borderColor={colors.gray4} bgColor={colors.background2} title="Ghi chú thêm" colorTitle={colors.white} allowClear onChange={val => console.log(val)} />

                    </CardComponent>
                </SectionComponent>
                <SectionComponent>
                    <CardComponent>
                        <RowComponent justify='space-between' >
                            <TextComponent text={'Thông tin đặt vé'} size={18} font={fontFamilies.bold} />
                            <ButtonComponent text='Chọn lại vé' textSize={14} onPress={() => alertCencelInvoice()} />
                        </RowComponent>
                        <SpaceComponent height={10} />
                        <RowComponent justify='space-between' >
                            <TextComponent text={'Loại vé'} size={16} font={fontFamilies.medium} />
                            <TextComponent text={'Số lượng'} size={16} font={fontFamilies.medium} />
                        </RowComponent>
                        <SpaceComponent height={10} />
                        {showTimeChose.ticketChose?.map((item) => {
                            return renderTypeTicket(item)
                        })}
                        <SpaceComponent height={8} />
                        <RowComponent justify='space-between' >
                            <TextComponent text={'Tạm tính'} size={18} font={fontFamilies.medium} />
                            <TextComponent text={convertMoney(showTimeChose.totalPrice || 0)} size={18} color={colors.primary} font={fontFamilies.semiBold} />
                        </RowComponent>
                        <View style={{ paddingTop: 26 }}>
                            <TextComponent text={'Vui lòng trả tất cả câu hỏi để tiếp tục'} textAlign='center' size={12} font={fontFamilies.medium} />
                        </View>
                    </CardComponent>
                </SectionComponent>
            </ContainerComponent>
            <SectionComponent bgColor={colors.black} styles={{ paddingVertical: 8 }}>
                <RowComponent justify='space-between'>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setOpenModalize(true)}>
                        <TextComponent text={'Tổng tiền'} size={18} font={fontFamilies.medium} color={colors.white} />
                        <SpaceComponent height={4} />
                        <RowComponent>
                            <TextComponent text={convertMoney(showTimeChose.totalPrice || 0)} size={20} font={fontFamilies.medium} color={colors.primary} />
                            <SpaceComponent width={8} />
                            <FontAwesome name="chevron-up" color={colors.primary} size={14} />
                        </RowComponent>
                    </TouchableOpacity>
                    <ButtonComponent text='Tiếp tục' onPress={() => navigation.navigate('InvoiceComfirmScreen')} type='primary' mrBottom={0} width={'auto'} styles={{ paddingVertical: 8 }} />
                </RowComponent>
            </SectionComponent>
            <LoadingModal  visible={isLoading}/>
            <Portal>
                <Modalize
                    adjustToContentHeight
                    ref={modalieRef}
                    key={'ModalShowTimes'}
                    onClose={() => setOpenModalize(false)}
                    modalStyle={{
                        backgroundColor: colors.background1,
                    }}
                    // modalHeight={appInfo.sizes.HEIGHT * 0.8}
                    FooterComponent={<>

                    </>}
                >
                    <SectionComponent>
                        <CardComponent>
                            <RowComponent justify='space-between' >
                                <TextComponent text={'Thông tin đặt vé'} size={18} font={fontFamilies.bold} />
                                <ButtonComponent text='Chọn lại vé' textSize={14} onPress={() => alertCencelInvoice()} />
                            </RowComponent>
                            <SpaceComponent height={10} />
                            <RowComponent justify='space-between' >
                                <TextComponent text={'Loại vé'} size={16} font={fontFamilies.medium} />
                                <TextComponent text={'Số lượng'} size={16} font={fontFamilies.medium} />
                            </RowComponent>
                            <SpaceComponent height={10} />
                            {showTimeChose.ticketChose?.map((item) => {
                                return renderTypeTicket(item)
                            })}
                            <SpaceComponent height={8} />
                            <RowComponent justify='space-between' >
                                <TextComponent text={'Tạm tính'} size={18} font={fontFamilies.medium} />
                                <TextComponent text={convertMoney(showTimeChose.totalPrice || 0)} size={18} color={colors.primary} font={fontFamilies.semiBold} />
                            </RowComponent>
                            <View style={{ paddingTop: 26 }}>
                                <TextComponent text={'Vui lòng trả tất cả câu hỏi để tiếp tục'} textAlign='center' size={12} font={fontFamilies.medium} />
                            </View>
                        </CardComponent>
                    </SectionComponent>
                </Modalize>
            </Portal>
        </>
    )
}



export default QuestionScreen