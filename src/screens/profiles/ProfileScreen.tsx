import { Button, FlatList, Modal, Text, TouchableOpacity, View } from "react-native"
import React, { ReactNode, useEffect, useMemo, useState } from "react"
import { ButtonComponent, CategoriesList, ContainerComponent, CricleComponent, DataLoaderComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../components";
import userAPI from "../../apis/userApi";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector, AuthState, removeAuth, updateCategoriesInterested, updateStatusCheckInDaily } from "../../reduxs/reducers/authReducers";
import { UserModel } from "../../models/UserModel";
import { LoadingModal, SelectModalize, SelectedImageModal } from "../../../modals";
import AvatarItem from "../../components/AvatarItem";
import { globalStyles } from "../../styles/globalStyles";
import { ImageOrVideo } from "react-native-image-crop-picker";
import { colors } from "../../constrants/color";
import Feather from 'react-native-vector-icons/Feather'
import socket from "../../utils/socket";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import storage from "@react-native-firebase/storage"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastMessaging } from "../../utils/showToast";
import { Edit2 } from "iconsax-react-native";
import categoryAPI from "../../apis/categoryAPI";
import { CategoryModel } from "../../models/CategoryModel";
import { fontFamilies } from "../../constrants/fontFamilies";
import { FollowModel } from "../../models/FollowModel";
import followAPI from "../../apis/followAPI";
import { apis } from "../../constrants/apis";
import { appInfo } from "../../constrants/appInfo";
import CardComponent from "../../components/CardComponent";
import Ticket from '../../assets/svgs/ticket.svg'
import BookMark from '../../assets/svgs/bookmark-svgrepo-com.svg'
import Star from '../../assets/svgs/star.svg'
import UserGroup from '../../assets/svgs/user-group-svgrepo-com.svg'
import checkLogin from "../../utils/checkLogin";
import { EventModelNew } from "../../models/EventModelNew";
import eventAPI from "../../apis/eventAPI";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { HandleNotification } from "../../utils/handleNotification";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { CoinChild, CoinF ,CoinFH} from "../../assets/svgs";
import Entypo from 'react-native-vector-icons/Entypo'
import { DateTime } from "../../utils/DateTime";
const ProfileScreen = ({ navigation, route }: any) => {
  const auth: AuthState = useSelector(authSelector)
  const [profile, setProfile] = useState<{
    fullname: string,
    phoneNumber: string,
    bio: string,
    _id: string,
    photoUrl: string,
    email: string,
  }>()
  const [isLoading, setIsLoading] = useState(false)
  const [fileSelected, setFileSelected] = useState<ImageOrVideo>()
  const [isOpenModalizeChooseImage, setIsOpenModalizeChooseImage] = useState(false)
  const [isUpdateImageProfile, setIsUpdateProfile] = useState(false)
  const [isOpenModalizeSelectCategory, setIsOpenModalizeSelectCategory] = useState(false)
  const [allCategory, setAllCategory] = useState<CategoryModel[]>([])
  const [follower, setFollower] = useState<FollowModel[]>([])
  const [idsFollowerCategory, setIdsFollowerCategory] = useState<string[]>([])
  const [searchCategory, setSearchCategory] = useState('')
  const [numberOfFollowers, setNumberOfFollowers] = useState(0)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const days = [
    {
      day:0,
      coin:100
    },
    {
      day:1,
      coin:100
    },{
      day:2,
      coin:100
    }
    ,{
      day:3,
      coin:100
    }
    ,{
      day:4,
      coin:100
    },{
      day:5,
      coin:100
    },
    {
      day:6,
      coin:500
    }
  ]
  // const [invoicePaid,setinvoicePaid] = useState<InvoiceDetailsModel[]>([])
  const dispatch = useDispatch()
  const [relatedEvents, setRelatedEvents] = useState<EventModelNew[]>([])
  useEffect(() => {
    haneleGetAPIRelatedEvents()
  }, [])
  useEffect(() => {
    setProfile({
      fullname: auth.fullname,
      phoneNumber: auth.phoneNumber,
      bio: auth.bio,
      _id: auth.id,
      photoUrl: auth.photoUrl,
      email: auth.email
    })
  }, [auth])
  const haneleGetAPIRelatedEvents = async () => {
    const api = apis.event.getAll({ limit: '4' })
    // setIsLoading(isLoading ? isLoading : false)
    try {
      const res: any = await eventAPI.HandleEvent(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setRelatedEvents(res.data as EventModelNew[])
      }
      // setIsLoading(false)

    } catch (error: any) {
      // setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log("HomeScreen", errorMessage)
    }
  }
  useEffect(() => {
    handleGetAllCategory()
  }, [])
  useEffect(() => {
    // handleCallApiGetProfile({ isLoading: true })
    handleCallApiGetFollowerById({ isLoading: true })
    // handleCallAPIGetTicketsByIdUser()
  }, [auth.accesstoken])
  useEffect(() => {
    if (auth.categoriesInterested) {
      const ids: string[] = []
      auth.categoriesInterested.map((item) => {
        ids.push(item.category._id)
      })
      setIdsFollowerCategory(ids)
    }
  }, [isOpenModalizeSelectCategory, auth])
  useEffect(() => {
    if (isUpdateImageProfile) {
      if (profile?.photoUrl) {
        setIsLoading(true)
        if (fileSelected) {
          const fileName = `${fileSelected.filename ?? `image-${Date.now()}`}.${fileSelected.path.split('.')[1]}`
          const path = `/images/${fileName}`
          const res = storage().ref(path).putFile(fileSelected.path)

          res.on('state_changed', snap => {
            console.log(snap)
          }, error => console.log(error),
            () =>//khi thành công
            {
              storage().ref(path).getDownloadURL().then(url => {
                handleCallApiUpdateImageProfile(profile, url)
              })
            }
          )
        }
        else {
          handleCallApiUpdateImageProfile(profile)
        }
      } else {
        ToastMessaging.Error({ message: "Ảnh không hợp lệ" })
      }
    }
  }, [isUpdateImageProfile])
  // useEffect(() => {
  //   const handleUpdateProfile = (idUser?: string) => {
  //     // handleCallApiGetProfile({ idUser: idUser })
  //   }
  //   const handleFollowByid = (idUser?: string) => {
  //     handleCallApiGetFollowerById({ idUser: idUser });
  //     console.log('followers cập nhật');
  //   };
  //   socket.on('updateUser', ({ idUser }) => {
  //     handleUpdateProfile(idUser)
  //   })
  //   socket.on('followUser', ({ idUser }) => {
  //     handleFollowByid(idUser)
  //   })
  //   return () => {
  //     socket.off('updateUser', handleUpdateProfile)
  //     socket.off('followUser', handleFollowByid)
  //   };
  // }, [])
  // const handleCallAPIGetTicketsByIdUser = async ()=>{
  //   const api = apis.ticket.getByIdUser(auth.id)
  //   try {
  //     const res = await ticketAPI.HandleTicket(api)
  //     if(res && res.status === 200 && res.data){
  //       setinvoicePaid(res.data)
  //     }
  //   } catch (error: any) {
  //     const errorMessage = JSON.parse(error.message)
  //     console.log("Profile",errorMessage.message)
  //   }
  // }
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
  const handleCallApiGetFollowerById = async ({ isLoading, idUser }: { isLoading?: boolean, idUser?: string }) => {

    if (auth.accesstoken) {
      try {
        const api = apis.follow.getById(idUser ?? auth.id)
        setIsLoadingFollow(isLoading ? isLoading : false)
        const res: any = await followAPI.HandleFollwer(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setFollower(res.data.followers)
          setNumberOfFollowers(res.data.numberOfFollowers)
        }
        setIsLoadingFollow(false)
      } catch (error: any) {

        setIsLoadingFollow(false)
        const errorMessage = JSON.parse(error.message)
        console.log("FollowerScreen", errorMessage)

      }
    } else {
      setFollower([])
      setNumberOfFollowers(0)
    }
  }
  // const handleCallApiGetProfile = async ({ isLoading, idUser }: { isLoading?: boolean, idUser?: string }) => {
  //   if (auth.accesstoken) {
  //     setIsLoading(isLoading ? isLoading : false)
  //     const api = `/get-user-byId?uid=${idUser ?? auth.id}`
  //     try {
  //       const res = await userAPI.HandleUser(api)
  //       if (res && res.data && res.status === 200) {
  //         setProfile(res.data.user)
  //       }
  //       setIsLoading(false)
  //     } catch (error: any) {
  //       const errorMessage = JSON.parse(error.message)
  //       console.log("HomeScreen", errorMessage)
  //       setIsLoading(false)
  //     }
  //   } 
  // }
  const handleChangeImageAvatar = async () => {
    setIsOpenModalizeChooseImage(true)

  }
  const handleOnchageValue = (key: string, value: string | Date | string[] | number) => {
    const item: any = { ...profile }
    item[`${key}`] = value
    setProfile(item)
  }
  const handleFileSelected = (val: ImageOrVideo) => {
    setFileSelected(val)
    handleOnchageValue('photoUrl', val.path)
  }
  const handleChoiceImage = (val: any) => {
    setFileSelected(undefined)
    val.type === 'url' ? handleOnchageValue('photoUrl', val.value) : handleFileSelected(val.value)
    setIsUpdateProfile(true)
  }

  const handleCallApiUpdateImageProfile = async (profile: {
    fullname: string,
    phoneNumber: string,
    bio: string,
    _id: string,
    photoUrl: string,
  }, url?: string) => {
    const api = apis.user.updateProfile()
    try {
      const res: any = await userAPI.HandleUser(api, { _id: profile?._id, photoUrl: url ? url : profile.photoUrl }, 'put')
      if (res && res.data && res.statusCode === 200) {
        const resStorage = await AsyncStorage.getItem('auth')
        const jsonResStorage = JSON.parse(resStorage || '')
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...jsonResStorage, ...res.data.user }))
        dispatch(addAuth({ ...auth, ...res.data.user }))
        // socket.emit('updateUser', { isUser: auth?.id })
        setIsLoading(false)
        setIsUpdateProfile(false)
        ToastMessaging.Success({ message: "Cập nhập ảnh đại điện thành công" })
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log('Lỗi rồi')
      }
      setIsLoading(false)
      setIsUpdateProfile(false)
    }
  }
  const handleFollowerCategory = (id: string) => {
    const idsCategory = [...idsFollowerCategory]
    const index = idsFollowerCategory.findIndex(item => item.toString() === id.toString())
    if (index != -1) {
      idsCategory.splice(index, 1)
      setIdsFollowerCategory(idsCategory)
    } else {
      idsCategory.push(id)
      setIdsFollowerCategory(idsCategory)

    }
  }
  const handleCallApiUpdateFollowerCategory = async () => {
    const api = '/interest-category'
    setIsOpenModalizeSelectCategory(false)
    setIsLoading(true)
    try {
      const res: any = await userAPI.HandleUser(api, { idUser: auth.id, idsCategory: idsFollowerCategory }, 'post')
      if (res && res.data && res.status === 200) {
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, categoriesInterested: res.data.user.categoriesInterested }))
        dispatch(updateCategoriesInterested({ categoriesInterested: res.data.user.categoriesInterested }))
      }
      setIsLoading(false)
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log(errorMessage.message ?? 'Lỗi rồi')
      }
      setIsLoading(false)
    }
  }
  // const handleCountFollows = useMemo(()=>{
  //   const vale = [1,2,3,4,5].reduce((total,item)=>{
  //     return total+item
  //   },0)  
  //   return ``
  // },[follower])
  const handleLogout = async () => {
    setIsLoading(true)
    if (auth.loginMethod === 'google') {
      GoogleSignin.signOut()//đăng xuất google
    }
    const fcmtoken = await AsyncStorage.getItem('fcmtoken')
    if (fcmtoken) {
      if (auth.fcmTokens && auth.fcmTokens.length > 0) {
        const items = [...auth.fcmTokens]
        const index = items.findIndex(item => item === fcmtoken)
        if (index !== -1) {
          items.splice(index, 1)
        }
        await HandleNotification.Update(auth.id, items)
      }
    }
    await AsyncStorage.removeItem('auth')
    dispatch(removeAuth())
    setIsLoading(false)
  }

  const renderCardHalf = ({ title, icon, onPress }: { title: string, icon: ReactNode, onPress?: () => void }) => {
    return <CardComponent styles={{ height: appInfo.sizes.HEIGHT * 0.09, width: appInfo.sizes.WIDTH * 0.46, paddingVertical: 12 }} isShadow onPress={onPress}>
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
        {icon}
        <TextComponent text={title} font={fontFamilies.medium} />
      </View>

    </CardComponent>
  }
  const handleCallAPICheckIn = async ()=>{
    setIsLoading(true)
    try {
      const api = apis.user.checkInDaily()
      const res = await userAPI.HandleUser(api,{idUser:auth.id,coins:days[auth.lastCheckIn + 1].coin},'put')
      if(res && res.status === 200 && res.data){
        dispatch(updateStatusCheckInDaily({lastCheckIn:res.data?.lastCheckIn,totalCoins:res.data?.totalCoins}))
        // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, IsDailyCheck:true,lastCheckIn:res.data?.lastCheckIn,totalCoins:res.data?.totalCoins}))
        setIsLoading(false)
        setModalVisible(true)
      }
    } catch (error:any) {
      setIsLoading(false)
      const errorMessage = JSON.parse(error.message)
      console.log(errorMessage.message ?? 'Lỗi rồi')
    }
  }
  const renderD = ({day, dayCheckRencent = -1,coin }: {day:number, dayCheckRencent:number,coin:number }) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: day !==6 ? 1 : 1.5 }}>
        <View style={{ backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: 4, flex: 1, width: '90%' }}>
          <TextComponent size={12} font={fontFamilies.semiBold} text={`+${coin}`} />
          <SpaceComponent height={6} />
          { dayCheckRencent >= day ?
          <CricleComponent size={28} color={colors.white} styles={{borderWidth:1.5,borderColor:colors.primary}}>
            <Entypo name="check" size={15}/>
          </CricleComponent>
          : day !== 6 ? <CoinChild /> : <CoinF />}
        </View>
        <View>
          <TextComponent 
          size={10} 
          font={fontFamilies.medium} 
          color={dayCheckRencent >= day ? colors.gray4 : dayCheckRencent + 1 === day ? colors.primary : colors.colorText} 
          text={DateTime.renderTextByDay({day:day,dayCheckRecent:dayCheckRencent,IsDailyCheck:auth.IsDailyCheck})} 
          />
        </View>
      </View>
    )
  }
  
  return (
    <ContainerComponent title="Tài khoản" isScroll bgColor={colors.backgroundBluishWhite}>
      <SectionComponent isNoPaddingBottom>
        <CardComponent styles={[globalStyles.center]} isShadow >
          {auth.accesstoken ? <>
            <RowComponent onPress={() => handleChangeImageAvatar()}>
              <AvatarItem size={90} photoUrl={profile?.photoUrl} isShowIconAbsolute borderWidth={1} colorBorderWidth={colors.gray4} />

            </RowComponent>
            <SpaceComponent height={8} />
            <TextComponent text={profile?.fullname || profile?.email || ''} title size={24} />
            {profile?.phoneNumber && <>
              <TextComponent text={profile.phoneNumber} size={14} color={colors.gray} />
              <SpaceComponent height={8} />
            </>}
            <RowComponent>
              <View style={[globalStyles.center, { flex: 1 }]}>
                <TextComponent text={`${numberOfFollowers}`} size={20} />
                <TextComponent text="Người theo dõi" />
              </View>
              <View style={{ height: '100%', width: 1, backgroundColor: colors.gray2 }} />
              <View style={[globalStyles.center, { flex: 1 }]}>
                <TextComponent text={follower[0]?.users.length !== undefined ? `${follower[0]?.users.length}` : '0'} size={20} />
                <TextComponent text="Đang theo dõi" />
              </View>
            </RowComponent>
            <SpaceComponent height={20} />
            <View >
              <RowComponent justify="center">
                <ButtonComponent text="Cập nhập thông tin"
                  type="primary"
                  onPress={() => navigation.navigate('EditProfileScreen', { profile })}
                  color="white"
                  textColor={colors.primary}

                  styles={{ borderWidth: 1, borderColor: colors.primary, marginBottom: 8 }}
                  icon={<Feather name="edit" size={20} color={colors.primary} />}
                  iconFlex="left"
                />
              </RowComponent>
              {/* <TextComponent text="Thông tin về tôi" title size={18} />
          <TextComponent text={profile?.bio || ''} styles={{minHeight:50}}  /> */}
            </View>
            {(auth.loginMethod === 'google' && auth.isHasPassword === false) && <CardComponent>
              <RowComponent styles={{ alignItems: 'flex-start', paddingRight: 12 }}>
                <AntDesign size={10} name="warning" style={{ marginTop: 4 }} />
                <SpaceComponent width={6} />
                <Text>
                  Tài khoản của bạn chưa có mật khẩu để đăng nhập, vui lòng
                  <Text style={{ color: colors.blue }} onPress={() => navigation.navigate('UpdatePasswordScreen', { type: 'updatePassword' })}> cập nhập tại đây</Text>
                </Text>
              </RowComponent>
            </CardComponent>}
          </> :
            <SectionComponent>
              <SpaceComponent height={16} />
              <ButtonComponent
                onPress={() => navigation.navigate('LoginScreen')}
                mrBottom={0} text="Đăng nhập/Đăng ký"
                type="primary"
                styles={{ borderRadius: 100, paddingVertical: 10 }} textSize={14} />
              <SpaceComponent height={6} />
              <TextComponent text={'Để trả nghiệm toàn bộ tính năng'} size={14} textAlign="center" font={fontFamilies.medium} />
            </SectionComponent>
          }
          {auth.accesstoken && <View style={{ position: 'absolute', top: 20, left: 10 }}>
            <RowComponent>
              <CoinF />
              <SpaceComponent width={4} />
              <TextComponent text={auth.totalCoins} size={22} color={colors.primary} font={fontFamilies.semiBold} />
            </RowComponent>
          </View>}
        </CardComponent>
      </SectionComponent>
     {auth.accesstoken &&  <SectionComponent isNoPaddingBottom>
        <CardComponent isShadow>
          <RowComponent>
            <TextComponent flex={1} text="Điểm danh nhận xu" title size={18} />
          </RowComponent>
          <SpaceComponent height={8} />
          <RowComponent>
            {
              days.map((item)=>renderD({day:item.day,coin:item.coin,dayCheckRencent:auth.lastCheckIn}))
            }
          </RowComponent>
          <SpaceComponent height={12} />
          <ButtonComponent
            disable={auth.IsDailyCheck ? true : false}
            colorDisable={colors.gray8}
            
            text={auth.IsDailyCheck ? `Bạn đã điểm danh rồi` :`Nhận ngay ${auth.lastCheckIn !==6 ? 100 : 500} xu`}
            type="primary"
            mrBottom={6} width={appInfo.sizes.WIDTH * 0.6}
            styles={{ borderRadius: 100,borderWidth:0 }}
            onPress={() => handleCallAPICheckIn()}
          />
        </CardComponent>
      </SectionComponent>}
      {auth.accesstoken && <SectionComponent isNoPaddingBottom>
        <CardComponent isShadow >
          <RowComponent>
            <TextComponent flex={1} text="Các thể loại sự kiện quan tâm" title size={18} />
            <RowComponent onPress={() => setIsOpenModalizeSelectCategory(true)} styles={{ paddingVertical: 6 }}>
              <Feather name="edit" size={16} color={colors.gray} />
              <SpaceComponent width={4} />
              <TextComponent text="Thay đổi" />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={8} />

          {auth?.categoriesInterested && auth?.categoriesInterested.length > 0 ? <DataLoaderComponent data={auth?.categoriesInterested} height={appInfo.sizes.HEIGHT * 0.1} isLoading={isLoadingFollow} children={
            <FlatList
              style={{ paddingHorizontal: 8 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={auth?.categoriesInterested}
              contentContainerStyle={{}}
              renderItem={({ item, index }) => (
                <AvatarItem size={70} styles={{ paddingHorizontal: index !== 0 ? 12 : 0 }} textName={item.category.name} photoUrl={item.category.image} />
              )}
            />
          }
            messageEmpty={'Không có thể loại nào cả'}
          /> :
            <View style={{ paddingVertical: 20 }}>
              <TextComponent textAlign="center" text={'HÃY CHỌN THỂ LOẠI YÊU THÍCH'} />
            </View>
          }
        </CardComponent>
      </SectionComponent>}
      {auth.accesstoken && <SectionComponent isNoPaddingBottom>
        <RowComponent>
          {renderCardHalf({
            title: 'Vé đã mua', icon: <Ticket />, onPress: () => {
              if (checkLogin(auth, navigation)) {
                navigation.navigate('TicketNavigator', {
                  relatedEvents: relatedEvents,
                })
              }
            }
          })}

          <SpaceComponent width={8} />
          {renderCardHalf({
            title: 'Danh sách theo dõi', icon: <UserGroup />, onPress: () => {
              if (checkLogin(auth, navigation)) {
                navigation.push('FriendsScreen', { screen: 'ListFriendsScreen' })
              }
            }
          })}


        </RowComponent>

        <RowComponent>
          {renderCardHalf({
            title: 'Sự kiện đã quan tâm', icon: <Star />, onPress: () => {
              if (checkLogin(auth, navigation)) {
                navigation.navigate('InterestedEventScreen', { bgColor: '' })
              }
            }
          })}


          <SpaceComponent width={8} />

          {renderCardHalf({ title: 'Sự kiện xem gần đây', icon: <BookMark />, onPress: () => navigation.navigate('ViewedEventScreen', { bgColor: '' }) })}


        </RowComponent>
        <RowComponent>
          {renderCardHalf({
            title: 'Đổi mật khẩu', icon: <MaterialCommunityIcons name="security" size={22} color={colors.blue} />, onPress: () => {
              if (checkLogin(auth, navigation)) {
                navigation.navigate('UpdatePasswordScreen', { type: 'changePassword' })
              }
            }
          })}


          <SpaceComponent width={8} />

          {renderCardHalf({
            title: 'Đăng xuất', icon: <Feather name="log-out" size={22} color={colors.orange} />,
            onPress: () => handleLogout()
          })}


        </RowComponent>
      </SectionComponent>}
      {/* <SectionComponent>
        <CardComponent isShadow styles={{ height: appInfo.sizes.HEIGHT * 0.5 }}>
          <TextComponent text={'Hỗ trợ'} size={18} font={fontFamilies.medium} />
        </CardComponent>
      </SectionComponent> */}
      <SpaceComponent height={16} />
      <Modal visible={modalVisible} transparent statusBarTranslucent>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{justifyContent:'center',alignItems:'center',paddingVertical:70,paddingHorizontal:50}}>
              <TextComponent text={'Chúc mừng'} size={36} font={fontFamilies.bold} color={colors.yellow} />
              <View style={{paddingVertical:20}}>
                <CoinFH />
              </View>
              <Text style={{color:colors.white,fontSize:20,fontFamily:fontFamilies.medium}}>
                Bạn đã nhận được{" "}
                <Text style={{color:colors.yellow ,fontFamily:fontFamilies.semiBold}}>
                   100
                </Text>
                {" "}
                xu
              </Text>
              <SpaceComponent height={12}/>
              <CardComponent styles={{borderRadius:100,backgroundColor:'rgba(0,0,0,0.4)',paddingVertical:4,paddingHorizontal:8}} >
                <RowComponent>
                  <CricleComponent size={16} color={colors.gray}>
                    <AntDesign name="exclamation" color={colors.white} size={16} />
                  </CricleComponent>
                  <SpaceComponent width={12}/>
                <Text style={{color:colors.yellow,fontSize:11,fontFamily:fontFamilies.semiBold}}>
                  100 xu = 100 VNĐ{" "}
                  <Text style={{color:colors.white,fontFamily:''}}>
                    có thể dùng để mua vé
                  </Text>
                </Text>
                </RowComponent>
              </CardComponent>
              <TouchableOpacity style={{position:'absolute',top:0,right:0}} onPress={()=>setModalVisible(false)}>
                <MaterialIcons name="cancel" size={46} color={colors.white}/>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* {auth.accesstoken && <ButtonComponent text="Đăng xuất" type="primary" color={colors.gray8} textColor={colors.black} />} */}
      <LoadingModal visible={isLoading} message="Hệ thống đang xử lý" />
      {/* <LoadingModal visible={isLoading} /> */}
      <SelectedImageModal onSelected={(val) => handleChoiceImage(val)} visible={isOpenModalizeChooseImage} onSetVisible={val => setIsOpenModalizeChooseImage(val)} />
      <SelectModalize
        key={"ProfileScreen"}
        adjustToContentHeight
        visible={isOpenModalizeSelectCategory}
        hidenHeader
        data={allCategory}
        onClose={() => setIsOpenModalizeSelectCategory(false)}
        onSearch={(val) => setSearchCategory(val)}
        valueSearch={searchCategory}
        title='Danh sách thể loại'
        styles={{ flexDirection: 'row', flexWrap: 'wrap' }}
        footerComponent={<View style={{
          paddingHorizontal: 10,
          paddingBottom: 10,
        }}>
          <ButtonComponent text="Thay đổi" color="white" styles={{ borderWidth: 1, borderColor: colors.primary }}
            textColor={colors.primary} type="primary" onPress={() => handleCallApiUpdateFollowerCategory()} />
        </View>}
        renderItem={(item: CategoryModel) => <>
          <View style={{ paddingVertical: 4, paddingHorizontal: 4 }} key={item?._id}>
            <TagComponent key={item?._id} onPress={() => handleFollowerCategory(item?._id)} label={item.name}
              bgColor={idsFollowerCategory.some(idCategory => idCategory === item?._id) ? colors.primary : colors.white}
              textColor={idsFollowerCategory.some(idCategory => idCategory === item?._id) ? colors.white : colors.black}
              styles={[globalStyles.shadow, { borderWidth: 1, borderColor: idsFollowerCategory.some(idCategory => idCategory === item?._id) ? colors.primary : colors.gray }]} />

          </View>
        </>
        }
      />

    </ContainerComponent >
  )
}
export default ProfileScreen;