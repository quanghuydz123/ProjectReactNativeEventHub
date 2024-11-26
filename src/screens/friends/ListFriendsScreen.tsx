import { Button, ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, CricleComponent, DataLoaderComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components";
import SearchComponent from "../../components/SearchComponent";
import { colors } from "../../constrants/color";
import { SearchNormal } from "iconsax-react-native";
import AvatarItem from "../../components/AvatarItem";
import { sizeGlobal } from "../../constrants/sizeGlobal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Entypo from "react-native-vector-icons/Entypo"
import { authSelector } from "../../reduxs/reducers/authReducers";
import { useSelector } from "react-redux";
import { FollowModel } from "../../models/FollowModel";
import { apis } from "../../constrants/apis";
import followAPI from "../../apis/followAPI";
import { FlatList } from "react-native-gesture-handler";
import { UserModel } from "../../models/UserModel";
import { appInfo } from "../../constrants/appInfo";
const ListFriendsScreen = ({ navigation, route }: any) => {
  // const { followRoute, yourFollowersRoute }: { followRoute: FollowModel[], yourFollowersRoute: FollowModel[] } = route.params || {}
  const [searchKey, setSearchKey] = useState('')
  const auth = useSelector(authSelector)
  const [isLoading, setIsLoading] = useState(false)
  const [follower, setFollower] = useState<FollowModel[]>([])
  const [yourFollowers, setYourFollowers] = useState<FollowModel[]>([])
  useEffect(() => {
      handleCallApiGetFollowerById(true)
  }, [])
  const handleCallApiGetFollowerById = async (isLoading?: boolean) => {
    if (auth.id) {
      const api = apis.follow.getById(auth.id)
      setIsLoading(isLoading ? isLoading : false)

      try {
        const res: any = await followAPI.HandleFollwer(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setFollower(res.data.followers)
          setYourFollowers(res.data.yourFollowers)
        }
        setIsLoading(false)

      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("FollowerScreen", errorMessage)
        setIsLoading(false)

      }
    }
  }
  const renderListFriend = (user: UserModel) => {
    return (
      <RowComponent key={user.createAt} styles={{ paddingBottom: 10 }} >
        <RowComponent onPress={() => navigation.navigate("AboutProfileScreen", { uid: user._id })}>
          <AvatarItem size={sizeGlobal.avatarItem - 4} photoUrl={user?.photoUrl} />
          <SpaceComponent width={6} />
          <View style={{ flex: 1 }}>
            <TextComponent text={user?.fullname} title size={15} />
            <TextComponent text={'22 người theo dõi chung'} size={13} color={colors.gray} />
          </View>
          <RowComponent styles={{ alignItems: 'flex-start' }}>
            <CricleComponent color={colors.backgroundSearchInput} borderRadius={10} size={44}
              onPress={() => console.log("ok")}
            >
              <MaterialCommunityIcons name="facebook-messenger" size={22} color={colors.black} />
            </CricleComponent>
            <SpaceComponent width={4} />
            <ButtonComponent
              onPress={() => console.log("ok")}
              styles={{ paddingLeft: 8 }}
              icon={<Entypo name="dots-three-horizontal" size={18} color={colors.gray} />}
              iconFlex="right" />
          </RowComponent>
        </RowComponent>
      </RowComponent>
    )
  }
  return (
    <ContainerComponent back title="Danh sách theo dõi"
      right={<SearchNormal size={20} color={colors.white} />}
      onPressRight={() => navigation.push('FriendsScreen', { screen: 'SearchFriendScreen' })}

    >
      {/* <SectionComponent>
        <View style={{
          width: '100%',
          backgroundColor: colors.gray3,
          height: 1
        }} />

        <SpaceComponent height={8} />
        <SearchComponent
          isNotShowArrow onSearch={(val) => setSearchKey(val)}
          value={searchKey}
          titlePlaceholder="Tìm kiếm người dùng"
          onEnd={() => console.log("ok")}
        />
      </SectionComponent> */}
      <ScrollView>
        <SectionComponent styles={{ paddingBottom: 0 }}>

          <TabBarComponent
            styles={{
              paddingHorizontal: 0,
              marginBottom: 0
            }}
            title={`Bạn đang theo dõi ${follower[0]?.users ? follower[0]?.users.reduce((acc, user) => acc + 1, 0) : '0'} người`}
            textSizeTitle={20}
            onPress={() => console.log("ok")}
            isNotShowIconRight
            titleRight=""
            textColor={colors.background}
          />
          <SpaceComponent height={16} />
          {/* <FlatList
  key={'flatlist1'}
  contentContainerStyle={{ paddingBottom: 16 }}
  showsVerticalScrollIndicator={false}
  data={follower[0]?.users}
  renderItem={({ item, index }) => renderListFriend(item.idUser, item.status)}
/> */}
          <DataLoaderComponent data={follower[0]?.users} isLoading={isLoading} height={appInfo.sizes.HEIGHT*0.4} children={
            // <FlatList
            //   key={'flatlist1'}
            //   contentContainerStyle={{ paddingBottom: 16 }}
            //   showsVerticalScrollIndicator={false}
            //   data={follower[0]?.users}
            //   renderItem={({ item, index }) => renderListFriend(item.idUser, item.status)}
            // />
            follower[0]?.users.map((item, index) => {
              return renderListFriend(item.idUser)
            })
          }
            messageEmpty={'Bạn chưa theo dõi ai'}
          />
          {(follower[0]?.users && follower[0]?.users.length >= 4) && <ButtonComponent text="Xem thêm" type="primary" color={colors.gray8} textColor={colors.black}/>}

        </SectionComponent>
        <SectionComponent>
          <View style={{
            width: '100%',
            backgroundColor: colors.gray3,
            height: 1
          }} />
          <SpaceComponent height={16} />
          <TabBarComponent
            styles={{
              paddingHorizontal: 0,
              marginBottom: 0
            }}
            title={`${yourFollowers.length} Người đang theo dõi bạn`}
            textSizeTitle={20}
            onPress={() => console.log("ok")}
            isNotShowIconRight
            titleRight=""
            textColor={colors.background}
          />
          <SpaceComponent height={16} />
          {/* <FlatList
  key={'flatlist2'}
  contentContainerStyle={{ paddingBottom: 16 }}
  showsVerticalScrollIndicator={false}
  data={yourFollowers}
  renderItem={({ item, index }) => renderListFriend(item.user, true)}
/> */}
          <DataLoaderComponent data={yourFollowers} isLoading={isLoading} children={
            yourFollowers.map((item, index) => {
              return renderListFriend(item.user)
            })
          }
            messageEmpty={'Chưa có ai theo dõi bạn'}
          />
          {(yourFollowers && yourFollowers.length) >= 4 && <ButtonComponent text="Xem thêm" type="primary" color={colors.gray8} textColor={colors.black}/>}
        </SectionComponent>
      </ScrollView>
    </ContainerComponent>
  )
}
export default ListFriendsScreen;