import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { SearchNormal } from "iconsax-react-native";
import { colors } from "../../constrants/color";

const FindFriendScreen = ({navigation}:any)=>{
  return (
    <ContainerComponent back title="Tìm kiếm bạn bè" 
    right={<SearchNormal size={20} color={colors.gray} 
    />}
    onPressRight={() => navigation.push('FriendsScreen', { screen: 'SearchFriendScreen' })}
    >
      <SectionComponent styles={{}}>
             <View style={{
                 width: '100%',
                 backgroundColor: colors.gray3,
                 height: 1
             }} />

             <SpaceComponent height={18} />
             <TextComponent
                 styles={{ paddingHorizontal: 0, paddingVertical: 0, marginBottom: 0 }}
                 text="Những người bạn có thể biết"
                 size={20}
                 title
             />
         </SectionComponent>
    </ContainerComponent>
  )
}
export default FindFriendScreen;