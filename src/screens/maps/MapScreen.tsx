import React, { useEffect, useState } from "react"

import { CategoriesList, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components"
import { StyleSheet, Text } from "react-native";


const MapScreen = ({ navigation }: any) => {

  return (
    <>
    <ContainerComponent title={'Bảng đồ'} >
      <SectionComponent styles={{justifyContent:'center',alignItems:'center'}}>
        <TextComponent text={'Map View'}/>
      </SectionComponent>
    </ContainerComponent>
  </>
  )
}

export default MapScreen;