import { FlatList, ScrollView, View } from "react-native"
import { ListEventRelatedComponent, SectionComponent, SpaceComponent, TextComponent, TicketComponent } from "../../../components"
import { colors } from "../../../constrants/color"
import SearchComponent from "../../../components/SearchComponent";
import { useState } from "react";
import { EventModelNew } from "../../../models/EventModelNew";
import { appInfo } from "../../../constrants/appInfo";


const PurchasedTicketsCanceledScreen = ({ navigation, route }: any)=>{
    const [searchKey, setSearchKey] = useState('');
    const {relatedEvents }:{relatedEvents:EventModelNew[]} = route.params
    return (
        <View style={{backgroundColor:colors.black,flex:1,paddingTop:12}}>
           
            <ScrollView style={{ flex: 1 }}>
                {Array.from({ length: 2 }).map((item, index) => {
                    return <TicketComponent status="Canceled" key={index} />
                })}
                <SpaceComponent height={10}/>
                <SpaceComponent height={1} color={colors.gray} width={appInfo.sizes.WIDTH} styles={{}} />

                <ListEventRelatedComponent relatedEvents={relatedEvents}/>
                <SpaceComponent height={20}/>
            </ScrollView>
        </View>
    )
}

export default PurchasedTicketsCanceledScreen