import { Button, Image, ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ChoiceLocationComponent, ContainerComponent, DateTimePickerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent, UploadImagePicker } from "../components"
import { useSelector } from "react-redux"
import { authSelector } from "../reduxs/reducers/authReducers"
import userAPI from "../apis/userApi"
import DropdownPicker from "../components/DropdownPicker"
import { ImageOrVideo } from "react-native-image-crop-picker"
import DropdownPickerSelect from "../components/DropdownPickerSelect"
import { CategoryModel } from "../models/CategoryModel"
import { Address } from "../models/LocationModel"
import storage from  "@react-native-firebase/storage"
import axios from "axios"
import eventAPI from "../apis/eventAPI"
import { LoadingModal } from "../../modals"
import socket from "../utils/socket"
import categoryAPI from "../apis/categoryAPI"
import { UserModel } from "../models/UserModel"
import { ToastMessaging } from "../utils/showToast"
import { useStatusBar } from "../hooks/useStatusBar"
import { apis } from "../constrants/apis"
const initValues = {
  title:'',
  description:'',
  Address:'',
  addressDetals:{
    city: '',
    county: '',
    district: '',
    houseNumber: '',
    postalCode: '',
    street: '',
  },
  Location:'',
  position:{
    lat:'',
    lng:''
  },
  photoUrl:'',
  price:'',
  users:[],
  categories:[],
  authorId:'',
  startAt:Date.now(),
  endAt:Date.now(),
}
const AddNewEvent = ()=>{
  const auth = useSelector(authSelector)
  const [eventData,setEventData] = useState<any>({...initValues,authorId:auth?.id})
  const [allUser,setAllUser] = useState<UserModel[]>([])
  const [fileSelected,setFileSelected] = useState<ImageOrVideo>()
  const [isLoading,setIsLoading] = useState(false)
  const [allCategory,setAllCategory] = useState<CategoryModel[]>([])
  useEffect(()=>{
    handleGetAllUsers()
    handleGetAllCategory()
  },[])
  useStatusBar('dark-content')
  useEffect(()=>{//call api get lat and long
    const api = `https://geocode.search.hereapi.com/v1/geocode?q=${eventData.Address}&limit=20&lang=vi-VI&in=countryCode:VNM&apiKey=${process.env.API_KEY_REVGEOCODE}`
    handleCallApiGetLatAndLong(api)
    },[eventData.Address])
  const handleCallApiGetLatAndLong = async (api:string)=>{
    try {
      const res = await axios(api)
      if(res && res.data.items.length > 0 && res.status === 200){
        const address = res.data.items[0].address
        if(address.street && address.district && address.city){
          handleOnchangePosition('position',res.data.items[0].position)
          handleOnchangeAddressDetails('addressDetals',address)
        }else{
          ToastMessaging.Error({message:'Hãy nhập đầy đủ thông tin địa chỉ sự kiện (tên đường,xã,huyện,tỉnh,....)'})
          handleOnchageValue('Address','') 
        }
      }else{
        console.log("vị trí chọn không hợp lệ")
        ToastMessaging.Error({message:'vị trí nhập không hợp lệ vui lòng nhập lại'})
        handleOnchageValue('Address','') 
      }
    } catch (error:any) {
      console.log(error)
    }
  }
  const handleOnSelectLocation = (val:string)=>{
    // handleOnchangeAddressDetails('addressDetals',val)
    handleOnchageValue('Address',val) 
  }
  const handleOnchageValue = (key:string, value:string | Date | string[] | number) => {
    const item:any = {...eventData}
    item[`${key}`] = value
    setEventData(item)
  }
  const handleOnchangeAddressDetails = (key:string,value:any)=>{
    const item:any = {...eventData}
    Object.keys(eventData.addressDetals).forEach((keyChild)=> {
      item[`${key}`][`${keyChild}`] = value[`${keyChild}`]
    })
    setEventData(item)
  }
  const handleOnchangePosition = (key:string,value:any) =>{
    const item:any = {...eventData}
    Object.keys(eventData.position).forEach((keyChild)=> {
      item[`${key}`][`${keyChild}`] = value[`${keyChild}`]
    })
    setEventData(item)
  }
  const handleGetAllCategory = async ()=>{
    const api = apis.category.getAll()
    try {
      const res = await categoryAPI.HandleCategory(api)
      if(res && res.data && res.status===200){
        setAllCategory(res.data as CategoryModel[])
      }
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      if(errorMessage.statusCode === 403){
        console.log(errorMessage.message)
      }else{
        console.log('Lỗi rồi')
      }
    }
  }
  const handleAddEvent = async ()=>{
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
          handleCallAPIAddEvent(eventData,url)
        })
      }
    )
    }
    else{
      handleCallAPIAddEvent(eventData)
    }

  }
  const handleCallAPIAddEvent = async (eventData:any,url?:string)=>{
    const api = '/add-event'
    try {
      const res = await eventAPI.HandleEvent(api,{...eventData,photoUrl:url ? url : eventData.photoUrl},'post')
      if(res?.status===200)
      {
        setEventData({...initValues,authorId:auth?.id})
        socket.emit('events')
        ToastMessaging.Success({message:"Thêm sự kiện thành công"})

      }
      setIsLoading(false)
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
    const handleGetAllUsers = async () => {
    const api = apis.user.getAll()
    try {
      const res:any = await userAPI.HandleUser(api, {}, 'get');
      if(res && res.data){
        setAllUser(res.data)
      }
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      console.log(errorMessage)
    }
  }
  const handleFileSelected = (val:ImageOrVideo) =>
  {
    setFileSelected(val)
    handleOnchageValue('photoUrl',val.path)
  }
  const   handleChoiceImage = (val:any)=>{
    setFileSelected(undefined)
    val.type === 'url' ? handleOnchageValue('photoUrl',val.value) : handleFileSelected(val.value)
  }
  return (
    <ContainerComponent isScroll title="Thêm sự kiện">
      <SectionComponent>
        
        <InputComponent  value={eventData.title} title="Tiêu đề" allowClear onChange={val => handleOnchageValue('title',val)}/>

        <DropdownPickerSelect 
        title="Thể loại" 
        values={allCategory} 
        selected={eventData.categories} 
        onSelect={val => handleOnchageValue('categories',val)}
        />

        <InputComponent  
        allowClear
        value={eventData.description} 
        title="Mô tả" 
        multiline
        numberOfLines={5}
        onChange={val => handleOnchageValue('description',val)}
        />

        <InputComponent  
        value={eventData.price} 
        title="Giá" 
        allowClear
        type="number-pad"
        onChange={val => handleOnchageValue('price',val)}

        />

        
      {/* <DateTimePickerComponent title="Ngày diễn ra" selected={eventData.date} 
          type="date" 
          onSelect={(val) => handleOnchageValue('date',val)}
          /> */}
          
          <DateTimePickerComponent  title="Thời gian bắt đầu" selected={eventData.startAt} 
          type="datetime" 
          onSelect={(val) => handleOnchageValue('startAt',val)}
          />
          <SpaceComponent width={20}/>
          <DateTimePickerComponent  title="Thời gian kết thúc" selected={eventData.endAt} 
          type="datetime" 
          onSelect={(val) => handleOnchageValue('endAt',val)}
          />
        <DropdownPicker label="Mời tham gia" values={allUser} 
        selected={eventData.users} 
        multibale
        onSelected={(val:string | string[]) => handleOnchageValue('users',val)}
        />
        <InputComponent  
        allowClear
        value={eventData.Location} 
        title="Địa điểm tổ chức" 
        onChange={val => handleOnchageValue('Location',val)}
        />
        <ChoiceLocationComponent title="Vị trí" value={eventData.Address} onSelect={(val:string) => handleOnSelectLocation(val)}/>

        <TextComponent text="Hình ảnh" title size={14}/>
        <SpaceComponent height={8}/>
        {eventData.photoUrl ? <Image style={{ 
          width:'100%',
          height:250,
          resizeMode:'contain',
          marginBottom:12
        }} source={{uri:eventData.photoUrl ? eventData.photoUrl : fileSelected?.path}}/> : <></>}
        <UploadImagePicker onSelected={val => handleChoiceImage(val)} seleted={eventData?.photoUrl}/>

      </SectionComponent>
     <SectionComponent>
     <ButtonComponent text="Thêm"  type="primary" onPress={handleAddEvent} />
     </SectionComponent>
     <LoadingModal visible={isLoading}/>
    </ContainerComponent>
  )
}
export default AddNewEvent;