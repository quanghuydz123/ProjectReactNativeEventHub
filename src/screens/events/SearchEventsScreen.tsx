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
import {debounce, lte} from 'lodash'
import socket from "../../utils/socket"
import ModalFilterEvent from "../../../modals/ModalFilterEvent"
import { CategoryModel } from "../../models/CategoryModel"
import categoryAPI from "../../apis/categoryAPI"
import axios from "axios"
interface routeParams {
  items: EventModelNew[],
  follows: FollowerModel[],
  lat:string,
  long:string,
  distance:string,
  title:string,
  limit:string,
  categories:CategoryModel[],
  categoriesSelected:string[]
}
interface FilterEvent {
  distance?:string,
  limit?:string,
  categoriesFilter?:string[],
  searchKey?:string,
  position:{
    lat?:string,
    lng?:string
  },
}
const initFilterEvent:FilterEvent = {
  limit:'',
  categoriesFilter:[],
  distance:'',
  searchKey:'',
  position:{
    lat:'',
    lng:''
  },
}
const SearchEventsScreen = ({ navigation, route }: any) => {
  const { items,follows,categories, lat, long, distance,title,limit,categoriesSelected }: routeParams = route.params || {}
  const [events, setEvents] = useState<EventModelNew[]>(items)
  const [isLoading, setIsLoading] = useState(false)
  const [allFollower, setAllFollower] = useState<FollowerModel[]>(follows)
  const [result,setResult] = useState<EventModelNew[]>(items)
  const [dataRoute,setDateRoute] = useState<routeParams>(route.params || {})
  const [isOpenModelizeFilter,setIsOpenModalizeFilter] = useState(false)
  const [allCategory, setAllCategory] = useState<CategoryModel[]>(categories)
  const [first,setFirst] = useState(false)
  const [idsSelectedCategories, setIdsSelectedCategories] = useState<string[]>([])
  const [addressFilter,setAddressFilter] = useState('')

  const [dateTime,setDateTime] = useState<{
    startAt:string,
    endAt:string
}>({
  startAt:'',
  endAt:''
})
  const [filterEvent,setFilterEvent] = useState<FilterEvent>(initFilterEvent)
  useEffect(() => {
    handleSetFilterEvent()
    if(!allFollower){
      handleCallApiGetAllFollower()
    }
    if(!allCategory){
      handleGetAllCategory()
    }
  }, [])

  // console.log("abcaasdadasasdsa",filterEvent.searchKey)
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
    if(first){
      const handleSeachValude = debounce(handleSearchEvent,500)
      handleSeachValude()
    }else{
      setFirst(true)
    }

  },[filterEvent.searchKey])
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
  useEffect(()=>{
    if(first){
      // if (!result) {
      //   getEvents()
      // }
      getEvents()
    }else{
      setFirst(true)
    }
  },[filterEvent])
  

  const handleSetFilterEvent = async ()=>{
    const filterCopy:FilterEvent = {...filterEvent}
    filterCopy['position']['lat'] = lat
    filterCopy['position']['lng'] = long
    filterCopy['distance'] = distance
    filterCopy['categoriesFilter'] = categoriesSelected
    setFilterEvent(filterCopy)
  }
  const handleOnchangePosition = (key:string,value:any) =>{
    const filterCopy:any = {...filterEvent}
    Object.keys(filterEvent.position).forEach((keyChild)=> {
      filterCopy[`${key}`][`${keyChild}`] = value[`${keyChild}`]
    })
    setFilterEvent(filterCopy)
  }
  const handleOnChangeValudeFilter = async (key:string,value:string | string[],keyPosition?:string,position?:any) =>{
    const filterCopy:any = {...filterEvent}
    filterCopy[`${key}`] = value
    if(position){
      Object.keys(filterEvent.position).forEach((keyChild)=> {
        filterCopy[`${keyPosition}`][`${keyChild}`] = position[`${keyChild}`]
      })
    }
    setFilterEvent(filterCopy)
  }
  const handleGetAllCategory = async () => {
    const api = '/get-all'
    try {
      const res: any = await categoryAPI.HandleCategory(api)
      if (res && res.data && res.statusCode === 200) {
        setAllCategory(res.data.categories)
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
      const res: any = await followerAPI.HandleFollwer(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setAllFollower(res.data.followers)
      }

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("HomeScreen", errorMessage)

    }
  }
  // useEffect(()=>{//call api get lat and long
  //   const api = `https://geocode.search.hereapi.com/v1/geocode?q=${addressFilter}&limit=20&lang=vi-VI&in=countryCode:VNM&apiKey=${process.env.API_KEY_REVGEOCODE}`
  //   handleCallApiGetLatAndLong(api)
  // },[addressFilter])
  const handleCallApiGetLatAndLong = async ()=>{
    const api = `https://geocode.search.hereapi.com/v1/geocode?q=${addressFilter}&limit=20&lang=vi-VI&in=countryCode:VNM&apiKey=${process.env.API_KEY_REVGEOCODE}`
    try {
      const res = await axios(api)
      if(res && res.data && res.status === 200){
          return res.data.items[0].position
      }else{
        console.log("vị trí chọn không hợp lệ")
      }
    } catch (error:any) {
      console.log(error)
    }
  }
  const getEvents = async () => {
    const api = apis.event.getAll({lat:filterEvent.position.lat,
      long:filterEvent.position.lng,distance:'10',categoriesFilter:filterEvent.categoriesFilter,
      startAt:dateTime.startAt,endAt:dateTime.endAt
      })
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
    const api = apis.event.getAll({lat:filterEvent.position.lat,
      long:filterEvent.position.lng,distance:'10',
      searchValue:filterEvent.searchKey,categoriesFilter:filterEvent.categoriesFilter,
      startAt:dateTime.startAt,endAt:dateTime.endAt
    })
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
  const handleCofirmFilterEvent = async ()=>{
    setIsOpenModalizeFilter(false)
    let position
    if(addressFilter){
      position = await handleCallApiGetLatAndLong()
    }
    await handleOnChangeValudeFilter('categoriesFilter',idsSelectedCategories,'position',position)

  }
  return (
    <ContainerComponent back title={dataRoute.title ?? 'Danh sách sự kiện'}>
      <SectionComponent>
        <RowComponent>
          <RowComponent styles={{ flex: 1, alignItems: 'center' }}>
            <SearchNormal size={20} variant="TwoTone" color={colors.gray} />
            <View style={{ backgroundColor: colors.gray, marginLeft: 10, height: 20, width: 1 }} />
            <View style={{ flex: 1 }}>
              <InputComponent styles={{ minHeight: 'auto', marginBottom: 0, borderColor: 'white' }} onChange={(val) => handleOnChangeValudeFilter('searchKey',val)} value={filterEvent.searchKey ?? ''} placeholder="Tìm kiếm sự kiện..." allowClear />
            </View>
          </RowComponent>
          <TagComponent
            onPress={() => {setIsOpenModalizeFilter(true),setIdsSelectedCategories(filterEvent.categoriesFilter ?? [])}}
            
            label="Lọc"
            icon={<CricleComponent size={20} color={'#b1aefa'}><Sort size={18} color="#5d56f3" /></CricleComponent>}
            bgColor="#5d56f3"
          />
        </RowComponent>
      </SectionComponent>
      {
        (result && result?.length > 0 && !isLoading ) ? <>

          <ListEventComponent items={result} follows={allFollower} />
        </> 
        :
          <LoadingComponent isLoading={isLoading} value={result?.length} />
      }
      <ModalFilterEvent selectedCategories={idsSelectedCategories} 
      onSelectCategories={(val)=>setIdsSelectedCategories(val)} 
      categories={allCategory} visible={isOpenModelizeFilter} 
      onClose={()=>setIsOpenModalizeFilter(false)}
      onComfirm={handleCofirmFilterEvent}
      selectedDateTime={dateTime}
      onSelectDateTime={(val)=>setDateTime(val)}
      selectedAddress={addressFilter}
      onSelectAddress={(val)=>setAddressFilter(val.label)}
      />
    </ContainerComponent>
  )
}
export default SearchEventsScreen;