import { ActivityIndicator, Button, RefreshControl, Text, View } from "react-native"
import React, { forwardRef, memo, useCallback, useState } from "react"
import { EventModelNew } from "../models/EventModelNew"
import { FlatList } from "react-native-gesture-handler"
import EventItem from "./EventItem"
import { FollowModel } from "../models/FollowModel"
import RowComponent from "./RowComponent"
import { colors } from "../constrants/color"
import TextComponent from "./TextComponent"
import Fontisto from 'react-native-vector-icons/Fontisto'
import SpaceComponent from "./SpaceComponent"
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { useDispatch, useSelector } from "react-redux"
import { authSelector, AuthState, updateSearchHistory } from "../reduxs/reducers/authReducers"
import { apis } from "../constrants/apis"
import userAPI from "../apis/userApi"
import AsyncStorage from "@react-native-async-storage/async-storage"
interface Props {
  items: EventModelNew[],
  isShownVertical?: boolean,
  bgColor?: string,
  numColumns?: number,
  onEndReached?: () => void,
  isLoading: boolean,
  isShowSuggest:boolean,
  setSearchKey:(val:string)=>void,

}
const ListEventComponent = forwardRef<any, Props>((props:Props,ref:any) => {
  const { items, isShownVertical, bgColor, numColumns, onEndReached, isLoading,isShowSuggest,setSearchKey} = props
  const [refreshing, setRefreshing] = React.useState(false);
  const auth:AuthState = useSelector(authSelector)
  const [isLoadingDeleteSearch,setIsLoadingDeleteSearch] = useState<{idSearch:string}>({
    idSearch:''
  })
  const dispatch = useDispatch()

  const handleUpdateHistorySearch = async (idKeyword:string,keyword:string) => {
    const api = apis.user.updateHistorySearch()
    try {
      const res = await userAPI.HandleUser(api,{idUser:auth.id,idKeyword,keyword},'put')
      if(res && res.status === 200 && res.data){
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, searchHistory: res.data }))
        dispatch(updateSearchHistory({ searchHistory: res.data }))
      }
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      console.log("ListEventComponent", errorMessage)
    }
  }
  const handleDeleteHistorySearch = async (idKeyword:string) => {
    setIsLoadingDeleteSearch({
      idSearch:idKeyword,
    })
    const api = apis.user.deleteHistorySearch()
    try {
      const res = await userAPI.HandleUser(api,{idUser:auth.id,idKeyword:idKeyword},'delete')
      if(res && res.status === 200 && res.data){
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, searchHistory: res.data }))
        dispatch(updateSearchHistory({ searchHistory: res.data }))
      }
       setIsLoadingDeleteSearch({
      idSearch:'',
    })
    } catch (error:any) {
       setIsLoadingDeleteSearch({
      idSearch:'',
    })
      const errorMessage = JSON.parse(error.message)
      console.log("ListEventComponent", errorMessage)
    }
  }
  const renderItemHistory = (searchItem:{_id:string,keyword:string,searchedAt:Date})=>{
    return (
      <>
      {(isLoadingDeleteSearch.idSearch !== searchItem._id ) ? <RowComponent 
          key={searchItem._id}
          justify="space-between" 
          styles={{paddingVertical:6}}>
          <RowComponent styles={{flex:1}}
          onPress={()=>{
            handleUpdateHistorySearch(searchItem._id,searchItem.keyword)
            setSearchKey(searchItem.keyword)
          }}
          >
            <Fontisto color={colors.white} name="clock" size={20}/>
            <SpaceComponent width={8}/>
            <TextComponent flex={1} numberOfLine={2} text={searchItem.keyword} color={colors.white} size={15}/>
          </RowComponent>
          <Feather style={{paddingHorizontal:8}} onPress={()=>handleDeleteHistorySearch(searchItem._id)} color={colors.gray} name="trash-2" size={18}/>
        </RowComponent> : <><ActivityIndicator /><SpaceComponent height={4}/>
        </>}
      </>
    )
  }
  const renderItemTrend = useCallback(()=>{
    return <RowComponent 
    onPress={()=>setSearchKey('muay thai')}
    styles={{paddingVertical:6}}>
    <RowComponent styles={{flex:1}}>
      <FontAwesome6 color={colors.primary} name="arrow-trend-up" size={20}/>
      <SpaceComponent width={8}/>
      <TextComponent text={'muay thai'} color={colors.white} size={15}/>
    </RowComponent>
  </RowComponent>
  },[])
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        // style={{flex:1}}
        ref={ref}
        key={items[0]?._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={isShowSuggest ? <View>
          {auth?.searchHistory?.slice(0, 5)?.map((item) => renderItemHistory(item))}
          {renderItemTrend()}
          {renderItemTrend()}

        </View> : <></>}
        ListHeaderComponentStyle={{
          paddingHorizontal:16
        }}
        data={items}
        // contentContainerStyle={{flex:1}}
        // refreshControl={
        //   <RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />
        // }
        numColumns={numColumns}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.8}
        ListFooterComponent={() => <View>
          {isLoading && <View style={{}}>
            <ActivityIndicator color={colors.primary} />
          </View>}
        </View>}
        ListFooterComponentStyle={{ paddingBottom: 40 }}

        renderItem={({ item }) => {
          return <EventItem
            bgColor={bgColor} item={item} key={item._id} isShownVertical={isShownVertical} />
        }} />
    </View>
  )
})
export default memo(ListEventComponent);