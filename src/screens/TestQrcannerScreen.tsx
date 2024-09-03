import React, { useEffect, useRef, useState } from 'react';
import { ContainerComponent, SectionComponent, TextComponent } from '../components';
const TestQrcannerScreen = ({navigation,route}:any) => {
   console.log("JSON.parse(route.params.dataRoute)",JSON.parse(route.params.dataRoute))
  return (

    <ContainerComponent>
      <SectionComponent>
        <TextComponent text={'abc'}/>
      </SectionComponent>
    </ContainerComponent>
  )
}
export default TestQrcannerScreen;
