import { FlatList, View } from "react-native"
import { ButtonComponent, DataLoaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components"
import { colors } from "../../constrants/color"
import SearchComponent from "../../components/SearchComponent"
import { useState } from "react"
import { authSelector, AuthState } from "../../reduxs/reducers/authReducers"
import { useSelector } from "react-redux"
import { OrganizerModel } from "../../models/OrganizerModel"
import { ToastMessaging } from "../../utils/showToast"
import AvatarItem from "../../components/AvatarItem"
import { fontFamilies } from "../../constrants/fontFamilies"
import { appInfo } from "../../constrants/appInfo"
import { FollowModel } from "../../models/FollowModel"
import checkLogin from "../../utils/checkLogin"

const removeVietnameseTones = (str:string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};
const OrganizerUnfollowedScreen = ({ navigation, route }: any) => {
    const auth: AuthState = useSelector(authSelector)

    const {organizers}:{organizers:OrganizerModel[]} = route.params
    // const [organizers,setorganizers] = useState([])
    const [searchKey, setSearchKey] = useState('');
    const userIds = new Set(auth.follow.users.map(user => user?.idUser));

    const filteredOrganizers = organizers.filter((item) => {
        if (!item.user || !item.user.fullname) return false; // Kiểm tra null hoặc undefined

        // Kiểm tra nếu item.user._id không nằm trong auth.follow.users
        if (userIds.has(item.user._id)) return false;

        const normalizedSearchKey = removeVietnameseTones(searchKey).toLowerCase();
        const normalizedTitle = removeVietnameseTones(item.user.fullname).toLowerCase();

        return normalizedTitle.includes(normalizedSearchKey);
    });
    return (
        <>
            <View style={{ backgroundColor: colors.background, flex: 1, paddingTop: 16 }}>
                <SectionComponent styles={{ paddingBottom: 8 }}>
                    <SearchComponent
                        isNotShowArrow
                        onSearch={(val) => setSearchKey(val)}
                        value={searchKey}
                        onEnd={() => console.log('ok')}
                        bgColor={colors.background}
                        textColor={colors.white}
                    />
                </SectionComponent>
                <SpaceComponent height={12} />
                <SectionComponent styles={{ flex: 1 }}>
                    <DataLoaderComponent
                        isFlex
                        data={filteredOrganizers}
                        isLoading={false}
                        messageEmpty="Không có tổ chức nào phù hợp"
                        messTextColor={colors.white}

                        children={
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredOrganizers}
                                keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
                                renderItem={({ item }) => (
                                    <>
                                        <RowComponent justify='space-between' key={item.user._id}>
                                            <RowComponent styles={{ alignItems: 'flex-start', width: appInfo.sizes.WIDTH * 0.7 }} onPress={() => {
                                                if (item?.user._id === auth.id) {
                                                    { ToastMessaging.Warning({ message: 'Đó là bạn mà', visibilityTime: 2000 }) }
                                                }
                                                else {
                                                    navigation.navigate("AboutProfileScreen", { uid: item?.user._id, organizer: item })
                                                }
                                            }}>
                                                <AvatarItem size={76} photoUrl={item.user.photoUrl} colorBorderWidth={colors.gray} />
                                                <SpaceComponent width={8} />
                                                <View style={{ flex: 1 }}>
                                                    <TextComponent text={item.user.fullname} font={fontFamilies.medium} numberOfLine={1} color={colors.white} />
                                                    <TextComponent text={`${item.user.numberOfFollowers} người đang theo dõi`} size={12} color={colors.gray8} />
                                                    <TextComponent text={item.user.bio ?? ''} size={10} numberOfLine={2} color={colors.gray4} />
                                                </View>
                                            </RowComponent>
                                            <ButtonComponent 
                                                text='Theo dõi' 
                                                type='primary' 
                                                textSize={12} 
                                                styles={{ paddingVertical: 8, paddingHorizontal: 8 }} 
                                                mrBottom={0} 
                                                width={appInfo.sizes.WIDTH * 0.22} 
                                                onPress={()=>{
                                                    if(checkLogin(auth,navigation)){
                                                        console.log("ok")
                                                    }
                                                }}  
                                            />
                                        </RowComponent>
                                        <SpaceComponent height={16} />
                                    </>
                                )}
                            />
                        }
                    />
                </SectionComponent>
            </View>
        </>
    )
}

export default OrganizerUnfollowedScreen