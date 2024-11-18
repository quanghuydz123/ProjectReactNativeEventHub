import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { UserModel } from "../../models/UserModel"
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SelectDropdownComponent, SpaceComponent, TextComponent } from "../../components"
import userAPI from "../../apis/userApi"
import { LoadingModal } from "../../../modals"
import { useDispatch, useSelector } from "react-redux"
import { addAuth, authSelector, AuthState } from "../../reduxs/reducers/authReducers"
import socket from "../../utils/socket"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ImageOrVideo } from "react-native-image-crop-picker"
import { ToastMessaging } from "../../utils/showToast"
import { apis } from "../../constrants/apis"
import axios from "axios"
interface Province {
    code: number;
    name: string;
}

interface District {
    code: number;
    name: string;
}

interface Ward {
    code: number;
    name: string;
}
const EditProfileScreen = ({ navigation, route }: any) => {
    const auth:AuthState = useSelector(authSelector)
    const [profileData, setProfileData] = useState<{
        fullname:string,
        phoneNumber:string,
        bio:string,
        _id:string,
        photoUrl:string,
        address:{
            province:{
                name:string,
                code:number,
            },
            districts:{
                name:string,
                code:number,
            },
            ward:{
                name:string,
                code:number,
            },
            houseNumberAndStreet:string
          },
    }>({
        fullname:auth.fullname,
        phoneNumber:auth.phoneNumber,
        bio:auth.bio,
        _id:auth.id,
        photoUrl:auth.photoUrl,
        address:auth.address

    })
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    // const [selectedProvince, setSelectedProvince] = useState<Province>({
    //     name:'',
    //     code:0
    // });
    // const [selectedDistrict, setSelectedDistrict] = useState<District>({
    //     name:'',
    //     code:0
    // });
    // const [selectedWard, setSelectedWard] = useState({
    //     name:'',
    //     code:0
    // });
    const [wards, setWards] = useState<Ward[]>([]);
    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (profileData.address.province.code !== 0 && profileData.address.province.code !== undefined) {
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [profileData.address.province]);
    useEffect(() => {
        if (profileData.address.districts.code !== 0 && profileData.address.districts.code !== undefined) {

            fetchWards();
        } else {
            setWards([]);
        }
    }, [profileData.address.districts]);
    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
            setProvinces(response.data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };
    const fetchDistricts = async () => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${profileData.address.province.code}?depth=2`);
            setDistricts(response.data.districts || []);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };
    const fetchWards = async () => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${profileData.address.districts.code}?depth=2`);
            setWards(response.data.wards || []);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };


    const handleOnchageValue = (key: string, value: string | Date | string[] | number) => {
        const item: any = { ...profileData }
        item[`${key}`] = value
        setProfileData(item)
    }
    const handleUpdateProfile = async () => {
        const api = apis.user.updateProfile()
        setIsLoading(true)
        try {
            const { photoUrl, ...profileDataWithoutPhotoUrl } = profileData;
            const res: any = await userAPI.HandleUser(api, { ...profileDataWithoutPhotoUrl }, 'put')
            if (res && res.data && res.statusCode === 200) {
                const resStorage = await AsyncStorage.getItem('auth')
                const jsonResStorage = JSON.parse(resStorage || '')
                await AsyncStorage.setItem('auth', JSON.stringify({ ...jsonResStorage, ...res.data.user }))
                dispatch(addAuth({ ...auth, ...res.data.user }))
                ToastMessaging.Success({visibilityTime:2000})
                setIsLoading(false)
            }
        } catch (error: any) {
            const errorMessage = JSON.parse(error.message)
            if (errorMessage.statusCode === 403) {
                console.log(errorMessage.message)
            } else {
                console.log('Lỗi rồi')
            }
            setIsLoading(false)
        }
    }
    // const handleFileSelected = (val:ImageOrVideo) =>
    //     {
    //       setFileSelected(val)
    //       handleOnchageValue('photoUrl',val.path)
    //     }
    // const handleChoiceImage = (val:any)=>{
    //     setFileSelected(undefined)
    //     val.type === 'url' ? handleOnchageValue('photoUrl',val.value) : handleFileSelected(val.value)
    // }
    console.log(profileData.address)
    return (
        <ContainerComponent isScroll back title="Cập nhập thông tin">
            <SectionComponent>
                <InputComponent

                    value={profileData?.fullname || ''}
                    onChange={(val) => handleOnchageValue('fullname', val)}
                    title="Họ tên"
                    allowClear
                />
                <InputComponent
                    value={profileData?.phoneNumber || ''}
                    onChange={(val) => handleOnchageValue('phoneNumber', val)}
                    title="Số điện thoại"
                    type="number-pad"
                    allowClear
                />
                
                <TextComponent text={'Địa chỉ nhận hàng (vui lòng cập nhập khi mua vé cứng)'}/>
                <SpaceComponent height={8}/>
                <View>
                    <SelectDropdownComponent 
                    title="Tỉnh/Thành" 
                    data={provinces} 
                    titleButton="Chọn Tỉnh/Thành" 
                    titlePlaceholder="Chọn Tỉnh/Thành" 
                    valueSelected={profileData.address.province}
                    onSelect={(val) => setProfileData({
                        ...profileData, // Giữ nguyên các thuộc tính khác trong profileData
                        address: {
                            ...profileData.address, // Giữ nguyên các thuộc tính khác trong address
                            province: {
                                name: val.name,
                                code: parseInt(val.code)
                            }
                        }
                    })}
                    />
                </View>
                <SpaceComponent height={12}/>

                <View>
                    <SelectDropdownComponent 
                    title="Quận/Huyện" 
                    data={districts} 
                    titleButton="Chọn Quận/Huyện" 
                    titlePlaceholder="Chọn Quận/Huyện"
                    valueSelected={profileData.address.districts}
                    onSelect={(val) => setProfileData({
                        ...profileData, // Giữ nguyên các thuộc tính khác trong profileData
                        address: {
                            ...profileData.address, // Giữ nguyên các thuộc tính khác trong address
                            districts: {
                                name: val.name,
                                code: parseInt(val.code)
                            }
                        }
                    })}
                    />
                </View>
                <SpaceComponent height={12}/>

                <View>
                    <SelectDropdownComponent 
                    title="Phường/Xã" 
                    data={wards} 
                    titleButton="Chọn Phường/Xã" 
                    titlePlaceholder="Chọn Tỉnh/Thành"
                    valueSelected={profileData.address.ward}
                    onSelect={(val) => setProfileData({
                        ...profileData, // Giữ nguyên các thuộc tính khác trong profileData
                        address: {
                            ...profileData.address, // Giữ nguyên các thuộc tính khác trong address
                            ward: {
                                name: val.name,
                                code: parseInt(val.code)
                            }
                        }
                    })}
                    />
                </View>
                <SpaceComponent height={12}/>
                <InputComponent
                    value={profileData.address.houseNumberAndStreet}
                    onChange={(val) => setProfileData({
                        ...profileData, // Giữ nguyên các thuộc tính khác trong profileData
                        address: {
                            ...profileData.address, // Giữ nguyên các thuộc tính khác trong address
                            houseNumberAndStreet:val
                        }
                    })}
                    title="Số nhà/Tên đường"
                    allowClear
                />
                <InputComponent
                    value={profileData?.bio || ''}
                    onChange={(val) => handleOnchageValue('bio', val)}
                    title="Giới thiệu bản thân"
                    numberOfLines={5}
                    multiline
                    allowClear
                    styles={{marginBottom:12}}

                />
                <ButtonComponent text="Cập nhập" onPress={() => handleUpdateProfile()} type="primary" />
                <View style={{height:500}}/>
            </SectionComponent>
            <LoadingModal visible={isLoading} />

        </ContainerComponent>
    )
}
export default EditProfileScreen;