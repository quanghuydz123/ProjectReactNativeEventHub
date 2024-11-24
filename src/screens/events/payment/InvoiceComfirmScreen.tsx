import { Image, Text, TouchableOpacity, View } from "react-native"
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
import { convertMoney } from "../../../utils/convertMoney"
import { TypeTicketModel } from "../../../models/TypeTicketModel"
import { Portal } from "react-native-portalize"
import { Modalize } from "react-native-modalize"
import { useEffect, useMemo, useRef, useState } from "react"
import { RadioButton } from "react-native-paper"
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group"
import { size } from "lodash"
import axios from "axios"
import { authSelector, AuthState } from "../../../reduxs/reducers/authReducers"
import { LoadingModal } from "../../../../modals"
import AntDesign from 'react-native-vector-icons/AntDesign'
const InvoiceComfirmScreen = ({ navigation, route }: any) => {
    const showTimeChose: billingState = useSelector(billingSelector)
    const [openModalize, setOpenModalize] = useState(false)
    const modalieRef = useRef<Modalize>()
    const [methodPayment, setMethodPayment] = useState('first');
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [isLoading,setIsLoading] = useState(false)
    const auth:AuthState = useSelector(authSelector)
    useEffect(() => {
        console.log("paymentUrl",paymentUrl)
        if (paymentUrl) {
            navigation.navigate('PaymentScreen', { url: paymentUrl })
        }
    }, [paymentUrl])
    const createPaymentUrl = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8888/order/create_payment_url', {
                uid: auth.id,
                amount: showTimeChose.totalPrice ?? 0, // Số tiền cần thanh toán
                language: 'vn',
                bankCode: ''
            });
            setPaymentUrl(response?.data?.url)
        } catch (error: any) {
            console.error('Lỗi khi tạo URL thanh toán:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (openModalize) {
            modalieRef.current?.open()
        } else {
            modalieRef.current?.close()
        }
    }, [openModalize])
    const radioButtons:RadioButtonProps[] = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: <>
                <SpaceComponent width={8}/>
                <RowComponent>
                    <Image source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s'}}
                     width={26} height={26} style={{borderRadius:4}}
                    />
                    <SpaceComponent width={8}/>
                    <TextComponent text={'VNPAY'} color={colors.white} font={fontFamilies.medium}/>
                </RowComponent>
            </>,
            value:'vnpay',
            containerStyle:{flex:1,width:'100%'},
            color:colors.primary,
            borderColor:'white',
            borderSize:2,
            size:20
        },
        
    ]), []);

    const [selectedId, setSelectedId] = useState('1');
    const renderTypeTicket = (item: { ticket: TypeTicketModel, amount: number }) => {
        return (
            <>
                <RowComponent 
                styles={{}}
                justify='space-between' key={item.ticket._id}>
                    <View>
                        <TextComponent text={item.ticket.name} size={16} font={fontFamilies.medium} />
                        <TextComponent text={convertMoney(item.ticket.price)} />
                    </View>
                    <View>
                        <TextComponent text={item.amount} textAlign='right' />
                        <TextComponent text={convertMoney(item.ticket.price * item.amount)} />
                    </View>
                </RowComponent>
                <SpaceComponent height={6} />
            </>
        )
    }
    return (
        <>
            <ContainerComponent back title={'Bảng câu hỏi'} bgColor={colors.black} isScroll isHiddenSpaceTop>
                <RowComponent justify='space-between' styles={{ paddingHorizontal: 30, backgroundColor: colors.background1, height: appInfo.sizes.HEIGHT * 0.08 }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CricleComponent children={<><Fontisto name='check' size={8} color={colors.black} /></>} size={16} color={colors.white} styles={{ borderWidth: 0.5, borderColor: colors.gray }} />
                        <SpaceComponent height={4} />
                        <TextComponent text={'Chọn vé'} color={colors.white} size={12} />
                    </View>
                    <SpaceComponent width={20} color={colors.gray} height={2} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CricleComponent children={<><Fontisto name='check' size={8} color={colors.black} /></>} size={16} color={colors.white} styles={{ borderWidth: 0.5, borderColor: colors.gray }} />
                        <SpaceComponent height={4} />
                        <TextComponent text={'Bảng câu hỏi'} color={colors.white} size={12} />
                    </View>
                    <SpaceComponent width={20} color={colors.gray} height={2} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CricleComponent children={<></>} size={16} color={colors.background1} styles={{ borderWidth: 1.5, borderColor: colors.yellow }} />
                        <SpaceComponent height={4} />
                        <TextComponent text={'Thanh Toán'}  color={colors.yellow} font={fontFamilies.semiBold} size={12} />
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
                                        <RowComponent>
                                            <CricleComponent children={<TextComponent text={'15'} size={18} font={fontFamilies.medium} color={colors.white} />} borderRadius={10} />
                                            <TextComponent text={':'} size={20} color={colors.white} styles={{ marginHorizontal: 6 }} />
                                            <CricleComponent children={<TextComponent text={'00'} size={18} font={fontFamilies.medium} color={colors.white} />} borderRadius={10} />
                                        </RowComponent>
                                    </View>
                                </View>
                            </View>
                        </SectionComponent>
                    </View>
                </LinearGradient>
                <SpaceComponent height={12}/>
                <SectionComponent >
                    <CardComponent>
                        <RowComponent styles={{alignItems:'flex-start',paddingRight:12}}>
                        <AntDesign size={10} name="warning" style={{marginTop:4}}/>
                        <SpaceComponent width={6}/>
                        <Text>
                            Lưu ý kiểm tra thông tin nhận vé. Nếu có thay đổi, vui lòng
                            <Text style={{color:colors.blue}} onPress={() => navigation.navigate('EditProfileScreen')}> cập nhập tại đây</Text>
                        </Text>
                        </RowComponent>
                    </CardComponent>
                </SectionComponent>
                <SectionComponent>
                    <CardComponent color={colors.background1}>
                        <RowComponent justify="space-between">
                            <TextComponent text={'Thông tin nhận vé'} color={colors.primary} font={fontFamilies.medium} size={16} />
                            <ButtonComponent text="Sửa" textSize={16} textColor={colors.primary} 
                                onPress={() => navigation.navigate('EditProfileScreen')}
                            />
                        </RowComponent>
                        <SpaceComponent height={16}/>
                        <View>
                            <RowComponent>
                                <TextComponent text={auth?.fullname ?? ''} font={fontFamilies.medium} color={colors.white}/>
                                <SpaceComponent width={8}/>
                                <TextComponent text={auth?.phoneNumber ?? ''} color={colors.white}/>
                            </RowComponent>
                            <SpaceComponent height={8}/>
                            <TextComponent text={auth?.email ?? ''} font={fontFamilies.medium} color={colors.white}/>
                            <SpaceComponent height={8}/>
                            <TextComponent 
                                size={14} 
                                text={[
                                    auth?.address?.houseNumberAndStreet,
                                    auth?.address?.ward?.name,
                                    auth?.address?.districts?.name,
                                    auth?.address?.province?.name
                                ].filter(Boolean).join(', ')} 
                                color={colors.white} 
                            />

                        </View>

                    </CardComponent>
                </SectionComponent>
                <SectionComponent>
                    <CardComponent color={colors.background1}>
                        <TextComponent text={'Phương thức thanh toán'} color={colors.primary} font={fontFamilies.medium} size={16} />
                        <SpaceComponent height={10}/>
                        <RadioGroup 
                            radioButtons={radioButtons} 
                            onPress={setSelectedId}
                            selectedId={selectedId}
                            containerStyle={{alignItems:'flex-start'}}
                            labelStyle={{backgroundColor:'red'}}
                            
                        />

                    </CardComponent>
                </SectionComponent>
                <SectionComponent>
                    <CardComponent>
                        <RowComponent justify='space-between' >
                            <TextComponent text={'Thông tin đặt vé'} size={18} font={fontFamilies.bold} />
                            <ButtonComponent text='Chọn lại vé' textSize={14} onPress={() => navigation.pop(2)} />
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
                            <TextComponent text={'Bằng việc tiến hanh thanh toán, bạn đã đồng ý với Điều Kiện Giao Dịch Chung'} textAlign='center' size={12} font={fontFamilies.medium} />
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
                    <ButtonComponent text='Thanh toán' onPress={()=>createPaymentUrl()} type='primary' mrBottom={0} width={'auto'} styles={{ paddingVertical: 8 }} />
                </RowComponent>
            </SectionComponent>
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
                                <ButtonComponent text='Chọn lại vé' textSize={14} onPress={() => navigation.goBack()} />
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
                                <TextComponent text={'Bằng việc tiến hanh thanh toán, bạn đã đồng ý với Điều Kiện Giao Dịch Chung'} textAlign='center' size={12} font={fontFamilies.medium} />
                            </View>
                        </CardComponent>
                    </SectionComponent>
                </Modalize>
            </Portal>
            <LoadingModal visible={isLoading} />
        </>
    )
}

export default InvoiceComfirmScreen