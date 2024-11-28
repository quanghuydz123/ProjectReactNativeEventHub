import React, { useEffect, useState } from "react"

import { CategoriesList, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components"
import { StyleSheet, Switch, Text } from "react-native";


const MapScreen = ({ navigation }: any) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
  }
  return (
    <>
    <ContainerComponent title={'Bảng đồ'} >
      <SectionComponent styles={{justifyContent:'center',alignItems:'center'}}>
        <TextComponent text={'Map View'}/>
        <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
        />
      </SectionComponent>
    </ContainerComponent>
  </>
  )
}

export default MapScreen;