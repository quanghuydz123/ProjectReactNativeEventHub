import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ButtonComponent, CategoriesList, CricleComponent, DataLoaderComponent, ListVideoComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
import LoadingComponent from '../../components/LoadingComponent';
import EventItem from '../../components/EventItem';
import { EventModelNew } from '../../models/EventModelNew';
import { FollowModel } from '../../models/FollowModel';
import { useDispatch, useSelector } from 'react-redux';
import { addAuth, addPositionUser, authSelector, AuthState } from '../../reduxs/reducers/authReducers';
import eventAPI from '../../apis/eventAPI';
import { apis } from '../../constrants/apis';
import followAPI from '../../apis/followAPI';
import { fontFamilies } from '../../constrants/fontFamilies';
import { colors } from '../../constrants/color';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { globalStyles } from '../../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Notification, SearchNormal } from 'iconsax-react-native';
import categoryAPI from '../../apis/categoryAPI';
import { CategoryModel } from '../../models/CategoryModel';
import notificationAPI from '../../apis/notificationAPI';
import { NotificationModel } from '../../models/NotificationModel';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { AddressModel } from '../../models/AddressModel';
import Geolocation from '@react-native-community/geolocation';
import userAPI from '../../apis/userApi';
import { HandleNotification } from '../../utils/handleNotification';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { handleLinking } from '../../utils/handleLinking';
import { ToastMessaging } from '../../utils/showToast';
import socket from '../../utils/socket';
import axios from 'axios';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { appInfo } from '../../constrants/appInfo';
import Swiper from 'react-native-swiper';
import { Platform, PermissionsAndroid } from 'react-native';
import { Screen } from 'react-native-screens';
import { useStatusBar } from '../../hooks/useStatusBar';
import { constantSelector } from '../../reduxs/reducers/constantReducers';
import EventItemHorizontal from '../../components/EventItemHorizontal';
import { OrganizerModel } from '../../models/OrganizerModel';
import organizerAPI from '../../apis/organizerAPI';
import AvatarItem from '../../components/AvatarItem';
const AnimatedFontAwesome5 = Animated.createAnimatedComponent(FontAwesome5)
const AnimatedMaterialCommunityIcons = Animated.createAnimatedComponent(MaterialCommunityIcons)
const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome)
const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons)

