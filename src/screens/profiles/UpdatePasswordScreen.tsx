import { useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components"
import CardComponent from "../../components/CardComponent"
import { colors } from "../../constrants/color"
import { apis } from "../../constrants/apis"
import authenticationAPI from "../../apis/authApi"
import { useDispatch, useSelector } from "react-redux"
import { authSelector, AuthState, updateIsHasPassword } from "../../reduxs/reducers/authReducers"
import { ToastMessaging } from "../../utils/showToast"
import React from 'react';

const UpdatePasswordScreen = ({ navigation, route }: any) => {
    const { type }: {
        type: 'updatePassword' | 'changePassword'
    } = route.params || {}
    const [data,setData] = useState({
        passwordCurrent:'',
        password:'',
        comfirmPassword:''
    })
    const auth:AuthState = useSelector(authSelector)
    const [errorMessage,setErrorMessage] = useState('')
    const dispath = useDispatch()
    const handleOnchageValue = (key:string, value:string | Date | string[] | number) => {
        if(errorMessage){
            setErrorMessage('')
        }
        const item:any = {...data}
        item[`${key}`] = value
        setData(item)
      }
    const handleCallAPIUpdatePassword = async ()=>{
        const api = apis.auth.updatePassword()
        try {
            if(type==='changePassword'){
                const res = await authenticationAPI.HandleAuthentication(api,{idUser:auth.id,password:data.password,passwordCurrent:data.passwordCurrent,comfirmPassword:data.comfirmPassword,type:'changePassword'},'put')
                if(res && res.status === 200 && res.data){
                    ToastMessaging.Success({visibilityTime:2000,title:'Đổi mật khẩu thành công!!!'})
                    navigation.goBack()

                }
            }else{
                const res = await authenticationAPI.HandleAuthentication(api,{idUser:auth.id,password:data.password,comfirmPassword:data.comfirmPassword,type:'updatePassword'},'put')
                if(res && res.status === 200 && res.data){
                    ToastMessaging.Success({visibilityTime:2000,title:'Cập nhập mật khẩu thành công!!!'})
                    dispath(updateIsHasPassword({}))
                    navigation.goBack()
                }
            }
        } catch (error:any) {
            const errorMessage = JSON.parse(error.message)
            setErrorMessage(errorMessage?.message ?? 'Lỗi rồi')
        }
    }
    return (
        <ContainerComponent bgColor={colors.backgroundBluishWhite} title={type === 'updatePassword' ? 'Cập nhập mật khẩu' : 'Đổi mật khẩu'} back>
            <SectionComponent>
                {type === 'updatePassword' ? <CardComponent isShadow>
                    <InputComponent isPassword onChange={(val)=>handleOnchageValue('password',val)} value={data.password} title="Nhập mật khẩu mới" />
                    <InputComponent isPassword onChange={(val)=>handleOnchageValue('comfirmPassword',val)} value={data.comfirmPassword} title="Nhập mật lại khẩu mới" />
                    {
                        errorMessage && <>
                            <TextComponent text={errorMessage} color="red"  textAlign="center"/>
                            <SpaceComponent height={2}/>
                        </>
                    }
                    <ButtonComponent type="primary" text="Xác nhận" onPress={()=>handleCallAPIUpdatePassword()} />
                </CardComponent> :
                    <CardComponent isShadow>
                        <InputComponent isPassword onChange={(val)=>handleOnchageValue('passwordCurrent',val)} value={data.passwordCurrent} title="Nhập mật khẩu hiện tại" />
                        <InputComponent isPassword onChange={(val)=>handleOnchageValue('password',val)} value={data.password} title="Nhập mật khẩu mới" />
                        <InputComponent isPassword onChange={(val)=>handleOnchageValue('comfirmPassword',val)} value={data.comfirmPassword} title="Nhập mật lại khẩu mới" />
                        {
                            errorMessage && <>
                                <TextComponent text={errorMessage} color="red" textAlign="center"/>
                                <SpaceComponent height={2}/>
                            </>
                        }
                        <ButtonComponent type="primary" text="Đổi mật khẩu" onPress={()=>handleCallAPIUpdatePassword()} />
                    </CardComponent>
                }
            </SectionComponent>
        </ContainerComponent>
    )
}

export default UpdatePasswordScreen