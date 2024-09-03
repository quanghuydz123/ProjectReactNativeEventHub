import React, { useEffect, useRef, useState } from 'react';
import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
const EventsScreen = ({navigation,route}:any) => {
  console.log("route",route)
  return (

    <ContainerComponent>
      <SectionComponent>
        <TextComponent text={'abc'}/>
      </SectionComponent>
    </ContainerComponent>
  )
}
export default EventsScreen;
