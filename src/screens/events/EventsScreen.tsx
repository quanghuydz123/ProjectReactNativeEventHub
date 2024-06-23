import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent } from "../../components";
import Toast from "react-native-toast-message";

const EventsScreen = ()=>{
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Cập nhập thành công',
      visibilityTime:1500
    });
  }
  return (
    <ContainerComponent back title="abvc">
       <Button
      title='Show toast'
      onPress={showToast}
    />
    </ContainerComponent>
  )
}
export default EventsScreen;