import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";
import MapView from "react-native-maps";
import { appInfo } from "../../constrants/appInfo";

const MapScreen = ()=>{
  return (
    <ContainerComponent>
      <SectionComponent>
      <TextComponent text="abc"/>
      </SectionComponent>
    </ContainerComponent>
  )
}
export default MapScreen;