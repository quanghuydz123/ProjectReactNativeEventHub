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
import { ShowTimeModel } from "../../../models/ShowTimeModel";
import { TypeTicketModel } from "../../../models/TypeTicketModel";
import { convertMoney } from "../../../utils/convertMoney";
import { DateTime } from "../../../utils/DateTime";
import { appInfo } from "../../../constrants/appInfo";
import RenderHTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
interface Props{
  showTimes:ShowTimeModel[],
  idEvent:string,
  titleEvent:string,
  addRessEvent:string,
  locationEvent:String
}
const ListTicketComponent = (props:Props) => {
  const {showTimes,idEvent,titleEvent,addRessEvent,locationEvent} = props
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
  const navigation:any = useNavigation()  
  const renderHeader = (section: ShowTimeModel, index: number, isActive: boolean, sections: any) => {
    const renderContentRight = (section:ShowTimeModel)=>{
      let content = <ButtonComponent 
      text={'Mua vé ngay'} 
      type="primary" 
      mrBottom={0} 
      width={'auto'} 
      textSize={14} 
      onPress={()=>navigation.navigate('ChooseTicketScreen',{showTimes:section,idEvent:idEvent,titleEvent:titleEvent,addRessEvent:addRessEvent,locationEvent:locationEvent})}
      styles={{ paddingVertical: 6 }} />
      if(section.status==='Ended'){
        content=<ButtonComponent 
        text={'Suất diễn đã kết thúc'} 
        type="primary" 
        mrBottom={0} 
        width={'auto'} 
        textSize={14}
        color={colors.background}
        textColor={colors.gray4}
        
        styles={{ paddingVertical: 6,borderWidth:1,borderColor:colors.gray4}} />
      }else if(section.status==='Ongoing'){
        content=<ButtonComponent 
        text={'Đang diễn ra'} 
        type="primary" 
        mrBottom={0} 
        width={'auto'} 
        
        textSize={14}
        color={colors.background}
        textColor={colors.gray4}
        styles={{ paddingVertical: 6,borderWidth:1,borderColor:colors.gray4}} />
      }else if(section.status==='SoldOut'){
        content=<ButtonComponent 
        text={'Suất diễn đã hết vé'} 
        type="primary" 
        mrBottom={0} 
        width={'auto'} 
        textSize={14}
        color={colors.background}
        textColor={colors.gray4}
        styles={{ paddingVertical: 6,borderWidth:1,borderColor:colors.gray4}} />
      } else if(section.status==='NotYetOnSale'){
        content=<ButtonComponent 
        text={'Suất diễn chưa mở bán'} 
        type="primary" 
        mrBottom={0} 
        width={'auto'} 
        textSize={14}
        color={colors.background}
        textColor={colors.gray4}
        styles={{ paddingVertical: 6,borderWidth:1,borderColor:colors.gray4}} />
      }else if(section.status==='SaleStopped'){
        content=<ButtonComponent 
        text={'Suất diễn đã ngừng bán vé'} 
        type="primary" 
        mrBottom={0} 
        width={'auto'} 
        textSize={14}
        color={colors.background}
        textColor={colors.gray4}
        styles={{ paddingVertical: 6,borderWidth:1,borderColor:colors.gray4}} />
      }

      return content
    }
    return (
      <RowComponent justify={'space-between'} styles={[{ paddingHorizontal: 12, paddingVertical: 10,borderRadius:12 },globalStyles.shadow]}>
        <RowComponent>
          <SimpleLineIcons name={isActive ? "arrow-down" : "arrow-right"} size={12} color={colors.white} />
          <SpaceComponent width={12} />
          <View>
            <TextComponent text={`${DateTime.GetTime(section?.startDate)} - ${DateTime.GetTime(section?.endDate)}`} color={colors.white} size={13} font={fontFamilies.medium} />
            <TextComponent text={DateTime.GetDateNew1(section?.startDate,section?.endDate)} color={colors.white} size={13} font={fontFamilies.medium} />
          </View>
        </RowComponent>
        {renderContentRight(section)}
      </RowComponent>
    );
  };
  const renderContent = (section: ShowTimeModel, index: number, isActive: boolean, sections: any) => {
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
            sections={section.typeTickets}
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
  const renderContentStatusTypeTicket = (section:TypeTicketModel)=>{
    const renderText = ()=>{
      let text = 'Tạm thời chưa biết'
      if(section.status==='Ended'){
        text="Đã ngừng bán vé onnile"
      }else if(section.status==='SoldOut'){
        text='Hết vé'
      }else if(section.status==='NotStarted'){
        text=`Mở bán từ ${DateTime.GetTime(section.startSaleTime)} ${DateTime.GetDate1(section.startSaleTime)}`
      }
      return text
    }
    return (
      section.status === 'OnSale' ? <></> :<TagComponent
        bgColor={colors.danger2}
        label={renderText()}
        textSize={10}
        font={fontFamilies.medium}
        textColor={colors.danger}
        styles={{
          paddingVertical: 2,
          minWidth: 20,
          marginRight:section.description ? 18 : 0
        }}
      />
    )
  }
  const renderHeaderChild = (section: TypeTicketModel, index: number, isActive: boolean, sections: any) => {
    const renderColorMoney = ()=>{
      let color = colors.primary
      if(section.status==='Ended' || section.status==='SoldOut' || section.status==='NotStarted'){
        color=colors.gray4
      }
      return color
    }
    return (
      <RowComponent styles={{width:'100%',paddingLeft:30,paddingRight:30,paddingVertical:20,
      backgroundColor:index%2===0 ? colors.background2 : colors.background1,
      // borderBottomEndRadius:(index===sections.length -1 ) ? 12 : 0,
      // borderBottomLeftRadius:(index===sections.length -1 ) ? 12 : 0,
      }}>
        {section.description && <SimpleLineIcons name={isActive ? "arrow-down" : "arrow-right"} size={10} color={colors.white} />}
        {section.description && <SpaceComponent width={8} />}
        <RowComponent justify="space-between" styles={{width:'100%'}}>
          <TextComponent text={section?.name} size={12} color={colors.white} font={fontFamilies.semiBold} />
          <View style={{}}>
            <TextComponent text={convertMoney(section.price)} textAlign="right" styles={{marginRight:section.description ? 18 : 0}} color={renderColorMoney()} font={fontFamilies.semiBold} />
            <SpaceComponent height={2}/>
           {renderContentStatusTypeTicket(section)}
          </View>
        </RowComponent>
      </RowComponent>
    );
  };
  const renderContentChild = (section: TypeTicketModel, index: number, isActive: boolean, sections: any) => {
    return (
      section.description ? (
        <View
          style={{
            paddingBottom: 10,
            paddingLeft: 30,
            paddingRight:30,
            backgroundColor: index % 2 === 0 ? 'rgb(46,47,50)' : 'rgb(55,55,60)',
            // borderBottomEndRadius:(index===sections.length -1 ) ? 12 : 0,
            // borderBottomLeftRadius:(index===sections.length -1 ) ? 12 : 0,
          }}
        >
           <RenderHTML
            contentWidth={appInfo.sizes.WIDTH - 20}
                    
            source={{ html: section.description }}
            // tagsStyles={{
            //   h2: { textAlign: 'center', fontWeight: 'bold', fontSize: 24 },
            //   p: { textAlign: 'center', fontSize: 16, lineHeight: 24 },
            //   li: { fontSize: 16, lineHeight: 22 },
            // }}
            
            tagsStyles={{
             
              
            p:{
              margin:0,
              color:colors.gray4,
              fontSize:14,
            },
            ul:{
              color:colors.gray4,
              
            },
            span:{
              fontSize:10,
              color:colors.gray4,

            }
            }}
            computeEmbeddedMaxWidth={() => appInfo.sizes.WIDTH - 90}
            
          />
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
      sections={showTimes}
      underlayColor={``}
      activeSections={state}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={updateSections}

      containerStyle={{paddingBottom:10,borderRadius:12}}
    />
  )
}
export default ListTicketComponent;