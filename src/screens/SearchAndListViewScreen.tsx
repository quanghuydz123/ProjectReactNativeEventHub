import { useState } from "react"
import { ButtonComponent, ContainerComponent, DataLoaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../components"
import { EventModelNew } from "../models/EventModelNew"
import { FollowModel } from "../models/FollowModel"
import { OrganizerModel } from "../models/OrganizerModel"
import SearchComponent from "../components/SearchComponent"
import { colors } from "../constrants/color"
import { FlatList, View } from "react-native"
import EventItemHorizontal from "../components/EventItemHorizontal"
import { ToastMessaging } from "../utils/showToast"
import { appInfo } from "../constrants/appInfo"
import { useSelector } from "react-redux"
import { authSelector, AuthState } from "../reduxs/reducers/authReducers"
import AvatarItem from "../components/AvatarItem"
import { fontFamilies } from "../constrants/fontFamilies"


const SearchAndListViewScreen = ({ navigation, route }: any)=>{
    const { items ,type,title,bgColor }: { items: EventModelNew[] | OrganizerModel[] | FollowModel[],type:'event' | 'organizer' | 'following',title?:string,bgColor:string} = route.params
    const [searchKey, setSearchKey] = useState('');
    const auth:AuthState = useSelector(authSelector)
    const renderContent = ()=>{
        switch(type){
            case 'event':
                return <>
                <DataLoaderComponent 
                    isFlex 
                    data={items as EventModelNew[]} 
                    isLoading={false}
                    messageEmpty="Không có sự kiện nào phù hợp"
                    messTextColor={colors.black}
                    
                    children={
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={items as EventModelNew[]}
                            keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
                            renderItem={({ item }) => (
                                <EventItemHorizontal item={item} bgColor={colors.white} textCalendarColor={colors.background} titleColor={colors.background} />
                            )}
                        />
                    }
                />
                </>
            case 'organizer':
                return <>
                <DataLoaderComponent 
                    isFlex 
                    data={items as OrganizerModel[]} 
                    isLoading={false}
                    messageEmpty="Không có sự kiện nào phù hợp"
                    messTextColor={colors.black}
                    
                    children={
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={items as OrganizerModel[]}
                            keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
                            renderItem={({ item }) => (
                                <>
                                <RowComponent justify='space-between' key={item.user._id}>
                                  <RowComponent styles={{ alignItems: 'flex-start', width: appInfo.sizes.WIDTH * 0.72 }} onPress={() => {
                                    if (item?.user._id === auth.id) {
                                      { ToastMessaging.Warning({ message: 'Đó là bạn mà', visibilityTime: 2000 }) }
                                    }
                                    else {
                                      navigation.navigate("AboutProfileScreen", { uid: item?.user._id, organizer: item })
                                    }
                                  }}>
                                    <AvatarItem size={80} photoUrl={item.user.photoUrl} colorBorderWidth={colors.gray} />
                                    <SpaceComponent width={8} />
                                    <View style={{ flex: 1 }}>
                                      <TextComponent text={item.user.fullname}  font={fontFamilies.medium} numberOfLine={1} color={colors.white} />
                                      <TextComponent text={`${item.user.numberOfFollowers} người đang theo dõi`} size={12} color={colors.gray8} />
                                      <TextComponent text={item.user.bio ?? ''} size={10} numberOfLine={2} color={colors.gray4} />
                                    </View>
                                  </RowComponent>
                                  <ButtonComponent text='Theo dõi' type='primary' textSize={12} styles={{ paddingVertical: 8, paddingHorizontal: 8 }} mrBottom={0} width={appInfo.sizes.WIDTH * 0.2} />
                                </RowComponent>
                                <SpaceComponent height={16} />
                              </>
                            )}
                        />
                    }
                />
                </>
            case 'following':
                return <>
                <DataLoaderComponent 
                    isFlex 
                    data={items as FollowModel[]} 
                    isLoading={false}
                    messageEmpty="Không có sự kiện nào phù hợp"
                    messTextColor={colors.black}
                    
                    children={
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={items as FollowModel[]}
                            keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
                            renderItem={({ item }) => (
                                <></>
                            )}
                        />
                    }
                />
                </>
            default:
                return <></>
        }
    }
    return (
        <ContainerComponent back title={title ?? 'Danh sách'} bgColor={bgColor ?? colors.white}>
            <SectionComponent styles={{ paddingBottom: 8 }}>
                <SearchComponent 
                    isNotShowArrow 
                    onSearch={(val) => setSearchKey(val)} 
                    value={searchKey} 
                    onEnd={() => console.log('ok')} 
                    bgColor={bgColor ? colors.background : colors.gray8}
                    textColor={bgColor ? colors.white : colors.black}
                />
            </SectionComponent>
            <SpaceComponent height={12}/>
            <SectionComponent styles={{flex:1}}>
                {renderContent()}
            </SectionComponent>
        </ContainerComponent>
    )
}

export default SearchAndListViewScreen