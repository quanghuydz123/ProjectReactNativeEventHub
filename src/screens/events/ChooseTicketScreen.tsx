import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { EventModelNew } from "../../models/EventModelNew";
import { convertMoney } from "../../utils/convertMoney";
import axios from "axios";
import { LoadingModal } from "../../../modals";
import { useSelector } from "react-redux";
import { authSelector, AuthState } from "../../reduxs/reducers/authReducers";

const ChooseTicketScreen = ({navigation,route}:any)=>{
    const {totalPrice}:{totalPrice:number} = route.params
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const auth:AuthState = useSelector(authSelector)
    useEffect(()=>{
        if(paymentUrl){
            navigation.navigate('PaymentScreen',{url:paymentUrl})
        }
    },[paymentUrl])
    const createPaymentUrl = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8888/order/create_payment_url', {
                uid:auth.id,
                amount: totalPrice, // Số tiền cần thanh toán
                language: 'vn',
                bankCode: ''
            });
            setPaymentUrl(response?.data?.url)
        } catch (error:any) {
            console.error('Lỗi khi tạo URL thanh toán:', error);
        } finally {
            setLoading(false);
        }
    };
  return (
    <ContainerComponent back>
        <SectionComponent>
            <TextComponent text={`Tổng tiền ${convertMoney(totalPrice)}`}/>
            <SpaceComponent height={20}/>
            <ButtonComponent type="primary" text="Thanh toán" onPress={()=>createPaymentUrl()}/>
        </SectionComponent>
        <LoadingModal visible={loading}/>
    </ContainerComponent>
  )
}
export default ChooseTicketScreen;