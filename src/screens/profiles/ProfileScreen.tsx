import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TagComponent, TextComponent } from "../../components";
import userAPI from "../../apis/userApi";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../../reduxs/reducers/authReducers";
import { UserModel } from "../../models/UserModel";
import { LoadingModal, SelectedImageModal } from "../../../modals";
import AvatarItem from "../../components/AvatarItem";
import { globalStyles } from "../../styles/globalStyles";
import { ImageOrVideo } from "react-native-image-crop-picker";
import { colors } from "../../constrants/color";
import Feather from 'react-native-vector-icons/Feather'
import socket from "../../utils/socket";
import MaterialIcons  from "react-native-vector-icons/MaterialIcons"
import storage from  "@react-native-firebase/storage"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastMessaging } from "../../utils/showToast";

const ProfileScreen = ({ navigation, route }: any) => {
  const auth = useSelector(authSelector)
  const [profile, setProfile] = useState<UserModel>()
  const [isLoading, setIsLoading] = useState(false)
  const [profileId, setProfileId] = useState('')
  const [fileSelected, setFileSelected] = useState<ImageOrVideo>()
  const [isOpenModalizeChooseImage,setIsOpenModalizeChooseImage] = useState(false)
  const [isUpdateImageProfile,setIsUpdateProfile] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    handleCallApiGetProfile()
  }, [])
  useEffect(()=>{
   if(isUpdateImageProfile){
    if(profile?.photoUrl){
      setIsLoading(true)
      if(fileSelected){
        const fileName = `${fileSelected.filename ?? `image-${Date.now()}`}.${fileSelected.path.split('.')[1]}`
        const path = `/images/${fileName}`
        const res = storage().ref(path).putFile(fileSelected.path)
  
        res.on('state_changed', snap=>{
          console.log(snap)
        },error=> console.log(error),
        ()=>//khi thành công
        {
          storage().ref(path).getDownloadURL().then(url => {
            handleCallApiUpdateImageProfile(profile,url)
          })
        }
      )
      }
      else{
        handleCallApiUpdateImageProfile(profile)
      }
    }else{
      ToastMessaging.Error("Ảnh không hợp lệ")
    }
   }
  },[isUpdateImageProfile])
  useEffect(()=>{
    socket.on('updateUser', data => {
      console.log('updateUser chạy lại')
      handleCallApiGetProfile()
    })
    return () => {
      socket.disconnect();
    };
  },[])
  
  const handleCallApiGetProfile = async () => {
    if (auth) {
      setIsLoading(true)
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
  const handleOnchageValue = (key:string, value:string | Date | string[] | number) => {
    const item:any = {...profile}
    item[`${key}`] = value
    setProfile(item)
  }
  const handleFileSelected =  (val:ImageOrVideo) =>
    {
      setFileSelected(val)
      handleOnchageValue('photoUrl',val.path)
    }
const handleChoiceImage =(val:any)=>{
    setFileSelected(undefined)
    val.type === 'url' ?  handleOnchageValue('photoUrl',val.value) :  handleFileSelected(val.value)
    setIsUpdateProfile(true)
}

const handleCallApiUpdateImageProfile = async(profile:UserModel,url?:string)=>{
  const api = '/update-profile'
  try {
      const res:any = await userAPI.HandleUser(api,{_id:profile._id,photoUrl:url ? url : profile.photoUrl},'put')
      console.log("res",res)
      if(res && res.data && res.statusCode===200){
          const resStorage = await AsyncStorage.getItem('auth')
          const jsonResStorage = JSON.parse(resStorage || '')
          await AsyncStorage.setItem('auth',JSON.stringify({...jsonResStorage,...res.data.user}))
          dispatch(addAuth({...auth,...res.data.user}))
          socket.emit('updateUser')
          setIsLoading(false)
          setIsUpdateProfile(false)
          ToastMessaging.Success("Cập nhập ảnh đại điện thành công")
      }
  } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      if(errorMessage.statusCode === 403){
          console.log(errorMessage.message)
      }else{
          console.log('Lỗi rồi')
      }
      setIsLoading(false)
      setIsUpdateProfile(false)
  }
}
  return (
    <ContainerComponent title="Hồ sơ người dùng">
      <SectionComponent styles={[globalStyles.center]}>
        <RowComponent onPress={() => handleChangeImageAvatar()}>
          <AvatarItem size={80} photoUrl={profile?.photoUrl} notBorderWidth />
          <CricleComponent styles={{position:'absolute',bottom:0,right:0,borderWidth:1,borderColor:colors.white}} size={24} color={colors.gray5}>
              <MaterialIcons name="add-a-photo" size={16} color={colors.gray}/>
          </CricleComponent>
        </RowComponent>
        <SpaceComponent height={8} />
        <TextComponent text={profile?.fullname || profile?.email || ''} title size={24} />
        <SpaceComponent height={8} />
        <RowComponent>
          <View style={[globalStyles.center, { flex: 1 }]}>
            <TextComponent text="0" size={20} />
            <TextComponent text="Người theo dõi" />
          </View>
          <View style={[globalStyles.center, { flex: 1 }]}>
            <TextComponent text="330" size={20} />
            <TextComponent text="Theo dõi" />
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
            styles={{borderWidth:1,borderColor:colors.primary}}
            icon={<Feather name="edit" size={20} color={colors.primary}/>}
            iconFlex="left"
            />
          </RowComponent>
          <TextComponent text="Thông tin về tôi" title size={18} />
          <TextComponent text={profile?.bio || ''} />
        </View>
        <SpaceComponent height={20} />

        <View>
          <RowComponent>
            <TextComponent flex={1} text="Các sự kiện quan tâm" title size={18} />
            <ButtonComponent text="Thay đổi" />
          </RowComponent>
          <RowComponent styles={{
            flexWrap: 'wrap', justifyContent: 'flex-start'
          }}>
            <TagComponent label="Âm nhạc" bgColor="green" onPress={() => { }} styles={{ marginRight: 8, marginBottom: 12 }} />
          </RowComponent>
        </View>
      </SectionComponent>
      <LoadingModal visible={isLoading} />
      <SelectedImageModal onSelected={(val)=>handleChoiceImage(val)} visible={isOpenModalizeChooseImage} onSetVisible={val => setIsOpenModalizeChooseImage(val)} />
    </ContainerComponent >
  )
}
export default ProfileScreen;