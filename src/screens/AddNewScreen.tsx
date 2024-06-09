import { Button, ScrollView, Text, View } from "react-native"
import React, { useState } from "react"
import { ChoiceLocationComponent, ContainerComponent, DateTimePickerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../components"
import { useSelector } from "react-redux"
import { authSelector } from "../reduxs/reducers/authReducers"
const initValues = {
  title:'',
  description:'',
  location:{
    title:'',
    address:''
  },
  imageUrl:'',
  price:0,
  users:[''],
  authorId:'',
  startAt:Date.now(),
  endAt:Date.now(),
  date:Date.now()
}
const AddNewScreen = ()=>{
  const auth = useSelector(authSelector)
  const [eventData,setEventData] = useState<any>({...initValues,authorId:auth?.id})
  const handleOnchageValue = (key:string, value:string | Date) => {
    const item:any = {...eventData}
    item[`${key}`] = value
    setEventData(item)
  }
  console.log("eventData",eventData)
  const handleAddEvent = async ()=>{
    
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
        
        <ChoiceLocationComponent />
      </SectionComponent>
    </ContainerComponent>
  )
}
export default AddNewScreen;