import { Button, FlatList, Image, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addAuth, addPositionUser, authSelector, removeAuth } from "../../reduxs/reducers/authReducers"
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../constrants/color"
import { CategoriesList, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components"
import { ArrowDown, Filter, HambergerMenu, Notification, SearchNormal, Sort } from "iconsax-react-native"
import { fontFamilies } from "../../constrants/fontFamilies"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import EventItem from "../../components/EventItem"
import Geolocation from '@react-native-community/geolocation';
import axios, { all } from "axios"
import { AddressModel } from "../../models/AddressModel"
import eventAPI from "../../apis/eventAPI"
import { EventModelNew } from "../../models/EventModelNew"
import { FollowModel } from "../../models/FollowModel"
import followAPI from "../../apis/followAPI"
import socket from "../../utils/socket"
import userAPI from "../../apis/userApi"
import { HandleNotification } from "../../utils/handleNotification"
import LoadingComponent from "../../components/LoadingComponent"
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { ToastMessaging } from "../../utils/showToast"
import { apis } from "../../constrants/apis"
import { CategoryModel } from "../../models/CategoryModel"
import categoryAPI from "../../apis/categoryAPI"
import { handleLinking } from "../../utils/handleLinking"
import notificationAPI from "../../apis/notificationAPI"
import { NotificationModel } from "../../models/NotificationModel"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CardComponent from "../../components/CardComponent"
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const MapScreen = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const auth = useSelector(authSelector)
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
  const [isShowMoney,setIsShowMoney] = useState(true)
  useEffect(() => {
    getLocationUser()
  }, [])
  useEffect(() => {
    HandleNotification.checkNotifitionPersion(dispatch)
    messaging().onMessage(async (mess: FirebaseMessagingTypes.RemoteMessage) => {
      console.log("mess", mess)
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
    handleCallApiGetAllEvent(true)
    handleCallApiGetAllFollower()
    handleGetAllCategory()
    handleCallAPIGetNotifications()
  }, [])

  // useEffect(()=>{
  //   if(notifications){
  //     console.log("HomeNotification")
  //     handleCheckViewedNotifications()
  //   }
  // },[notifications])

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
  return (
    <ContainerComponent>
      <SectionComponent>
        <TextComponent text={'abc'}/>
      </SectionComponent>
    </ContainerComponent>
  )
}
export default MapScreen;