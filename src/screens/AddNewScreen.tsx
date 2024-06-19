import { Button, Image, ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ChoiceLocationComponent, ContainerComponent, DateTimePickerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent, UploadImagePicker } from "../components"
import { useSelector } from "react-redux"
import { authSelector } from "../reduxs/reducers/authReducers"
import userAPI from "../apis/userApi"
import DropdownPicker from "../components/DropdownPicker"
import { SelectModel } from "../models/SelectModel"
import { ImageOrVideo } from "react-native-image-crop-picker"
import DropdownPickerSelect from "../components/DropdownPickerSelect"
import { CategoryModel } from "../models/CategoryModel"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Food, FoodWhite } from "../assets/svgs"
import { Address } from "../models/LocationModel"
import storage from  "@react-native-firebase/storage"
import axios from "axios"
import eventAPI from "../apis/eventAPI"
import { LoadingModal } from "../../modals"
import socket from "../utils/socket"
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
  category:'',
  authorId:'',
  startAt:Date.now(),
  endAt:Date.now(),
  date:Date.now()
}
const AddNewScreen = ()=>{
  const auth = useSelector(authSelector)
  const [eventData,setEventData] = useState<any>({...initValues,authorId:auth?.id})
  const [allUser,setAllUser] = useState<SelectModel[]>([])
  const [fileSelected,setFileSelected] = useState<ImageOrVideo>()
  const [isLoading,setIsLoading] = useState(false)
  const categories:CategoryModel[] = [
    {
        key:'sports',
        label:'Thể thao',
        color:'#F0635A'
    },
    {
        key:'666ad89ad08fd9c8bec5bd61',
        label:'Âm nhạc',
        icon:<MaterialIcons name="library-music" color={'white' } size={20}/>,
        color:'#f59762'
    },
    {
        key:'food',
        label:'Ẩm thực',
        icon:<FoodWhite color={'white' }/>,
        color:'#29d697'
    },
    {
        key:'art',
        label:'Vân hóa và Nghệ thuật',
        icon:<Ionicons name="color-palette-outline" color={'white' } size={20}/>,
        color:'#46CDFB'
    },
    
]
  useEffect(()=>{
    handleGetAllUsers()
  },[])

  useEffect(()=>{//call api get lat and long
    const api = `https://geocode.search.hereapi.com/v1/geocode?q=${eventData.Address}&limit=20&lang=vi-VI&in=countryCode:VNM&apiKey=${process.env.API_KEY_REVGEOCODE}`
    handleCallApiGetLatAndLong(api)
  },[eventData.Address])
  const handleCallApiGetLatAndLong = async (api:string)=>{
    try {
      const res = await axios(api)
      if(res && res.data && res.status === 200){
        handleOnchangePosition('position',res.data.items[0].position)
      }else{
        console.log("vị trí chọn không hợp lệ")
      }
    } catch (error:any) {
      console.log(error)
    }
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
    const api = '/get-all'
    try {
      const res:any = await userAPI.HandleUser(api, {}, 'get');
      if(res && res.data){
        const items:SelectModel[] = []
        res.data.users.forEach((item:any)=>{
          items.push(
          {
            name:item.fullname,
            email:item.email,
            value:item._id,
            photoUrl:item?.photoUrl
          })
        })
        setAllUser(items)
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
  const handleChoiceImage = (val:any)=>{
    setFileSelected(undefined)
    val.type === 'url' ? handleOnchageValue('photoUrl',val.value) : handleFileSelected(val.value)
  }
  const handleOnSelectLocation = (val:Address)=>{
    handleOnchangeAddressDetails('addressDetals',val)
    handleOnchageValue('Address',val?.label) 

  }
  return (
    <ContainerComponent isScroll title="Thêm sự kiện">
      <SectionComponent>
        
        <InputComponent  value={eventData.title} title="Tiêu đề" allowClear onChange={val => handleOnchageValue('title',val)}/>

        <DropdownPickerSelect 
        title="Thể loại" 
        values={categories} 
        selected={eventData.category} 
        onSelect={val => handleOnchageValue('category',val)}
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

        
        <DateTimePickerComponent title="Ngày diễn ra" selected={eventData.date} 
          type="date" 
          onSelect={(val) => handleOnchageValue('date',val)}
          />
          
        <RowComponent>
          <DateTimePickerComponent minimumDate={eventData.date}  title="Thời gian bắt đầu" selected={eventData.startAt} 
          type="datetime" 
          onSelect={(val) => handleOnchageValue('startAt',val)}
          />
          <SpaceComponent width={20}/>
          <DateTimePickerComponent minimumDate={eventData.date}  title="Thời gian kết thúc" selected={eventData.endAt} 
          type="datetime" 
          onSelect={(val) => handleOnchageValue('endAt',val)}
          />
        </RowComponent>
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
        <ChoiceLocationComponent title="Vị trí" value={eventData.Address} onSelect={(val:Address) => handleOnSelectLocation(val)}/>

        <TextComponent text="Hình ảnh"/>
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
export default AddNewScreen;