const UPPER_HEADER_HEIGHT = 44;
const UPPER_HEADER_PADDING_TOP = 4;
const LOWER_HEADER_HEIGHT = 96;
const HomeScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch()
  const [address, setAddress] = useState<AddressModel>()
  const { getItem } = useAsyncStorage('isRemember')
  const [allEvent, setAllEvent] = useState<EventModelNew[]>([])
  const [allEventNear, setAllEventNear] = useState<EventModelNew[]>([])
  const [allFollower, setAllFollower] = useState<FollowModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingNearEvent, setIsLoadingNearEvent] = useState(true)
  const { getItem: getItemAuth } = useAsyncStorage('auth')
  const [refreshList, setRefreshList] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [notifications, setNotifications] = useState<NotificationModel[]>([])
  const [isViewdNotifications, setIsViewNotifications] = useState(true)
  const [numberOfUnseenNotifications, setNumberOfUnseenNotifications] = useState(0)
  const auth: AuthState = useSelector(authSelector)
  const [organizers, setOrganizers] = useState<OrganizerModel[]>([])
  const [followerByIdAuth, setFollowerByIdAuth] = useState<FollowModel[]>([])

  useStatusBar('light-content')

  const animatedValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const lastOffsetY = useRef(0);
  const scrollDirection = useRef('');

  // const maxHeight = animatedValue.interpolate({
  //   inputRange: [0, LOWER_HEADER_HEIGHT],
  //   outputRange: [96,0],
  //   extrapolate: 'clamp',
  // })
  useEffect(() => {
    HandleNotification.checkNotifitionPersion(dispatch)
    messaging().onMessage(async (mess: FirebaseMessagingTypes.RemoteMessage) => {
      console.log("messasdsad",mess)
      handleCallAPIGetNotifications()
      ToastMessaging.Success({
        message: `${mess.notification?.body}`, title: `${mess.notification?.title}`,
        onPress: () => {
          if (mess.data) {
            if(mess.data.type==='InviteUserToEvent'){
              navigation.navigate('EventDetails', { id: mess?.data.id })
            }
          }
        },
        visibilityTime:3000
      })
    })

    messaging().getInitialNotification().then((mess: any) => {  //Xử khi người dùng tắt app và ấn thông 
      console.log("messmess", mess)
      if(mess?.data?.type==='InviteUserToEvent'){
        if (mess?.data?.id) {
          handleLinking(`com.appeventhubmoinhat123://app/detail/${mess.data.id}`)
        }
      }
    })
  }, [])
  useEffect(() => {
    handleCallApiGetAllEvent(true)
    handleCallApiGetAllFollower()
    handleGetAllCategory()
    handleCallAPIGetOrganizers()
  }, [])
  useEffect(() => {
    getLocationUser()
    handleCallAPIGetNotifications()
    handleCallApiGetFollowerById()
    // checkfcmToken()
  }, [auth.accesstoken])
  // useEffect(() => {
  //   handleCallApiGetEventsNearYou(true)
  // }, [auth.position])
  useEffect(() => {
    setRefreshList(prev => !prev);
  }, [allFollower])

  const handleCallApiGetFollowerById = async (isLoading?: boolean) => {
    if (auth.id) {
      const api = apis.follow.getById(auth.id)
      // setIsLoading(isLoading ? isLoading : false)

      try {
        const res: any = await followAPI.HandleFollwer(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setFollowerByIdAuth(res.data.followers)
        }
        // setIsLoading(false)

      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("FollowerScreen", errorMessage)
        // setIsLoading(false)

      }
    }else{
      setFollowerByIdAuth([])
    }
  }
  useEffect(() => {
    // const handleFollowers = () => {
    //   handleCallApiGetAllFollower();
    //   console.log('followers cập nhật');
    // };

    // const handleEvents = () => {
    //   handleCallApiGetAllEvent();
    //   handleCallApiGetEventsNearYou();
    //   console.log('events cập nhật');
    // };

    // const handleUpdateUser = () => {
    //   handleCallApiGetAllEvent();
    //   handleCallApiGetEventsNearYou();
    //   console.log('user cập nhật');
    // };
 
    const handleGetNotifications = (idUser?: string) => {
      handleCallAPIGetNotifications(idUser)
      console.log('notification cập nhật123');
    };

    // socket.on('followers', (idUser) => {
    //   if (idUser === auth.id) {
    //     handleCallApiGetAllFollower()
    //   }
    // });
    // socket.on('events', handleEvents);
    // socket.on('updateUser', handleUpdateUser);
    socket.on('getNotifications', ({ idUser }) => {
      handleGetNotifications(idUser)
    })
    return () => {
      // socket.off('followers', handleFollowers);
      // socket.off('events', handleEvents);
      // socket.off('updateUser', handleUpdateUser);
      socket.off('getNotifications', handleGetNotifications);
    };
  }, [])
  // const checkfcmToken = ()=>{
  //     if(auth.fcmTokens?.length === 0){
  //         HandleNotification.checkNotifitionPersion()
  //     }
  // }
  const handleCallAPIGetOrganizers = async () => {
    try {
      const api = apis.organizer.getAll({})
      const res = await organizerAPI.HandleOrganizer(api)
      if (res && res.data && res.status === 200) {
        setOrganizers(res.data)
      }

    } catch (error) {

    }
  }
  const getFeatureViewAnimation = (animatedValue: any, outputX: number) => {
    const TRANSLATE_X_INPUT_RANGE = [0, 80];
    const translateY = {
      translateY: animatedValue.interpolate({
        inputRange: [0, LOWER_HEADER_HEIGHT],
        outputRange: [0, -57],
        extrapolate: 'clamp',
      }),
    };
    return {
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: TRANSLATE_X_INPUT_RANGE,
            outputRange: [0, outputX],
            extrapolate: 'clamp',
          }),
        },
        translateY,
      ],
    };
  };
  const depositViewAnimation = getFeatureViewAnimation(animatedValue, 36);
  const withdrawViewAnimation = getFeatureViewAnimation(animatedValue, -6);
  const qrViewAnimation = getFeatureViewAnimation(animatedValue, -44);
  const scanViewAnimation = getFeatureViewAnimation(animatedValue, -78);

  const featureNameAnimation = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 30],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 30],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };
  const featureIconAnimation = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  };
  const featureIconCircleAnimation = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 25],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })
  };
  // const textInputAnimation = {
  //   transform: [
  //     {
  //       scaleX: animatedValue.interpolate({
  //         inputRange: [0, 50],
  //         outputRange: [1, 0],
  //         extrapolate: 'clamp',
  //       }),
  //     },
  //     {
  //       translateX: animatedValue.interpolate({
  //         inputRange: [0, 25],
  //         outputRange: [0, -100],
  //         extrapolate: 'clamp',
  //       }),
  //     },
  //   ],
  //   opacity: animatedValue.interpolate({
  //     inputRange: [0, 25],
  //     outputRange: [1, 0],
  //     extrapolate: 'clamp',
  //   }),
  // };
  // const viewMoneyAnimation = {
  //   transform: [
  //     {
  //       translateY: animatedValue.interpolate({
  //         inputRange: [0, LOWER_HEADER_HEIGHT],
  //         outputRange: [0, -96],
  //         extrapolate: 'clamp',

  //       }),
  //     },
  //   ],
  // };
  const headerAnimation = {
    zIndex: animatedValue.interpolate({
      inputRange: [0, 10],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };
  const reverseGeoCode = async (lat: number, long: number) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apiKey=${process.env.API_KEY_REVGEOCODE}`
    try {
      const res = await axios(api)
      if (res && res.data && res.status === 200) {
        setAddress(res.data.items[0])
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleGetAllCategory = async () => {
    const api = apis.category.getAll()
    setIsLoadingCategories(true)
    try {
      const res = await categoryAPI.HandleCategory(api)
      if (res && res.data && res.status === 200) {
        setCategories(res.data as CategoryModel[])
      }
      setIsLoadingCategories(false)
    } catch (error: any) {
      setIsLoadingCategories(false)
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log('Lỗi rồi')
      }
    }
  }
  const handleCallApiGetAllFollower = async () => {
    const api = apis.follow.getAll()
    try {
      const res: any = await followAPI.HandleFollwer(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setAllFollower(res.data.followers)
      }

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("HomeScreen", errorMessage)

    }
  }
  const getLocationUser = async () => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        handleCallApiGetEventsNearYou({ isLoading: true, position: position.coords })
        // reverseGeoCode(position.coords.latitude,position.coords.longitude)
        // if (!auth.position) {
        if (auth.accesstoken) {

          if (position?.coords?.latitude !== auth?.position?.lat && position?.coords?.longitude !== auth?.position?.lng) {
            handleCallApiUpdatePostionUser(position?.coords?.latitude, position?.coords?.longitude)
            // }
          }
        }
        // else {
        //   console.log("handleCallApiUpdatePostionUser")
        //   handleCallApiUpdatePostionUser(position?.coords?.latitude, position?.coords?.longitude)
        // }

      }
    }, (error) => {
      console.log('Lấy vị trí bị lỗi', error)
    }, {});

  }
  const handleCallApiUpdatePostionUser = async (lat: number, lng: number) => {
    if (auth.accesstoken) {
      const api = apis.user.updatePositionUser()
      try {
        const res: any = await userAPI.HandleUser(api, { id: auth.id, lat, lng }, 'put');
        const authItem: any = await getItemAuth()
        if (res && res.data && res.status === 200) {
          await AsyncStorage.setItem('auth', JSON.stringify({ ...JSON.parse(authItem), position: res.data.user.position }))
        }
        dispatch(addPositionUser({ lat: res.data.user.position.lat, lng: res.data.user.position.lng }))
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("HomeScreen", errorMessage)
      }
    }
  }
  const handleCheckViewedNotifications = async (notifications123: NotificationModel[]) => {
    const isCheck = notifications123?.some((item) => item.isViewed === false)
    const numberOfUnseenNotifications = notifications123?.reduce((count, item) => count + (!item.isViewed ? 1 : 0), 0);
    // const numberOfUnseenNotifications = notifications.filter((item)=>item.isViewed===false).length
    setNumberOfUnseenNotifications(numberOfUnseenNotifications);
    setIsViewNotifications(!isCheck)
  }
  const handleCallAPIGetNotifications = async (idUser?: string) => {
    if (auth.accesstoken) {
      const api = apis.notification.getNotificationsById({ idUser: idUser ?? auth.id })
      try {
        const res: any = await notificationAPI.HandleNotification(api)
        if (res && res.data && res.status === 200) {
          // console.log("res.data.notificatios", res.data.notifications.length)
          setNotifications(res.data.notifications)
          await handleCheckViewedNotifications(res.data.notifications)
        }

      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        if (errorMessage.statusCode === 403) {
          console.log(errorMessage.message)
        } else {
          console.log('Lỗi rồi')
        }
      }
    } else {
      setNotifications([])
    }
  }

  const handleCallApiGetAllEvent = async (isLoading?: boolean) => {
    const api = apis.event.getAll({ limit: '10' })
    setIsLoading(isLoading ? isLoading : false)
    try {
      const res: any = await eventAPI.HandleEvent(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setAllEvent(res.data as EventModelNew[])
      }
      setIsLoading(false)

    } catch (error: any) {
      setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log("HomeScreen", errorMessage)
    }
  }

  const handleCallApiGetEventsNearYou = async ({ isLoading, position }: { isLoading?: boolean, position: { latitude: number, longitude: number } }) => {
    // console.log("auth.position",auth.position)
    if (auth.position) {
      setIsLoadingNearEvent(isLoading ? isLoading : false)
      // const api = `/get-events?lat=${auth.position.lat}&long=${auth.position.lng}&distance=${10}&limit=${10}&limitDate=${new Date().toISOString()}`
      const api = apis.event.getAll({ lat: position.latitude.toString(), long: position.longitude.toString(), distance: '10', limitDate: `${new Date().toISOString()}`, limit: '10' })
      try {
        const res: any = await eventAPI.HandleEvent(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setAllEventNear(res.data as EventModelNew[])
        }
        setIsLoadingNearEvent(false)

      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("HomeScreen", errorMessage)
        setIsLoadingNearEvent(false)

      }
    } else {
      console.log("Không lấy được vị trí hiện tại để lấy event")
    }
  }
  const handleScrollView = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    scrollDirection.current =
      offsetY - lastOffsetY.current > 0 ? 'down' : 'up';
    lastOffsetY.current = offsetY;
    animatedValue.setValue(offsetY);
  }
  const featureIconCircleCustomAnimation = {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 50],
      outputRange: [colors.white, colors.primary],
      extrapolate: 'clamp',
    })
  };
  const featureIconCustomAnimation = {
    color: animatedValue.interpolate({
      inputRange: [0, 50],
      outputRange: [colors.primary, colors.white],
      extrapolate: 'clamp',
    })
  };
  const featureTestAnimation = {
    // transform: [
    //   {
    //     scale: animatedValue.interpolate({
    //       inputRange: [0, 100],
    //       outputRange: [0, 1],
    //       extrapolate: 'clamp',
    //     }),
    //   },
    // ],
    opacity: animatedValue.interpolate({
      inputRange: [80, 96],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  };
  const checkLogin = () => {
    if (!auth.accesstoken) {
      navigation.navigate('LoginScreen')
      return false
    }
    return true
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View style={[styles.upperHeaderPlaceholder]} />
      </SafeAreaView>

      <Animated.View style={[styles.header, headerAnimation]}>
        <View style={styles.upperHeader}>
          {/* <View style={styles.searchContainer}>
            <Image
              source={require('../../assets/images/momo/search.png')}
              style={[styles.icon16, {marginLeft: 8}]}
            />
            <AnimatedTextInput
              placeholder="Tìm kiếm"
              placeholderTextColor="rgba(255, 255, 255, 0.8)"
              style={[styles.searchInput, textInputAnimation]}
            />
          </View> */}
          <RowComponent styles={{ flex: 1 }}
            onPress={() => navigation.navigate('SearchEventsScreen', {
            })}>
            <SearchNormal size={20} color={colors.white} />
            {/* <Animated.View style={[{ backgroundColor: colors.gray2, marginHorizontal: 10, height: 20, width: 1 }, featureNameAnimation]} /> */}
            <SpaceComponent width={12} />
            <TextComponent text="Tìm kiếm sự kiện..." flex={1} color={colors.white} size={18} animatedValue={animatedValue} isAnimationHiden />
          </RowComponent>
          <SpaceComponent width={16} />
          <TouchableOpacity onPress={() => {
            if (checkLogin()) {
              setNumberOfUnseenNotifications(0)
              setIsViewNotifications(true)
              navigation.navigate('NotificationsScreen', { notificationRoute: notifications.slice(0, 10) })
            }
          }}>
            <Notification size={22} color={colors.white} />
            {
              !isViewdNotifications && <View style={{
                backgroundColor: '#02E9FE',
                width: 18,
                height: 18,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#02E9FE',
                position: 'absolute',
                top: -6,
                right: -6,
                justifyContent: 'center',
                alignItems: 'center'
              }} >
                <TextComponent text={numberOfUnseenNotifications} size={10} font={fontFamilies.medium} color={colors.white} />
              </View>
            }
          </TouchableOpacity>
          <SpaceComponent width={22} />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons name="menu" size={22} color={colors.white} />
            {
              !true && <View style={{
                backgroundColor: '#02E9FE',
                width: 18,
                height: 18,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#02E9FE',
                position: 'absolute',
                top: -6,
                right: -6,
                justifyContent: 'center',
                alignItems: 'center'
              }} >
                <TextComponent text={numberOfUnseenNotifications} size={10} font={fontFamilies.medium} color={colors.white} />
              </View>
            }
          </TouchableOpacity>

        </View>
        {/* <Animated.View style={[{backgroundColor:'white',flexDirection:'row',alignItems:'center',},featureTestAnimation]}>
          <FontAwesome name={isShowMoney ? 'eye' : 'eye-slash'}
            size={14} color={colors.black} onPress={() => setIsShowMoney(!isShowMoney)}
            style={{ paddingHorizontal: 4, paddingVertical: 4 }}
          />
          <TextComponent text={isShowMoney ? '1.000.000đ' : '*********'} font={fontFamilies.medium} color={colors.black} />
        </Animated.View> */}

        <View style={[styles.lowerHeader]}>
          <Animated.View style={[styles.feature, depositViewAnimation]}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => checkLogin()} >
              <CricleComponent color={'rgb(255,255,255)'} borderRadius={10} size={32}
                featureIconAnimation={featureIconCircleCustomAnimation}
                onPress={() => checkLogin()}
              >
                <AnimatedMaterialIcons name='bookmark-added' size={20} color={colors.primary} style={[featureIconCustomAnimation]} />
              </CricleComponent>
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                SỰ KIỆN QT
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.feature, withdrawViewAnimation]}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => checkLogin()} >
              <CricleComponent color={'rgb(255,255,255)'} borderRadius={10} size={32}
                featureIconAnimation={featureIconCircleCustomAnimation}
                onPress={() => checkLogin()}
              >
                <AnimatedFontAwesome name='ticket' size={18} color={colors.primary} style={[featureIconCustomAnimation]} />
              </CricleComponent>
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                VÉ ĐÃ MUA
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.feature, qrViewAnimation]} >

            {/* <CricleComponent color={colors.primary} borderRadius={10} size={32} 
              featureIconAnimation={featureIconAnimation}
              styles={[styles.featureIcon,{width:20}]}
                    console.log("ok")
              >
                <FontAwesome5 name='user-friends' size={16} color={colors.white}/>
              </CricleComponent> */}

            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
              if (checkLogin()) {
                navigation.navigate('FriendsScreen')
              }
            }} >
              <CricleComponent color={'rgb(255,255,255)'} borderRadius={10} size={32}
                featureIconAnimation={featureIconCircleCustomAnimation}
                onPress={() => {
                  if (checkLogin()) {
                    navigation.navigate('FriendsScreen')
                  }
                }}
              >
                <AnimatedFontAwesome5 name='user-friends' size={16} color={colors.primary} style={[featureIconCustomAnimation]} />
              </CricleComponent>
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                THEO DÕI
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.feature, scanViewAnimation]} >

            <TouchableOpacity onPress={() => {
              if (checkLogin()) {
                console.log("ok")
              }
            }} style={{ alignItems: 'center' }}>
              <CricleComponent color={'rgb(255,255,255)'} borderRadius={10} size={32}
                featureIconAnimation={featureIconCircleCustomAnimation}
                onPress={() => {
                  if (checkLogin()) {
                    console.log("ok")
                  }
                }}
              >
                <AnimatedMaterialCommunityIcons name="facebook-messenger" size={22} color={colors.primary} style={[featureIconCustomAnimation]} />
              </CricleComponent>


              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                TIN NHẮN
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        {/* <Animated.View style={[viewMoneyAnimation, { paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }, globalStyles.shadow]}>
          <FontAwesome name={isShowMoney ? 'eye' : 'eye-slash'}
            size={14} color={colors.black} onPress={() => setIsShowMoney(!isShowMoney)}
            style={{ paddingHorizontal: 4, paddingVertical: 4 }}
          />
          <TextComponent text={isShowMoney ? '1.000.000đ' : '*********'} font={fontFamilies.medium} color={colors.black} />
        </Animated.View> */}
      </Animated.View >


      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={handleScrollView}
        onScrollEndDrag={(e) => {
          if (e.nativeEvent.contentOffset.y < LOWER_HEADER_HEIGHT) {
            scrollViewRef.current?.scrollTo({
              y: scrollDirection.current === 'down' ? 96 : 0,
              animated: true,
            });
          }
        }}
        scrollEventThrottle={16}>
        <Animated.View style={[styles.spaceForHeader]} />

        <SectionComponent styles={{ paddingHorizontal: 0, backgroundColor: colors.background }}>
          <View style={{ margin: 0 }}>
            <ListVideoComponent />
          </View>

          <SpaceComponent height={30} />
          <TabBarComponent title="Các sự kiện sắp xảy ra" onPress={() => navigation.navigate('SearchEventsScreen', { title: 'Các sự kiện sắp xảy ra', categories: categories, follows: allFollower })} />
          {
            // <FlatList
            //   showsHorizontalScrollIndicator={false}
            //   horizontal
            //   data={allEvent}
            //   extraData={refreshList}
            //   renderItem={({ item, index }) => <EventItem followers={allFollower} item={item} key={item?._id} />}
            // />
            <DataLoaderComponent data={allEvent} isLoading={isLoading} height={appInfo.sizes.HEIGHT * 0.3} children={
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={allEvent}
                extraData={refreshList}
                renderItem={({ item, index }) => <EventItem item={item} key={item?._id} />}
              />
            }
              messageEmpty={'Không có sự kiên nào sắp xảy ra'}
            />
          }
          <TabBarComponent title="Danh mục" onPress={() => console.log("ok")} isNotShowIconRight titleRight='' />
          <DataLoaderComponent data={categories} isLoading={isLoadingCategories} height={appInfo.sizes.HEIGHT * 0.2} children={
            <CategoriesList values={categories} />
          }
            messageEmpty={'Không có thể loại nào cả'}
          />
          <SpaceComponent height={16} />
          <TabBarComponent title="Gần chỗ bạn" onPress={() => navigation.navigate('SearchEventsScreen', { title: 'Các sự kiện gần chỗ bạn', categories: categories, lat: auth.position.lat, long: auth.position.lng, distance: '10', follows: allFollower })} />
          {


            <DataLoaderComponent data={allEventNear} isLoading={isLoadingNearEvent} height={appInfo.sizes.HEIGHT * 0.3} children={
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={allEventNear}
                extraData={refreshList}
                renderItem={({ item, index }) => <EventItem item={item} key={item?._id} />}
              />
            }
              messageEmpty={'Không có sự kiên nào gần chỗ bạn'}
            />
          }
          <TabBarComponent title="Các đơn vị tổ sự kiện" onPress={() => navigation.navigate('OrganizerNavigator',{
            // screen:'OrganizerUnfollowedScreen',
              organizers:organizers,
              // organizersFollowing: organizers.filter((item)=>auth.follow.users.some(user => user?.idUser === item.user._id)),
              // organizersUnFollowed: organizers.filter((item)=>!auth.follow.users.some(user => user?.idUser === item.user._id))
             
          })} />
          <SpaceComponent height={4} />
          <DataLoaderComponent data={organizers} isLoading={false} height={appInfo.sizes.HEIGHT * 0.3} children={
            <SectionComponent styles={{}}>
              {/* <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={organizers}
              extraData={refreshList}
              renderItem={({ item, index }) => <>
                  
              </>
              }
              /> */}
              {(organizers && organizers.length > 0) && organizers.slice(0, 3).map((item) => {
                const isFollowing = auth?.follow?.users.length > 0 && auth?.follow?.users.some(user => user.idUser === item.user._id)
                return <>
                  <RowComponent justify='space-between' key={item.user._id}>
                    <RowComponent styles={{ alignItems: 'flex-start', width: appInfo.sizes.WIDTH * 0.72 }} onPress={() => {
                      if (item?.user._id === auth.id) {
                        { ToastMessaging.Warning({ message: 'Đó là bạn mà', visibilityTime: 2000 }) }
                      }
                      else {
                        navigation.navigate("AboutProfileScreen", { uid: item?.user._id, organizer: item })
                      }
                    }}>
                      <AvatarItem size={70} photoUrl={item.user.photoUrl} colorBorderWidth={colors.gray} />
                      <SpaceComponent width={8} />
                      <View style={{ flex: 1 }}>
                        <TextComponent text={item.user.fullname} font={fontFamilies.medium} numberOfLine={1} color={colors.white} />
                        <TextComponent text={`${item.user.numberOfFollowers} người đang theo dõi`} size={12} color={colors.gray8} />
                        <TextComponent text={item.user.bio ?? ''} size={10} numberOfLine={2} color={colors.gray4} />
                      </View>
                    </RowComponent>
                    <ButtonComponent 
                    text={ isFollowing ? "Đã theo dõi" : 'Theo dõi'}
                    type='primary' 
                    textSize={10} 
                    styles={{ paddingVertical: 6, 
                    paddingHorizontal: 8 }} 
                    color={isFollowing ? colors.gray8 : colors.primary}
                    mrBottom={0} 
                    textColor={isFollowing ? colors.black : colors.white}
                    width={appInfo.sizes.WIDTH * 0.2} />
                  </RowComponent>
                  <SpaceComponent height={16} />
                </>
              })
              }
            </SectionComponent>
          }
            messageEmpty={'Đang tải...'}
          />

          {(auth.viewedEvents && auth.viewedEvents.length > 0) && <>
            <TabBarComponent title="Sự kiện xem gần đây" onPress={() => navigation.navigate('ViewedEventScreen', { bgColor: colors.background })} />
            <DataLoaderComponent data={auth.viewedEvents?.slice(0, 3)} isLoading={false} height={appInfo.sizes.HEIGHT * 0.3} children={
              <SectionComponent>
                {auth.viewedEvents.slice(0, 3).map((item) => <EventItemHorizontal bgColor={colors.background} titleColor={colors.white} textCalendarColor={colors.white} item={item.event} key={item?.event._id} />)}
              </SectionComponent>
            }
              messageEmpty={'Không có sự kiên nào gần chỗ bạn'}
            />

          </>}
          {/* <View style={styles.scrollViewContent} /> */}
        </SectionComponent>
      </ScrollView>
    </View>
  )
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30

  },
  icon16: {
    width: 16,
    height: 16,
  },
  icon32: {
    width: 32,
    height: 32,
  },
  upperHeaderPlaceholder: {
    height: UPPER_HEADER_HEIGHT + UPPER_HEADER_PADDING_TOP,
    paddingTop: UPPER_HEADER_PADDING_TOP,
  },
  header: {
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.primary,
    paddingTop: 30,
    zIndex: 1
  },
  upperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: UPPER_HEADER_HEIGHT + UPPER_HEADER_PADDING_TOP,
    paddingTop: UPPER_HEADER_PADDING_TOP,
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 8,
  },
  bell: {
    width: 16,
    height: 16,
    marginHorizontal: 32,
  },
  avatar: {
    width: 28,
    height: 28,
  },
  lowerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: LOWER_HEADER_HEIGHT,
  },
  searchInput: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    borderRadius: 4,
    paddingVertical: 4,
    paddingLeft: 32,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureName: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 14,
    color: colors.white,
    marginTop: 12,
  },
  spaceForHeader: {
    height: LOWER_HEADER_HEIGHT,
  },
  scrollViewContent: {
    height: 500,
    backgroundColor: colors.background,
  },
});