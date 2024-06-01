import { Button, FlatList, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authSelector, removeAuth } from "../../reduxs/reducers/authReducers"
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../constrants/color"
import { CategoriesList, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components"
import { ArrowDown, Filter, HambergerMenu, Notification, SearchNormal, Sort } from "iconsax-react-native"
import { fontFamilies } from "../../constrants/fontFamilies"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import EventItem from "../../components/EventItem"
const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const auth = useSelector(authSelector)
  const [isRemember, setIsReMember] = useState<boolean>(false)
  const { getItem } = useAsyncStorage('isRemember')
  useEffect(() => {
    handleGetItem()
  }, [])

  const handleGetItem = async () => {
    const res = await getItem()
    setIsReMember(res === 'true')
  }
  const handleLogout = async () => {
    if (isRemember === true) {
      await AsyncStorage.setItem('auth', auth.email)
      dispatch(removeAuth({}))
    } else {
      await AsyncStorage.removeItem('auth')
      dispatch(removeAuth({}))
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
          <RowComponent>
            <TouchableOpacity onPress={() => navigation.openDrawer()} >
              <HambergerMenu size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={[{ flex: 1, alignItems: 'center' }]}>
              <RowComponent>
                <TextComponent text="Chọn địa chỉ" color={colors.white2} size={12} />
                <MaterialIcons name="arrow-drop-down" size={18} color={colors.white2} />
              </RowComponent>
              <TextComponent text={'Ho Chi Minh'} size={13} color={colors.white2} font={fontFamilies.medium} />
            </View>
            <CricleComponent color={'#524CE0'} size={36}>
              <View>
                <Notification size={18} color={colors.white} />
                <View style={{
                  backgroundColor: '#02E9FE',
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#02E9FE',
                  position: 'absolute',
                  top: 0,
                  right: 0
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
              <TextComponent text="Search..." flex={1} color={colors.gray2} size={18} />
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
        <View style={{ marginTop: 16 }}>
          <CategoriesList isFill />
        </View>
      </View>
      <ScrollView style={[{ 
        flex: 1, 
        backgroundColor: colors.white,

        }]}>
        <SectionComponent styles={{paddingHorizontal:0,paddingTop:20}}>
           <TabBarComponent title="Các sự kiện sắp xảy ra" onPress={()=>console.log("abc")}/>
           <FlatList 
           
           horizontal
           data={Array.from({length:5})}
           renderItem={({item,index})=> <EventItem item={item} key={index} type="card"/>}
           />
        </SectionComponent>

      </ScrollView>
    </View>
  )
}
export default HomeScreen;