import { Button, PermissionsAndroid, Text, ToastAndroid, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../components";
import { ToastMessaging } from "../utils/showToast";
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from "react-native-camera";
import { appInfo } from "../constrants/appInfo";
import { colors } from "../constrants/color";
import { ArrowLeft } from "iconsax-react-native";
import { useStatusBar } from "../hooks/useStatusBar";
import AvatarItem from "../components/AvatarItem";
import { CategoryModel } from "../models/CategoryModel";
const QrScannerScreen = ({ navigation }: any) => {
  const [data, setData] = useState('scanSomeThing')
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  useStatusBar('light-content')
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasCameraPermission(true)
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleQrScanner = (data:any)=>{
    try {
      const dataParse = JSON.parse(data)
      const type = dataParse?.type
      switch (type){
        case 'event':
          const dataEvent:{type:string,idEvent:string} = dataParse
          navigation.navigate('EventDetails', { id: dataEvent?.idEvent })
          break
        default:
          ToastAndroid.show('Qr chả có tác dụng gì', ToastAndroid.SHORT);
          break
      }
    } catch (error) {
      ToastAndroid.show('Mã Qr không hợp lệ', ToastAndroid.SHORT);

    }
  }
  const PendingAuthorizationViewComponent = ()=>{
    return <>
      <AvatarItem size={130} photoUrl="https://icons.veryicon.com/png/o/miscellaneous/linear/camera-265.png"
      bgColor="white"/>
    <SpaceComponent height={8}/>
    <TextComponent styles={{paddingHorizontal:12}} text={'Vui lòng cho phép truy cập máy ảnh để có thể sử dụng chức năng quét mã QR '} title size={14} textAlign="center" color={colors.white}/>
    <SpaceComponent height={8}/>
    <ButtonComponent text="Cho phép" type="primary" width={'auto'} onPress={()=>requestCameraPermission()} />
    </>
  }
  return (
    <View style={{}}>
     { <QRCodeScanner
      
        onRead={({ data }) => handleQrScanner(data)}
        // flashMode={RNCamera.Constants.FlashMode.torch}
        reactivate={true}
        reactivateTimeout={500}
        cameraStyle={{ height: appInfo.sizes.HEIGHT+appInfo.sizes.HEIGHT*0.1, width: appInfo.sizes.WIDTH }} // hiện thị toàn màn hình
        cameraProps={{
          notAuthorizedView: <View style={{
            flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.black
          }}>{PendingAuthorizationViewComponent()}</View>,
          pendingAuthorizationView: <View style={{
            flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.black
          }}>{PendingAuthorizationViewComponent()}</View>,
        }

        }
      // topContent={
      //   <TextComponent text={data} color="red"/>
      // }

      />}
      <View style={{
        position: 'absolute',
        top: appInfo.sizes.HEIGHT * 0.05,
        paddingHorizontal: 16
      }}>
        <RowComponent styles={{
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={colors.white} />
          </TouchableOpacity>
          <SpaceComponent width={4} />
          <TextComponent text={'Quét mã'} color={colors.white} title size={20} textAlign="center" />
        </RowComponent>
      </View>
    </View>
  )
}
export default QrScannerScreen;