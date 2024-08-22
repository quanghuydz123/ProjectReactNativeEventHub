import { Button, Image, Text, View } from "react-native"
import React, { useState } from "react"
import { ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import SearchComponent from "../../components/SearchComponent";

const SearchFriendScreen = () => {
  const [searchKey, setSearchKey] = useState('')
  return (
    <ContainerComponent back
    title={<SearchComponent isNotShowArrow onSearch={(val)=>setSearchKey(val)} value={searchKey}
    titlePlaceholder="Tìm kiếm bạn bè"
    />}
    >
      <SectionComponent styles={{
        flex: 1,
        alignItems: 'center'
      }}>
        <View style={{paddingVertical:20}}>
          <Image source={{ uri: 'https://ps.w.org/search-engine-insights/assets/icon-256x256.png?rev=2019875' }} style={{
            width: 120,
            height: 120
          }} />
        </View>
        <TextComponent text={'Tìm bạn bè'} title size={16} />
        <SpaceComponent height={4} />
        <TextComponent text={'Hãy tìm bạn bè và người quen để kết nối với họ trên ứng dụng EventHub'} textAlign="center" />

      </SectionComponent>
    </ContainerComponent>
  )
}
export default SearchFriendScreen;