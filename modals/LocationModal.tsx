import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { ButtonComponent, InputComponent, RowComponent, SpaceComponent, TextComponent } from "../src/components"
import AntDesign from "react-native-vector-icons/AntDesign"
import { colors } from "../src/constrants/color"
import { ArrowLeft, SearchNormal } from "iconsax-react-native"
import axios from "axios"
import { Address, LocationModel } from "../src/models/LocationModel"
import { fontFamilies } from "../src/constrants/fontFamilies"
import SearchComponent from "../src/components/SearchComponent"
import { BackHandler } from 'react-native';

interface Props {
    visible:boolean
    onClose:()=>void
    onSelect:(val:Address)=>void,
    onConfirm:()=>void
}
const LocationModal = (props:Props)=>{
    const {visible,onClose,onSelect,onConfirm} = props
    const [searchKey,setSearchKey] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [locations,setLocations] = useState<LocationModel>()
    const handleClose = () =>{
      onClose()
    }
    const handleSearchLocation = async ()=>{
      const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=20&lang=vi-VI&in=countryCode:VNM&apiKey=${process.env.API_KEY_AUTOCOMPLE}`
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
    const handleSelectedLocation = (address:Address)=>{
      onSelect(address)
      onConfirm()
    }
    const handleRenderLocationSearch = (address:Address)=>{
      return <RowComponent
      onPress={()=>handleSelectedLocation(address)}
       key={address.label} styles={[
          localStyles.listItem,
          {
              paddingVertical:10,
              borderBottomWidth:1,
              borderBlockColor:colors.gray6,
              paddingHorizontal:10,
          }
      ]}
      >
         
          <SpaceComponent width={8}/>
         <View style={{
          flex:1,

         }}>
              <TextComponent 
              color={colors.colorText} 
              text={address.label} 
              flex={1} 
              font={fontFamilies.regular}
                  styles={{
                      textAlignVertical:'center'
                  }}
               />
         </View>
      </RowComponent>
    }
  return (
    <Modal visible={visible} animationType="slide" style={{
      flex:1,
    }}>
      <View 
      style={{
        paddingVertical:30,
        flex:1
      }}>
        <View style={{
          paddingHorizontal:10
        }}>
        {/* <RowComponent justify="flex-end">
          <ArrowLeft color={colors.gray}  onPress={() => handleClose()} />
                          <SpaceComponent width={6} />
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
              />
              
            </View>
           
        </RowComponent> */}
        <SearchComponent value={searchKey} onPressArrow={()=>handleClose()} onSearch={(val)=> setSearchKey(val)}/>
        </View>
        <View style={{
          marginTop:20
        }}>
            {
              locations && (
                <FlatList 
                showsVerticalScrollIndicator={false}
                data={locations.items}
                renderItem={({item,index}) => handleRenderLocationSearch(item.address)}
                />
              )
            }
        </View>
      </View>
      <ButtonComponent text="Tìm kiếm" type="primary" onPress={handleSearchLocation}/>
    </Modal >
  )
}
export default LocationModal;
const localStyles = StyleSheet.create({
    
  avartar:{
    width:30,
    height:30,
    borderRadius:100,
    justifyContent:'center',alignItems:'center'

  },
  listItem:{
    paddingVertical:12
  },
  listItemText:{
    paddingLeft:12
  }
})