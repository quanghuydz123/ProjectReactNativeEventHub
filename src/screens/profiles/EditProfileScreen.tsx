import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { UserModel } from "../../models/UserModel"
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, TextComponent } from "../../components"
import userAPI from "../../apis/userApi"
import { LoadingModal } from "../../../modals"
import { useDispatch, useSelector } from "react-redux"
import { addAuth, authSelector } from "../../reduxs/reducers/authReducers"
import socket from "../../utils/socket"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ImageOrVideo } from "react-native-image-crop-picker"
import { ToastMessaging } from "../../utils/showToast"
import { apis } from "../../constrants/apis"

const EditProfileScreen = ({navigation,route}:any)=>{
    const {profile}:{profile:UserModel} = route.params
    const [profileData,setProfileData] = useState<UserModel>(profile)
    const [isLoading,setIsLoading] = useState(false)
    const auth= useSelector(authSelector)
    const dispatch = useDispatch()
    const [fileSelected,setFileSelected] = useState<ImageOrVideo>()
    const handleOnchageValue = (key:string, value:string | Date | string[] | number) => {
      const item:any = {...profileData}
      item[`${key}`] = value
      setProfileData(item)
    }
    const handleUpdateProfile = async ()=>{
        const api = apis.user.updateProfile()
        setIsLoading(true)
        try {
            const { photoUrl, ...profileDataWithoutPhotoUrl } = profileData;
            const res:any = await userAPI.HandleUser(api,{...profileDataWithoutPhotoUrl},'put')
            if(res && res.data && res.statusCode===200){
                const resStorage = await AsyncStorage.getItem('auth')
                const jsonResStorage = JSON.parse(resStorage || '')
                await AsyncStorage.setItem('auth',JSON.stringify({...jsonResStorage,...res.data.user}))
                dispatch(addAuth({...auth,...res.data.user}))
                socket.emit('updateUser')
                ToastMessaging.Success({})
                setIsLoading(false)
            }
        } catch (error:any) {
            const errorMessage = JSON.parse(error.message)
            if(errorMessage.statusCode === 403){
                console.log(errorMessage.message)
            }else{
                console.log('Lỗi rồi')
            }
            setIsLoading(false)
        }
    }
    const handleFileSelected = (val:ImageOrVideo) =>
        {
          setFileSelected(val)
          handleOnchageValue('photoUrl',val.path)
        }
    const handleChoiceImage = (val:any)=>{
        setFileSelected(undefined)
        val.type === 'url' ? handleOnchageValue('photoUrl',val.value) : handleFileSelected(val.value)
    }
  return (
    <ContainerComponent isScroll back title="Cập nhập thông tin">
        <SectionComponent>
            <InputComponent 
            
            value={profileData.fullname} 
            onChange={(val)=>handleOnchageValue('fullname',val)} 
            title="Họ tên"
            allowClear
            />
            <InputComponent 
            value={profileData.phoneNumber || ''} 
            onChange={(val)=>handleOnchageValue('phoneNumber',val)} 
            title="Số điện thoại"
            type="number-pad"
            allowClear
            />
            <InputComponent 
            value={profileData.bio || ''} 
            onChange={(val)=>handleOnchageValue('bio',val)} 
            title="Giới thiệu bản thân"
            numberOfLines={5}
            multiline
            allowClear
            />
            {/* <InputComponent 
            value={profileData.bio || ''} 
            onChange={(val)=>handleOnchageValue('bio',val)} 
            title="Địa chỉ hiện tại"
            numberOfLines={2}
            multiline
            allowClear
            /> */}
            <ButtonComponent  text="Cập nhập" onPress={()=>handleUpdateProfile()} type="primary"/>
        </SectionComponent>
        <LoadingModal visible={isLoading}/>
        
    </ContainerComponent>
  )
}
export default EditProfileScreen;