import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { ContainerComponent, SpaceComponent, TextComponent } from "../components"
import { colors } from "../constrants/color"
import { fontFamilies } from "../constrants/fontFamilies"
import PurchasedTicketNotStartedScreen from "../screens/events/ticket/PurchasedTicketsNotStartedScreen"
import PurchasedTicketsEndScreen from "../screens/events/ticket/PurchasedTicketsEndScreen"
import { appInfo } from "../constrants/appInfo"
import { useEffect, useState } from "react"
import { EventModelNew } from "../models/EventModelNew"
import { apis } from "../constrants/apis"
import eventAPI from "../apis/eventAPI"
import { PurchasedTicketsCanceledScreen } from "../screens"


const TicketNavigator = ({navigation,route}:any)=>{
    const {relatedEvents} = route.params
    const Tab = createMaterialTopTabNavigator()
    // const [relatedEvents, setRelatedEvents] = useState<EventModelNew[]>([])
    // useEffect(()=>{
    //     haneleGetAPIRelatedEvents()
    // },[])
    // const haneleGetAPIRelatedEvents = async () => {
    //     const api = apis.event.getAll({limit:'4'})
    //     // setIsLoading(isLoading ? isLoading : false)
    //     try {
    //       const res: any = await eventAPI.HandleEvent(api, {}, 'get');
    //       if (res && res.data && res.status === 200) {
    //         setRelatedEvents(res.data as EventModelNew[])
    //       }
    //       // setIsLoading(false)
    
    //     } catch (error: any) {
    //       // setIsLoading(false)
    //       const errorMessage = JSON.parse(error.message)
    //       console.log("HomeScreen", errorMessage)
    //     }
    //   }
    return <>
        <ContainerComponent back title={'Vé của tôi'} isHiddenSpaceTop bgColor={colors.black}>
            <Tab.Navigator 
             screenOptions={({route})=>({
                
                tabBarStyle:{
                    backgroundColor:colors.black,
                    marginHorizontal:appInfo.sizes.WIDTH*0.14,
                    
                },
                tabBarIndicatorStyle:{
                    backgroundColor:colors.primary,
                    
                },
                tabBarLabel({focused}){
                    if(route.name === 'PurchasedTicketNotStartedScreen'){
                        return <TextComponent text={'Sắp diễn ra'} styles={{width:120}} textAlign="center" color={focused ? colors.white : colors.gray4} font={ focused ? fontFamilies.semiBold : fontFamilies.medium}/>
                    }else if(route.name === 'PurchasedTicketsEndScreen'){
                        return <TextComponent text={'Đã kết thúc'} styles={{width:120}} textAlign="center" color={focused ? colors.white : colors.gray4} font={ focused ? fontFamilies.semiBold : fontFamilies.medium}/>
                    }else if(route.name === 'PurchasedTicketsCanceledScreen'){
                        return <TextComponent text={'Đã bị hủy'} styles={{width:120}} textAlign="center" color={focused ? colors.white : colors.gray4} font={ focused ? fontFamilies.semiBold : fontFamilies.medium}/>

                    }
                }
             })}
            >
                <Tab.Screen name="PurchasedTicketNotStartedScreen" component={PurchasedTicketNotStartedScreen} initialParams={{relatedEvents:relatedEvents}}/>
                <Tab.Screen name="PurchasedTicketsEndScreen" component={PurchasedTicketsEndScreen} initialParams={{relatedEvents:relatedEvents}}/>
                <Tab.Screen name="PurchasedTicketsCanceledScreen" component={PurchasedTicketsCanceledScreen} initialParams={{relatedEvents:relatedEvents}}/>

            </Tab.Navigator>
        </ContainerComponent>
    </>
}

export default TicketNavigator