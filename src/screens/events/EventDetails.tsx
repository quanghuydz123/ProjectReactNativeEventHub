import {
  Alert,
  BackHandler,
  Button,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Ref, useCallback, useEffect, useRef, useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  CricleComponent,
  DataLoaderComponent,
  ListEventRelatedComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TabBarComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import {appInfo} from '../../constrants/appInfo';
import {
  ArrowDown,
  ArrowDown2,
  ArrowLeft,
  ArrowLeft2,
  ArrowRight,
  Calendar,
  Data,
  Location,
} from 'iconsax-react-native';
import {colors} from '../../constrants/color';
import CardComponent from '../../components/CardComponent';
import {globalStyles} from '../../styles/globalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AvatarGroup from '../../components/AvatarGroup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fontFamilies} from '../../constrants/fontFamilies';
import {EventModelNew} from '../../models/EventModelNew';
import {DateTime} from '../../utils/DateTime';
import {convertMoney, renderPrice} from '../../utils/convertMoney';
import {useDispatch, useSelector} from 'react-redux';
import {
  addViewedEvent,
  authSelector,
  AuthState,
  updateEventsInterested,
} from '../../reduxs/reducers/authReducers';
import {UserModel} from '../../models/UserModel';
import {LoadingModal, SelectModalize} from '../../../modals';
import eventAPI from '../../apis/eventAPI';
import socket from '../../utils/socket';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import AvatarItem from '../../components/AvatarItem';
import {UserHandleCallAPI} from '../../utils/UserHandleCallAPI';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {apis} from '../../constrants/apis';
import notificationAPI from '../../apis/notificationAPI';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ToastMessaging} from '../../utils/showToast';
import {useStatusBar} from '../../hooks/useStatusBar';
import {Linking} from 'react-native';
import userAPI from '../../apis/userApi';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ListTicketComponent from './components/ListTicketComponent';
import RenderHTML, {HTMLElementModel} from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import {
  addEventRelated,
  addShowTimeChose,
  billingSelector,
} from '../../reduxs/reducers/billingReducer';
import ListEventComponent from '../../components/ListEventComponent';
import EventItem from '../../components/EventItem';
import CommentComponent from './components/CommentComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {CommentModel} from '../../models/CommentModel';
import commentAPI from '../../apis/commentAPI';
import {ActivityIndicator} from 'react-native';
import {ShowTimeModel} from '../../models/ShowTimeModel';
import LoadingUI from '../../components/LoadingUI';

