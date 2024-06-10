import { Button, ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ChoiceLocationComponent, ContainerComponent, DateTimePickerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../components"
import { useSelector } from "react-redux"
import { authSelector } from "../reduxs/reducers/authReducers"
import userAPI from "../apis/userApi"
import DropdownPicker from "../components/DropdownPicker"
import { SelectModel } from "../models/SelectModel"
const initValues = {
  title:'',
  description:'',
  location:{
    title:'',
    address:''
  },
  imageUrl:'',
  price:0,
  users:[],
  authorId:'',
  startAt:Date.now(),
  endAt:Date.now(),
  date:Date.now()
}
const AddNewScreen = ()=>{
  const auth = useSelector(authSelector)
  const [eventData,setEventData] = useState<any>({...initValues,authorId:auth?.id})
  const [allUser,setAllUser] = useState<SelectModel[]>([])
  useEffect(()=>{
    handleGetAllUsers()
  },[])
  const handleOnchageValue = (key:string, value:string | Date | string[]) => {
    const item:any = {...eventData}
    item[`${key}`] = value
    setEventData(item)
  }
  console.log("eventData",eventData)
  const handleAddEvent = async ()=>{
   

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
  return (
    <ContainerComponent isScroll title="Thêm sự kiện">
      <SectionComponent>
        <InputComponent  value={eventData.title} title="Tiêu đề" allowClear onChange={val => handleOnchageValue('title',val)}/>

        <InputComponent  
        allowClear
        value={eventData.description} 
        title="Mô tả" 
        multiline
        numberOfLines={5}
        onChange={val => handleOnchageValue('description',val)}
        />
        <DateTimePickerComponent title="Ngày diễn ra" selected={eventData.date} 
          type="date" 
          onSelect={(val) => handleOnchageValue('date',val)}
          />
          
        <RowComponent>
          <DateTimePickerComponent title="Thời gian bắt đầu" selected={eventData.startAt} 
          type="time" 
          onSelect={(val) => handleOnchageValue('startAt',val)}
          />
          <SpaceComponent width={20}/>
          <DateTimePickerComponent title="Thời gian kết thúc" selected={eventData.endAt} 
          type="time" 
          onSelect={(val) => handleOnchageValue('endAt',val)}
          />
        </RowComponent>
        <DropdownPicker  label="Mời tham gia" values={allUser} 
        selected={eventData.users} 
        multibale
        onSelected={(val:string | string[]) => handleOnchageValue('users',val)}
        />
        <ChoiceLocationComponent />
      </SectionComponent>
      <ButtonComponent text="Thêm"  type="primary" onPress={handleAddEvent}/>
    </ContainerComponent>
  )
}
export default AddNewScreen;