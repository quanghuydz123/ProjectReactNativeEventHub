import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { UserModel } from "../../models/UserModel"
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SelectDropdownComponent, SpaceComponent, TextComponent } from "../../components"
import userAPI from "../../apis/userApi"
import { LoadingModal } from "../../../modals"
import { useDispatch, useSelector } from "react-redux"
import { addAuth, authSelector } from "../../reduxs/reducers/authReducers"
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
    const { profile }: { profile: UserModel } = route.params
    const [profileData, setProfileData] = useState<UserModel>(profile)
    const [isLoading, setIsLoading] = useState(false)
    const auth = useSelector(authSelector)
    const dispatch = useDispatch()
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province>({
        name:'',
        code:0
    });
    const [selectedDistrict, setSelectedDistrict] = useState<District>({
        name:'',
        code:0
    });
    const [selectedWard, setSelectedWard] = useState({
        name:'',
        code:0
    });
    const [wards, setWards] = useState<Ward[]>([]);
    const [fileSelected, setFileSelected] = useState<ImageOrVideo>()


    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince.code !== 0) {

            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);
    useEffect(() => {
        if (selectedDistrict.code !== 0) {

            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);
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
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
            setDistricts(response.data.districts || []);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };
    const fetchWards = async () => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
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
                socket.emit('updateUser', { isUser: auth?.id })
                ToastMessaging.Success({})
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
    console.log(selectedProvince)
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
                <InputComponent
                    value={profileData?.bio || ''}
                    onChange={(val) => handleOnchageValue('bio', val)}
                    title="Giới thiệu bản thân"
                    numberOfLines={5}
                    multiline
                    allowClear
                    styles={{marginBottom:12}}

                />
                <TextComponent text={'Địa chỉ nhận hàng (vui lòng cập nhập khi mua vé cứng)'}/>
                <SpaceComponent height={8}/>
                <View>
                    <SelectDropdownComponent 
                    title="Tỉnh/Thành" 
                    data={provinces} 
                    titleButton="Chọn Tỉnh/Thành" 
                    titlePlaceholder="Chọn Tỉnh/Thành" 
                    valueSelected={selectedProvince}
                    onSelect={(val)=>setSelectedProvince({name:val.name,code:parseInt(val.code)})}
                    />
                </View>
                <SpaceComponent height={12}/>

                <View>
                    <SelectDropdownComponent 
                    title="Quận/Huyện" 
                    data={districts} 
                    titleButton="Chọn Quận/Huyện" 
                    titlePlaceholder="Chọn Quận/Huyện"
                    valueSelected={selectedDistrict}
                    onSelect={(val)=>setSelectedDistrict({name:val.name,code:parseInt(val.code)})}
                    />
                </View>
                <SpaceComponent height={12}/>

                <View>
                    <SelectDropdownComponent 
                    title="Phường/Xã" 
                    data={wards} 
                    titleButton="Chọn Phường/Xã" 
                    titlePlaceholder="Chọn Tỉnh/Thành"
                    valueSelected={selectedWard}
                    onSelect={(val)=>setSelectedWard({name:val.name,code:parseInt(val.code)})}
                    />
                </View>
                <SpaceComponent height={12}/>
                <InputComponent
                    value={''}
                    onChange={(val) => console.log(val)}
                    title="Số nhà/Tên đường"
                    allowClear
                />
                
                <ButtonComponent text="Cập nhập" onPress={() => handleUpdateProfile()} type="primary" />
                <View style={{height:500}}/>
            </SectionComponent>
            <LoadingModal visible={isLoading} />

        </ContainerComponent>
    )
}
export default EditProfileScreen;