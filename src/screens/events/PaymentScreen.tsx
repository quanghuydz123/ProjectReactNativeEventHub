import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";
import { EventModelNew } from "../../models/EventModelNew";

const PaymentScreen = ({navigation,route}:any)=>{
    const {event}:{event:EventModelNew} = route.params
    console.log("event",event.title)
  return (
    <ContainerComponent back>
        <SectionComponent>
            <TextComponent text="abc"/>
        </SectionComponent>
    </ContainerComponent>
  )
}
export default PaymentScreen;