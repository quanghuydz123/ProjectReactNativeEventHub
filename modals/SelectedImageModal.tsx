import { Button, Modal, Text, TouchableOpacity, View } from "react-native"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import { Camera, CloseCircle, Image, Link } from "iconsax-react-native";

import Ionicons from "react-native-vector-icons/Ionicons"
import { ButtonComponent, InputComponent, RowComponent, SpaceComponent, TextComponent } from "../src/components";
import { fontFamilies } from "../src/constrants/fontFamilies";
import ImageCropPicker from "react-native-image-crop-picker";
import { globalStyles } from "../src/styles/globalStyles";
import { colors } from "../src/constrants/color";
interface Props {
    onSelected: (val: {
        type: 'url' | 'file',
        value: any
    }) => void,
    visible: boolean
    onSetVisible:(val:boolean)=>void

}
const UploadImagePicker = (props: Props) => {
    const { onSelected,visible,onSetVisible } = props
    const modalizeRef = useRef<Modalize>()
    const [imageUrl, setImageUrl] = useState('')
    const [isVisibleModalAddUrl, setIsVisibleModalAddUrl] = useState(false)
    useEffect(()=>{
        if(visible){
            modalizeRef.current?.open()
        }else{
            modalizeRef.current?.close()
        }
    },[visible])
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
                    mediaType: 'photo',
                    cropping: true

                }).then(res => {
                    onSelected({ type: 'file', value: res })
                })
                break
            case 'library':
                ImageCropPicker.openPicker({
                    cropping: true,
                    mediaType: 'photo'

                }).then((res => {
                    onSelected({ type: 'file', value: res })
                }))
                break
            case 'link':
                setIsVisibleModalAddUrl(true)
                break
        }
        modalizeRef.current?.close()
        onSetVisible(false)
    }
    return (
        <View>
            <Portal>
                <Modalize adjustToContentHeight ref={modalizeRef} handlePosition="inside" onClose={()=>onSetVisible(false)}>
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
                <View style={[globalStyles.container, {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }]}>
                    <View style={[{
                        backgroundColor: 'white',
                        marginBottom: 20,
                        borderRadius: 12,
                        width: '90%',
                        padding: 20
                    }]}>
                        <RowComponent justify="flex-end">
                            <TouchableOpacity onPress={() => { setIsVisibleModalAddUrl(false), setImageUrl('') }}>
                                <CloseCircle size={22} color={colors.gray} />
                            </TouchableOpacity>
                        </RowComponent>
                        <TextComponent text="Image URL" title size={18} />
                        <SpaceComponent height={16} />
                        <InputComponent title="Nhập URL" value={imageUrl} onChange={val => setImageUrl(val)} />
                        <RowComponent justify="flex-end">
                            <ButtonComponent text="Thêm" type="link" onPress={() => {
                                setIsVisibleModalAddUrl(false),
                                    onSelected({ type: 'url', value: imageUrl })
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