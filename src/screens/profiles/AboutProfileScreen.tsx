import { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity, Animated, Image, FlatList } from "react-native"

import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import { useSelector } from "react-redux"
import { LoadingModal } from "../../../modals"
import followAPI from "../../apis/followAPI"
import userAPI from "../../apis/userApi"
import { ContainerComponent, SectionComponent, RowComponent, SpaceComponent, ButtonComponent, TextComponent, TagComponent } from "../../components"
import AvatarItem from "../../components/AvatarItem"
import { apis } from "../../constrants/apis"
import { colors } from "../../constrants/color"
import { FollowModel } from "../../models/FollowModel"
import { UserModel } from "../../models/UserModel"
import { authSelector } from "../../reduxs/reducers/authReducers"
import { globalStyles } from "../../styles/globalStyles"
import socket from "../../utils/socket"
import { appInfo } from "../../constrants/appInfo"
import CardComponent from "../../components/CardComponent"
import { OrganizerModel } from "../../models/OrganizerModel"
import { EventModelNew } from "../../models/EventModelNew"
import organizerAPI from "../../apis/organizerAPI"
import { CreativeCommons } from "iconsax-react-native"
import AvatarGroup from "../../components/AvatarGroup"
import { fontFamilies } from "../../constrants/fontFamilies"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { convertMoney } from "../../utils/convertMoney"
import { DateTime } from "../../utils/DateTime"
const AboutProfileScreen = ({ navigation, route }: any) => {
  const { uid, organizer }: { uid: string, organizer: OrganizerModel } = route.params
  const [uidOthor, setUidOther] = useState(uid)
  const [tabSelected, setTabSelected] = useState('about')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserModel>()
  const [follower, setFollower] = useState<FollowModel[]>([])
  const [followerUserOther, setFollowerUserOther] = useState<FollowModel[]>([])
  const [isLLoadingNotShow, setIsLLoadingNotShow] = useState(false)
  const auth = useSelector(authSelector)
  const [numberOfFollowers, setNumberOfFollowers] = useState(0)
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const [eventCreated, setEventCreated] = useState<EventModelNew[]>([])
  const [width, setWidth] = useState(0)
  useEffect(() => {
    Animated.spring(tabOffsetValue, {
      toValue: width * (tabSelected === 'about' ? 0 : 1),
      useNativeDriver: true,
      speed: 250
    }).start();
  }, [tabSelected])
  const tabs = [{
    key: 'about',
    title: 'Giới thiệu',
    content: ''
  }, {
    key: 'events',
    title: `Sự kiện đã tổ chức (${eventCreated?.length ?? 0})`,
    content: ''
  }
  ]

  useEffect(() => {
    handleCallApiGetProfile()
    handleCallApiGetFollowerUserOtherById(true)
    getEventCreated()
  }, [])
  useEffect(() => {
    handleCallApiGetFollowerById(true)
  }, [auth.id])
  // const renderTabContent = (key: String) => {
  //   let content = <></>
  //   switch (key) {
  //     case 'about':
  //       break
  //     case 'events':
  //       break
  //     default:
  //       content = <></>
  //       break
  //   }
  //   return content
  // }
  const getEventCreated = async () => {
    if (uidOthor) {
      const api = `/get-eventCreatedOrganizerById?idUser=${uidOthor}`
      try {
        const res = await organizerAPI.HandleOrganizer(api)
        if (res && res.data && res.status === 200) {
          setEventCreated(res.data)
        }
        setIsLoading(false)
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("AboutScreen", errorMessage)
        setIsLoading(false)
      }
    }
  }
  const handleCallApiGetProfile = async () => {
    if (uidOthor) {
      setIsLoading(true)
      const api = apis.user.getById(uidOthor)
      try {
        const res = await userAPI.HandleUser(api)
        if (res && res.data && res.status === 200) {
          setProfile(res.data.user)
        }
        setIsLoading(false)
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("AboutScreen", errorMessage)
        setIsLoading(false)
      }
    }
  }
  const   handleCallApiGetFollowerById = async (isLoading?: boolean) => {
    if (auth.id) {
      const api = apis.follow.getById(auth.id)
      setIsLoading(isLoading ? isLoading : false)

      try {
        const res: any = await followAPI.HandleFollwer(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setFollower(res.data.followers)
        }
        setIsLoading(false)

      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("FollowerScreen", errorMessage)
        setIsLoading(false)

      }
    }
  }
  const handleFollowUser = async () => {
    const api = apis.follow.updateFollowUserOther()
    setIsLoading(true)
    try {
      const res = await followAPI.HandleFollwer(api, { idUser: auth.id, idUserOther: uidOthor }, 'put')
      console.log("res", res)
      if (res && res.data && res.status === 200) {
        await handleCallApiGetFollowerById()
        await handleCallApiGetFollowerUserOtherById()
        socket.emit('followUser', { idUser: auth?.id })
        socket.emit('getNotifications', { idUser: auth?.id })
      }
      setIsLoading(false)
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log('Lỗi rồi EventDetails')
      }
      setIsLoading(false)
    }
  }
  const handleCallApiGetFollowerUserOtherById = async (isLoading?: boolean) => {
    if (uidOthor) {
      const api = apis.follow.getById(uidOthor)
      setIsLoading(isLoading ? isLoading : false)
      try {
        const res: any = await followAPI.HandleFollwer(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setFollowerUserOther(res.data.followers)
          setNumberOfFollowers(res.data.numberOfFollowers)
        }
        setIsLoading(false)

      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("FollowerScreen", errorMessage)
        setIsLoading(false)
      }
    }
  }
  const renderEventCreated = (events: EventModelNew[]) => {
    return (
      events?.length > 0
        ?
        <View style={{flex:1}}>
          <FlatList 
            showsVerticalScrollIndicator={false}
            data={events}
            keyExtractor={(item) => item._id} // đảm bảo mỗi item có một key duy nhất
            renderItem={({item})=>{
              return (
                <CardComponent styles={{ paddingVertical:0,paddingHorizontal:0 ,backgroundColor:colors.white}} onPress={() => { navigation.push('EventDetails', { id: item._id }); }}>
                <RowComponent>
                  <View>
                    <Image source={{ uri: item?.photoUrl }} style={{ width: appInfo.sizes.WIDTH * 0.35, height: 90, borderRadius: 12, resizeMode: 'stretch' }} />
                    {item.statusEvent === 'Ended' &&  <View style={{position:'absolute',
                    right:0,
                    top:0,
                    backgroundColor:colors.warning,
                    paddingHorizontal:8,
                    paddingVertical:3,
                    borderBottomLeftRadius:10,
                    borderTopRightRadius:10,
                  }}>
                    <TextComponent text={'Đã diễn ra'} size={8} font={fontFamilies.medium} color="white"/>
                  </View>}
                  </View>
                  <SpaceComponent width={8} />
                  <View style={{flex:1}}>

                    <TextComponent numberOfLine={1} text={item?.title} title size={14} color={colors.background} />
                    <TextComponent text={item?.price ? `Từ ${convertMoney(item?.price)}` : 'Vào cổng tự do'} title size={13} color={`${colors.primary}`} />
                    <RowComponent styles={{ flexWrap: 'wrap' }}>
                      {
                  
                        <View style={{ paddingVertical: 2 }} key={item.category?._id}>
                          <TagComponent
                            bgColor={colors.primary}
                            label={item.category.name}
                            textSize={8}
                            styles={{
                              minWidth: 50,
                              paddingVertical: 2,
                              paddingHorizontal: 2,
                            }}
                          />
                        </View>
                      }
                    </RowComponent>

                    {/* {
                      (item.usersInterested && item.usersInterested.length > 0) && <AvatarGroup users={item.usersInterested} />
                    } */}
                    <RowComponent>
                      <Feather name="calendar" size={12} color={colors.background} />
                      <SpaceComponent width={4} />
                      <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(item?.showTimes[0]?.startDate ?? Date.now()).getDay())} - ${DateTime.GetDateNew1(item?.showTimes[0]?.startDate ?? new Date(),item?.showTimes[0]?.endDate || new Date())} `} color={colors.background} size={12} />
                      </RowComponent>
                    <RowComponent justify="space-between" styles={{}}>
                      <RowComponent>

                      <TextComponent text={item.addressDetals.county ?? ''} font={fontFamilies.medium} numberOfLine={1} color={colors.text2} flex={1} size={12} />

                        <SpaceComponent width={4} />
                        <RowComponent>
                          <FontAwesome name="eye" color={colors.primary} size={16} />
                          <SpaceComponent width={2} />
                          <TextComponent text={'78654'} size={12} color={colors.primary} />
                        </RowComponent>
                        <SpaceComponent width={4} />
                      </RowComponent>


                    </RowComponent>
                  </View>
                </RowComponent>
              </CardComponent>
              
              )
            }}
          />
        </View>
        :
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <TextComponent text={'Không có sự kiện nào cả'}/>
        </View>
    )
  }
  return (
    <ContainerComponent back title="Hồ sơ người ta" bgColor={colors.backgroundBluishWhite} right={<Feather name="more-vertical" size={22} color={colors.white} />}>
      <SectionComponent isNoPaddingBottom>
        <CardComponent isShadow styles={[globalStyles.center, { paddingBottom: 20 }]}>

          <RowComponent>
            <AvatarItem size={90} photoUrl={organizer?.user?.photoUrl ?? profile?.photoUrl} borderWidth={1} colorBorderWidth={colors.gray4} />
          </RowComponent>
          <SpaceComponent height={8} />
          <TextComponent text={organizer?.user?.fullname ?? (profile?.fullname || profile?.email || '')} title size={24} />
          {/* {profile?.phoneNumber && <>
            <TextComponent text={profile.phoneNumber} size={14} color={colors.gray} />
            <SpaceComponent height={8} />
          </>} */}
          <SpaceComponent height={8} />

          <RowComponent>
            <View style={[globalStyles.center, { flex: 1 }]}>
              <TextComponent text={`${numberOfFollowers}`} size={20} />
              <TextComponent text="Người theo dõi" />
            </View>
            <View style={{ height: '100%', width: 1, backgroundColor: colors.gray2 }} />
            <View style={[globalStyles.center, { flex: 1 }]}>
              <TextComponent text={followerUserOther[0]?.users.length !== undefined ? `${followerUserOther[0]?.users.filter((item) => item.status === true).length}` : '0'} size={20} />
              <TextComponent text="Đang theo dõi" />
            </View>
          </RowComponent>
          <SpaceComponent height={16} />
          <RowComponent justify="center">
            <ButtonComponent

              text={(follower[0]?.users.length > 0 && follower[0]?.users.some(user => user.idUser?._id === uidOthor)) ? follower[0]?.users.some(user => (user.status === false && user.idUser._id === uidOthor)) ? "Đang đợi chấp nhận" : "Đã theo dõi" : 'Theo dõi'}
              onPress={() => handleFollowUser()}
              type="primary"
              color={colors.primary}
              textColor={colors.white}
              textSize={14}
              width={appInfo.sizes.WIDTH * 0.4}
              styles={{ borderWidth: 1, borderColor: colors.primary, marginBottom: 0, minHeight: 0, paddingVertical: 12 }}
              icon={(follower[0]?.users.length > 0 && follower[0]?.users.some(user => user.idUser?._id === uidOthor)) ?
                <AntDesign name="deleteuser" size={18} color={colors.white} /> :
                <AntDesign name="adduser" size={18} color={colors.white} />}
              iconFlex="left"
            />
            <SpaceComponent width={10} />
            <ButtonComponent text="Liên hệ"
              type="primary"
              color="white"
              textColor={colors.primary}
              textSize={14}
              styles={{ borderWidth: 1, borderColor: colors.primary, marginBottom: 0, minHeight: 0, paddingVertical: 12 }}
              width={appInfo.sizes.WIDTH * 0.4}
              icon={<AntDesign name="message1" size={18} color={colors.primary} />}
              iconFlex="left"
            />
          </RowComponent>
        </CardComponent>

      </SectionComponent>


      <SectionComponent>
        <CardComponent isShadow styles={{height:'79%'}}>

          <RowComponent>
            {
              tabs.map((tab) => (
                <TouchableOpacity key={tab.key}
                  style={[
                    globalStyles.center, {
                      flex: 1,
                      paddingBottom: 4,
                      // borderBottomWidth: 2,
                      // borderBottomColor: tab.key === tabSelected ? colors.primary : colors.white
                    },

                  ]}
                  onPress={() => setTabSelected(tab.key)}
                >
                  <TextComponent text={tab.title} size={16} title={tab.key === tabSelected} color={tab.key === tabSelected ? colors.primary : colors.black} />
                </TouchableOpacity>
              ))
            }
            <Animated.View
              onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
              style={{
                height: 2,
                position: 'absolute',
                width: '50%',
                backgroundColor: colors.primary,
                bottom: 0,
                left: 0,
                borderRadius: 100,
                transform: [
                  { translateX: tabOffsetValue }
                ]
              }} />
          </RowComponent>
          <SpaceComponent height={6} />
          <View style={{flex:1 }}>
            {tabSelected === 'about' ?
              <TextComponent text={organizer?.user?.bio ?? (profile?.bio || "Chưa có gì cả")} /> :
              <>{renderEventCreated(eventCreated)}</>
            }
          </View>
        </ CardComponent>

      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent >
  )
}
export default AboutProfileScreen;