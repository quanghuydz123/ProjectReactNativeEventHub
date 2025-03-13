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
import { SearchNormal, Sort, TrendUp } from "iconsax-react-native"
import { colors } from "../../constrants/color"
import { debounce, lte, toString } from 'lodash'
import socket from "../../utils/socket"
import ModalFilterEvent from "../../../modals/ModalFilterEvent"
import { CategoryModel } from "../../models/CategoryModel"
import categoryAPI from "../../apis/categoryAPI"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { authSelector, AuthState, updateSearchHistory } from "../../reduxs/reducers/authReducers"
import SearchComponent from "../../components/SearchComponent"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { constantSelector, constantState, updateEvents } from "../../reduxs/reducers/constantReducers"
import userAPI from "../../apis/userApi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { KeyWordModel } from "../../models/KeyWordModel"
import keywordAPI from "../../apis/keywordAPI"
interface routeParams {
  follows: FollowModel[],
  lat: string,
  long: string,
  distance: string,
  title: string,
  limit: string,
  categories: CategoryModel[],
  categoriesSelected: string[],
  keywordsSelected:string[],
  sortType?: 'view',
  isSearchParams: boolean
}
interface FilterEvent {
  distance?: string,
  limit?: string,
  categoriesFilter?: string[],
  position: {
    lat?: string,
    lng?: string
  },
  keywordsFilter?:string[],
  sortType?: 'view'
}
const initFilterEvent: FilterEvent = {
  limit: '',
  categoriesFilter: [],
  keywordsFilter:[],
  distance: '',
  position: {
    lat: '',
    lng: ''
  },
}
const SearchEventsScreen = ({ navigation, route }: any) => {
  const { categories, lat, long, distance, title, limit, categoriesSelected, keywordsSelected,sortType }: routeParams = route.params || {}
  // const [events, setEvents] = useState<EventModelNew[]>(items)
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<EventModelNew[]>([])
  const [isOpenModelizeFilter, setIsOpenModalizeFilter] = useState(false)
  const [allCategory, setAllCategory] = useState<CategoryModel[]>(categories)
  const [first, setFirst] = useState(true)
  const [idsSelectedCategories, setIdsSelectedCategories] = useState<string[]>([])
  const [idsSelectedKeywords, setIdsSelectedKeywords] = useState<string[]>([])

  const [addressFilter, setAddressFilter] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [isEnabledSortByView, setIsEnabledSortByView] = useState(sortType === 'view' ? true : false);
  const [limitGetEvent, setLimitGetEvent] = useState(10)
  const [isLoadingLimit, setIsLoadingLimit] = useState(false)
  const [isShowSuggest, setIsShowSuggest] = useState(true)
  const flatListRef = React.useRef<any>()
  const constant:constantState = useSelector(constantSelector)
  const dispatch = useDispatch()
  const [keywords,setKeywords] = useState<KeyWordModel[]>([])
  const [priceRenge, setPriceRenge] = useState<{
    low: number,
    high: number
  }>({
    low: 0,
    high: 5000000
  })
  const [dateTime, setDateTime] = useState<{
    startAt: string,
    endAt: string
  }>({
    startAt: '',
    endAt: ''
  })
  const auth:AuthState = useSelector(authSelector)
  const [filterEvent, setFilterEvent] = useState<FilterEvent>(initFilterEvent)
  useEffect(() => {
    handleSetFilterEvent()
    handleGetKeyWords()
    if (!allCategory) {
      handleGetAllCategory()
    }
  }, [])

  useEffect(() => {
    if (!first) {
      // if (!isFirstGetFilter) {
      //   getEvents({})
      //   setIsShowSuggest(false)
      // } else {
      //   getEvents({})
      //   setIsShowSuggest(true)
      //   setIsFirstGetFilter(false)
      // }
      getEvents({})
      // setIsShowSuggest(true)
    } else {
      setFirst(false)
    }
  }, [filterEvent])
  useEffect(() => {
    if (!searchKey) {
      // getEvents({})
      setResult(constant.events)
      setIsShowSuggest(true)
    }
  }, [searchKey])
  useEffect(() => {
    if (!first) {
      if ((result.length - limitGetEvent >= -10) && (result.length - limitGetEvent <= 0)) {
        getEvents({ isGetLimit: true })
      }
    } else {
      setFirst(false)
    }
  }, [limitGetEvent])
  // useEffect(()=>{
  //   if(isEnabledSortByView){
  //     handleOnChangeValudeFilter('sortType','view')
  //   }else{
  //     handleOnChangeValudeFilter('sortType','')
  //   }
  // },[isEnabledSortByView])
  useEffect(() => {
    if(keywordsSelected && keywordsSelected.length > 0){
      const filterCopy: FilterEvent = { ...filterEvent }
      filterCopy['keywordsFilter'] = keywordsSelected
      setFilterEvent(filterCopy)
    }
  }, [keywordsSelected])

  useEffect(() => {
   if(categoriesSelected && categoriesSelected.length > 0){
    const filterCopy: FilterEvent = { ...filterEvent }
    filterCopy['categoriesFilter'] = categoriesSelected
    setFilterEvent(filterCopy)
   }
  }, [categoriesSelected])

  const handleSetFilterEvent = async () => {
    const filterCopy: FilterEvent = { ...filterEvent }
    filterCopy['position']['lat'] = lat
    filterCopy['position']['lng'] = long
    filterCopy['distance'] = distance
    // filterCopy['categoriesFilter'] = categoriesSelected
    filterCopy['sortType'] = sortType
    setFilterEvent(filterCopy)
  }
  // const handleOnchangePosition = (key: string, value: any) => {
  //   const filterCopy: any = { ...filterEvent }
  //   Object.keys(filterEvent.position).forEach((keyChild) => {
  //     filterCopy[`${key}`][`${keyChild}`] = value[`${keyChild}`]
  //   })
  //   setFilterEvent(filterCopy)
  // }
  const handleOnChangeValudeFilter = async (key: string, value: string | string[], keyPosition?: string, position?: any) => {
    const filterCopy: any = { ...filterEvent }
    filterCopy[`${key}`] = value
    filterCopy[`keywordsFilter`] = idsSelectedKeywords

    if (position) {
      Object.keys(filterEvent.position).forEach((keyChild) => {
        filterCopy[`${keyPosition}`][`${keyChild}`] = position[`${keyChild}`]
      })
    }
    if (isEnabledSortByView) {
      filterCopy[`sortType`] = 'view'
      // handleOnChangeValudeFilter('sortType','view')
    } else {
      filterCopy[`sortType`] = ''
      // handleOnChangeValudeFilter('sortType','')
    }
    setFilterEvent(filterCopy)
  }
  const handleGetKeyWords = async () => {
    const api = apis.keyword.getAll()
    try {
      const res = await keywordAPI.HandleKeyword(api)
      if (res && res.data && res.status === 200) {
        setKeywords(res.data)
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
  const handleCallApiGetLatAndLong = async () => {
    const api = `https://geocode.search.hereapi.com/v1/geocode?q=${addressFilter}&limit=20&lang=vi-VI&in=countryCode:VNM&apiKey=${process.env.API_KEY_REVGEOCODE}`
    try {
      const res = await axios(api)
      if (res && res.data && res.status === 200) {
        return res.data.items[0].position
      } else {
        console.log("vị trí chọn không hợp lệ")
      }
    } catch (error: any) {
      console.log(error)
    }
  }
  const getEvents = async ({ isGetLimit }: { isGetLimit?: boolean}) => {
    const api = apis.event.getAll({
      lat: filterEvent.position.lat, searchValue:    searchKey,
      long: filterEvent.position.lng, distance: '10', categoriesFilter: filterEvent.categoriesFilter,
      startAt: dateTime.startAt, endAt: dateTime.endAt, maxPrice: toString(priceRenge.high), minPrice: toString(priceRenge.low), sortType: filterEvent.sortType, 
      limit: limitGetEvent.toString(),keywordsFilter:filterEvent.keywordsFilter
    })
    setIsLoading(isGetLimit ? false : true)
    setIsLoadingLimit(isGetLimit ? true : false)
    try {
      const res = await eventAPI.HandleEvent(api)
      if (res && res.data && res.status === 200) {
        setResult(res.data as EventModelNew[])
        dispatch(updateEvents({events:res.data}))
      }
      setIsLoading(false)
      setIsLoadingLimit(false)
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("ExploreEvent", errorMessage)
      setIsLoading(false)
      setIsLoadingLimit(false)
    }
  }
  const handleSearchEvent = async ({searchValue}:{searchValue?:string}) => {
    const api = apis.event.getAll({
      lat: filterEvent.position.lat,
      long: filterEvent.position.lng, distance: '10',
      searchValue: searchValue ? searchValue : searchKey, categoriesFilter: filterEvent.categoriesFilter,
      startAt: dateTime.startAt, endAt: dateTime.endAt, maxPrice: toString(priceRenge.high), minPrice: toString(priceRenge.low), sortType: filterEvent.sortType, 
      limit: limitGetEvent.toString(),keywordsFilter:filterEvent.keywordsFilter
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
  const handleCofirmFilterEvent = async () => {
    setIsOpenModalizeFilter(false)
    let position
    if (addressFilter) {
      position = await handleCallApiGetLatAndLong()
    }
    await handleOnChangeValudeFilter('categoriesFilter', idsSelectedCategories, 'position', position)

    // if(isEnabledSortByView){
    //   handleOnChangeValudeFilter('sortType','view')
    // }else{
    //   handleOnChangeValudeFilter('sortType','')
    // }
  }
  const toTop = () => {
    // use current
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
  }
  const handleResetFilterEvent = () => {
    setIsOpenModalizeFilter(false)
    setFilterEvent(initFilterEvent)
    setIsEnabledSortByView(false)
  }
  const handleAddHistorySearch = async () => {
  
    const api = apis.user.addHistorySearch()
    try {
      const res = await userAPI.HandleUser(api,{idUser:auth.id,keyword:searchKey},'post')
      if(res && res.status === 200 && res.data){
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, searchHistory: res.data }))
        dispatch(updateSearchHistory({ searchHistory: res.data }))
      }
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      console.log("SearchEventScreens", errorMessage)
    }
  }
  return (
    <ContainerComponent back title={title ?? 'Danh sách sự kiện'} bgColor={colors.black} colorTitle={colors.white}>
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
          <SearchComponent
            textColor={colors.backgroundBluishWhite}
            bgColor={colors.black}
            isNotShowArrow styles={{ width: '78%' }}
            onSearch={(val) => setSearchKey(val)}
            value={searchKey}
            onFocus={()=>{
              if(isShowSuggest){
                toTop()
              }
            }}
            onEnd={() => {
              if (searchKey) {
                handleAddHistorySearch()
                handleSearchEvent({})
                setIsShowSuggest(false)
              }
            }}

          />
          <SpaceComponent width={4} />
          <TagComponent
            onPress={() => { setIsOpenModalizeFilter(true), setIdsSelectedCategories(filterEvent.categoriesFilter ?? []),setIdsSelectedKeywords(filterEvent.keywordsFilter ?? []) }}

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
            <ListEventComponent
              ref={flatListRef}
              setSearchKey={(val)=>{
                setSearchKey(val)
                handleSearchEvent({searchValue:val})
                setIsShowSuggest(false)
              }}
              isLoading={isLoadingLimit}
              numColumns={2}
              bgColor={colors.black}
              isShownVertical
              onEndReached={() => {
                if(!isLoadingLimit && result.length >= 10){
                  setLimitGetEvent(prev => prev + 10)
                }
              }}
              isShowSuggest={isShowSuggest}
              items={result ?? []} />

          } />

      }
      <ModalFilterEvent
        selectedCategories={idsSelectedCategories}
        onSelectCategories={(val) => setIdsSelectedCategories(val)}
        selectedKeywords={idsSelectedKeywords}
        onSelectKeywords={(val)=>setIdsSelectedKeywords(val)}
        categories={allCategory} visible={isOpenModelizeFilter}
        onClose={() => setIsOpenModalizeFilter(false)}
        onResetFilter={handleResetFilterEvent}
        onComfirm={handleCofirmFilterEvent}
        selectedDateTime={dateTime}
        onSelectDateTime={(val) => setDateTime(val)}
        selectedAddress={addressFilter}
        onSelectAddress={(val) => setAddressFilter(val)}
        onSelectPriceRange={(val) => setPriceRenge({ low: val.low, high: val.high })}
        selectedPriceRenge={priceRenge}
        isEnabledSortByView={isEnabledSortByView}
        onEnableSortByView={(val) => setIsEnabledSortByView(val)}
        keywords={keywords ?? []}
      />
    </ContainerComponent>
  )
}
export default SearchEventsScreen;