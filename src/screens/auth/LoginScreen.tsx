import { Alert, Button, Image, Switch, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { globalStyles } from "../../styles/globalStyles";
import { FolderMinus, Lock, Sms } from "iconsax-react-native";
import { colors } from "../../constrants/color";
import { fontFamilies } from "../../constrants/fontFamilies";
import SocialLogin from "./components/SocialLogin";
import authenticationAPI from "../../apis/authApi";
import { Validate } from "../../utils/validate";
import { useDispatch } from "react-redux";
import { addAuth } from "../../reduxs/reducers/authReducers";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRemember, setIsReMember] = useState(true)
  const { getItem } = useAsyncStorage('auth')
  const dispatch = useDispatch()

  useEffect(() => {
    saveEmail()
  }, [])
  const saveEmail = async () => {
    const res = await getItem()
    res && setEmail(res)
  }
  const handleLogin = async () => {
    const emailValidation = Validate.email(email)
    if(email && password){
      if (emailValidation) {
        try {
          const res = await authenticationAPI.HandleAuthentication('/login', { email, password }, 'post');
          console.log("123123", res)
          dispatch(addAuth(res.data))
          if (isRemember) {
            await AsyncStorage.setItem('auth', JSON.stringify(res.data))
          } else {
            await AsyncStorage.setItem('auth', JSON.stringify(res.data))
          }
        } catch (error) {
          console.log("123123", JSON.stringify(error))
        }
      }
      else {
        Alert.alert('Thông báo', 'Email không đúng dịnh dạng!!!', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }
    }
    else {
      Alert.alert('Thông báo', 'Hãy nhập đầy đủ thông tin', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
    

  }
  return (
    <ContainerComponent isScroll>
      <SectionComponent styles={{ justifyContent: 'center', alignItems: 'center', marginTop: 75 }}>
        <Image source={require('../../assets/images/text-logo.png')}
          style={{
            width: 162,
            height: 114,
            marginBottom: 30
          }}
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent text={'Đăng nhập'} size={24} font={fontFamilies.medium} />
        <SpaceComponent height={21} />
        <InputComponent value={email} onChange={(val) => setEmail(val)}
          placeholder={'abc@gmail.com'}
          affix={<Sms size={22} color={colors.gray} />}
        />

        <InputComponent value={password} onChange={(val) => setPassword(val)}
          placeholder={'Password'}
          isPassword
          affix={<Lock size={22} color={colors.gray} />}
        />
        <RowComponent justify={'space-between'}>
          <RowComponent onPress={() => setIsReMember(!isRemember)}>
            <Switch thumbColor={colors.white} trackColor={{ true: colors.primary }} value={isRemember} onChange={() => setIsReMember(!isRemember)} />
            <SpaceComponent width={4} />
            <TextComponent text={'Nhớ mật khẩu'} />
          </RowComponent>
          <ButtonComponent text="Quên mật khẩu?" onPress={() => navigation.navigate('ForgotPasswordScreen')} type={'link'} />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent onPress={handleLogin} text={'Đăng nhập'} type={'primary'} />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn chưa có tài khoản?" />
          <ButtonComponent text="Đăng ký" type="link" onPress={() => navigation.navigate('SignUpScreen')} />
        </RowComponent>
      </SectionComponent>

    </ContainerComponent>
  )
}
export default LoginScreen;