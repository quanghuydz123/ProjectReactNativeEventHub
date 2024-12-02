import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import followAPI from "../../apis/followAPI"
import { EventModelNew } from "../../models/EventModelNew"
import { FollowModel } from "../../models/FollowModel"
import { apis } from "../../constrants/apis"
import eventAPI from "../../apis/eventAPI"
import { ContainerComponent, CricleComponent, DataLoaderComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../components"
import ListEventComponent from "../../components/ListEventComponent"
import LoadingComponent from "../../components/LoadingComponent"
import { SearchNormal, Sort } from "iconsax-react-native"
import { colors } from "../../constrants/color"
import {debounce, lte, toString} from 'lodash'
import socket from "../../utils/socket"
import ModalFilterEvent from "../../../modals/ModalFilterEvent"
import { CategoryModel } from "../../models/CategoryModel"
import categoryAPI from "../../apis/categoryAPI"
import axios from "axios"
import { useSelector } from "react-redux"
import { authSelector } from "../../reduxs/reducers/authReducers"
import SearchComponent from "../../components/SearchComponent"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
interface routeParams {
  follows: FollowModel[],
  lat:string,
  long:string,
  distance:string,
  title:string,
  limit:string,
  categories:CategoryModel[],
  categoriesSelected:string[],
  sortType?:'view'
}
interface FilterEvent {
  distance?:string,
  limit?:string,
  categoriesFilter?:string[],
  position:{
    lat?:string,
    lng?:string
  },
  sortType?:'view'
}
const initFilterEvent:FilterEvent = {
  limit:'',
  categoriesFilter:[],
  distance:'',
  position:{
    lat:'',
    lng:''
  },
}
const SearchEventsScreen = ({ navigation, route }: any) => {
  const { categories, lat, long, distance,title,limit,categoriesSelected,sortType }: routeParams = route.params || {}
  // const [events, setEvents] = useState<EventModelNew[]>(items)
  const [isLoading, setIsLoading] = useState(true)
  const [result,setResult] = useState<EventModelNew[]>()
  const [dataRoute,setDateRoute] = useState<routeParams>(route.params || {})
  const [isOpenModelizeFilter,setIsOpenModalizeFilter] = useState(false)
  const [allCategory, setAllCategory] = useState<CategoryModel[]>(categories)
  const [first,setFirst] = useState(false)
  const [idsSelectedCategories, setIdsSelectedCategories] = useState<string[]>([])
  const [addressFilter,setAddressFilter] = useState('')
  const [searchKey,setSearchKey] = useState('')
  const [isEnabledSortByView, setIsEnabledSortByView] = useState(sortType === 'view' ? true : false);
  const [priceRenge, setPriceRenge] = useState<{
    low: number,
    high: number
  }>({
      low:0,
      high:5000000
  })
  const [dateTime,setDateTime] = useState<{
    startAt:string,
    endAt:string
}>({
  startAt:'',
  endAt:''
})
const auth = useSelector(authSelector)
  const [filterEvent,setFilterEvent] = useState<FilterEvent>(initFilterEvent)
  useEffect(() => {
    handleSetFilterEvent()
   
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
  // useEffect(()=>{
  //   // if(!searchKey){
  //   //   setResult(events)
  //   // }
  //   // else{
  //   //   const handleSeachValude = debounce(handleSearchEvent,100)
  //   //   handleSeachValude()
  //   // }
  //   console.log("ok2")
  //   if(first){
  //     const handleSeachValude = debounce(handleSearchEvent,500)
  //     handleSeachValude()
  //   }else{
  //     setFirst(true)
  //   }

  // },[searchKey])
  useEffect(() => {
    // const handleFollowers = () => {
    //   handleCallApiGetAllFollower();
    //   console.log('followers cập nhật');
    // };
    // socket.on('followers',(idUser)=>{
    //   if(idUser===auth.id){
    //     handleFollowers()
    //   }
    // })

 
    // return () => {
    //   socket.off('followers', handleFollowers);
    // };
  }, [])
  useEffect(()=>{
    if(first){
      getEvents()
    }else{
      setFirst(true)
    }
  },[filterEvent])
  useEffect(()=>{
    if(isEnabledSortByView){
      handleOnChangeValudeFilter('sortType','view')
    }else{
      handleOnChangeValudeFilter('sortType','')
    }
  },[isEnabledSortByView])
  const handleSetFilterEvent = async ()=>{
    const filterCopy:FilterEvent = {...filterEvent}
    filterCopy['position']['lat'] = lat
    filterCopy['position']['lng'] = long
    filterCopy['distance'] = distance
    filterCopy['categoriesFilter'] = categoriesSelected
    filterCopy['sortType'] = sortType
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
    const api = apis.category.getAll()
    try {
      const res = await categoryAPI.HandleCategory(api)
      if (res && res.data && res.status === 200) {
        setAllCategory(res.data as CategoryModel[])
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

  // const handleCallApiGetAllFollower = async () => {
  //   const api = apis.follow.getAll()
  //   try {
  //     const res: any = await followAPI.HandleFollwer(api, {}, 'get');
  //     if (res && res.data && res.status === 200) {
  //       setAllFollower(res.data.followers)
  //     }

  //   } catch (error: any) {
  //     const errorMessage = JSON.parse(error.message)
  //     console.log("HomeScreen", errorMessage)

  //   }
  // }
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
    const api = apis.event.getAll({lat:filterEvent.position.lat,searchValue:searchKey,
      long:filterEvent.position.lng,distance:'10',categoriesFilter:filterEvent.categoriesFilter,
      startAt:dateTime.startAt,endAt:dateTime.endAt,maxPrice:toString(priceRenge.high),minPrice:toString(priceRenge.low),sortType:filterEvent.sortType
      })
    setIsLoading(true)
    try {
      const res = await eventAPI.HandleEvent(api)
      if (res && res.data && res.status === 200) {
        setResult(res.data as EventModelNew[])
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
      searchValue:searchKey,categoriesFilter:filterEvent.categoriesFilter,
      startAt:dateTime.startAt,endAt:dateTime.endAt,maxPrice:toString(priceRenge.high),minPrice:toString(priceRenge.low),sortType:filterEvent.sortType
    })
    setIsLoading(true)
    try {
      const res = await eventAPI.HandleEvent(api)
      if (res && res.data && res.status === 200) {
        setResult(res.data as EventModelNew[])
      }
      setIsLoading(false)
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("ExploreEvent", errorMessage)
      setIsLoading(false)
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
  const handleResetFilterEvent = ()=>{
    setIsOpenModalizeFilter(false)
  }
  return (
    <ContainerComponent back title={dataRoute.title ?? 'Danh sách sự kiện'} bgColor={colors.black} colorTitle={colors.white}>
      <SectionComponent>
        <RowComponent>
          {/* <RowComponent styles={{ flex: 1, alignItems: 'center' }}>
            <SearchNormal size={20} variant="TwoTone" color={colors.gray} />
            <View style={{ backgroundColor: colors.gray, marginLeft: 10, height: 20, width: 1 }} />
            <View style={{ flex: 1 }}>
              <InputComponent styles={{ minHeight: 'auto', marginBottom: 0, borderColor: 'white' }} onChange={(val) => setSearchKey(val)}
               value={searchKey ?? ''} placeholder="Tìm kiếm sự kiện..." allowClear onEnd={()=>handleSearchEvent()} />
            </View>
          </RowComponent> */}
          <SearchComponent textColor={colors.backgroundBluishWhite} bgColor={colors.black}  isNotShowArrow styles={{width:'78%'}} onSearch={(val)=>setSearchKey(val)} value={searchKey} onEnd={()=>handleSearchEvent()}/>
            <SpaceComponent width={4}/>
          <TagComponent
            onPress={() => {setIsOpenModalizeFilter(true),setIdsSelectedCategories(filterEvent.categoriesFilter ?? [])}}
            
            label="Lọc"
            icon={<CricleComponent size={20} color={colors.primary}><FontAwesome name="filter" size={18} color={colors.white} /></CricleComponent>}
            bgColor={colors.primary}
          />
        </RowComponent>
      </SectionComponent>
      {
        <DataLoaderComponent isFlex data={result} isLoading={isLoading} 
            messageEmpty="Không có sự kiện nào phù hợp"
            children={
              <ListEventComponent numColumns={2} bgColor={colors.black} isShownVertical items={result ?? []} />

            }/>
        
      }
      <ModalFilterEvent selectedCategories={idsSelectedCategories} 
      
      onSelectCategories={(val)=>setIdsSelectedCategories(val)} 
      categories={allCategory} visible={isOpenModelizeFilter} 
      onClose={()=>handleResetFilterEvent()}
      onComfirm={handleCofirmFilterEvent}
      selectedDateTime={dateTime}
      onSelectDateTime={(val)=>setDateTime(val)}
      selectedAddress={addressFilter}
      onSelectAddress={(val)=>setAddressFilter(val)}
      onSelectPriceRange={(val)=>setPriceRenge({low:val.low,high:val.high})}
      selectedPriceRenge={priceRenge}
      isEnabledSortByView={isEnabledSortByView}
      onEnableSortByView={(val)=>setIsEnabledSortByView(val)}
      />
    </ContainerComponent>
  )
}
export default SearchEventsScreen;