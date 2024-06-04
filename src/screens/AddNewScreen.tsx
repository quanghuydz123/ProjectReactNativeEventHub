import { Button, Text, View } from "react-native"
import React from "react"
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
  return (
    <View>
      <Text>AddNewScreen</Text>
    </View>
  )
}
export default AddNewScreen;