const EventDetails = ({navigation, route}: any) => {
  const {id}: {id: string} = route.params;
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [heightButton, setHeightButton] = useState(0);
  const auth: AuthState = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [userSelected, setUserSelected] = useState<string[]>([]);
  const [allUser, setAllUser] = useState<UserModel[]>([]);
  const [isOpenModalizeInvityUser, setIsOpenModalizeInityUser] =
    useState(false);
  const [event, setEvent] = useState<EventModelNew>();
  const dispatch = useDispatch();
  const [isInterested, setIsInterested] = useState(false);
  // const { getItem: getItemAuth } = useAsyncStorage('auth')
  // const [interestText, setInterestText] = useState('')
  const [isShowDes, setIsShowDes] = useState(false);
  const [isLoadingChoseShowTime, setIsLoadingChoseShowTime] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState<EventModelNew[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  // const [textComment, setTextComment] = useState('')
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [index, setIndex] = useState(-1);
  const [interestedCount, setInterestedCount] = useState(0);
  const [descriptionEvent, setDesciptionEvent] = useState('');
  const [showTimes, setShowTimes] = useState<ShowTimeModel[]>([]);
  const [isLoadingShowTime, setIsLoadingShowTime] = useState(true);
  // const [comments,setComments] = useState<CommentModel[]>([])
  useStatusBar('light-content');
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isShowing) {
          bottomSheetRef.current?.close();
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          return true;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [bottomSheetRef, isShowing]),
  );
  useEffect(() => {
    UserHandleCallAPI.getAll(setAllUser);
    if (!event) {
      handleCallApiGetEventById();
    }
  }, []);
  // useEffect( ()=>{
  //   a()
  // },[])
  // const a = async ()=>{
  //   const authItem: any = await getItemAuth()
  //   console.log("authItem",JSON.parse(authItem)?.eventsInterested)
  // }

  useEffect(() => {
    // const userCount = event?.usersInterested?.length || 0;
    // const isUserInterested = event?.usersInterested?.some(item => item.user._id === auth.id);

    // setInterestText(isUserInterested
    //   ? userCount - 1 > 0
    //     ? `Bạn và ${userCount - 1} Người khác đã quan tâm`
    //     : `Bạn đã quan tâm`
    //   : `${userCount} Người đã quan tâm`)
    if (event) {
      setInterestedCount(event?.usersInterested?.length ?? 0);
      haneleGetAPIRelatedEvents();
      // handleCallAPIGetComments()
      handleCallAPIGetDescriptionEvent();
      handleCallAPIGetShowTimesEvent();
      handleIncViewEvent();
    }
  }, [event]);

  useEffect(() => {
    setIsInterested(
      auth?.eventsInterested?.some(
        eventIntersted => eventIntersted.event === event?._id,
      ),
    );
  }, [auth?.eventsInterested, event]);
  const handleCallApiGetEventById = async () => {
    setIsLoading(true);
    try {
      const res = await eventAPI.HandleEvent(apis.event.getById(id));
      if (res && res.data && res.status === 200) {
        setEvent(res.data as EventModelNew);
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = JSON.parse(error.message);
      console.log(errorMessage);
    }
  };
  const handleCallAPIGetDescriptionEvent = async () => {
    try {
      const api = apis.event.getDescriptionEvent({idEvent: event?._id ?? ''});
      const res: any = await eventAPI.HandleEvent(api);
      if (res && res.data && res.status === 200) {
        setDesciptionEvent(res.data);
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      console.log('EventDetails', errorMessage);
    }
  };
  const handleCallAPIGetShowTimesEvent = async () => {
    try {
      const api = apis.event.getShowTimesEvent({idEvent: event?._id ?? ''});
      const res: any = await eventAPI.HandleEvent(api);
      if (res && res.data && res.status === 200) {
        setShowTimes(res.data);
      }
      setIsLoadingShowTime(false);
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      console.log('EventDetails', errorMessage);
    }
  };
  const handleIncViewEvent = async () => {
    try {
      const api = apis.event.incViewEvent();
      const res = await eventAPI.HandleEvent(
        api,
        {idUser: auth.id ?? '', idEvent: event?._id},
        'put',
      );
      if (res && res.data && res.status === 200) {
        const data = res.data as EventModelNew;
        const viewedEvents = [...auth.viewedEvents];
        const index = viewedEvents.findIndex(
          item => item.event._id === data?._id,
        );
        if (index !== -1) {
          viewedEvents.splice(index, 1);
        }
        viewedEvents.unshift({event: data});
        dispatch(addViewedEvent({viewedEvents: viewedEvents}));
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, viewedEvents: viewedEvents }))
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      console.log('EventDetails', errorMessage);
    }
  };
  const haneleGetAPIRelatedEvents = async () => {
    const api = apis.event.getAll({
      categoriesFilter: [event?.category._id || ''],
      limit: '8',
    });
    try {
      const res: any = await eventAPI.HandleEvent(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setRelatedEvents(res.data as EventModelNew[]);
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      console.log('HomeScreen', errorMessage);
    }
  };
  // const handleScroll = (event: any) => {//khi scroll tới cuối cùng thì bằng true
  //   const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  //   const paddingToBottom = 0; // Khoảng cách từ cuối mà bạn muốn nhận biết
  //   const y = isAtEnd ? layoutMeasurement.height + contentOffset.y + heightButton : layoutMeasurement.height + contentOffset.y
  //   const isScrollEnd = y >= contentSize.height - paddingToBottom;
  //   setIsAtEnd(isScrollEnd);
  // };
  // const onLayout = (event: any) => {//Lấy ra height
  //   const { height, width } = event.nativeEvent.layout;
  //   setHeightButton(height)
  // };
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
    setIsInterested(!isInterested);
    if (isInterested) {
      setInterestedCount(prev => prev - 1);
    } else {
      setInterestedCount(prev => prev + 1);
    }
    const api = '/interest-event';
    if (event?._id) {
      try {
        const res: any = await userAPI.HandleUser(
          api,
          {idUser: auth.id, idEvent: event?._id},
          'post',
        );
        if (res && res.status === 200) {
          // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, eventsInterested: res.data.user.eventsInterested }))
          dispatch(
            updateEventsInterested({
              eventsInterested: res.data.user.eventsInterested,
            }),
          );
        }
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message);
        if (errorMessage.statusCode === 403) {
          console.log(errorMessage.message);
        } else {
          console.log('Lỗi rồi EventDetails');
        }
      }
    }
  };
  const handleSelectItem = (id: string) => {
    if (userSelected.includes(id)) {
      const data = userSelected.filter(item => item !== id);
      setUserSelected(data);
    } else {
      setUserSelected([...userSelected, id]);
    }
  };
  // const onShare = async () => {
  //   try {
  //     const result = await Share.share({
  //       message:
  //         'React Native | A framework for building native apps using React',
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error: any) {
  //     Alert.alert(error.message);
  //   }
  // };
  const handleInviteUsers = async () => {
    if (event?._id) {
      const api = apis.notification.handleSendNotificationInviteUserToEvent();
      try {
        const res = await notificationAPI.HandleNotification(
          api,
          {SenderID: auth.id, RecipientIds: userSelected, eventId: event?._id},
          'post',
        );
        if (res && res.status === 200 && res.data) {
          // socket.emit('getNotifications', { idUser: auth.id })
          setIsOpenModalizeInityUser(false);
          setUserSelected([]);
        }
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message);
        console.log('Lỗi rồi EventDetails');
      }
    }
  };
  // const handleCreateBillPaymentEvent = async () => {
  //   navigation.navigate('PaymentScreen', { event: event })
  // }

  const openMap = () => {
    const encodedAddress = encodeURIComponent(event?.Address || ''); // Mã hóa địa chỉ
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log('Không thể mở URL:', url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('Lỗi khi mở bản đồ:', err));
  };
  const share = () => {
    const options = {
      message:
        'Vào đây xem sự kiện siêu "xịn sò" nè! Đặt vé ngay để không bỏ lỡ nha!',
      url: 'https://ticketbox.vn/baotangcuanuoitiec-hn-vu-22907?utm_medium=hero-banner&utm_source=tkb-homepage',
    };
    Share.open(options)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  const renderButton = () => {
    let text = isLoadingShowTime ? 'Đang xử lý' : 'Mua vé ngay';
    let disable = isLoadingShowTime;
    let width = '70%';
    let onPress = () => {
      if (checkLogin()) {
        setIsLoadingChoseShowTime(true);
        dispatch(
          addShowTimeChose({
            showTimes: showTimes[0],
            idEvent: event?._id,
            titleEvent: event?.title,
            addRessEvent: event?.Address,
            locationEvent: event?.Location,
            relatedEvents: relatedEvents,
          }),
        );
        setIsLoadingChoseShowTime(false);
        navigation.navigate('ChooseTicketScreen');
      }
    };
    if (event?.statusEvent === 'NotYetOnSale') {
      text = 'Sự kiện chưa mở bán';
      width = '80%';
      disable = true;
    } else if (event?.statusEvent === 'SoldOut') {
      text = 'Đã hết vé';
      width = '80%';
      disable = true;
    } else if (event?.statusEvent === 'Ended') {
      text = 'Sự kiện đã hết thúc';
      width = '80%';
      disable = true;
    } else if (event?.statusEvent === 'SaleStopped') {
      text = 'Đã ngưng bán vé';
      width = '80%';
      disable = true;
    } else if (event?.statusEvent === 'Ongoing') {
      text = 'Sự kiện đang diễn ra';
      width = '80%';
      disable = true;
    } else if (event?.statusEvent === 'Cancelled') {
      text = 'Đã bị hủy';
      width = '80%';
      disable = true;
    } else if (showTimes && showTimes?.length > 1) {
      text = 'Chọn lịch diễn';
      onPress = () => scrollToComponent();
    }
    return (
      <ButtonComponent
        text={text}
        alignItems="flex-end"
        type="primary"
        width={width}
        styles={{paddingVertical: 8, marginBottom: 0}}
        textSize={14}
        onPress={onPress}
        isCheckLogin={true}
        disable={disable}
      />
    );
  };

  const scrollViewRef: any = useRef(null); //tự scroll đến mục tiêu khi click
  const targetRef: any = useRef(null);
  const scrollToComponent = () => {
    targetRef.current?.measureLayout(
      scrollViewRef?.current?.getInnerViewNode(),
      (x: number, y: number) => {
        scrollViewRef?.current?.scrollTo({y: y, animated: true});
      },
    );
  };
  const checkLogin = () => {
    if (!auth.accesstoken) {
      navigation.navigate('LoginScreen');
      return false;
    }
    return true;
  };
  const openComment = () => {
    if (isShowing) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef?.current?.expand();
    }
  };
  return (
    <>
      <ContainerComponent
        scrollRef={scrollViewRef}
        back
        title={'Chi tiết sự kiện'}
        isScroll
        isHiddenSpaceTop
        bgColor={colors.backgroundBluishWhite}
        right={
          !isLoading ? (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 100,
                padding: 6,
              }}
              onPress={() => share()}>
              <FontAwesome name="share" size={16} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <></>
          )
        }>
        <View style={[{flex: 1, height: 'auto'}, styles.shadow]}>
          <ImageBackground
            source={{
              uri:
                event?.photoUrl ??
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDsou-9Yj0s2NTQ1pGx4zvMQj12BW1NUvgLA&s',
            }}
            imageStyle={{flex: 1, objectFit: 'fill'}}
            style={[globalStyles.shadow, {height: '100%'}]}
            blurRadius={4}>
            <SectionComponent styles={{paddingTop: 10}}>
              <CardComponent
                color={colors.background1}
                styles={{padding: 0, height: '99%'}}
                isShadow>
                <Image
                  source={{
                    uri:
                      event?.photoUrl ??
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDsou-9Yj0s2NTQ1pGx4zvMQj12BW1NUvgLA&s',
                  }}
                  style={{
                    height: 180,
                    objectFit: 'fill',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
                <SectionComponent styles={{paddingTop: 12}}>
                  <TextComponent
                    text={event?.title || ''}
                    numberOfLine={2}
                    title
                    size={16}
                    color={colors.white}
                    font={fontFamilies.medium}
                  />
                  <SpaceComponent height={8} />
                  <RowComponent styles={{alignItems: 'flex-start'}}>
                    <FontAwesome6
                      name="calendar"
                      size={14}
                      color={colors.white}
                    />
                    <SpaceComponent width={8} />
                    <View>
                      <TextComponent
                        text={`${DateTime.GetTime(
                          showTimes[0]?.startDate || new Date(),
                        )} - ${DateTime.GetTime(
                          showTimes[0]?.endDate || new Date(),
                        )}, ${DateTime.GetDateNew1(
                          showTimes[0]?.startDate || new Date(),
                          showTimes[0]?.endDate || new Date(),
                        )}`}
                        font={fontFamilies.medium}
                        color={colors.primary}
                        size={12}
                      />
                      {showTimes && showTimes.length > 1 && (
                        <View
                          style={{
                            alignSelf: 'flex-start',
                            borderWidth: 1,
                            borderColor: colors.white,
                            padding: 2,
                          }}>
                          <TextComponent
                            text={`+${showTimes.length - 1} thời gian khác`}
                            color={colors.white}
                            font={fontFamilies.medium}
                            size={8}
                          />
                        </View>
                      )}
                    </View>
                  </RowComponent>

                  {!(showTimes && showTimes.length > 1) && (
                    <SpaceComponent height={8} />
                  )}
                  <RowComponent styles={{alignItems: 'flex-start'}}>
                    <FontAwesome6
                      size={14}
                      color={colors.white}
                      name="location-dot"
                      style={{}}
                    />
                    <SpaceComponent width={8} />
                    <View style={{flex: 1}}>
                      <TextComponent
                        text={event?.Location || ''}
                        numberOfLine={2}
                        color={colors.primary}
                        font={fontFamilies.medium}
                        size={12}
                      />
                      <TextComponent
                        numberOfLine={2}
                        text={event?.Address || ''}
                        size={11.5}
                        color={colors.gray4}
                      />
                      <ButtonComponent
                        text="Xem trên bảng đồ"
                        type="link"
                        textFont={fontFamilies.medium}
                        icon={<ArrowDown2 size={14} color={colors.primary} />}
                        iconFlex="right"
                        textSize={10}
                        textColor={colors.primary}
                        onPress={() => openMap()}
                      />
                    </View>
                  </RowComponent>
                </SectionComponent>
              </CardComponent>
            </SectionComponent>
          </ImageBackground>
        </View>
        <SpaceComponent height={14} />
        {/* <SectionComponent styles={{ paddingTop: 14 }}>
          <CardComponent isShadow>
            <RowComponent justify="center" styles={{ paddingVertical: 10 }}>
              <ButtonComponent
                text={isInterested ? 'Đã quan tâm' : 'Quan tâm'}
                textFont={'12'} type="primary"
                width={appInfo.sizes.WIDTH * 0.42}
                color={colors.white}
                textColor={colors.background}
                styles={{ borderWidth: 1, borderColor: colors.background, minHeight: 0, paddingVertical: 12 }}
                icon={<FontAwesome name={isInterested ? "star" : "star-o"} size={16} color={colors.background} />}
                iconFlex="left"
                textSize={14}
                isCheckLogin={true}
                mrBottom={0}
                onPress={() => { handleInterestEvent() }}
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
                isCheckLogin
                textSize={14}
                onPress={() => setIsOpenModalizeInityUser(true)}
              />

            </RowComponent>
            {event && event?.usersInterested && event?.usersInterested.length > 0 && <>
              <SpaceComponent height={12} />
              <RowComponent styles={{ alignItems: 'flex-start' }}>
                <MaterialCommunityIcons size={20} color={colors.primary} name="account-heart-outline" />
                <SpaceComponent width={8} />
                <View>
                  <TextComponent
                    text={interestText}
                    size={14}
                    styles={{ fontWeight: 'bold' }} color={colors.primary}
                  />
                  {<AvatarGroup isShowButton isShowText={false} users={event?.usersInterested} textColor={colors.background} size={26} />}

                </View>
              </RowComponent>
            </>}
          </CardComponent>
        </SectionComponent> */}
        <SectionComponent>
          <CardComponent isShadow styles={{paddingBottom: 26}}>
            <View style={{}}>
              <TextComponent
                text={'Giới thiệu'}
                font={fontFamilies.bold}
                title
                size={18}
              />
              {event?.keywords && event.keywords.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 10,
                  }}>
                  {event.keywords.map(item => {
                    return (
                      <View style={{paddingRight: 4, paddingVertical: 4}}>
                        <TagComponent
                          label={item?.name ?? ''}
                          bgColor={colors.white}
                          textColor={colors.colorText}
                          styles={{
                            borderWidth: 1,
                            borderColor: colors.background,
                          }}
                          onPress={() =>
                            navigation.push('SearchEventsScreen', {
                              keywordsSelected: [item._id],
                            })
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              )}
              <SpaceComponent height={10} />
              <SpaceComponent height={1} styles={{}} color={colors.gray2} />
              <SpaceComponent height={10} />
            </View>
            <View
              style={{maxHeight: isShowDes ? 5000 : 480, overflow: 'hidden'}}>
              {/* <TextComponent text={event?.description ?? ''} /> */}
              {descriptionEvent ? (
                <RenderHTML
                  contentWidth={appInfo.sizes.WIDTH - 20}
                  source={{html: descriptionEvent}}
                  // tagsStyles={{
                  //   h2: { textAlign: 'center', fontWeight: 'bold', fontSize: 24 },
                  //   p: { textAlign: 'center', fontSize: 16, lineHeight: 24 },
                  //   li: { fontSize: 16, lineHeight: 22 },
                  // }}

                  tagsStyles={{
                    img: {
                      objectFit: 'fill',
                    },
                    ul: {},
                    li: {
                      color: colors.black,
                    },
                    p: {
                      margin: 0,
                    },
                    h1: {
                      fontSize: 20,
                    },
                    h2: {
                      fontSize: 18,
                    },
                    h3: {
                      fontSize: 16,
                    },
                    h4: {
                      fontSize: 14,
                    },
                    h5: {
                      fontSize: 12,
                    },
                  }}
                  computeEmbeddedMaxWidth={() => appInfo.sizes.WIDTH - 90}
                />
              ) : (
                <LoadingUI />
              )}
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                left: 10,
              }}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,1)']}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 80, // Độ cao mờ
                  bottom: 0,
                }}
              />
              <TouchableOpacity
                onPress={() => setIsShowDes(!isShowDes)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  paddingTop: 8,
                  paddingBottom: 8,
                }}>
                <AntDesign
                  name={isShowDes ? 'caretup' : 'caretdown'}
                  size={10}
                  color={colors.gray4}
                />
              </TouchableOpacity>
            </View>
          </CardComponent>
        </SectionComponent>
        <SectionComponent sectionRef={targetRef}>
          <CardComponent
            isNoPadding
            isShadow
            title="Thông tin vé"
            sizeTitle={14}
            colorSpace={colors.background}
            colorTitle={colors.white}
            color={colors.background}>
            {showTimes && showTimes.length > 0 ? (
              <ListTicketComponent
                showTimes={showTimes}
                idEvent={event?._id ?? ''}
                titleEvent={event?.title ?? ''}
                addRessEvent={event?.Address ?? ''}
                locationEvent={event?.Location ?? ''}
                relatedEvents={relatedEvents}
              />
            ) : isLoadingShowTime ? (
              <LoadingUI bgColor={colors.background} />
            ) : (
              <View
                style={{
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextComponent
                  text={'Không có suất diễn nào'}
                  color={colors.white}
                />
              </View>
            )}
          </CardComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent isShadow title="Ban tổ chức">
            <AvatarItem
              size={120}
              bdRadius={2}
              photoUrl={
                event?.authorId.user.photoUrl ||
                'https://i.scdn.co/image/ab676161000051745a79a6ca8c60e4ec1440be53'
              }
              onPress={() => {
                if (event?.authorId?.user._id === auth.id) {
                  {
                    ToastMessaging.Warning({
                      message: 'Đó là bạn mà',
                      visibilityTime: 2000,
                    });
                  }
                } else {
                  navigation.navigate('AboutProfileScreen', {
                    uid: event?.authorId?.user._id,
                    user: event?.authorId.user,
                  });
                }
              }}
            />
            <TextComponent
              text={event?.authorId.user.fullname || ''}
              paddingVertical={8}
              size={16}
              font={fontFamilies.bold}
            />
            <TextComponent
              text={
                event?.authorId.user.bio ||
                'Siêu nhạc hội đẳng cấp quốc tế 8Wonder'
              }
            />
          </CardComponent>
        </SectionComponent>

        <LoadingModal
          visible={isLoading || isLoadingChoseShowTime}
          message="Hệ thống đang xử lý"
          bgColor={isLoading ? colors.background : 'rgba(0,0,0,0.5)'}
          styles={{marginTop: isLoading ? 78 : 0}}
        />
        <SelectModalize
          adjustToContentHeight
          title="Danh sách người dùng đang theo dõi"
          data={allUser}
          onClose={() => setIsOpenModalizeInityUser(false)}
          onSearch={(val: string) => setSearchUser(val)}
          valueSearch={searchUser}
          visible={isOpenModalizeInvityUser}
          footerComponent={
            <View
              style={{
                paddingBottom: 10,
              }}>
              <ButtonComponent
                disable={false}
                text="Mời ngay"
                color="white"
                styles={{borderWidth: 1, borderColor: colors.primary}}
                textColor={colors.primary}
                type="primary"
                onPress={() => handleInviteUsers()}
              />
            </View>
          }
          renderItem={(item: UserModel) => (
            <RowComponent
              key={item.email}
              styles={[
                {
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderBlockColor: colors.gray6,
                },
              ]}>
              <AvatarItem
                photoUrl={item?.photoUrl}
                size={38}
                onPress={() => {
                  if (item?._id == auth?.id) {
                    setIsOpenModalizeInityUser(false);
                    // navigation.navigate('Profile', {
                    //   screen: 'ProfileScreen'
                    // })
                  } else {
                    setIsOpenModalizeInityUser(false);
                    navigation.navigate('AboutProfileScreen', {uid: item?._id});
                  }
                }}
              />
              <SpaceComponent width={8} />
              <View style={{flex: 1}}>
                <ButtonComponent
                  text={`${item.fullname} (${item.email})`}
                  onPress={() => handleSelectItem(item?._id)}
                  textColor={
                    userSelected.includes(item?._id)
                      ? colors.primary
                      : colors.colorText
                  }
                  numberOfLineText={1}
                  textFont={fontFamilies.regular}
                />
              </View>
              {userSelected.includes(item?._id) ? (
                <AntDesign
                  color={colors.primary}
                  size={18}
                  name="checkcircle"
                />
              ) : (
                <AntDesign color={colors.gray} size={18} name="checkcircle" />
              )}
            </RowComponent>
          )}
        />
        <ListEventRelatedComponent relatedEvents={relatedEvents} />
      </ContainerComponent>
      {!isLoading && (
        <CommentComponent
          // textComment={textComment}
          authorId={event?.authorId.user._id ?? ''}
          idEvent={event?._id ?? ''}
          // comments={comments}
          // setTextComment={(val) => setTextComment(val)}
          setIndex={val => setIndex(val)}
          setIsShowing={val => setIsShowing(val)}
          isShowing={isShowing}
          ref={bottomSheetRef}
        />
      )}

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: appInfo.sizes.HEIGHT * 0.3,
          right: 8,
        }}
        onPress={() => {
          if (checkLogin()) {
            handleInterestEvent();
          }
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <AntDesign
            name={isInterested ? 'like1' : 'like2'}
            size={28}
            color={colors.primary}
          />
          <TextComponent
            text={interestedCount}
            size={14}
            font={fontFamilies.medium}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: appInfo.sizes.HEIGHT * 0.215,
          right: 8,
        }}
        onPress={() => openComment()}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <AntDesign
            name={'message1'}
            style={
              {
                // transform: [{ rotate: '360deg' }]
              }
            }
            size={28}
            color={colors.primary}
          />
          <TextComponent
            text={event?.totalComments ?? 0}
            size={14}
            font={fontFamilies.medium}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: appInfo.sizes.HEIGHT * 0.15,
          right: 8,
        }}
        onPress={() => {
          if (checkLogin()) {
            setIsOpenModalizeInityUser(true);
          }
        }}>
        <Ionicons name="person-add" size={28} color={colors.primary} />
      </TouchableOpacity>

      {
        <SectionComponent
          isNoPaddingBottom
          styles={{
            backgroundColor: colors.black,
            height: 70,
            justifyContent: 'center',
          }}>
          <RowComponent justify="space-between">
            <Text
              style={{
                color: colors.white,
                fontSize: 19,
                fontFamily: fontFamilies.medium,
              }}>
              {renderPrice(showTimes[0])}
            </Text>
            {renderButton()}
          </RowComponent>
        </SectionComponent>
      }
    </>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#262626', // Màu của bóng đổ, sử dụng giá trị RGBA để xác định màu và độ trong suốt.
    shadowOffset: {
      width: 0, // Độ lệch bóng đổ theo trục X. Giá trị 0 nghĩa là bóng đổ không lệch theo chiều ngang.
      height: 4, // Độ lệch bóng đổ theo trục Y. Giá trị 4 nghĩa là bóng đổ sẽ lệch xuống dưới 4 đơn vị.
    },
    shadowOpacity: 0.25, // Độ mờ của bóng đổ, giá trị từ 0 đến 1. Giá trị 0.25 nghĩa là bóng đổ sẽ có độ mờ 25%.
    shadowRadius: 8, // Bán kính mờ của bóng đổ, giá trị lớn hơn sẽ làm bóng đổ trở nên mờ hơn và mềm hơn.
    elevation: 8, // Độ cao của phần tử trên Android, ảnh hưởng đến độ mờ và kích thước của bóng đổ.
  },
});
export default EventDetails;
