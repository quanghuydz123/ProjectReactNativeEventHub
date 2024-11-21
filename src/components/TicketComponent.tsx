import { useRef, useState } from "react";
import { appInfo } from "../constrants/appInfo";
import RowComponent from "./RowComponent";
import CardComponent from "./CardComponent";
import TextComponent from "./TextComponent";
import CricleComponent from "./CricleComponent";
import { fontFamilies } from "../constrants/fontFamilies";
import { colors } from "../constrants/color";
import SpaceComponent from "./SpaceComponent";
import { View } from "react-native";
import TagComponent from "./TagComponent";
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ButtonComponent from "./ButtonComponent";
import { ArrowDown2 } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { InvoiceDetailsModel } from "../models/InvoiceDetailsModel";
import { DateTime } from "../utils/DateTime";

interface Props{
  invoice:InvoiceDetailsModel
}
const TicketComponent = (props:Props) => {
  const {invoice} = props
  const cardRef = useRef(null); // Tạo tham chiếu cho card dưới
  const [cardHeitght, setCardHeitght] = useState(appInfo.sizes.HEIGHT * 0.24); // State để lưu width của card dưới
  const navigation:any = useNavigation()
  return (
    <>
      <RowComponent onPress={()=>navigation.navigate('PurchasedTicketsDetailsScreen',{invoice:invoice})}>
        <CardComponent color={colors.background3} styles={{ width: appInfo.sizes.WIDTH * 0.21, minHeight: cardHeitght, justifyContent: 'center', alignItems: 'center' }}>
          <TextComponent text={new Date(invoice.showTimeDetails.startDate).getDate()} font={fontFamilies.semiBold} size={22} color={colors.white} />
          <TextComponent text={`Tháng ${new Date(invoice.showTimeDetails.startDate).getMonth()+1}`} font={fontFamilies.semiBold} color={colors.white} />
          <TextComponent text={new Date(invoice.showTimeDetails.startDate).getFullYear()} font={fontFamilies.semiBold} color={colors.white} />
          <TextComponent text={`x${invoice.invoiceDetails.totalTicket}`} size={18} font={fontFamilies.semiBold} color={colors.primary} />

          <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', top: -10, right: -14 }} />
          <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', bottom: -10, right: -14 }} />

        </CardComponent>
        <SpaceComponent width={appInfo.sizes.WIDTH * 0.01} />
        <CardComponent
          ref={cardRef} // Gắn ref cho card dưới
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setCardHeitght(height); // Lấy width và gắn vào state
          }}
          color={colors.background3} styles={{ width: appInfo.sizes.WIDTH * 0.76, minHeight: cardHeitght }}>
          <TextComponent text={invoice.eventDetails.title} color={colors.white} font={fontFamilies.semiBold} size={14} />
          <SpaceComponent height={6} />
          <RowComponent>
            <TagComponent
              label={'Thành công'}
              styles={{ paddingVertical: 2 }}
              textSize={11}
              font={fontFamilies.medium}
              textColor={colors.black}
              bgColor={colors.primary}

            />
            <SpaceComponent width={4} />
            <TagComponent
              label='Vé điện tử'
              styles={{ paddingVertical: 2, borderWidth: 1, borderColor: colors.primary }}
              textSize={11}
              font={fontFamilies.medium}
              textColor={colors.primary}
              bgColor={colors.background1}
            />
          </RowComponent>
          <SpaceComponent height={6} />
          <RowComponent styles={{ alignItems: "center" }}>
            <FontAwesome name='barcode' size={15} color={colors.white} />
            <SpaceComponent width={4} />
            <TextComponent text={`Mã đơn hàng: ${invoice.invoiceDetails.invoiceCode}`} size={12} font={fontFamilies.medium} color={colors.white} />
          </RowComponent>
          <SpaceComponent height={4} />
          <RowComponent styles={{ alignItems: 'flex-start' }}>
            <AntDesign name='clockcircle' size={15} color={colors.white} style={{ marginTop: 3 }} />
            <SpaceComponent width={4} />
            <TextComponent text={`${DateTime.GetTime(invoice.showTimeDetails.startDate)} - ${DateTime.GetTime(invoice.showTimeDetails.endDate)}, ${DateTime.GetDateNew1(invoice.showTimeDetails.startDate,invoice.showTimeDetails.endDate)}`} size={12} font={fontFamilies.medium} color={colors.white} />
          </RowComponent>

          <SpaceComponent height={4} />
          <RowComponent styles={{ alignItems: 'flex-start' }}>
            <FontAwesome6 size={16} color={colors.white} name="location-dot" style={{ marginTop: 3 }} />
            <SpaceComponent width={8} />
            <View style={{ flex: 1 }}>
              <TextComponent text={invoice.eventDetails.Location} numberOfLine={2} color={colors.white} font={fontFamilies.medium} size={12.5} />
              <TextComponent numberOfLine={2} font={fontFamilies.regular} text={invoice.eventDetails.Address} size={12} color={colors.white} />
              <ButtonComponent
                text="Xem trên bảng đồ"
                type="link"
                textFont={fontFamilies.medium}
                icon={<ArrowDown2 size={14} color={colors.primary} />}
                iconFlex="right"
                textSize={11}
                textColor={colors.primary}
              // onPress={() => openMap()}
              />

            </View>
          </RowComponent>

          <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', top: -10, left: -14 }} />
          <CricleComponent children={<></>} color={colors.black} size={24} styles={{ position: 'absolute', bottom: -10, left: -14 }} />

        </CardComponent>
      </RowComponent>
      <SpaceComponent height={4} />
    </>
  )

}


export default TicketComponent