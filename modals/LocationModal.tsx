import { Button, FlatList, Modal, Text, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { ButtonComponent, InputComponent, RowComponent, SpaceComponent, TextComponent } from "../src/components"
import AntDesign from "react-native-vector-icons/AntDesign"
import { colors } from "../src/constrants/color"
import { SearchNormal } from "iconsax-react-native"
import axios from "axios"
import { LocationModel } from "../src/models/LocationModel"

interface Props {
    visible:boolean
    onClose:()=>void
    onSelect:(val:string)=>void
}
const LocationModal = (props:Props)=>{
    const {visible,onClose,onSelect} = props
    const [searchKey,setSearchKey] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [locations,setLocations] = useState<LocationModel>()

    const handleClose = () =>{
      onClose()
    }
    const handleSearchLocation = async ()=>{
      const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=10&lang=vi-VI&apiKey=7Y47aqh1ZSjVIQoK1XfAYpJHWggUcTOmSuxfYq3Dz3M`
      try {
        setIsLoading(true)
        const res = await axios.get(api)
        if(res && res.data && res.status===200){
          setLocations(res.data)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    console.log(locations?.items.length)
  return (
    <Modal visible={visible} animationType="slide" style={{
      flex:1,
    }}>
      <View 
      style={{
        paddingVertical:30,
        paddingHorizontal:20,
        flex:1
      }}>
        <RowComponent justify="flex-end">
          <View style={{
            flex:1
          }}>
            <InputComponent 
            styles={{
              marginBottom:0
            }}
            affix={<SearchNormal size={20} color={colors.gray}/>}
            value={searchKey} 
            placeholder="Tìm kiếm"
            allowClear
            onChange={val => setSearchKey(val)}
            onEnd={handleSearchLocation}
            />
            
          </View>
          <SpaceComponent width={12} />
            {/* <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" color={colors.colorText} size={22}/>
            </TouchableOpacity> */}
            <ButtonComponent text="Hủy" type="link" onPress={handleClose}/>
        </RowComponent>
        <View style={{
          marginTop:20
        }}>
            {
              locations && (
                <FlatList 
                data={locations.items}
                renderItem={({item,index}) => (
                  <TextComponent text={`${item?.address?.city}, ${item?.address?.county}`}/>
                  )}
                />
              )
            }
        </View>
      </View>
    </Modal >
  )
}
export default LocationModal;