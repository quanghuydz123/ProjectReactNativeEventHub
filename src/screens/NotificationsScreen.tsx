import { ActivityIndicator, Button, FlatList, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../components";
import { globalStyles } from "../styles/globalStyles";
import { useSelector } from "react-redux";
import { authSelector } from "../reduxs/reducers/authReducers";
import AvatarItem from "../components/AvatarItem";
import { colors } from "../constrants/color";
import { appInfo } from "../constrants/appInfo";
import Entypo from 'react-native-vector-icons/Entypo'
import { UserModel } from "../models/UserModel";
import { EventModelNew } from "../models/EventModelNew";
import { NotificationModel } from "../models/NotificationModel";
import notificationAPI from "../apis/notificationAPI";
import socket from "../utils/socket";

const NotificationsScreen = ({navigation,route}:any)=>{
  const {notificationRoute}: { notificationRoute: NotificationModel[]} = route.params || {}
  const [notifications,setNotifications] = useState<NotificationModel[]>(notificationRoute)
  const [isLoading,setIsLoadng] = useState(false)
  const user = useSelector(authSelector)
  useEffect(()=>{
    handleCallAPIUpdateIsViewdNotifications()
  },[])
  const handleCallAPIUpdateIsViewdNotifications = async ()=>{
    const api = `/update-isViewed-notifitions`
    try {
      const res:any = await notificationAPI.HandleNotification(api,{uid:user.id},'put')
      if(res && res.status===200){
        socket.emit('getNotifications')
      }
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      if(errorMessage.statusCode === 403){
        console.log(errorMessage.message)
      }else{
        console.log('Lỗi rồi')
      }
    }
  }
  const renderNofitications = (value:NotificationModel)=>{
    switch(value.type){
      case 'inviteEvent':
        return (
          <View key={`${value._id}`} style={{flex:1,paddingHorizontal:12,backgroundColor:value.isRead ? colors.white : '#eff8ff'}}>
                <RowComponent key={`${value._id}`} styles={{flex:1,minHeight:appInfo.sizes.HEIGHT/8,paddingTop:10,alignItems:'flex-start'}} >
                  <AvatarItem size={60} styles={{minHeight:'100%'}} photoUrl={value.senderID.photoUrl}/>
                  <TouchableOpacity style={{flex:1,paddingHorizontal:12,minHeight:'100%'}} 
                     onPress={()=>navigation.navigate('EventDetails', {item:value.eventId})}>

                      <Text style={[globalStyles.text,{fontWeight:'bold'}]} numberOfLines={3}>
                        {`${value.senderID.fullname} `}
                        <Text style={[globalStyles.text]}>
                          {value.content}
                        </Text>
                      </Text>
                      <SpaceComponent height={2}/>
                      <TextComponent text={'5 phút trước'} color={colors.gray} size={12}/>
                      {/* <RowComponent>
                        <ButtonComponent text="Từ chối" type="primary" color="white" textColor={colors.colorText}
                        styles={{minHeight:20,paddingVertical:12,borderWidth:1,borderColor:colors.gray2}}/>
                        <ButtonComponent text="Chấp nhập" type="primary" styles={{minHeight:20,paddingVertical:12}}/>
                      </RowComponent> */}
                  </TouchableOpacity>
                  <ButtonComponent
                  
                  onPress={()=>console.log("ok")}
                  styles={{paddingVertical:4}}
                  icon={<Entypo name="dots-three-horizontal" size={12} color={colors.colorText}/>} 
                  iconFlex="right"/>
              </RowComponent>
              
                </View>
        )
      case 'follow':
        return (
          <View key={`${value._id}`} style={{flex:1,paddingHorizontal:12,backgroundColor:value.isRead ? colors.white : '#eff8ff'}}>
                <RowComponent key={`${value._id}`} styles={{flex:1,minHeight:appInfo.sizes.HEIGHT/8,paddingTop:10,alignItems:'flex-start'}} >
                  <AvatarItem size={60} styles={{minHeight:'100%'}} photoUrl={value.senderID.photoUrl}/>
                  <TouchableOpacity style={{flex:1,paddingHorizontal:12,minHeight:'100%'}}>

                      <Text style={[globalStyles.text,{fontWeight:'bold'}]} numberOfLines={3}>
                        {`${value.senderID.fullname} `}
                        <Text style={[globalStyles.text]}>
                          {value.content}
                        </Text>
                      </Text>
                      <SpaceComponent height={2}/>
                      <TextComponent text={'5 phút trước'} color={colors.gray} size={12}/>
                      {/* <RowComponent>
                        <ButtonComponent text="Từ chối" type="primary" color="white" textColor={colors.colorText}
                        styles={{minHeight:20,paddingVertical:12,borderWidth:1,borderColor:colors.gray2}}/>
                        <ButtonComponent text="Chấp nhập" type="primary" styles={{minHeight:20,paddingVertical:12}}/>
                      </RowComponent> */}
                  </TouchableOpacity>
                  <ButtonComponent
                  
                  onPress={()=>console.log("ok")}
                  styles={{paddingVertical:4}}
                  icon={<Entypo name="dots-three-horizontal" size={12} color={colors.colorText}/>} 
                  iconFlex="right"/>
              </RowComponent>
              
                </View>
        )
      default:
        return (
          <></>
        )
    }
  }
  return (
    <ContainerComponent  back title="Thông báo">
        {
          !isLoading ? (notifications && notifications.length > 0 ? <SectionComponent styles={{paddingHorizontal:0}}>
            <TextComponent text={'Trước đó'} title size={16} styles={{paddingHorizontal:12}}/>
            <SpaceComponent height={8}/>
            
            <FlatList 
            contentContainerStyle={{paddingBottom:10}}
            showsVerticalScrollIndicator={false}
            data={notifications}
            renderItem={({item,index})=>renderNofitications(item)}
            
            />
            
            </SectionComponent> : <SectionComponent styles={[globalStyles.center,{flex:1}]}>
            <TextComponent text={'Không có thông báo nào'} />
        </SectionComponent>)
      : <><View style={{
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:20,
        paddingVertical:75,
    }}>
      
        <ActivityIndicator />
    </View></>
        }
    </ContainerComponent>
  )
}
export default NotificationsScreen;