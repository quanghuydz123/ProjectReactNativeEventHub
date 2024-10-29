import { Alert, Button, Image, ImageBackground, Platform, ScrollView, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { Ref, useEffect, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components";
import { appInfo } from "../../constrants/appInfo";
import { ArrowDown, ArrowDown2, ArrowLeft, ArrowLeft2, ArrowRight, Calendar, Data, Location } from "iconsax-react-native";
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
import { useDispatch, useSelector } from "react-redux";
import { authSelector, AuthState, updateEventsInterested } from "../../reduxs/reducers/authReducers";
import { UserModel } from "../../models/UserModel";
import { LoadingModal, SelectModalize } from "../../../modals";
import eventAPI from "../../apis/eventAPI";
import followAPI from "../../apis/followAPI";
import { FollowModel } from "../../models/FollowModel";
import socket from "../../utils/socket";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AvatarItem from "../../components/AvatarItem";
import { UserHandleCallAPI } from "../../utils/UserHandleCallAPI";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { apis } from "../../constrants/apis";
import notificationAPI from "../../apis/notificationAPI";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ToastMessaging } from "../../utils/showToast";
import { useStatusBar } from "../../hooks/useStatusBar";
import { Linking } from 'react-native';
import userAPI from "../../apis/userApi";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import ListTicketComponent from "./components/ListTicketComponent";
import RenderHTML from "react-native-render-html";
const EventDetails = ({ navigation, route }: any) => {

  const { id }: {   id: string } = route.params
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [heightButton, setHeightButton] = useState(0);
  const auth:AuthState = useSelector(authSelector)
  const [isLoading, setIsLoading] = useState(true)
  // const [isLLoadingNotShow, setIsLLoadingNotShow] = useState(false)
  // const [followerEvent, setFollowerEvent] = useState<FollowModel[]>(followers)
  const [searchUser, setSearchUser] = useState('')
  const [userSelected, setUserSelected] = useState<string[]>([])
  const [allUser, setAllUser] = useState<UserModel[]>([])
  const [isOpenModalizeInvityUser, setIsOpenModalizeInityUser] = useState(false)
  const [event, setEvent] = useState<EventModelNew>()
  const dispatch = useDispatch()
  const [isInterested, setIsInterested] = useState(false)
  const { getItem: getItemAuth } = useAsyncStorage('auth')
  const [interestText,setInterestText] = useState('')
  useStatusBar('light-content')
  console.log("isLoading",isLoading)
  useEffect(() => {
    UserHandleCallAPI.getAll(setAllUser)
    if (!event) {
      handleCallApiGetEventById()
    }
    // if (!followers) {
    //   handleCallApiGetAllFollower()
    // }

  }, [])
  // useEffect( ()=>{
  //   a()
  // },[])
  // const a = async ()=>{
  //   const authItem: any = await getItemAuth()
  //   console.log("authItem",JSON.parse(authItem)?.eventsInterested)  
  // }
  useEffect(()=>{
    const userCount = event?.usersInterested?.length || 0;
    const isUserInterested = event?.usersInterested?.some(item => item.user._id === auth.id);
    
    setInterestText(isUserInterested
      ? userCount - 1 > 0 
        ? `Bạn và ${userCount - 1} Người khác đã quan tâm`
        : `Bạn đã quan tâm`
      : `${userCount} Người đã quan tâm`)
  },[event])
  useEffect(()=>{
    setIsInterested(
      auth?.eventsInterested?.some(eventIntersted => eventIntersted.event === event?._id) 
    );
  },[auth?.eventsInterested,event])
  const handleCallApiGetEventById = async () => {
    setIsLoading(true)
    try {
      const res = await eventAPI.HandleEvent(apis.event.getById(id))
      if (res && res.data && res.status === 200) {
        setEvent(res.data as EventModelNew)

      }
      setIsLoading(false)

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log(errorMessage)
      setIsLoading(false)

    }
  }
  // const handleCallApiGetAllFollower = async () => {
  //   const api = apis.follow.getAll()
  //   setIsLoading(true)
  //   try {
  //     const res: any = await followAPI.HandleFollwer(api, {}, 'get')
  //     if (res && res.data && res.status === 200) {
  //       setFollowerEvent(res.data.followers)
  //     }
  //     setIsLoading(false)

  //   } catch (error: any) {
  //     const errorMessage = JSON.parse(error.message)
  //     console.log("HomeScreen", errorMessage)
  //     setIsLoading(false)
  //   }
  // }
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
  // const handleFlowerEvent = async () => {
  //   const api = apis.follow.updateFollowEvent()
  //   if (event?._id) {
  //     try {
  //       const res = await followAPI.HandleFollwer(api, { idUser: auth.id, idEvent: event?._id }, 'post')
  //       if (res && res.data.event && res.status === 200) {
  //         socket.emit("followers", { id: auth.id });
  //         handleCallApiGetAllFollower()
  //       }
  //     } catch (error: any) {
  //       const errorMessage = JSON.parse(error.message)
  //       if (errorMessage.statusCode === 403) {
  //         console.log(errorMessage.message)
  //       } else {
  //         console.log('Lỗi rồi EventDetails')
  //       }
  //     }
  //   }
  // }
  const handleInterestEvent = async () => {
    const api = '/interest-event'
    if (event?._id) {
      try {
        const res:any = await userAPI.HandleUser(api, { idUser: auth.id, idEvent: event?._id }, 'post')
        if (res && res.status === 200) {
          await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, eventsInterested:res.data.user.eventsInterested }))
          dispatch(updateEventsInterested({eventsInterested:res.data.user.eventsInterested}))
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
        const res = await notificationAPI.HandleNotification(api, { SenderID: auth.id, RecipientIds: userSelected, eventId: event?._id }, 'post')
        if (res && res.status === 200 && res.data) {
          socket.emit('getNotifications',{idUser: auth.id})   
        }
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log('Lỗi rồi EventDetails')

      }
    }
  }
  const handleCreateBillPaymentEvent = async () => {
    navigation.navigate('PaymentScreen', { event: event })
  }
  const openMap = () => {
    const encodedAddress = encodeURIComponent(event?.Address || ''); // Mã hóa địa chỉ
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log('Không thể mở URL:', url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Lỗi khi mở bản đồ:', err));
  }
    return (
   
    <>
    <ContainerComponent back title={"Chi tiết sự kiện"} isScroll isHiddenSpaceTop bgColor={colors.backgroundBluishWhite}>
      <View style={[{ flex: 1, height: appInfo.sizes.HEIGHT * 0.50 },styles.shadow]}>
        
        <ImageBackground
          source={{ uri: event?.photoUrl ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDsou-9Yj0s2NTQ1pGx4zvMQj12BW1NUvgLA&s' }}
          imageStyle={{ flex: 1, objectFit: 'fill' }}
          style={[globalStyles.shadow, { height: '100%' }]}
          blurRadius={4}
        >
          
          <SectionComponent styles={{ paddingTop: 10 }}>
            <CardComponent color={colors.background1} styles={{ padding: 0, height: '98.5%' }} isShadow>
              <Image source={{ uri: event?.photoUrl ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDsou-9Yj0s2NTQ1pGx4zvMQj12BW1NUvgLA&s' }} style={{ height: '55%',objectFit:'fill',
                borderTopLeftRadius:12,
                borderTopRightRadius:12
                }}/>
              <SectionComponent styles={{ paddingTop: 12 }}>
                <TextComponent text={event?.title || ''} numberOfLine={2} title size={18} color={colors.white} font={fontFamilies.medium} />
                <SpaceComponent height={8} />
                <RowComponent styles={{}}>
                  <FontAwesome6 name="calendar" size={16} color={colors.white} />
                  <SpaceComponent width={8} />
                  <TextComponent text={`19:00 - 21:30, 22 Tháng 11, 2024`} font={fontFamilies.medium} color={colors.primary} size={12.5} />
                </RowComponent>
                <SpaceComponent height={8} />
                <RowComponent styles={{ alignItems: 'flex-start' }}>
                  <FontAwesome6 size={16} color={colors.white} name="location-dot" style={{}} />
                  <SpaceComponent width={8} />
                  <View style={{ flex: 1 }}>
                    <TextComponent text={event?.Location || ''} numberOfLine={1} color={colors.primary} font={fontFamilies.medium} size={12.5} />
                    <TextComponent numberOfLine={2} text={event?.Address || ''} size={12} color={colors.gray4} />
                    <ButtonComponent
                    text="Xem trên bảng đồ"
                    type="link"
                    textFont={fontFamilies.medium}
                    icon={<ArrowDown2 size={14} color={colors.primary}/>}
                    iconFlex="right"
                    textSize={11}
                    textColor={colors.primary}
                    onPress={()=>openMap()}
                  />
                  </View>
                </RowComponent>
              </SectionComponent>
            </CardComponent>
          </SectionComponent>
        </ImageBackground>
      </View>
      <SectionComponent styles={{paddingTop:14}}>
        <CardComponent isShadow>
        <RowComponent justify="center" styles={{paddingVertical:10}}>
                <ButtonComponent
                  text={isInterested ? 'Đã quan tâm' : 'Quan tâm'}
                  textFont={'12'} type="primary"
                  width={appInfo.sizes.WIDTH * 0.42}
                  color={colors.white}
                  textColor={colors.background}
                  styles={{ borderWidth: 1, borderColor: colors.background, minHeight: 0, paddingVertical: 12 }}
                  icon={<FontAwesome name={isInterested ? "star" : "star-o"} size={16} color={colors.background} />}
                  iconFlex="left"
                  mrBottom={0}
                  onPress={() => handleInterestEvent()}
                />

                <SpaceComponent width={8} />
                <ButtonComponent
                  text={'Mời bạn bè'}
                  textFont={'12'}
                  type="primary"
                  width={appInfo.sizes.WIDTH * 0.42}
                  color={colors.white}
                  textColor={colors.background}
                  styles={{ borderWidth: 1, borderColor: colors.background, minHeight: 0, paddingVertical: 12 }}
                  icon={<Ionicons name="person-add" size={16} color={colors.background} />}
                  iconFlex="left"
                  mrBottom={0}
                  onPress={() => { setIsOpenModalizeInityUser(true) }}
                />
                
              </RowComponent>
              {/* {<AvatarGroup  users={event?.usersInterested} textColor={colors.background} size={40}  />} */}
              {event && event?.usersInterested && event?.usersInterested.length>0 && <>
              <SpaceComponent height={12}/>
              <RowComponent styles={{alignItems:'flex-start'}}>
                <MaterialCommunityIcons size={20} color={colors.primary} name="account-heart-outline" />
                <SpaceComponent width={8}/>
                <View>
                    <TextComponent 
                    text={interestText} 
                    size={14} 
                    styles={{fontWeight:'bold'} } color={colors.primary}
                    />
                    {<AvatarGroup  isShowButton isShowText={false} users={event?.usersInterested} textColor={colors.background} size={26}  />}

                </View>
              </RowComponent>
              </>}
        </CardComponent>
      </SectionComponent>
      <SectionComponent >
        <CardComponent isShadow title='Giới thiệu'>
          {/* <TextComponent text={event?.description ?? ''} /> */}
          {event?.description && <RenderHTML
        contentWidth={appInfo.sizes.WIDTH - 20}
                
        source={{ html: event.description }}
        // tagsStyles={{
        //   h2: { textAlign: 'center', fontWeight: 'bold', fontSize: 24 },
        //   p: { textAlign: 'center', fontSize: 16, lineHeight: 24 },
        //   li: { fontSize: 16, lineHeight: 22 },
        // }}
        
        tagsStyles={{
          img:{
            objectFit:'fill',
          },
          
        p:{
          margin:0
        }
        }}
        computeEmbeddedMaxWidth={() => appInfo.sizes.WIDTH - 90}
        
      />}
        </CardComponent>
      </SectionComponent>
      <SectionComponent >
        <CardComponent isNoPadding isShadow title='Thông tin vé' sizeTitle={14} colorSpace={colors.background} colorTitle={colors.white} color={colors.background}>
          <ListTicketComponent />
        </CardComponent>
      </SectionComponent>
      <SectionComponent >
        <CardComponent isShadow title='Ban tổ chức'>
          <AvatarItem size={120} bdRadius={2} photoUrl='https://i.scdn.co/image/ab676161000051745a79a6ca8c60e4ec1440be53'/>
          <TextComponent text={'8Wonder'} paddingVertical={8} size={16} font={fontFamilies.bold}/>
          <TextComponent text={'Siêu nhạc hội đẳng cấp quốc tế 8Wonder'}/>
        </CardComponent>
      </SectionComponent>
     
      <LoadingModal visible={isLoading} message="Hệ thống đang xử lý" bgColor={colors.background} styles={{marginTop:78}}/>
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
          <AvatarItem photoUrl={item?.photoUrl} size={38} onPress={() => {
            if (item?._id == auth?.id) {
              setIsOpenModalizeInityUser(false)
              navigation.navigate('Profile', {
                screen: 'ProfileScreen'
              })
            }
            else {
              setIsOpenModalizeInityUser(false)
              navigation.navigate("AboutProfileScreen", { uid: item?._id })
            }
          }} />
          <SpaceComponent width={8} />
          <View style={{ flex: 1 }}>
            <ButtonComponent
              text={`${item.fullname} (${item.email})`}
              onPress={() => handleSelectItem(item?._id)}
              textColor={userSelected.includes(item?._id) ?
                colors.primary : colors.colorText}
              numberOfLineText={1}
              textFont={fontFamilies.regular}
            />
          </View>
          {userSelected.includes(item?._id) ? <AntDesign color={colors.primary} size={18} name="checkcircle" /> : <AntDesign color={colors.gray} size={18} name="checkcircle" />}
        </RowComponent>}/>
    </ContainerComponent>
    {
      <SectionComponent isNoPaddingBottom styles={{backgroundColor:colors.black,height:70,justifyContent:'center'}}>
        <RowComponent justify="space-between">
          <Text style={{
            color:colors.white,
            fontSize:15}}>Từ <Text style={{
              color:colors.white,
              fontSize:19,
              fontFamily:fontFamilies.medium
              }}>{convertMoney(event?.price || 0)}
              </Text>
          </Text>
          <ButtonComponent text="Mua vé ngay" alignItems="flex-end" type="primary" width={'70%'}  styles={{paddingVertical:8,marginBottom:0}} textSize={14}/>
        </RowComponent>
      </SectionComponent>
      }
    </>
  )
}
const styles = StyleSheet.create({
  shadow:{
    shadowColor:'#262626',       // Màu của bóng đổ, sử dụng giá trị RGBA để xác định màu và độ trong suốt.
    shadowOffset:{
        width:0,                         // Độ lệch bóng đổ theo trục X. Giá trị 0 nghĩa là bóng đổ không lệch theo chiều ngang.
        height:4                         // Độ lệch bóng đổ theo trục Y. Giá trị 4 nghĩa là bóng đổ sẽ lệch xuống dưới 4 đơn vị.
    },
    shadowOpacity:0.25,                  // Độ mờ của bóng đổ, giá trị từ 0 đến 1. Giá trị 0.25 nghĩa là bóng đổ sẽ có độ mờ 25%.
    shadowRadius:8,                      // Bán kính mờ của bóng đổ, giá trị lớn hơn sẽ làm bóng đổ trở nên mờ hơn và mềm hơn.
    elevation:8                      // Độ cao của phần tử trên Android, ảnh hưởng đến độ mờ và kích thước của bóng đổ.
},
});
export default EventDetails;