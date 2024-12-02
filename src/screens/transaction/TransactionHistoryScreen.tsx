import { Button, Text, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../components";
import QRCode from "react-native-qrcode-svg";
import Accordion from 'react-native-collapsible/Accordion';
import { colors } from "../../constrants/color";
import ListTicketComponent from "../events/components/ListTicketComponent";
import LottieView from "lottie-react-native";
import SearchComponent from "../../components/SearchComponent";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { fontFamilies } from "../../constrants/fontFamilies";
import AvatarItem from "../../components/AvatarItem";
import { useSelector } from "react-redux";
import { authSelector, AuthState, Invoice } from "../../reduxs/reducers/authReducers";
import { convertMoney } from "../../utils/convertMoney";
import { DateTime } from "../../utils/DateTime";
import { apis } from "../../constrants/apis";
import invoiceAPI from "../../apis/invoiceAPI";
import { appInfo } from "../../constrants/appInfo";
import { LoadingModal } from "../../../modals";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import CardComponent from "../../components/CardComponent";
const TransactionHistoryScreen = ({ navigation, route }: any) => {
  const [search, setSearch] = useState('')
  const auth: AuthState = useSelector(authSelector)
  const [invoices, setInvoices] = useState<Invoice[][]>(auth?.invoices)
  const [isLoading, setIsLoading] = useState(false)
  const [openModalize, setOpenModalize] = useState(false)

  useEffect(() => {
    setInvoices(auth?.invoices)
  }, [auth])
  const modalieRef = useRef<Modalize>()
  useEffect(() => {
    if (openModalize) {
      modalieRef.current?.open()
    } else {
      modalieRef.current?.close()
    }
  }, [openModalize])
  const handleCallAPISearchInvoice = async () => {
    const api = apis.invoice.getByIdUser({ idUser: auth.id, searchValue: search })
    setIsLoading(true)
    try {
      const res = await invoiceAPI.HandleInvoice(api)
      if (res && res.data && res.status === 200) {
        setInvoices(res.data)
      }
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log("TransactionHistoryScreen", errorMessage.message)
    }
  }
  const renderInvoice = (invoice: Invoice, index: number) => {
    return (
      <SectionComponent
        onPress={() => navigation.navigate('PurchasedTicketsDetailsScreen', { idInvoice: invoice._id })}
        styles={{ paddingVertical: 12, backgroundColor: index % 2 !== 0 ? '#f7fbfe' : colors.white }} key={invoice._id}>
        <RowComponent>
          <RowComponent styles={{ backgroundColor: index % 2 !== 0 ? '#f7fbfe' : colors.white }}>
            <AvatarItem
              photoUrl="https://img.freepik.com/premium-vector/success-payment-icon-flat-style-approved-money-vector-illustration-isolated-background-successful-pay-sign-business-concept_157943-1354.jpg"
              size={50}
              borderWidth={0}

            />
          </RowComponent>
          <SpaceComponent width={8} />
          <View style={{ flex: 1 }}>
            <TextComponent text={`${invoice?.titleEvent}`} size={15} font={fontFamilies.medium} />
            <TextComponent text={`${DateTime.GetTime(invoice.createdAt)} - ${DateTime.GetDate2(invoice.createdAt)}`} size={12} />
            <RowComponent justify="space-between">
              <TextComponent text={`Số lượng vé: ${invoice.totalTicket}`} size={12} />
              <TextComponent text={`-${convertMoney(invoice?.totalPrice ?? 0)}`} font={fontFamilies.medium} color={colors.primary} size={15} />
            </RowComponent>
          </View>
        </RowComponent>
      </SectionComponent>
    )
  }
  const renderData = () => {
    return (
      <>
        {
          (invoices && invoices.length) > 0 ? invoices.map((invoiceGroup: Invoice[], index) => {
            return (
              <View key={index}>
                <View style={{ paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#e7f4fd' }}>
                  <TextComponent text={DateTime.GetMonthAndYear(invoiceGroup[0].createdAt)} font={fontFamilies.semiBold} size={21} />
                </View>
                <View>
                  {
                    invoiceGroup.map((invoice, index) => {
                      return renderInvoice(invoice, index)
                    })
                  }
                </View>
              </View>
            )
          }) : <View style={{ height: appInfo.sizes.HEIGHT * 0.8, justifyContent: 'center', alignItems: 'center' }}>
            <TextComponent text={'Không có giao dịch nào'} />
          </View>

        }
      </>
    )
  }
  return (
    <ContainerComponent

      isHiddenSpaceTop title={<SearchComponent value={search}
        onSearch={(val) => setSearch(val)}
        bgColor={colors.white}
        isNotShowArrow

        onEnd={() => handleCallAPISearchInvoice()}
        titlePlaceholder="Tìm kiếm giao dịch"
        styles={{

        }}

      />}
      right={
        <>
          <CricleComponent size={30} color={colors.white} styles={{ marginLeft: 10 }} onPress={() => setOpenModalize(true)}>
            <MaterialCommunityIcons name="filter-outline" size={24} color={colors.black} />
          </CricleComponent>
        </>
      }
      isScroll
    >
      {
        renderData()
      }

      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalieRef}
          key={'ModalFilterTransaction'}
          onClose={() => setOpenModalize(false)}
          modalStyle={{ paddingVertical: 12, backgroundColor: colors.backgroundBluishWhite }}
          // modalHeight={appInfo.sizes.HEIGHT * 0.8}
          FooterComponent={<>
            <SectionComponent>
              <TextComponent text={'Bộ lọc lịch sự giao dịch'} size={18} font={fontFamilies.medium} />
              <SpaceComponent height={8} />
              <TextComponent text={'Thời gian'} size={16} />
              <RowComponent styles={{ flexWrap: 'wrap' }}>
                <CardComponent styles={{
                  width: appInfo.sizes.WIDTH * 0.29, paddingVertical: 18,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  backgroundColor:'#d6f7e6'
                }}>
                  <TextComponent text={'Tất cả'} size={13} textAlign="center"/>
                </CardComponent>
                <SpaceComponent width={8} />
                <CardComponent styles={{ width: appInfo.sizes.WIDTH * 0.29, paddingVertical: 18 }}>
                  <TextComponent text={'Tháng 12/2024'} size={13} textAlign="center"/>
                </CardComponent>
                <SpaceComponent width={8} />
                <CardComponent styles={{ width: appInfo.sizes.WIDTH * 0.29, paddingVertical: 18 }}>
                  <TextComponent text={'Tháng 11/2024'} size={13} textAlign="center"/>
                </CardComponent>
                <SpaceComponent width={8} />
                <CardComponent styles={{ width: appInfo.sizes.WIDTH * 0.29, paddingVertical: 18 }}>
                  <TextComponent text={'Tháng 10/2024'} size={13} textAlign="center"/>
                </CardComponent>
              </RowComponent>
            </SectionComponent>
          </>}
        >

        </Modalize>
      </Portal>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>

  )
}
export default TransactionHistoryScreen;