import { Button, Text, View } from "react-native"
import React, { useState } from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";
import SearchComponent from "../../components/SearchComponent";

const ChatsScreen = ()=>{
    const [searchKey,setSearchKey] = useState('')
  return (
    <ContainerComponent back title="Đoạn chat">
        <SectionComponent>
            <SearchComponent onSearch={(val)=>setSearchKey(val)} value={searchKey}  isNotShowArrow/>
        </SectionComponent>
    </ContainerComponent>
  )
}
export default ChatsScreen;