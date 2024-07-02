import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent } from "../../components";
import Toast from "react-native-toast-message";
import EventItem from "../../components/EventItem";

const EventsScreen = () => {
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Cập nhập thành công',
      visibilityTime: 1500
    });
  }
  return (
    <ContainerComponent back title="abvc">
      <View>
      </View>
    </ContainerComponent>
  )
}
export default EventsScreen;