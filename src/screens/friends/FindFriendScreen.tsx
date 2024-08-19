import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";

const FindFriendScreen = ()=>{
  return (
    <ContainerComponent back title="Tìm kiếm bạn bè">
      <SectionComponent>
        <TextComponent text={'abc'}/>
      </SectionComponent>
    </ContainerComponent>
  )
}
export default FindFriendScreen;