import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, TextComponent } from "../../components";
import { EventModelNew } from "../../models/EventModelNew";
import { apis } from "../../constrants/apis";
import eventAPI from "../../apis/eventAPI";
import { LoadingModal } from "../../../modals";
import LoadingComponent from "../../components/LoadingComponent";
import { FollowModel } from "../../models/FollowModel";
import followAPI from "../../apis/followAPI";
import ListEventComponent from "../../components/ListEventComponent";
import { SearchNormal } from "iconsax-react-native";
import { colors } from "../../constrants/color";

const ExploreEvent = ({navigation,route}:any) => {
    const {items}:{items:EventModelNew[]} = route.params || {}
    const [events, setEvents] = useState<EventModelNew[]>(items)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(!events){
            getEvents()
        }
    }, [])
   
    const getEvents = async () => {
        const api = apis.event.getAll({})
        setIsLoading(true)
        try {
            const res = await eventAPI.HandleEvent(api)
            if(res && res.data && res.status===200){
                setEvents(res.data as EventModelNew[])
            }
            setIsLoading(false)
        } catch (error: any) {
            const errorMessage = JSON.parse(error.message)
            console.log("ExploreEvent", errorMessage)
            setIsLoading(false)
        }
    }
    return (
        <ContainerComponent back title="Danh sách sự kiện" right={<RowComponent>
            <ButtonComponent onPress={()=>navigation.navigate('SearchEventsScreen',{items:events})} iconFlex="left" icon={<SearchNormal  size={20} color={colors.colorText}/> }/>
        </RowComponent>}>
            {
                (events && events?.length > 0 ) ? <>

                <ListEventComponent items={events}/>
                </> : 
                <LoadingComponent isLoading={isLoading} value={events?.length}/>
            }
        </ContainerComponent>
    )
}
export default ExploreEvent;