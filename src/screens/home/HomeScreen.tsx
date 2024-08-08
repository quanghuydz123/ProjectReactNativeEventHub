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
import { CategoriesList, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
import LoadingComponent from '../../components/LoadingComponent';
import EventItem from '../../components/EventItem';
import { EventModelNew } from '../../models/EventModelNew';
import { FollowModel } from '../../models/FollowModel';
import { useDispatch, useSelector } from 'react-redux';
import { addPositionUser, authSelector } from '../../reduxs/reducers/authReducers';
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
import { appInfo } from '../../constrants/appInfo';
import Swiper from 'react-native-swiper';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
const AnimatedFontAwesome5 = Animated.createAnimatedComponent(FontAwesome5)
const AnimatedMaterialCommunityIcons = Animated.createAnimatedComponent(MaterialCommunityIcons)

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
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingNearEvent, setIsLoadingNearEvent] = useState(false)
  const { getItem: getItemAuth } = useAsyncStorage('auth')
  const [refreshList, setRefreshList] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [notifications, setNotifications] = useState<NotificationModel[]>([])
  const [isViewdNotifications, setIsViewNotifications] = useState(true)
  const [numberOfUnseenNotifications, setNumberOfUnseenNotifications] = useState(0)
  const [isShowMoney, setIsShowMoney] = useState(true)
  const auth = useSelector(authSelector)

  const animatedValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const lastOffsetY = useRef(0);
  const scrollDirection = useRef('');
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

  const viewMoneyAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, LOWER_HEADER_HEIGHT],
          outputRange: [0, -100],
          extrapolate: 'clamp',

        }),
      },
    ],
  };
  const headerAnimation = {
    zIndex: animatedValue.interpolate({
      inputRange: [0, 10],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };
  // const maxHeight = animatedValue.interpolate({
  //   inputRange: [0, LOWER_HEADER_HEIGHT],
  //   outputRange: [96,0],
  //   extrapolate: 'clamp',
  // })

  useEffect(() => {
    HandleNotification.checkNotifitionPersion(dispatch)
    messaging().onMessage(async (mess: FirebaseMessagingTypes.RemoteMessage) => {
      ToastMessaging.Success({
        message: `${mess.notification?.body}`, title: `${mess.notification?.title}`,
        onPress: () => {
          if (mess.data) {
            navigation.navigate('EventDetails', { id: mess?.data.id })
          }
        }
      })
    })

    messaging().getInitialNotification().then((mess: any) => {  //Xử khi người dùng tắt app và ấn thông 
      console.log("messmess", mess)
      if (mess?.data?.id) {
        handleLinking(`eventhub://app/detail/${mess.data.id}`)
      }
    })
  }, [])
  useEffect(() => {
    getLocationUser()
    handleCallApiGetAllEvent(true)
    handleCallApiGetAllFollower()
    handleGetAllCategory()
    handleCallAPIGetNotifications()
  }, [])
  useEffect(() => {
    handleCallApiGetEventsNearYou(true)
  }, [auth.position])
  useEffect(() => {
    setRefreshList(prev => !prev);
  }, [allFollower])
  useEffect(() => {
    const handleFollowers = () => {
      handleCallApiGetAllFollower();
      console.log('followers cập nhật');
    };

    const handleEvents = () => {
      handleCallApiGetAllEvent();
      handleCallApiGetEventsNearYou();
      console.log('events cập nhật');
    };

    const handleUpdateUser = () => {
      handleCallApiGetAllEvent();
      handleCallApiGetEventsNearYou();
      console.log('user cập nhật');
    };

    const handleGetNotifications = () => {
      handleCallAPIGetNotifications()
      console.log('notification cập nhật');
    };

    socket.on('followers', (idUser) => {
      if (idUser === auth.id) {
        handleCallApiGetAllFollower()
      }
    });
    socket.on('events', handleEvents);
    socket.on('updateUser', handleUpdateUser);
    socket.on('getNotifications', handleGetNotifications)
    return () => {
      socket.off('followers', handleFollowers);
      socket.off('events', handleEvents);
      socket.off('updateUser', handleUpdateUser);
      socket.off('getNotifications', handleGetNotifications);
    };
  }, [])

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
    const api = '/get-all'
    try {
      const res: any = await categoryAPI.HandleCategory(api)
      if (res && res.data && res.statusCode === 200) {
        setCategories(res.data.categories)
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log('Lỗi rồi')
      }
    }
  }
  const handleCallApiGetAllFollower = async () => {
    const api = `/get-all`
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
        // reverseGeoCode(position.coords.latitude,position.coords.longitude)
        if (auth.position) {
          if (position?.coords?.latitude !== auth?.position?.lat && position?.coords?.longitude !== auth?.position?.lng) {
            handleCallApiUpdatePostionUser(position?.coords?.latitude, position?.coords?.longitude)
          }
        } else {
          handleCallApiUpdatePostionUser(position?.coords?.latitude, position?.coords?.longitude)
        }

      }
    }, (error) => {
      console.log('Lấy vị trí bị lỗi', error)
    }, {});
  }
  const handleCallApiUpdatePostionUser = async (lat: number, lng: number) => {
    const api = '/update-position-user'
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
  const handleCheckViewedNotifications = async (notifications123: NotificationModel[]) => {
    const isCheck = notifications123?.some((item) => item.isViewed === false)
    const numberOfUnseenNotifications = notifications123?.reduce((count, item) => count + (!item.isViewed ? 1 : 0), 0);
    // const numberOfUnseenNotifications = notifications.filter((item)=>item.isViewed===false).length
    setNumberOfUnseenNotifications(numberOfUnseenNotifications);
    setIsViewNotifications(!isCheck)
  }
  const handleCallAPIGetNotifications = async () => {
    const api = `/get-notifications-byId?uid=${auth.id}`
    try {
      const res: any = await notificationAPI.HandleNotification(api)
      if (res && res.data && res.status === 200) {
        console.log("res.data.notificatios", res.data.notifications.length)
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
  }
  const handleCallApiGetAllEvent = async (isLoading?: boolean) => {
    const api = `/get-events?limit=${10}&limitDate=${new Date().toISOString()}`
    setIsLoading(isLoading ? isLoading : false)
    try {
      const res: any = await eventAPI.HandleEvent(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setAllEvent(res.data.events)
      }
      setIsLoading(false)

    } catch (error: any) {
      setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log("HomeScreen", errorMessage)
    }
  }

  const handleCallApiGetEventsNearYou = async (isLoading?: boolean) => {
    // console.log("auth.position",auth.position)
    if (auth.position) {
      setIsLoadingNearEvent(isLoading ? isLoading : false)
      // const api = `/get-events?lat=${auth.position.lat}&long=${auth.position.lng}&distance=${10}&limit=${10}&limitDate=${new Date().toISOString()}`
      const api = apis.event.getAll({ lat: auth.position.lat, long: auth.position.lng, distance: '10', limit: '10', limitDate: `${new Date().toISOString()}` })
      try {
        const res: any = await eventAPI.HandleEvent(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setAllEventNear(res.data.events)
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
      inputRange: [0, 25],
      outputRange: ['rgb(255, 255, 255)', 'rgb(175, 12, 110)'],
      extrapolate: 'clamp',
    })
  };
  const featureIconCustomAnimation = {
    color: animatedValue.interpolate({
      inputRange: [0, 50],
      outputRange: ['rgb(175, 12, 110)', 'rgb(255, 255, 255)'],
      extrapolate: 'clamp',
    })
  };
  const [index,setIndex] = useState(0)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <Animated.View style={[styles.upperHeaderPlaceholder]} />
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
            <SearchNormal size={20} variant="TwoTone" color={colors.white} />
            <Animated.View style={[{ backgroundColor: colors.gray2, marginHorizontal: 10, height: 20, width: 1 }, featureNameAnimation]} />
            <TextComponent text="Tìm kiếm sự kiện..." flex={1} color={colors.gray2} size={18} animatedValue={animatedValue} isAnimationHiden />
          </RowComponent>
          <SpaceComponent width={16} />
          <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen', { notificationRoute: notifications })}>
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

        <View style={[styles.lowerHeader]}>
          <Animated.View style={[styles.feature, depositViewAnimation]}>
            <Animated.Image
              source={require('../../assets/images/momo/deposit.png')}
              style={[styles.featureIcon, featureIconAnimation]}
            />
            <Animated.Image
              source={require('../../assets/images/momo/deposit-circle.png')}
              style={[styles.icon32, featureIconCircleAnimation]}
            />
            <Animated.Text style={[styles.featureName, featureNameAnimation]}>
              NẠP TIỀN
            </Animated.Text>
          </Animated.View>

          <Animated.View style={[styles.feature, withdrawViewAnimation]}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => console.log("123123")}>
              <Animated.Image
                source={require('../../assets/images/momo/withdraw.png')}
                style={[styles.featureIcon, featureIconAnimation]}
              />
              <Animated.Image
                source={require('../../assets/images/momo/withdraw-circle.png')}
                style={[styles.icon32, featureIconCircleAnimation]}
              />
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                CHUYỂN TIỀN
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.feature, qrViewAnimation]}>

            {/* <CricleComponent color={colors.primary} borderRadius={10} size={32} 
              featureIconAnimation={featureIconAnimation}
              styles={[styles.featureIcon,{width:20}]}
              onPress={() => navigation.navigate('ChatsScreen')}
              >
                <FontAwesome5 name='user-friends' size={16} color={colors.white}/>
              </CricleComponent> */}

            <CricleComponent color={'rgb(255,255,255)'} borderRadius={10} size={32}
              featureIconAnimation={featureIconCircleCustomAnimation}
              onPress={() => navigation.navigate('ChatsScreen')}
            >
              <AnimatedFontAwesome5 name='user-friends' size={16} color={colors.primary} style={[featureIconCustomAnimation]} />
            </CricleComponent>
            <Animated.Text style={[styles.featureName, featureNameAnimation]}>
              BẠN BÈ
            </Animated.Text>
          </Animated.View>

          <Animated.View style={[styles.feature, scanViewAnimation]}>
            {/* <Animated.Image
                source={require('../../assets/images/momo/scan.png')}
                style={[styles.featureIcon, featureIconAnimation]}
              />
              <Animated.Image
                source={require('../../assets/images/momo/scan-circle.png')}
                style={[styles.icon32, featureIconCircleAnimation]}
              /> */}
            {/* <Animated.Image
                  source={require('../../assets/images/momo/qr.png')}
                  style={[styles.featureIcon, featureIconAnimation]}
                /> */}
            <CricleComponent color={'rgb(255,255,255)'} borderRadius={10} size={32}
              featureIconAnimation={featureIconCircleCustomAnimation}
              onPress={() => navigation.navigate('ChatsScreen')}
            >
              <AnimatedMaterialCommunityIcons name="facebook-messenger" size={22} color={colors.primary} style={[featureIconCustomAnimation]} />
            </CricleComponent>
            {/* <Animated.Image
                  source={require('../../assets/images/momo/qr-circle.png')}
                  style={[styles.icon32, featureIconCircleAnimation]}
                /> */}

            <Animated.Text style={[styles.featureName, featureNameAnimation]}>
              TIN NHẮN
            </Animated.Text>
          </Animated.View>
        </View>
        <Animated.View style={[viewMoneyAnimation, { paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }, globalStyles.shadow]}>
          <FontAwesome name={isShowMoney ? 'eye' : 'eye-slash'}
            size={14} color={colors.black} onPress={() => setIsShowMoney(!isShowMoney)}
            style={{ paddingHorizontal: 4, paddingVertical: 4 }}
          />
          <TextComponent text={isShowMoney ? '1.000.000đ' : '*********'} font={fontFamilies.medium} color={colors.black} />
        </Animated.View>
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
        <SectionComponent styles={{ paddingHorizontal: 0, paddingTop: 20, backgroundColor: 'white' }}>

          {/* <Swiper style={{}} loop={false} onIndexChanged={(num)=>setIndex(num)}
          activeDotColor={colors.white}
          height={200}
          index={index}
          >
              <Image source={{uri:'https://xuongdancuong.com/public/libraries/libraryxhome-678/images/tin-tuc/am-nhac-la-gi.jpg'}}
              style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
              />
              <Image source={{uri:'https://xuongdancuong.com/public/libraries/libraryxhome-678/images/tin-tuc/am-nhac-la-gi.jpg'}}
              style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
              />
              <Image source={{uri:'https://xuongdancuong.com/public/libraries/libraryxhome-678/images/tin-tuc/am-nhac-la-gi.jpg'}}
              style={{flex:1,width:appInfo.sizes.WIDTH,height:appInfo.sizes.HEIGHT,resizeMode:'cover'}}
              />
          </Swiper> */}
          <TabBarComponent title="Danh mục" onPress={() => console.log("ok")} />
            <CategoriesList values={categories} />
          <SpaceComponent height={16}/>
          <TabBarComponent title="Các sự kiện sắp xảy ra" onPress={() => navigation.navigate('SearchEventsScreen', { title: 'Các sự kiện sắp xảy ra', categories: categories, follows: allFollower })} />
          {
            isLoading ? <LoadingComponent isLoading={isLoading} value={allEvent.length} /> : <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={allEvent}
              extraData={refreshList}
              renderItem={({ item, index }) => <EventItem followers={allFollower} item={item} key={item._id} />}
            />
          }

          <TabBarComponent title="Gần chỗ bạn" onPress={() => navigation.navigate('SearchEventsScreen', { title: 'Các sự kiện gần chỗ bạn', categories: categories, lat: auth.position.lat, long: auth.position.lng, distance: '10', follows: allFollower })} />
          {
            isLoadingNearEvent ? <LoadingComponent isLoading={isLoadingNearEvent} value={allEvent.length} /> : <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={allEventNear}
              extraData={refreshList}
              renderItem={({ item, index }) => <EventItem followers={allFollower} item={item} key={item._id} />}
            />
          }
          <View style={styles.scrollViewContent} />
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
    height: UPPER_HEADER_HEIGHT + UPPER_HEADER_PADDING_TOP + 24,
    paddingTop: UPPER_HEADER_PADDING_TOP,
  },
  header: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#AF0C6E',
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
    flex:1,
  },
  featureName: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 14,
    color: '#FFFFFF',
    marginTop: 12,
  },
  spaceForHeader: {
    height: LOWER_HEADER_HEIGHT,
  },
  scrollViewContent: {
    height: 500,
    backgroundColor: 'white',
  },
});