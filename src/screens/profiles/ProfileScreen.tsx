import { Button, Text, View } from "react-native"
import React, { useEffect, useMemo, useState } from "react"
import { ButtonComponent, CategoriesList, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../components";
import userAPI from "../../apis/userApi";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../../reduxs/reducers/authReducers";
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
import { FollowerModel } from "../../models/FollowerModel";
import followerAPI from "../../apis/followerAPI";
import { apis } from "../../constrants/apis";

const ProfileScreen = ({ navigation, route }: any) => {
  const auth = useSelector(authSelector)
  const [profile, setProfile] = useState<UserModel>()
  const [isLoading, setIsLoading] = useState(false)
  const [profileId, setProfileId] = useState('')
  const [fileSelected, setFileSelected] = useState<ImageOrVideo>()
  const [isOpenModalizeChooseImage, setIsOpenModalizeChooseImage] = useState(false)
  const [isUpdateImageProfile, setIsUpdateProfile] = useState(false)
  const [isOpenModalizeSelectCategory, setIsOpenModalizeSelectCategory] = useState(false)
  const [allCategory, setAllCategory] = useState<CategoryModel[]>([])
  const [follower, setFollower] = useState<FollowerModel[]>([])
  const [idsFollowerCategory,setIdsFollowerCategory] = useState<string[]>([])
  const [searchCategory, setSearchCategory] = useState('')
  const [numberOfFollowers,setNumberOfFollowers] = useState(0)

  const dispatch = useDispatch()
  useEffect(() => {
    handleCallApiGetProfile(true)
    handleGetAllCategory()
    handleCallApiGetFollowerById()
  }, [])
  useEffect(()=>{
    if(follower){
      const ids:string[] = []
      follower[0]?.categories.map((category)=>{
        ids.push(category._id)
      })
      setIdsFollowerCategory(ids)
    }
  },[follower,isOpenModalizeSelectCategory])
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
        ToastMessaging.Error("Ảnh không hợp lệ")
      }
    }
  }, [isUpdateImageProfile])
  useEffect(() => {
    const handleUpdateProfile = ()=>{
      handleCallApiGetProfile()
    }
    const handleFollowByid = () => {
      handleCallApiGetFollowerById();
      console.log('followers cập nhật');
    };
    socket.on('updateUser',handleUpdateProfile)
    socket.on('followUser',handleFollowByid)
    return () => {
      socket.off('updateUser',handleUpdateProfile)
      socket.off('followUser',handleFollowByid)
    };
  }, [])
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
  const handleCallApiGetFollowerById = async () => {
    const api = apis.follow.getById(auth.id)
    try {
      const res: any = await followerAPI.HandleFollwer(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setFollower(res.data.followers)
        setNumberOfFollowers(res.data.numberOfFollowers)
      }

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("FollowerScreen", errorMessage)

    }
  }
  const handleCallApiGetProfile = async (isLoading?:boolean) => {
    if (auth) {
      setIsLoading(isLoading ? isLoading : false)
      const api = `/get-user-byId?uid=${auth.id}`
      try {
        const res = await userAPI.HandleUser(api)
        if (res && res.data && res.status === 200) {
          setProfile(res.data.user)
        }
        setIsLoading(false)
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("HomeScreen", errorMessage)
        setIsLoading(false)
      }
    }
  }
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

  const handleCallApiUpdateImageProfile = async (profile: UserModel, url?: string) => {
    const api = '/update-profile'
    try {
      const res: any = await userAPI.HandleUser(api, { _id: profile._id, photoUrl: url ? url : profile.photoUrl }, 'put')
      if (res && res.data && res.statusCode === 200) {
        const resStorage = await AsyncStorage.getItem('auth')
        const jsonResStorage = JSON.parse(resStorage || '')
        await AsyncStorage.setItem('auth', JSON.stringify({ ...jsonResStorage, ...res.data.user }))
        dispatch(addAuth({ ...auth, ...res.data.user }))
        socket.emit('updateUser')
        setIsLoading(false)
        setIsUpdateProfile(false)
        ToastMessaging.Success({message:"Cập nhập ảnh đại điện thành công"})
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
  const handleFollowerCategory = (id:string)=>{
    const idsCategory = [...idsFollowerCategory]
    const index = idsFollowerCategory.findIndex(item => item.toString() === id.toString())
    if(index != -1){
      idsCategory.splice(index,1)
      setIdsFollowerCategory(idsCategory)
    }else{
      idsCategory.push(id)
      setIdsFollowerCategory(idsCategory)

    }
  }
  const handleCallApiUpdateFollowerCategory = async()=>{
    const api = '/update-follower-category'
    setIsLoading(true)
    try {
      const res:any = await followerAPI.HandleFollwer(api,{idUser:auth.id,idsCategory:idsFollowerCategory},'put')
      if(res && res.data && res.status===200){
        handleCallApiGetFollowerById()
      }
      setIsLoading(false)
      setIsOpenModalizeSelectCategory(false)
    } catch (error:any) {
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
  console.log(follower[0]?.users[0]?.idUser)
  return (
    <ContainerComponent title="Hồ sơ người dùng">
      <SectionComponent styles={[globalStyles.center]}>
        <RowComponent onPress={() => handleChangeImageAvatar()}>
          <AvatarItem size={80} photoUrl={profile?.photoUrl} notBorderWidth />
          <CricleComponent styles={{ position: 'absolute', bottom: 0, right: 0, borderWidth: 1, borderColor: colors.white }} size={24} color={colors.gray5}>
            <MaterialIcons name="add-a-photo" size={16} color={colors.gray} />
          </CricleComponent>
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
          <View style={{height:'100%', width:1,backgroundColor:colors.gray2}}/>
          <View style={[globalStyles.center, { flex: 1 }]}>
          <TextComponent text={follower[0]?.users.length !== undefined ? `${follower[0]?.users.filter((item)=>item.status===true).length}` : '0'} size={20} />
            <TextComponent text="Đang theo dõi" />
          </View>
        </RowComponent>
      </SectionComponent>
      <SectionComponent>
        <View >
          <RowComponent justify="center">
            <ButtonComponent text="Cập nhập thông tin"
              type="primary"
              onPress={() => navigation.navigate('EditProfileScreen', { profile })}
              color="white"
              textColor={colors.primary}
              styles={{ borderWidth: 1, borderColor: colors.primary}}
              icon={<Feather name="edit" size={20} color={colors.primary} />}
              iconFlex="left"
            />
          </RowComponent>
          <TextComponent text="Thông tin về tôi" title size={18} />
          <TextComponent text={profile?.bio || ''} />
        </View>
        <SpaceComponent height={20} />

        <View>
          <RowComponent>
            <TextComponent flex={1} text="Các thể loại sự kiện yêu thích" title size={18} />
            <RowComponent onPress={() => setIsOpenModalizeSelectCategory(true)} styles={{paddingVertical:6}}>
              <Feather name="edit" size={16} color={colors.gray} />
              <SpaceComponent width={4} />
              <TextComponent text="Thay đổi" />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={8}/>
          <RowComponent styles={{
            flexWrap: 'wrap', justifyContent: 'flex-start'
          }}>
            {
              
              follower[0]?.categories ? follower[0]?.categories.map((category)=><View key={category._id} style={{paddingBottom:4,paddingHorizontal:2}}><TagComponent key={category._id} label={category.name} 
              bgColor={colors.primary} 
              textColor={colors.white} 
              styles={[globalStyles.shadow,{borderWidth:1,borderColor:colors.primary}]} />
              </View>) : ''
            }              
          </RowComponent>
        </View>
      </SectionComponent>
      <LoadingModal visible={isLoading} />
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
        styles={{ flexDirection: 'row',flexWrap:'wrap' }}
        footerComponent={<View  style={{
          paddingHorizontal: 10,
          paddingBottom: 10,
        }}>
          <ButtonComponent text="Thay đổi" color="white" styles={{ borderWidth: 1, borderColor: colors.primary }}
            textColor={colors.primary} type="primary" onPress={() => handleCallApiUpdateFollowerCategory()} />
        </View>}
        renderItem={(item: CategoryModel) => <>
          <View style={{paddingVertical:4,paddingHorizontal:4}} key={item._id}>
            <TagComponent key={item._id} onPress={()=>handleFollowerCategory(item._id)} label={item.name} 
            bgColor={idsFollowerCategory.some(idCategory => idCategory === item._id) ? colors.primary : colors.white}
            textColor={idsFollowerCategory.some(idCategory => idCategory === item._id) ? colors.white : colors.black} 
            styles={[globalStyles.shadow,{borderWidth:1,borderColor:idsFollowerCategory.some(idCategory => idCategory === item._id) ? colors.primary : colors.gray}]} />

          </View>
        </>
        }
      />
    </ContainerComponent >
  )
}
export default ProfileScreen;