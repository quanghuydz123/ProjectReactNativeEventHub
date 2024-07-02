import { Button, FlatList, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addAuth, addPositionUser, authSelector, removeAuth } from "../../reduxs/reducers/authReducers"
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../constrants/color"
import { CategoriesList, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components"
import { ArrowDown, Filter, HambergerMenu, Notification, SearchNormal, Sort } from "iconsax-react-native"
import { fontFamilies } from "../../constrants/fontFamilies"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import EventItem from "../../components/EventItem"
import Geolocation from '@react-native-community/geolocation';
import axios, { all } from "axios"
import { AddressModel } from "../../models/AddressModel"
import eventAPI from "../../apis/eventAPI"
import { EventModelNew } from "../../models/EventModelNew"
import { FollowerModel } from "../../models/FollowerModel"
import followerAPI from "../../apis/followerAPI"
import socket from "../../utils/socket"
import userAPI from "../../apis/userApi"
import { HandleNotification } from "../../utils/handleNotification"
import LoadingComponent from "../../components/LoadingComponent"
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { ToastMessaging } from "../../utils/showToast"
import { apis } from "../../constrants/apis"
import { CategoryModel } from "../../models/CategoryModel"
import categoryAPI from "../../apis/categoryAPI"

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const auth = useSelector(authSelector)
  const [address, setAddress] = useState<AddressModel>()
  const { getItem } = useAsyncStorage('isRemember')
  const [allEvent, setAllEvent] = useState<EventModelNew[]>([])
  const [allEventNear, setAllEventNear] = useState<EventModelNew[]>([])
  const [allFollower, setAllFollower] = useState<FollowerModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingNearEvent, setIsLoadingNearEvent] = useState(false)
  const { getItem: getItemAuth } = useAsyncStorage('auth')
  const [refreshList, setRefreshList] = useState(false);
  const [categories,setCategories] = useState<CategoryModel[]>([])
  useEffect(() => {
    getLocationUser()
  }, [])
  useEffect(()=>{
    HandleNotification.checkNotifitionPersion(dispatch)
    messaging().onMessage(async (mess:FirebaseMessagingTypes.RemoteMessage) =>{
      console.log("mess",mess)
      ToastMessaging.Success({message:`${mess.notification?.body}`,title:`${mess.notification?.title}`,
      onPress:()=>{
        if(mess.data){
          navigation.navigate('EventDetails',{id:mess?.data.id}) 
        }
      }
      })
    })
  },[])
  useEffect(() => {
    handleCallApiGetAllEvent()
    handleCallApiGetAllFollower()
    handleGetAllCategory()
  }, [])

  useEffect(() => {
    handleCallApiGetEventsNearYou()
  }, [auth.position])
  useEffect(() => {
    setRefreshList(prev => !prev);
  }, [allFollower])
  useEffect(() => {
    socket.on('followers', data => {
      handleCallApiGetAllFollower()
      console.log('follower chạy lại')
    })

    socket.on('events', data => {
      handleCallApiGetAllEvent()
      handleCallApiGetEventsNearYou()
      console.log('events chạy lại')
    })

    socket.on('updateUser', data => {
      handleCallApiGetAllEvent()
      handleCallApiGetEventsNearYou()
      console.log('updateUser chạy lại')
    })
    return () => {
      socket.disconnect();
    };
  }, [])

  const handleGetAllCategory = async ()=>{
    const api = '/get-all'
    try {
      const res:any = await categoryAPI.HandleCategory(api)
      if(res && res.data && res.statusCode===200){
        setCategories(res.data.categories)
      }
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      if(errorMessage.statusCode === 403){
        console.log(errorMessage.message)
      }else{
        console.log('Lỗi rồi')
      }
    }
  }
  const getLocationUser = async () => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        // reverseGeoCode(position.coords.latitude,position.coords.longitude)
        if(auth.position){
          if(position?.coords?.latitude !== auth?.position?.lat && position?.coords?.longitude !== auth?.position?.lng)
            {
              handleCallApiUpdatePostionUser(position?.coords?.latitude, position?.coords?.longitude)
            }
        }else{
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
      const res: any = await followerAPI.HandleFollwer(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setAllFollower(res.data.followers)
      }

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("HomeScreen", errorMessage)

    }
  }

  const handleCallApiGetAllEvent = async () => {
    const api = `/get-events?limit=${10}&limitDate=${new Date().toISOString()}`
    setIsLoading(true)
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

  const handleCallApiGetEventsNearYou = async () => {
    // console.log("auth.position",auth.position)
    if (auth.position) {
      setIsLoadingNearEvent(true)
      // const api = `/get-events?lat=${auth.position.lat}&long=${auth.position.lng}&distance=${10}&limit=${10}&limitDate=${new Date().toISOString()}`
      const api = apis.event.getAll({lat:auth.position.lat,long:auth.position.lng,distance:'10',limit:'10',limitDate:`${new Date().toISOString()}`})
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
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      <View style={{
        height: Platform.OS === 'android' ? 168 : 182,
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52,
        zIndex: 1,
      }}>
        <View style={{
          paddingHorizontal: 16
        }}>

          <RowComponent onPress={() => console.log("'ok ")}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} >
              <HambergerMenu size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={[{ flex: 1, alignItems: 'center' }]}>
              <RowComponent>
                {
                  address ?
                    <TextComponent text="Chỉnh sửa địa chỉ" color={colors.white2} size={12} />
                    :
                    <TextComponent text="Lấy địa chỉ hiện tại" color={colors.white2} size={12} />
                }
                <MaterialIcons name="arrow-drop-down" size={18} color={colors.white2} />
              </RowComponent>
              {
                address &&
                <TextComponent text={`${address.address?.district}, ${address.address?.city}, ${address.address?.county}`} numberOfLine={1}
                  size={13} color={colors.white2} font={fontFamilies.medium} />
              }
            </View>
            <CricleComponent color={'#524CE0'} size={36}>
              <View>
                <Notification size={18} color={colors.white} />
                <View style={{
                  backgroundColor: '#02E9FE',
                  width: 6,
                  height: 6,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#02E9FE',
                  position: 'absolute',
                  top: 0,
                  right: 3
                }} />
              </View>
            </CricleComponent>
          </RowComponent>
          <SpaceComponent height={20} />

          <RowComponent>
            <RowComponent styles={{ flex: 1 }}
              onPress={() => navigation.navigate('SearchEventsScreen', {
                isFilter: false
              })}>
              <SearchNormal size={20} variant="TwoTone" color={colors.white} />
              <View style={{ backgroundColor: colors.gray2, marginHorizontal: 10, height: 20, width: 1 }} />
              <TextComponent text="Tìm kiếm sự kiện..." flex={1} color={colors.gray2} size={18} />
            </RowComponent>
            <TagComponent
              onPress={() => navigation.navigate('SearchEventsScreen', {
                isFilter: true
              })}
              label="Lọc"
              icon={<CricleComponent size={20} color={'#b1aefa'}><Sort size={18} color="#5d56f3" /></CricleComponent>}
              bgColor="#5d56f3"
            />
          </RowComponent>
        </View>
        <SpaceComponent height={20} />
        <View style={{ marginTop: 10, }}>
          <CategoriesList isFill values={categories} />
        </View>
      </View>
      <ScrollView style={[{
        flex: 1,
        backgroundColor: colors.white,
        marginTop: Platform.OS === 'android' ? 18 : 22
      }]}>
        <SectionComponent styles={{ paddingHorizontal: 0, paddingTop: 20 }}>
          <TabBarComponent title="Các sự kiện sắp xảy ra" onPress={() => navigation.navigate('SearchEventsScreen',{title:'Các sự kiện sắp xảy ra',items:allEvent})} />
          {
            isLoading ? <LoadingComponent isLoading={isLoading} value={allEvent.length} /> : <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={allEvent}
            extraData={refreshList}
            renderItem={({ item, index }) => <EventItem followers={allFollower} item={item} key={item._id} />}
          />
          }

          <TabBarComponent title="Gần chỗ bạn" onPress={() =>  navigation.navigate('SearchEventsScreen',{title:'Các sự kiện gần chỗ bạn',items:allEventNear,lat:auth.position.lat,long:auth.position.lng,distance:'10'})} />
          {
            isLoadingNearEvent ? <LoadingComponent isLoading={isLoadingNearEvent} value={allEvent.length} /> : <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={allEventNear}
            extraData={refreshList}
            renderItem={({ item, index }) => <EventItem followers={allFollower} item={item} key={item._id} />}
          />
          }
        </SectionComponent>


      </ScrollView>
    </View>
  )
}
export default HomeScreen;