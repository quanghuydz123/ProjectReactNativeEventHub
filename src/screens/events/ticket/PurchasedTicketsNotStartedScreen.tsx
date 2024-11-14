import { FlatList, ScrollView, View } from "react-native"
import { ButtonComponent, ListEventRelatedComponent, SectionComponent, SpaceComponent, TextComponent, TicketComponent } from "../../../components"
import { colors } from "../../../constrants/color"
import SearchComponent from "../../../components/SearchComponent";
import { useState } from "react";
import { EventModelNew } from "../../../models/EventModelNew";
import CardComponent from "../../../components/CardComponent";
import { appInfo } from "../../../constrants/appInfo";


const PurchasedTicketNotStartedScreen = ({ navigation, route }: any) => {
    const { relatedEvents }: { relatedEvents: EventModelNew[] } = route.params
    const [searchKey, setSearchKey] = useState('');
    return (
        <View style={{ backgroundColor: colors.black, flex: 1, paddingTop: 12 }}>
            {/* <SectionComponent styles={{ paddingBottom: 8 }}>
                    <SearchComponent
                        isNotShowArrow
                        onSearch={(val) => setSearchKey(val)}
                        value={searchKey}
                        onEnd={() => console.log('ok')}
                        bgColor={colors.background}
                        textColor={colors.white}
                    />
                </SectionComponent> */}
            <ScrollView style={{ flex: 1 }}>
                {Array.from({ length: 4 }).map((item, index) => {
                    return <TicketComponent key={index} />
                })}
                <View >
                    <ButtonComponent  text="Xem tất cả" type="primary" mrBottom={0} color={colors.primary} width={'auto'} textSize={13} styles={{borderRadius:100,paddingVertical:8}} textColor={colors.white} />
                </View>
                <SpaceComponent height={10}/>
                <SpaceComponent height={1} color={colors.gray} width={appInfo.sizes.WIDTH} styles={{}} />

                <ListEventRelatedComponent relatedEvents={relatedEvents}/>
                <SpaceComponent height={20}/>
            </ScrollView>

        </View>
    )
}

export default PurchasedTicketNotStartedScreen