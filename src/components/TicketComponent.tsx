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


const TicketComponent = () => {
    const cardRef = useRef(null); // Tạo tham chiếu cho card dưới
    const [cardHeitght, setCardHeitght] = useState(appInfo.sizes.HEIGHT * 0.24); // State để lưu width của card dưới
    return (
        <>
             <RowComponent>
            <CardComponent color={'#535257'} styles={{ width: appInfo.sizes.WIDTH * 0.2, minHeight: cardHeitght, justifyContent: 'center', alignItems: 'center' }}>
              <TextComponent text={'22'} font={fontFamilies.semiBold} size={22} color={colors.white} />
              <TextComponent text={'Tháng 11'} font={fontFamilies.semiBold} color={colors.white} />
              <TextComponent text={'2024'} font={fontFamilies.semiBold} color={colors.white} />
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
            color={'#535257'} styles={{ width: appInfo.sizes.WIDTH * 0.77, minHeight: cardHeitght }}>
              <TextComponent text={'Khóa tu cuối tuần TÌM VỀ CHÍNH MÌNH'} color={colors.white} font={fontFamilies.semiBold} size={14} />
              <SpaceComponent height={6} />
              <RowComponent>
                <TagComponent
                  label='Thành công'
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
                <TextComponent text={'Mã đơn hàng: 900243146'} size={12} font={fontFamilies.medium} color={colors.white} />
              </RowComponent>
              <SpaceComponent height={4} />
              <RowComponent styles={{ alignItems: 'flex-start' }}>
                <AntDesign name='clockcircle' size={15} color={colors.white} style={{marginTop:3}} />
                <SpaceComponent width={4} />
                <TextComponent text={'08:30, 22 tháng 11, 2024 - 15:00, 24 tháng 11, 2024'} size={12} font={fontFamilies.medium} color={colors.white} />
              </RowComponent>

              <SpaceComponent height={4} />
              <RowComponent styles={{ alignItems: 'flex-start' }}>
                <FontAwesome6 size={16} color={colors.white} name="location-dot" style={{marginTop:3}} />
                <SpaceComponent width={8} />
                <View style={{ flex: 1 }}>
                  <TextComponent text={'SECC, 799 Nguyễn Văn Linh, Q.7'} numberOfLine={2} color={colors.white} font={fontFamilies.medium} size={12.5} />
                  <TextComponent numberOfLine={2} font={fontFamilies.regular} text={'799 Nguyễn Văn Linh, Tan Phu Ward, 7 District, Ho Chi Minh City'} size={12} color={colors.white} />
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
          <SpaceComponent height={4}/>
        </>
    )

}


export default TicketComponent