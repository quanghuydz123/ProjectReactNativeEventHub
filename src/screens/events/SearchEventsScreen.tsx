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
import ModalFilterEvent from "../../../modals/ModalFilterEvent"
import { CategoryModel } from "../../models/CategoryModel"
import categoryAPI from "../../apis/categoryAPI"
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
  lat?:string,
  long?:string,
  distance?:string,
  limit?:string,
  categoriesFilter?:string[],
  searchKey?:string
}
const initFilterEvent:FilterEvent = {
  lat:'',
  long:'',
  limit:'',
  categoriesFilter:[],
  distance:'',
  searchKey:''
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
  console.log("ids",idsSelectedCategories)
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
    filterCopy['lat'] = lat
    filterCopy['long'] = long
    filterCopy['distance'] = distance
    filterCopy['categoriesFilter'] = categoriesSelected
    setFilterEvent(filterCopy)
  }
  const handleOnChangeValudeFilter = (key:string,value:string | string[]) =>{
    const filterCopy:any = {...filterEvent}
    filterCopy[`${key}`] = value
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
  const getEvents = async () => {
    const api = apis.event.getAll({lat:filterEvent.lat,
      long:filterEvent.long,distance:filterEvent.distance,categoriesFilter:filterEvent.categoriesFilter
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
    const api = apis.event.getAll({lat:filterEvent.lat,
      long:filterEvent.long,distance:filterEvent.distance,
      searchValue:filterEvent.searchKey,categoriesFilter:filterEvent.categoriesFilter})
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
  const handleCofirmFilterEvent = ()=>{
    setIsOpenModalizeFilter(false)
    handleOnChangeValudeFilter('categoriesFilter',idsSelectedCategories)
  }
  console.log("cacac",filterEvent.categoriesFilter)
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
      />
    </ContainerComponent>
  )
}
export default SearchEventsScreen;