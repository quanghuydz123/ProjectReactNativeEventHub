import { Alert, Button, Image, ImageBackground, Platform, ScrollView, Share, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React, { Ref, useEffect, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from "../../components";
import { appInfo } from "../../constrants/appInfo";
import { ArrowLeft, ArrowLeft2, ArrowRight, Calendar, Data, Location } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import CardComponent from "../../components/CardComponent";
import { globalStyles } from "../../styles/globalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import AvatarGroup from "../../components/AvatarGroup";
import Ionicons from "react-native-vector-icons/Ionicons"
import { fontFamilies } from "../../constrants/fontFamilies";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { EventModelNew } from "../../models/EventModelNew";
import { DateTime } from "../../utils/DateTime";
import { convertMoney } from "../../utils/convertMoney";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/authReducers";
import { UserModel } from "../../models/UserModel";
import { LoadingModal, SelectModalize } from "../../../modals";
import eventAPI from "../../apis/eventAPI";
import followerAPI from "../../apis/followerAPI";
import { FollowerModel } from "../../models/FollowerModel";
import socket from "../../utils/socket";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AvatarItem from "../../components/AvatarItem";
import { UserHandleCallAPI } from "../../utils/UserHandleCallAPI";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { apis } from "../../constrants/apis";
import notificationAPI from "../../apis/notificationAPI";
const EventDetails = ({ navigation, route }: any) => {

  const { item, followers, id }: { item: EventModelNew, followers: FollowerModel[], id: string } = route.params
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [heightButton, setHeightButton] = useState(0);
  const auth = useSelector(authSelector)
  const [isLoading, setIsLoading] = useState(false)
  const [isLLoadingNotShow, setIsLLoadingNotShow] = useState(false)
  const [followerEvent, setFollowerEvent] = useState<FollowerModel[]>(followers)
  const [searchUser, setSearchUser] = useState('')
  const [userSelected, setUserSelected] = useState<string[]>([])
  const [allUser, setAllUser] = useState<UserModel[]>([])
  const [isOpenModalizeInvityUser, setIsOpenModalizeInityUser] = useState(false)
  const [event, setEvent] = useState<EventModelNew>(item)
  useEffect(() => {
    UserHandleCallAPI.getAll(setAllUser)
    if (!event) {
      handleCallApiGetEventById()
    }
    if (!followers) {
      handleCallApiGetAllFollower()
    }

  }, [])
  console.log("event", event?.title)
  const handleCallApiGetEventById = async () => {
    setIsLoading(true)
    try {
      const res = await eventAPI.HandleEvent(apis.event.getById(id))
      if (res && res.data && res.status === 200) {
        setEvent(res.data.event)

      }
      setIsLoading(false)

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log(errorMessage)
      setIsLoading(false)

    }
  }
  const handleCallApiGetAllFollower = async () => {
    const api = `/get-all`
    setIsLoading(true)
    try {
      const res: any = await followerAPI.HandleFollwer(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setFollowerEvent(res.data.followers)
      }
      setIsLoading(false)

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("HomeScreen", errorMessage)
      setIsLoading(false)
    }
  }
  const handleScroll = (event: any) => {//khi scroll tới cuối cùng thì bằng true
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 0; // Khoảng cách từ cuối mà bạn muốn nhận biết
    const y = isAtEnd ? layoutMeasurement.height + contentOffset.y + heightButton : layoutMeasurement.height + contentOffset.y
    const isScrollEnd = y >= contentSize.height - paddingToBottom;
    setIsAtEnd(isScrollEnd);
  };
  const onLayout = (event: any) => {//Lấy ra height
    const { height, width } = event.nativeEvent.layout;
    setHeightButton(height)
  };
  const handleFlowerEvent = async () => {
    const api = '/update-follower-event'
    if (event?._id) {
      try {
        const res = await followerAPI.HandleFollwer(api, { idUser: auth.id, idEvent: event._id }, 'post')
        if (res && res.data.event && res.status === 200) {
          socket.emit("followers");
          handleCallApiGetAllFollower()
        }
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        if (errorMessage.statusCode === 403) {
          console.log(errorMessage.message)
        } else {
          console.log('Lỗi rồi EventDetails')
        }
      }
    }
  }
  const handleSelectItem = (id: string) => {
    if (userSelected.includes(id)) {
      const data = userSelected.filter(item => item !== id);
      setUserSelected(data)
    } else {
      setUserSelected([...userSelected, id])
    }
  }
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  const handleInviteUsers = async () => {
    if (event?._id) {
      const api = apis.notification.handleSendNotificationInviteUserToEvent()
      try {
        const res = await notificationAPI.HandleNotification(api, { uids: userSelected, eventId: event._id }, 'post')
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log('Lỗi rồi EventDetails')

      }
    }
  }
  const handleCreateBillPaymentEvent = async () => {
    const data = {
      createAt: Date.now(),
      createdBy: auth.id,
      event: item,
    }
    navigation.navigate('PaymentScreen', { event: item })
  }
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white
    }}>
      <ImageBackground style={{
        flex: 1,
        height: 260,
      }} imageStyle={{
        resizeMode: 'stretch',
        height: 260,
        width: appInfo.sizes.WIDTH,
      }} source={{ uri: event?.photoUrl ?? 'https://static6.depositphotos.com/1181438/670/v/450/depositphotos_6708849-stock-illustration-magic-spotlights-with-blue-rays.jpg' }}>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}>
          <RowComponent styles={{
            padding: 16,
            paddingTop: 30,
          }} justify="space-between" >
            <RowComponent styles={{ flex: 1 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}
                style={{ minHeight: 48, minWidth: 48, justifyContent: 'center' }}
              >
                <ArrowLeft size={24} color={colors.white} />
              </TouchableOpacity>
              <TextComponent flex={1} text="Chi tiết sự kiện" size={24} title color={colors.white} />
            </RowComponent>
            <CardComponent onPress={() => handleFlowerEvent()} isShadow styles={[globalStyles.noSpaceCard]} color={'#ffffff4D'}>
              {
                event?._id && <FontAwesome
                  name={followerEvent && followerEvent.length > 0 && followerEvent.filter(item => item.user._id === auth.id)[0]?.events.some(eventa => eventa._id === event._id) ? "bookmark" : 'bookmark-o'}
                  size={22}
                  color={followerEvent && followerEvent.length > 0 && followerEvent.filter(item => item.user._id === auth.id)[0]?.events.some(eventa => eventa._id === event._id) ? colors.white : colors.black}
                />
              }
            </CardComponent>
          </RowComponent>
        </LinearGradient>
        <View style={{
          flex: 1,
          paddingTop: 244 - 102,
        }}>
          <SectionComponent>
            <View style={{
              marginTop: 0,
              justifyContent: 'center',
              alignItems: 'center',

            }}>
              <RowComponent styles={[{
                backgroundColor: colors.white, borderRadius: 100, paddingHorizontal: event?.users && event?.users?.length > 0 ? 12 : 0,
                width: '96%'
              }, globalStyles.shadow]}>
                <AvatarGroup size={36} isShowButton users={event?.users} onPressInvity={(event: any) => { event.persist(), setIsOpenModalizeInityUser(true) }} />
              </RowComponent>
            </View>
          </SectionComponent>
          <ScrollView

            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}
          >
            <SectionComponent>
              <TextComponent text={event?.title ?? ''} title size={30} font={fontFamilies.semiBold} />
            </SectionComponent>
            <SectionComponent>
              <RowComponent>
                <CardComponent styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]} color={`${colors.primary}20`}>
                  <MaterialIcons size={30} color={colors.primary} name="attach-money" />
                </CardComponent>
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48
                }}>
                  {
                    event.price ? <>
                      <TextComponent text={convertMoney(event.price ?? 0)} font={fontFamilies.medium} size={16} />
                      <TextComponent text="Áp dụng mã giảm giá ngay !" color={colors.gray} /></> :
                      <>
                        <TextComponent text={'Vào cổng tự do'} font={fontFamilies.medium} size={16} />
                      </>
                  }

                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent>
                <CardComponent styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]} color={`${colors.primary}20`}>
                  <Calendar size={30} color={colors.primary} variant="Bold" />
                </CardComponent>
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48
                }}>
                  <TextComponent text={DateTime.GetDateNew(new Date(event?.startAt ?? Date.now()), new Date(event?.endAt ?? Date.now()))} font={fontFamilies.medium} size={16} />
                  <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(event?.startAt ?? Date.now()).getDay())}, ${DateTime.GetTime(new Date(event?.startAt ?? Date.now()))} - ${DateTime.GetTime(new Date(event?.endAt ?? Date.now()))}`} color={colors.gray} />
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent>
                <CardComponent styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]} color={`${colors.primary}20`}>
                  <Ionicons size={30} color={colors.primary} name="location-sharp" />
                </CardComponent>
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48,
                  flex: 1
                }}>
                  <TextComponent text={event?.Location ?? ''} numberOfLine={1} font={fontFamilies.medium} size={16} />
                  <SpaceComponent height={8} />
                  <TextComponent numberOfLine={2} text={event?.Address ?? ''} color={colors.gray} />
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent onPress={() => {
                if (event?.authorId._id === auth.id) {
                  navigation.navigate('Profile', {
                    screen: 'ProfileScreen'
                  })
                }
                else {
                  navigation.navigate("AboutProfileScreen", { uid: event?.authorId._id })
                }
              }}
              >
                <AvatarItem photoUrl={event?.authorId.photoUrl} size={48} bdRadius={12} />
                <SpaceComponent width={16} />
                <View style={{
                  justifyContent: 'space-around',
                  height: 48
                }}>
                  <TextComponent text={event?.authorId.fullname || ''} font={fontFamilies.medium} size={16} />
                  <TextComponent text="Đơn vị tổ chức" color={colors.gray} />
                </View>
              </RowComponent>
            </SectionComponent>
            <TabBarComponent title={'Thông tin sự kiện'} />
            <SectionComponent>
              <TextComponent text={event?.description ? event.description : ''} />

            </SectionComponent>
          </ScrollView>
        </View>
      </ImageBackground>

      {
        isAtEnd ?
          <View onLayout={onLayout} style={{
            padding: 12
          }}>
            <ButtonComponent text="Mua vé ngay" type="primary"
              icon={<View style={[globalStyles.iconContainer, { backgroundColor: colors.primary }]}>
                <ArrowRight
                  size={18}
                  color={colors.white}
                /></View>}
              iconFlex="right"
              onPress={() => handleCreateBillPaymentEvent()}
            />
          </View>
          :
          <LinearGradient colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,1)']} style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            padding: 12
          }}>
            {event.price ? <ButtonComponent text="Mua vé ngay" type="primary"
              icon={<View style={[globalStyles.iconContainer, { backgroundColor: colors.primary }]}>
                <ArrowRight
                  size={18}
                  color={colors.white}
                /></View>}
              iconFlex="right"
              onPress={() => handleCreateBillPaymentEvent()}
            /> :
              <ButtonComponent text="Đăng ký tham dự" type="primary"/>}
          </LinearGradient>
      }
      <LoadingModal visible={isLoading} />
      <LoadingModal visible={isLLoadingNotShow} notShowContent />
      <SelectModalize
        adjustToContentHeight
        title="Danh sách người dùng đang theo dõi"
        data={allUser}
        onClose={() => setIsOpenModalizeInityUser(false)}
        onSearch={(val: string) => setSearchUser(val)}
        valueSearch={searchUser}
        visible={isOpenModalizeInvityUser}
        footerComponent={<View style={{
          paddingBottom: 10,
        }}>
          <ButtonComponent disable={userSelected.length <= 0} text="Mời ngay" color="white" styles={{ borderWidth: 1, borderColor: colors.primary }}
            textColor={colors.primary} type="primary" onPress={() => handleInviteUsers()} />
        </View>}
        renderItem={(item: UserModel) => <RowComponent
          key={item.email} styles={[
            {
              paddingVertical: 6,
              borderBottomWidth: 1,
              borderBlockColor: colors.gray6,
            }
          ]}
        >
          <AvatarItem photoUrl={item.photoUrl} size={38} onPress={() => {
            if (item._id == auth.id) {
              setIsOpenModalizeInityUser(false)
              navigation.navigate('Profile', {
                screen: 'ProfileScreen'
              })
            }
            else {
              setIsOpenModalizeInityUser(false)
              navigation.navigate("AboutProfileScreen", { uid: item._id })
            }
          }} />
          <SpaceComponent width={8} />
          <View style={{ flex: 1 }}>
            <ButtonComponent
              text={`${item.fullname} (${item.email})`}
              onPress={() => handleSelectItem(item._id)}
              textColor={userSelected.includes(item._id) ?
                colors.primary : colors.colorText}
              numberOfLineText={1}
              textFont={fontFamilies.regular}
            />
          </View>
          {userSelected.includes(item._id) ? <AntDesign color={colors.primary} size={18} name="checkcircle" /> : <AntDesign color={colors.gray} size={18} name="checkcircle" />}
        </RowComponent>}
      />
    </View>
  )
}
export default EventDetails;