import { Button, Modal, Text, TouchableOpacity, View } from "react-native"
import React, { ReactNode, useRef, useState } from "react"
import ButtonComponent from "./ButtonComponent";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import TextComponent from "./TextComponent";
import { Camera, CloseCircle, Image, Link } from "iconsax-react-native";
import { colors } from "../constrants/color";
import RowComponent from "./RowComponent";
import SpaceComponent from "./SpaceComponent";
import { fontFamilies } from "../constrants/fontFamilies";
import ImageCropPicker from "react-native-image-crop-picker";
import { globalStyles } from "../styles/globalStyles";
import InputComponent from "./InputComponent";
import Ionicons from "react-native-vector-icons/Ionicons"
interface Props {
  onSelected:(val:{
    type:'url' | 'file',
    value:any
  }) => void,
  seleted:string

}
const UploadImagePicker = (props: Props) => {
  const {onSelected,seleted} = props
  const modalizeRef = useRef<Modalize>()
  const [imageUrl, setImageUrl] = useState('')
  const [isVisibleModalAddUrl, setIsVisibleModalAddUrl] = useState(false)
  const choiceMethodImage = [
    {
      key: 'camera',
      title: 'Chụp hình',
      icon: <Camera size={22} color={colors.gray} />
    },
    {
      key: 'library',
      title: 'Lấy trong thư viện',
      icon: <Image size={22} color={colors.gray} />
    },
    {
      key: 'link',
      title: 'Lấy link',
      icon: <Link size={22} color={colors.gray} />
    }
  ]
  const renderItem = (item: { key: string, title: string, icon: ReactNode }) => {
    return (
      <RowComponent key={item.key} styles={{
        marginBottom: 10,
        paddingVertical: 6,
      }} onPress={() => handleChoiceMethodImage(item.key)}>
        {item.icon}
        <SpaceComponent width={12} />
        <TextComponent text={item.title} font={fontFamilies.medium} />
      </RowComponent>
    )
  }
  const handleChoiceMethodImage = (key: string) => {
    switch (key) {
      case 'camera':
        ImageCropPicker.openCamera({
          mediaType:'photo',
          cropping:true

        }).then(res => {
          onSelected({type:'file',value:res})
        })
        break
      case 'library':
        ImageCropPicker.openPicker({
          cropping: true,
          mediaType:'photo'

        }).then((res => {
          onSelected({type:'file',value:res})
        }))
        break
      case 'link':
        setIsVisibleModalAddUrl(true)
        break
    }
    modalizeRef.current?.close()
  }
  return (
    <View>
      
      {
        seleted ? <ButtonComponent text={'Chỉnh sửa hình ảnh'} 
        type="link" 
        onPress={() => modalizeRef.current?.open()} />
        :
        <TouchableOpacity onPress={() => modalizeRef.current?.open()} activeOpacity={0.9} style={[
          globalStyles.inputContainer,{minHeight:250,flexDirection:'column',backgroundColor:colors.gray6}
        ]}>
          <Ionicons name="image" size={30} color={colors.gray}/>
          <SpaceComponent height={8}/>
          <TextComponent text="Chọn hình ảnh"/>
        </TouchableOpacity>
      }
      
      <Portal>
        <Modalize adjustToContentHeight ref={modalizeRef} handlePosition="inside">
          <View style={{
            paddingVertical: 30,
            paddingHorizontal: 20
          }}>
            {
              choiceMethodImage.map((item) => renderItem(item))
            }
          </View>
        </Modalize>
        
      </Portal>
      <Modal transparent statusBarTranslucent animationType="slide" visible={isVisibleModalAddUrl} style={{
        flex: 1
      }}>
        <View style={[globalStyles.container,{
          backgroundColor:'rgba(0,0,0,0.5)',
          justifyContent:'center',
          alignItems:'center'
        }]}>
          <View style={[{
            backgroundColor:'white',  
            marginBottom:20,
            borderRadius:12,
            width:'90%',
            padding:20
          }]}>
           <RowComponent justify="flex-end">
                <TouchableOpacity onPress={()=>{setIsVisibleModalAddUrl(false),setImageUrl('')}}>
                    <CloseCircle size={22} color={colors.gray}/>
                </TouchableOpacity>
           </RowComponent>
           <TextComponent text="Image URL" title size={18} />
           <SpaceComponent height={16} />
           <InputComponent title="Nhập URL" value={imageUrl} onChange={val => setImageUrl(val)}/>
           <RowComponent justify="flex-end">
              <ButtonComponent text="Thêm" type="link"  onPress={()=>{
                setIsVisibleModalAddUrl(false),
                onSelected({type:'url',value:imageUrl})
                setImageUrl('')
                }}
                />
           </RowComponent>
          </View>
        </View>
      </Modal>
    </View>
  )
}
export default UploadImagePicker;