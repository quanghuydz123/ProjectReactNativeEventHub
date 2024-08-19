import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";

const ListFriendsScreen = ()=>{
  return (
    <ContainerComponent back title="Danh sách bạn bè">
      <SectionComponent>
        <TextComponent text={'abc'}/>
      </SectionComponent>
    </ContainerComponent>
  )
}
export default ListFriendsScreen;