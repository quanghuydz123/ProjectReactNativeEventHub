import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import followerAPI from "../../apis/followerAPI"
import { EventModelNew } from "../../models/EventModelNew"
import { FollowerModel } from "../../models/FollowerModel"
import { apis } from "../../constrants/apis"
import eventAPI from "../../apis/eventAPI"
import { ContainerComponent, CricleComponent, InputComponent, RowComponent, SectionComponent, TagComponent, TextComponent } from "../../components"
import ListEventComponent from "../../components/ListEventComponent"
import LoadingComponent from "../../components/LoadingComponent"
import { SearchNormal, Sort } from "iconsax-react-native"
import { colors } from "../../constrants/color"
import {debounce} from 'lodash'
import socket from "../../utils/socket"
interface routeParams {
  items: EventModelNew[],
  follows: FollowerModel[],
  lat:string,
  long:string,
  distance:string,
  title:string,
  limit:string
  
}
const SearchEventsScreen = ({ navigation, route }: any) => {
  const { items,follows, lat, long, distance,title,limit }: routeParams = route.params || {}
  const [events, setEvents] = useState<EventModelNew[]>(items)
  const [isLoading, setIsLoading] = useState(false)
  const [allFollower, setAllFollower] = useState<FollowerModel[]>(follows)
  const [searchKey, setSeachKey] = useState('')
  const [result,setResult] = useState<EventModelNew[]>(items)
  const [isSearching,setIsSearching] = useState(false)
  const [dataRoute,setDateRoute] = useState<routeParams>(route.params || {})
  useEffect(() => {
    if (!result) {
      getEvents()
    }
    if(!allFollower){
      handleCallApiGetAllFollower()
    }
  }, [])
  // useEffect (()=>{
  //   if(route.params){
  //     setDateRoute(route.params)
  //   }
  // },[route])
  useEffect(()=>{
    // if(!searchKey){
    //   setResult(events)
    // }
    // else{
    //   const handleSeachValude = debounce(handleSearchEvent,100)
    //   handleSeachValude()
    // }
    const handleSeachValude = debounce(handleSearchEvent,500)
    handleSeachValude()

  },[searchKey])

  useEffect(() => {
    const handleFollowers = () => {
      handleCallApiGetAllFollower();
      console.log('followers cập nhật');
    };
    socket.on('followers',handleFollowers)

 
    return () => {
      socket.off('followers', handleFollowers);
    };
  }, [])
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
  const getEvents = async () => {
    console.log("abc")
    const api = apis.event.getAll({lat:lat,long:long,distance:distance})
    setIsLoading(true)
    try {
      const res = await eventAPI.HandleEvent(api)
      if (res && res.data && res.status === 200) {
        setResult(res.data.events)
      }
      setIsLoading(false)
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("ExploreEvent", errorMessage)
      setIsLoading(false)
    }
  }
  const handleSearchEvent = async ()=>{
    const api = apis.event.getAll({lat:lat,long:long,distance:distance,searchValue:searchKey})
    try {
      const res = await eventAPI.HandleEvent(api)
      if (res && res.data && res.status === 200) {
        setResult(res.data.events)
      }

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("ExploreEvent", errorMessage)

    }
  }
  return (
    <ContainerComponent back title={dataRoute.title ?? 'Danh sách sự kiện'}>
      <SectionComponent>
        <RowComponent>
          <RowComponent styles={{ flex: 1, alignItems: 'center' }}>
            <SearchNormal size={20} variant="TwoTone" color={colors.gray} />
            <View style={{ backgroundColor: colors.gray, marginLeft: 10, height: 20, width: 1 }} />
            <View style={{ flex: 1 }}>
              <InputComponent styles={{ minHeight: 'auto', marginBottom: 0, borderColor: 'white' }} onChange={(val) => setSeachKey(val)} value={searchKey} placeholder="Tìm kiếm sự kiện..." allowClear />
            </View>
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
      </SectionComponent>
      {
        (result && result?.length > 0) ? <>

          <ListEventComponent items={result} follows={allFollower} />
        </> 
        :
          <LoadingComponent isLoading={isLoading} value={result?.length} />
      }
    </ContainerComponent>
  )
}
export default SearchEventsScreen;