import { Button, Text, View } from "react-native"
import React, { useState } from "react"
import QRCode from "react-native-qrcode-svg";
import Accordion from 'react-native-collapsible/Accordion';
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../../components";
import { colors } from "../../../constrants/color";
import { fontFamilies } from "../../../constrants/fontFamilies";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { globalStyles } from "../../../styles/globalStyles";
import { BorderlessButton } from "react-native-gesture-handler";
const ListTicketComponent = () => {
  const ShowTimes = [
    {
      typeTicket: ['First','First'],

    },
    {
      typeTicket: ['Second','Second','Second'],
    },
  ];

  const [state, setState] = useState([])
  const [stateChild, setStateChild] = useState([])
  
  const renderHeader = (section: any, index: number, isActive: boolean, sections: any) => {
    return (
      <RowComponent justify={'space-between'} styles={[{ paddingHorizontal: 12, paddingVertical: 10,borderRadius:12 },globalStyles.shadow]}>
        <RowComponent>
          <SimpleLineIcons name={isActive ? "arrow-down" : "arrow-right"} size={12} color={colors.white} />
          <SpaceComponent width={12} />
          <View>
            <TextComponent text={'20:00 - 23:00'} color={colors.white} size={13} font={fontFamilies.medium} />
            <TextComponent text={'28 Tháng 12, 2024'} color={colors.white} size={13} font={fontFamilies.medium} />
          </View>
        </RowComponent>
        <ButtonComponent text={'Mua vé ngay'} type="primary" mrBottom={0} width={'auto'} textSize={14} styles={{ paddingVertical: 6 }} />
      </RowComponent>
    );
  };
  const renderContent = (section: any, index: number, isActive: boolean, sections: any) => {
    return (
      <View style={{}}>
        {/* <RowComponent justify="space-between" styles={{ paddingVertical: 20, paddingLeft: 40, paddingRight: 20, backgroundColor: 'rgb(46,47,50)' }}>
          <TextComponent text={'THƯỜNG'} size={12} color={colors.white} font={fontFamilies.semiBold} />
          <TextComponent text={'1.500.000 VNĐ'} color={colors.primary} font={fontFamilies.semiBold} />
        </RowComponent>
        <RowComponent justify="space-between" styles={{ paddingVertical: 20, paddingLeft: 40, paddingRight: 20, backgroundColor: 'rgb(55,55,60)' }}>
          <TextComponent text={'VIP'} size={12} color={colors.white} font={fontFamilies.semiBold} />
          <TextComponent text={'1.500.000 VNĐ'} color={colors.primary} font={fontFamilies.semiBold} />
        </RowComponent>
        <RowComponent justify="space-between" styles={{ paddingVertical: 20, paddingLeft: 40, paddingRight: 20, backgroundColor: 'rgb(46,47,50)' }}>
          <TextComponent text={'SIÊU VÍP'} size={12} color={colors.white} font={fontFamilies.semiBold} />
          <View style={{}}>
            <TextComponent text={'1.500.000 VNĐ'} textAlign="right" color={colors.primary} font={fontFamilies.semiBold} />
            <SpaceComponent height={2} />
            <TagComponent
              bgColor={colors.danger2}
              label={'Ngừng bán vé onnile'}
              textSize={10}
              font={fontFamilies.medium}
              textColor={colors.danger}
              styles={{
                paddingVertical: 2,
                minWidth: 20,
              }}
            />
          </View>
        </RowComponent> */}
        <RowComponent>
          <Accordion
            sections={section.typeTicket}
            activeSections={stateChild}
            underlayColor={``}
            renderHeader={renderHeaderChild}
            renderContent={renderContentChild}
            onChange={updateSectionsChild}
            containerStyle={{ width: '100%',borderRadius:12}}
          />
        </RowComponent>
        
      </View>
    );
  };
  const updateSections = (activeSections: any) => {
    setState(activeSections)
    setStateChild([])
  };

  const renderHeaderChild = (section: any, index: number, isActive: boolean, sections: any) => {
    return (
      <RowComponent styles={{width:'100%',paddingLeft:30,paddingRight:index%2===0 ? 40 : 30,paddingVertical:20,
      backgroundColor:index%2===0 ? colors.background2 : colors.background1,
      borderBottomEndRadius:(index===sections.length -1 ) ? 12 : 0,
      borderBottomLeftRadius:(index===sections.length -1 ) ? 12 : 0,
      }}>
        {index %2==0 && <SimpleLineIcons name={isActive ? "arrow-down" : "arrow-right"} size={10} color={colors.white} />}
        {<SpaceComponent width={8} />}
        <RowComponent justify="space-between" styles={{width:'100%'}}>
          <TextComponent text={'VÉ CAO CẤP'} size={10} color={colors.white} font={fontFamilies.semiBold} />
          <View>
            <TextComponent text={'1.500.000 VNĐ'} textAlign="right" color={colors.primary} font={fontFamilies.semiBold} />
            {/* <TagComponent
              bgColor={colors.danger2}
              label={'Ngừng bán vé onnile'}
              textSize={10}
              font={fontFamilies.medium}
              textColor={colors.danger}
              styles={{
                paddingVertical: 2,
                minWidth: 20,
              }}
            /> */}
          </View>
        </RowComponent>
      </RowComponent>
    );
  };
  const renderContentChild = (section: any, index: number, isActive: boolean, sections: any) => {
    return (
      index % 2 === 0 ? (
        <View
          style={{
            paddingBottom: 10,
            paddingLeft: 50,
            paddingRight:30,
            backgroundColor: index % 2 === 0 ? 'rgb(46,47,50)' : 'rgb(55,55,60)',
            borderBottomEndRadius:(index===sections.length -1 ) ? 12 : 0,
            borderBottomLeftRadius:(index===sections.length -1 ) ? 12 : 0,
          }}
        >
          <TextComponent text={'- Vé đứng gần ca sĩ nhất'} color={colors.gray4} size={11} />
          <TextComponent text={'- Nhận được quà tặng sau khi kết thúc chương trình'} color={colors.gray4} size={11} />
        </View>
      ) : (
        <></>
      )
    );
  };
  const updateSectionsChild = (activeSections: any) => {
    setStateChild(activeSections)
  };
  return (
    <Accordion
      sections={ShowTimes}
      underlayColor={``}
      activeSections={state}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={updateSections}

      containerStyle={{borderRadius:12}}
    />
  )
}
export default ListTicketComponent;