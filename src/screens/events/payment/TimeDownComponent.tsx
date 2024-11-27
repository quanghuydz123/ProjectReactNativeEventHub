import { memo, useEffect, useState } from "react";
import { RowComponent, CricleComponent, TextComponent } from "../../../components"
import { colors } from "../../../constrants/color"
import { fontFamilies } from "../../../constrants/fontFamilies"
import { useDispatch, useSelector } from "react-redux";
import { billingSelector, billingState, updateTimeOrder } from "../../../reduxs/reducers/billingReducer";
import { useNavigation } from "@react-navigation/native";
import { apis } from "../../../constrants/apis";
import invoiceAPI from "../../../apis/invoiceAPI";
import { constantSelector } from "../../../reduxs/reducers/constantReducers";


const TimeDownComponent = () => {
    const bill: billingState = useSelector(billingSelector)
    const dispatch = useDispatch()

    const contants = useSelector(constantSelector)
    const navigation: any = useNavigation()
    useEffect(() => {
        const timer = setInterval(() => {
            if (bill.orderTime === 0) {
                handleCancelInvoice()
                clearInterval(timer);
                return;
            }
            else {
                const timeNew = bill.orderTime - 1
                dispatch(updateTimeOrder({ orderTime: timeNew }))
            }
        }, 1000);



        return () => clearInterval(timer);
    }, [bill.orderTime]);
    const handleCancelInvoice = async () => {
        try {
            const api = apis.invoice.cancelInvoice()
            const res = await invoiceAPI.HandleInvoice(api, { ticketsReserve: bill.ticketsReserve }, 'delete')
            if (res && res.status === 200) {
                if (contants.nameScreen === 'QuestionScreen') {
                    navigation.goBack()
                } else if (contants.nameScreen === 'InvoiceComfirmScreen') {
                    navigation.pop(2)
                }
            }
        } catch (error: any) {
            // navigation.goBack()
            const errorMessage = JSON.parse(error.message)
            console.log("QuestionScreen", errorMessage)
        }
    }
    return <RowComponent>
        <CricleComponent children={<TextComponent text={String(Math.floor(bill.orderTime / 60)).padStart(2, '0')} size={18} font={fontFamilies.medium} color={colors.white} />} borderRadius={10} />
        <TextComponent text={':'} size={20} color={colors.white} styles={{ marginHorizontal: 6 }} />
        <CricleComponent children={<TextComponent text={String(bill.orderTime % 60).padStart(2, '0')} size={18} font={fontFamilies.medium} color={colors.white} />} borderRadius={10} />
    </RowComponent>
}

export default memo(TimeDownComponent)