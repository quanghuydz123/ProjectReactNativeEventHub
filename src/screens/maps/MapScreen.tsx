import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CategoriesList, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components"
import { Animated, BackHandler, FlatList, Image, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { point, featureCollection } from '@turf/helpers'
import { size } from "lodash";
import Feather from 'react-native-vector-icons/Feather'
import { colors } from "../../constrants/color";
import SearchComponent from "../../components/SearchComponent";
import { appInfo } from "../../constrants/appInfo";
import { globalStyles } from "../../styles/globalStyles";
import { fontFamilies } from "../../constrants/fontFamilies";
import MapGoogle from '../../assets/svgs/map-google.svg'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { authSelector, AuthState } from "../../reduxs/reducers/authReducers";
import { useSelector } from "react-redux";
import EventItemHorizontal from "../../components/EventItemHorizontal";
import axios from "axios";
import { GeoCodeModel } from "../../models/GeoCodeModel";
import calculateDistance from "../../utils/calculateDistance";
import { EventModelNew, Position } from "../../models/EventModelNew";
import LocationPin from '../../assets/svgs/location-pin.svg'
import { Modalize } from "react-native-modalize";
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import EventItem from "../../components/EventItem";
import { apis } from "../../constrants/apis";
import eventAPI from "../../apis/eventAPI";
import { CategoryModel } from "../../models/CategoryModel";
import categoryAPI from "../../apis/categoryAPI";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AvatarGroup from "../../components/AvatarGroup";
import { DateTime } from "../../utils/DateTime";
import LoadingUI from "../../components/LoadingUI";
import RenderHTML from "react-native-render-html";
import { renderPrice } from "../../utils/convertMoney";
import LinearGradient from "react-native-linear-gradient";
MapboxGL.setAccessToken(`${process.env.API_KEY_MAP}}`);
interface DataSearchAddress {
  title: string,
  position: {
    lat: number,
    lng: number,
  },
  distance: number
}
//https://chatgpt.com/c/67a7cc2f-0964-800c-9da8-eaaa0e860001
const MapScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('')
  const [isVisibleModal, setIsVisibleModel] = useState(false)
  // const [categories, setCategories] = useState<CategoryModel[]>([])
  const cameraRef: any = useRef(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [isShowing, setIsShowing] = useState(false)
  const auth: AuthState = useSelector(authSelector)
  const [dataSearchAddress, setdataSearchAddress] = useState<DataSearchAddress[]>([])
  const [typeData, setTypeData] = useState<'search' | 'history'>('history')
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [isLoadingGetEvents, setIsLoadingGetEvents] = useState(false)
  const [isLoadingGetDes, setIsLoadingGetDes] = useState(false)
  const snapPoints = useMemo(() => ['90%', "20%"], []);
  const [width, setWidth] = useState(0)
  const snapPointsChose = useMemo(() => ['90%', '40%', "20%"], []);
  const [tabSelected, setTabSelected] = useState('about')
  const [isShowDes, setIsShowDes] = useState(false)
  const tabs = [{
    key: 'about',
    title: 'Tổng quan',
    content: ''
  }
  // , {
  //   key: 'events',
  //   title: `Bình luận`,
  //   content: ''
  // }
  ]
  const [recentEvents, setRecentEvents] = useState<EventModelNew[]>([])
  // const [events, setEvents] = useState<EventModelNew[]>([])
  const [index, setIndex] = useState(0)
  const [eventChose,setEventChose] = useState<EventModelNew>()
  const [desEvent,setDesEvent] = useState('')
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const [addressChose, setAddressChose] = useState<DataSearchAddress>({
    distance: 0,
    position: {
      lat: 0,
      lng: 0
    },
    title: ''
  })
  const bottomSheetRef = useRef<BottomSheet>(null)
  const bottomSheetRefChose = useRef<BottomSheet>(null)

  // useEffect(() => {
  //   // handleCallAPIGetCategories()
  //   // handleCallAPIGetEvents()
  // }, [])
  useEffect(() => {
    if (addressChose.position.lat !== 0 && addressChose.position.lng !== 0) {
      handleCallAPIGetEventsRecent()
    }
  }, [addressChose])

  useEffect(() => {
    const getLocation = async () => {
      const location: any = await MapboxGL.locationManager.getLastKnownLocation();
      if (location) {
        setUserLocation([location.coords.longitude, location.coords.latitude]);
        setAddressChose({
          title: 'Địa điểm của bạn',
          position: {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          },
          distance: 1
        })
      }
    };
    getLocation();
  }, [cameraRef]);

  useEffect(() => {
    Animated.spring(tabOffsetValue, {
      toValue: width * (tabSelected === 'about' ? 0 : 1),
      useNativeDriver: true,
      speed: 100
    }).start();
  }, [tabSelected])

  const handleCallAPIGetDescriptionEvents = async (id:string)=>{
      setIsLoadingGetDes(true)
        const api = apis.event.getDescriptionEvent({idEvent:id})
      try {
        const res: any = await eventAPI.HandleEvent(api)
        if (res && res.data && res.status === 200) {
          setDesEvent(res.data)
        }
        setIsLoadingGetDes(false)

      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log('Lỗi rồi MapSceen', errorMessage)
        setIsLoadingGetDes(false)

      }
  }
  // const handleCallAPIGetEvents = async () => {
  //   setIsLoadingGetEvents(true)
  //   const api = apis.event.getAll({})
  //   try {
  //     const res: any = await eventAPI.HandleEvent(api)
  //     if (res && res.data && res.status === 200) {
  //       setEvents(res.data)
  //     }
  //     bottomSheetRef?.current?.expand()
  //   } catch (error: any) {
  //     const errorMessage = JSON.parse(error.message)
  //     console.log('Lỗi rồi MapSceen', errorMessage)
  //     setIsLoadingGetEvents(false)

  //   }
  // }

  // const handleCallAPIGetCategories = async () => {
  //   setIsLoadingGetEvents(true)
  //   const api = apis.category.getAll()
  //   try {
  //     const res: any = await categoryAPI.HandleCategory(api)
  //     if (res && res.data && res.status === 200) {
  //       setCategories(res.data)
  //     }
  //     bottomSheetRef?.current?.expand()
  //   } catch (error: any) {
  //     const errorMessage = JSON.parse(error.message)
  //     console.log('Lỗi rồi MapSceen', errorMessage)
  //     setIsLoadingGetEvents(false)

  //   }
  // }

  const handleCallAPIGetEventsRecent = async () => {
    setIsLoadingGetEvents(true)
    const api = apis.event.getAll({ lat: addressChose.position.lat.toString(), long: addressChose.position.lng.toString(), distance: '10' })
    try {
      const res: any = await eventAPI.HandleEvent(api)
      if (res && res.data && res.status === 200) {
        setRecentEvents(res.data)
      }
      bottomSheetRef?.current?.expand()
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log('Lỗi rồi MapSceen', errorMessage)
      setIsLoadingGetEvents(false)

    }
  }
  // const openSheet = () => {
  //   if (isShowing) {
  //     bottomSheetRef.current?.close();
  //   } else {
  //     bottomSheetRef?.current?.expand()
  //   }
  // }
  const moveToCurrentLocation = () => {
    if (userLocation && cameraRef.current) {
      moveToCurrentLocationByPosition(userLocation)
      setAddressChose({
        title: 'Địa điểm của bạn',
        position: {
          lat: userLocation[1],
          lng: userLocation[0]
        },
        distance: 1
      })
    }
  };
  const moveToCurrentLocationByPosition = (positon: [lng: number, lat: number]) => {
    cameraRef.current.setCamera({
      centerCoordinate: positon,
      zoomLevel: 16,
      animationDuration: 1000,
    });
  }
  const handleCallAPISearchAddress = async () => {
    if (search != '') {
      setTypeData('search')
      setIsLoadingSearch(true)
      const api = `https://geocode.search.hereapi.com/v1/geocode?q=${search}&limit=20&lang=vi-VI&in=countryCode:VNM&apiKey=${process.env.API_KEY_REVGEOCODE}`
      try {
        const res = await axios(api)
        if (res && res.data.items.length > 0 && res.status === 200) {
          const data: GeoCodeModel[] = res.data.items
          setdataSearchAddress(data.map((item) => {
            return {
              title: item.title,
              position: item.position,
              distance: calculateDistance({ userPosition: { lng: userLocation[0], lat: userLocation[1] }, addressPosition: item.position })
            }
          }))
          setIsLoadingSearch(false)

        }

      } catch (error) {
        setIsLoadingSearch(false)

      }
    }
  }
  const handleSheetChanges = useCallback((index: number) => {
    setIndex(index)
    setIsShowing(index < 1 ? false : true);
  }, []);
  const eventPoints: any = recentEvents.map(event => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [event.position.lng, event.position.lat]
    },
    properties: {
      _id: event._id,
      photoUrl: event.photoUrl,
      title:event.title,
      position:event.position,
      category:event.category,
      showTimes:event.showTimes,
      usersInterested:event.usersInterested
    }
  }));
  const eventImages = recentEvents.reduce((acc, event) => {
    acc[event.photoUrl] = event.photoUrl;
    return acc;
  }, {} as Record<string, string>);
  const onEventPress = (e: any) => {
    setEventChose(e.features[0].properties)
    handleCallAPIGetDescriptionEvents(e.features[0].properties._id)
    setTabSelected('about')
    setIsShowDes(false)
    bottomSheetRef?.current?.snapToIndex(0)
    bottomSheetRefChose?.current?.expand()
    // const feature = e.features[0]; 
    // if (feature) {
    //   const eventId = feature.properties._id; 
    //   navigation.push('EventDetails', {  id: eventId })
    // }
  };
  
  return (
    <>
      <ContainerComponent title={'Bảng đồ'} isHiddenSpaceTop>
        <SectionComponent styles={{ flex: 1, paddingHorizontal: 0, paddingBottom: 0 }}>
          <MapboxGL.MapView
            styleURL={'mapbox://styles/mapbox/streets-v12'}
            style={{ flex: 1 }}
            projection="globe"
            zoomEnabled={true}
            logoEnabled={false}
            scaleBarEnabled={false}
          >
            <MapboxGL.Camera
              ref={cameraRef}
              followUserLocation={false}
              followZoomLevel={16}
              centerCoordinate={userLocation}
              zoomLevel={16}

              animationMode={'flyTo'}
              animationDuration={4000}
            />

            <MapboxGL.LocationPuck puckBearing="heading" pulsing={{ isEnabled: true }} />
            <MapboxGL.Images images={eventImages} />

            <MapboxGL.Images images={{
              locationPin: 'https://uxwing.com/wp-content/themes/uxwing/download/location-travel-map/map-pin-icon.png',

            }} />


            <MapboxGL.ShapeSource
              id='eventSource'
              onPress={onEventPress}
              shape={{
                type: 'FeatureCollection',
                features: eventPoints
              }}
            >
              <MapboxGL.SymbolLayer
                id="eventIcons"
                style={{
                  iconImage: ['get', 'photoUrl'],
                  iconSize: [
                    'interpolate', ['linear'], ['zoom'],
                    6, 0, // Ẩn icon khi zoom nhỏ hơn 6
                    8, 0.04 // Zoom đến 8 thì icon có kích thước bình thường
                  ],
                  iconAllowOverlap: true
                }}
              />
            </MapboxGL.ShapeSource>
            {addressChose.position.lat !== 0 && addressChose.position.lng !== 0 && addressChose.title !== 'Địa điểm của bạn' && <MapboxGL.ShapeSource
              onPress={() => bottomSheetRef?.current?.expand()}
              id='ShapeSourcePin'
              shape={featureCollection(
                [
                  point([addressChose.position.lng, addressChose.position.lat], { icon: 'locationPin' })
                ])}>
              <MapboxGL.SymbolLayer
                id="iconPin"

                style={{
                  iconImage: 'locationPin',
                  iconSize: 0.06,
                  iconAllowOverlap: true,

                }}
              >



              </MapboxGL.SymbolLayer>

            </MapboxGL.ShapeSource>}
          </MapboxGL.MapView>
          <View style={{ position: 'absolute', width: '100%' }}>
            <SpaceComponent height={12} />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <RowComponent onPress={() => setIsVisibleModel(true)} styles={[globalStyles.shadow, { backgroundColor: colors.white, padding: 10, borderRadius: 100, width: '95%', borderWidth: 1, borderColor: colors.gray2 }]}>
                <MapGoogle />
                <SpaceComponent width={6} />
                <TextComponent text={'Tìm kiếm ở đây'} size={16} color={colors.gray4} />
              </RowComponent>
            </View>
            {/* <SpaceComponent height={8} />
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              renderItem={({ item }) => <>
                <TagComponent
                  bgColor={colors.white}
                  label={item.name}
                  onPress={() => console.log("ok")}
                  textColor={colors.gray}
                  textSize={12}

                  styles={[globalStyles.shadow, {
                    minWidth: 100,
                    paddingVertical: 6,
                    paddingHorizontal: 6,
                  }]}
                />
                <SpaceComponent width={8} />
              </>}
            /> */}
          </View>
          <View style={{ position: 'absolute', bottom: appInfo.sizes.HEIGHT * 0.02, right: 8 }}>
            <CricleComponent onPress={() => moveToCurrentLocation()} size={50} color={colors.white} >
              <Feather name="minimize" size={24} color={colors.blue} />

            </CricleComponent>
          </View>
        </SectionComponent>
        <Modal
          visible={isVisibleModal}
          style={{}}
          animationType="fade"


        >
          <SpaceComponent height={12} />
          <SectionComponent styles={{ paddingHorizontal: 0 }}>
            <SearchComponent minHeight={50}
              styles={{ padding: 12 }}

              titlePlaceholder="Tìm kiếm ở đây"
              onPressArrow={() => setIsVisibleModel(false)}
              onSearch={(val) => {
                if (val === '') {
                  setdataSearchAddress([])
                  setTypeData('history')
                }
                setSearch(val)
              }}
              value={search}
              //  onEnd={()=>handleCallAPISearchAddress()}
              onEnd={() => {
                setIsLoadingSearch(true)
                setTypeData('search')
                setdataSearchAddress([{ "distance": 1.6405785653233234, "position": { "lat": 10.8457, "lng": 106.77894 }, "title": "Đường Võ Văn Ngân, Phường Hiệp Phú, Thủ Đức, Hồ Chí Minh, Việt Nam" }, { "distance": 0.8321360106912561, "position": { "lat": 10.85006, "lng": 106.76307 }, "title": "Võ Văn Ngân, Phường Bình Thọ, Thủ Đức, Hồ Chí Minh, Việt Nam" }, { "distance": 0.6629387212664227, "position": { "lat": 10.85052, "lng": 106.76513 }, "title": "Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, Hồ Chí Minh, Việt Nam" }, { "distance": 107.17748163115085, "position": { "lat": 10.88715, "lng": 105.78701 }, "title": "Đường Võ Văn Ngân, Thị Trấn Vĩnh Hưng, Huyện Vĩnh Hưng, Long An, Việt Nam" }, { "distance": 1.3050443119887554, "position": { "lat": 10.85126, "lng": 106.75695 }, "title": "Đường Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, Hồ Chí Minh, Việt Nam" }, { "distance": 593.4752769428212, "position": { "lat": 16.00304, "lng": 108.21962 }, "title": "Đường Võ Văn Ngân, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam" }, { "distance": 96.45144585647647, "position": { "lat": 11.18639, "lng": 107.58498 }, "title": "Đường Võ Văn Ngân, Thị Trấn Võ Xu, Huyện Đức Linh, Bình Thuận, Việt Nam" }])
                setIsLoadingSearch(false)
              }}
            />
          </SectionComponent>
          <SectionComponent>
            <RowComponent justify="space-between">
              <TextComponent size={16} font={fontFamilies.medium} text={typeData === 'history' ? 'Gần đây' : 'Kết quả tìm kiếm'} />
              <AntDesign size={18} name={'exclamationcircleo'} />
            </RowComponent>
            <SpaceComponent height={12} />
            <View>
              {!isLoadingSearch ? <FlatList
                data={dataSearchAddress}
                showsVerticalScrollIndicator={false}

                ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: appInfo.sizes.HEIGHT * 0.8 }}><TextComponent text={'Không có dữ liệu !'} /></View>}
                renderItem={({ item }) => {
                  return (
                    <>
                      <RowComponent onPress={() => {
                        bottomSheetRef.current?.close();
                        setAddressChose(item)
                        setIsVisibleModel(false)
                        moveToCurrentLocationByPosition([item.position.lng, item.position.lat])
                      }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <CricleComponent color={colors.gray7} size={34}>
                            {typeData === 'history' ? <AntDesign name="clockcircleo" size={20} /> : <Entypo name="location-pin" size={22} />}
                          </CricleComponent>
                          {typeData === 'search' && <TextComponent text={`${item?.distance.toFixed(1) ?? ''} km`} size={12} />}
                        </View>
                        <SpaceComponent width={16} />
                        <View style={{ flex: 1, paddingVertical: 22, borderBottomWidth: 1, borderBottomColor: colors.gray7 }}>
                          {
                            <TextComponent size={15} text={item?.title ?? ''} />
                          }
                        </View>
                      </RowComponent>
                    </>
                  )
                }}
              /> : <LoadingUI />}
            </View>
          </SectionComponent>
        </Modal>
        <BottomSheet
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          index={-1}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          containerStyle={{ zIndex: 100, marginTop: appInfo.sizes.HEIGHT * 0.3 }}

        >
          <BottomSheetView>
            <SectionComponent>
              <RowComponent styles={{ alignItems: 'flex-start' }} >
                <TextComponent flex={0.96} text={addressChose?.title ?? ''} numberOfLine={2} size={24} />
                <CricleComponent onPress={() => bottomSheetRef.current?.close()} color={colors.gray7} size={30}>
                  <AntDesign name="close" size={16} />
                </CricleComponent>
              </RowComponent>
            </SectionComponent>
          </BottomSheetView>
          <SectionComponent>
            <RowComponent justify="space-between">
              <TextComponent size={16} text={'Các sự kiện gần khu vực'} />
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchEventsScreen', {
                  long: addressChose.position.lng.toString(),
                  lat: addressChose.position.lat.toString(),
                  distance: '10',
                  title: 'Các sự kiện gần khu vực'
                })}>
                <TextComponent color={colors.primary} text={'Xem tất cả'} font={fontFamilies.medium} />
              </TouchableOpacity>
            </RowComponent>
            <SpaceComponent height={4} />
            <BottomSheetFlatList
              data={recentEvents}
              ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: appInfo.sizes.HEIGHT * 0.2 }}>
                <TextComponent text={'Không có sự kiện nào !'} />
              </View>}
              contentContainerStyle={{
                paddingBottom: 90
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <EventItemHorizontal onPress={() => moveToCurrentLocationByPosition([item.position.lng, item.position.lat])} item={item} key={item?._id} />
                  </>
                )
              }}

            />
          </SectionComponent>
        </BottomSheet>

        <BottomSheet
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          index={-1}
          ref={bottomSheetRefChose}
          snapPoints={snapPointsChose}
          containerStyle={{ zIndex: 100, marginTop: appInfo.sizes.HEIGHT * 0.3 }}

        >
          <BottomSheetView>
            <SectionComponent>
              <RowComponent styles={{ alignItems: 'flex-start' }} >
                <TextComponent flex={0.96} text={eventChose?.title ?? ''} numberOfLine={2} size={20} />
                <CricleComponent onPress={() => bottomSheetRefChose.current?.close()} color={colors.gray7} size={30}>
                  <AntDesign name="close" size={16} />
                </CricleComponent>
              </RowComponent>
              <TextComponent text={`Cách vị trí bạn ${userLocation && calculateDistance({userPosition: { lng: userLocation[0] || 0, lat: userLocation[1] || 0 },addressPosition:eventChose?.position ?? {lat:0, lng:0}}).toFixed(2) } km`}/>
            </SectionComponent>
          </BottomSheetView>
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <SectionComponent>
              <RowComponent>
                <TagComponent
                  bgColor={'#0a7b89'}
                  label={'Chi tiết'}
                  onPress={() => { navigation.push('EventDetails', {  id: eventChose?._id }) }}
                  textColor={colors.white}
                  textSize={13}
                  icon={<AntDesign name="infocirlceo" size={16} color={colors.white} />}
                  styles={[{
                    minWidth: 100,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                  }]}
                />
                <SpaceComponent width={12} />
                <TagComponent
                  bgColor={'#d3f5ff'}
                  label={'Đường đi'}
                  onPress={() => console.log("ok")}
                  textColor={'#00505c'}
                  textSize={13}
                  icon={<FontAwesome5 name="directions" size={16} color={'#00505c'} />}
                  styles={[{
                    minWidth: 100,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                  }]}
                />
              </RowComponent>
              <SpaceComponent height={12} />
              <Image
                resizeMode="stretch"
                source={{ uri: eventChose?.photoUrl }}
                style={{
                  width: '100%',
                  height: appInfo.sizes.HEIGHT * 0.25,
                  borderRadius: 12
                }}
              />
              <SpaceComponent height={12}/>
              <View style={{ height: '100%', flex: 1 }}>

                <RowComponent>
                  {
                    tabs.map((tab) => (
                      <TouchableOpacity key={tab.key}
                        style={[
                          globalStyles.center, {
                            flex: 1,
                            paddingBottom: 4,
                        
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
                      width: '100%',
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
                      <>
                          {eventChose && <TextComponent text={`${renderPrice(eventChose?.showTimes[0])}`} title size={20} color={`${colors.primary}`} />}
                          <RowComponent styles={{ flexWrap: 'wrap' }}>
                          {
                            
                            <View style={{ paddingVertical: 2 }} key={'12d'}>
                              <TagComponent
                                bgColor={colors.primary}
                                label={eventChose?.category?.name ?? ''}
                                textSize={12}
                                styles={{
                                  minWidth: 100,
                                  paddingVertical: 6,
                                  paddingHorizontal: 10,
                                }}
                              />
                            </View>
                          }
                        </RowComponent>
                        {
                          (eventChose?.usersInterested && eventChose?.usersInterested.length > 0) && <AvatarGroup users={eventChose?.usersInterested} size={30}/>
                        }
                        <RowComponent>
                          <Feather name="calendar" size={16} color={colors.colorText} />
                          <SpaceComponent width={4} />
                          <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(eventChose?.showTimes[0]?.startDate ?? Date.now()).getDay())} - ${DateTime.GetDateNew1(eventChose?.showTimes[0]?.startDate ?? new Date(),eventChose?.showTimes[0]?.endDate || new Date())} `} color={colors.colorText} size={16} />
                        </RowComponent>
                        <SpaceComponent height={12}/>
                        <View style={{ maxHeight: isShowDes ? 5000 : 480, overflow: 'hidden' }}>
                            {/* <TextComponent text={event?.description ?? ''} /> */}
                            {!isLoadingGetDes ? <RenderHTML
                              contentWidth={appInfo.sizes.WIDTH - 20}

                              source={{ html: desEvent }}
                              // tagsStyles={{
                              //   h2: { textAlign: 'center', fontWeight: 'bold', fontSize: 24 },
                              //   p: { textAlign: 'center', fontSize: 16, lineHeight: 24 },
                              //   li: { fontSize: 16, lineHeight: 22 },
                              // }}

                              tagsStyles={{
                                img: {
                                  objectFit: 'fill',
                                },
                                ul: {

                                },
                                li: {
                                  color: colors.black,
                                },
                                p: {
                                  margin: 0,
                                },
                                h1: {
                                  fontSize: 20
                                },
                                h2: {
                                  fontSize: 18
                                },
                                h3: {
                                  fontSize: 16
                                },
                                h4: {
                                  fontSize: 14
                                },
                                h5: {
                                  fontSize: 12
                                }
                              }}
                              computeEmbeddedMaxWidth={() => appInfo.sizes.WIDTH - 90}

                            /> : <LoadingUI />}
                             <View style={{ position: 'absolute', bottom: 0, width: '100%', left: 10 }}>
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
                            
                                            }}
                                          >
                                            <AntDesign name={isShowDes ? 'caretup' : 'caretdown'} size={10} color={colors.gray4} />
                                          </TouchableOpacity>
                                        </View>
                          </View>
                      </>
                      :
                      <>
                      </>
                    }
                  </View>
              </View>

            </SectionComponent>
          </BottomSheetScrollView>
        </BottomSheet>
      </ContainerComponent>

    </>
  )
}

export default MapScreen;