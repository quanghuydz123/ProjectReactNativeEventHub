import { ActivityIndicator, Button, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ButtonComponent, ContainerComponent, CricleComponent, DataLoaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../components";
import { globalStyles } from "../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../reduxs/reducers/authReducers";
import AvatarItem from "../components/AvatarItem";
import { colors } from "../constrants/color";
import { appInfo } from "../constrants/appInfo";
import Entypo from 'react-native-vector-icons/Entypo'
import { UserModel } from "../models/UserModel";
import { EventModelNew } from "../models/EventModelNew";
import { NotificationModel } from "../models/NotificationModel";
import notificationAPI from "../apis/notificationAPI";
import socket from "../utils/socket";
import { DateTime } from "../utils/DateTime";
import { LoadingModal } from "../../modals";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { apis } from "../constrants/apis";
import { sizeGlobal } from "../constrants/sizeGlobal";
const NotificationsScreen = ({ navigation, route }: any) => {
  const { notificationRoute }: { notificationRoute: NotificationModel[] } = route.params || {}
  const [notifications, setNotifications] = useState<NotificationModel[]>(notificationRoute)
  const [isLoading, setIsLoadng] = useState(false)
  const [isLoadingModal, setIsLoadingModal] = useState(false)
  const user = useSelector(authSelector)
  const modalizeRef = useRef<Modalize>(null);
  const [isFirst, setIsFirst] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [notificationSelected, setSotificationSelected] = useState<NotificationModel>()
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch()
  const auth = useSelector(authSelector)
  useEffect(() => {
    if (!notifications) {
      handleCallAPIGetNotifications({})
    }
    handleCallAPIUpdateIsViewdNotifications()
    // handleCallAPIGetNotifications(true)
  }, [])
  useEffect(() => {
    if (isFirst) {
      modalizeRef.current?.open();
    }
    else {
      setIsFirst(true)
    }
  }, [notificationSelected, toggle])
  const handleCallAPIGetNotifications = async ({isLoading,idUser}:{isLoading?:boolean,idUser?:string}) => {
    if (user.accesstoken) {
      const api = apis.notification.getNotificationsById({ idUser: idUser ?? user.id })
      setIsLoadng(isLoading ? isLoading : false)
      try {
        const res: any = await notificationAPI.HandleNotification(api)
        if (res && res.data && res.status === 200) {
          setNotifications(res.data.notifications)
        }
        setIsLoadng(false)
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        if (errorMessage.statusCode === 403) {
          console.log(errorMessage.message)
        } else {
          console.log('Lỗi rồi')
        }
        setIsLoadng(false)
      }
    }
  }
  useEffect(() => {

    const handleGetNotifications = (idUser?:string) => {
      handleCallAPIGetNotifications({idUser:idUser})
      console.log('notification cập nhật');
    };
    socket.on('getNotifications', ({idUser})=>{
      handleGetNotifications(idUser)
    })
    return () => {
      socket.off('getNotifications', handleGetNotifications);
    };
  }, [])
  const handleCallAPIUpdateIsViewdNotifications = async () => {
    const api = apis.notification.updateisViewdNotifications()
    try {
      const res: any = await notificationAPI.HandleNotification(api, { uid: user.id }, 'put')
      if (res && res.status === 200) {
        socket.emit('getNotifications',{idUser: auth?.id})

      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log('Lỗi rồi')
      }
    }
  }
  const handleRejectNotification = async (notification: NotificationModel) => {
    const api = apis.notification.updateStatusNotifications()
    setIsLoadingModal(true)
    try {
      const res: any = await notificationAPI.HandleNotification(api, { idUserFollow: notification.senderID._id, idUserFollowed: notification.recipientId._id, type: 'rejected' }, 'put')
      setIsLoadingModal(false)
      if (res && res.status === 200) {
        socket.emit('getNotifications',{idUser: auth?.id})
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log('Lỗi rồi')
      }
      setIsLoadingModal(false)
    }
  }
  const handleComfirmNofitication = async (notification: NotificationModel) => {
    const api = apis.notification.updateStatusNotifications()
    setIsLoadingModal(true)
    try {
      const res: any = await notificationAPI.HandleNotification(api, { idUserFollow: notification.senderID._id, idUserFollowed: notification.recipientId._id, type: 'answered' }, 'put')
      setIsLoadingModal(false)
      if (res && res.status === 200) {
        socket.emit('getNotifications',{idUser: auth?.id})
        socket.emit('followUser',{idUser:auth?.id})
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message)
      } else {
        console.log('Lỗi rồi')
      }
      setIsLoadingModal(false)
    }
  }
  const handleOpenModalize = (notificatoin: NotificationModel) => {
    setSotificationSelected(notificatoin)
    setToggle(!toggle)
  }
  const renderStatusNotification = (notification: NotificationModel) => {
    switch (notification.status) {
      case 'unanswered':
        return (
          <RowComponent>

            <ButtonComponent text="Chấp nhập" type="primary" width={'auto'} styles={{ minHeight: 20, borderRadius: 5, paddingVertical: 10, width: appInfo.sizes.WIDTH * 0.32 }}
              onPress={() => handleComfirmNofitication(notification)}
            />
            <SpaceComponent width={20} />

            <ButtonComponent text="Từ chối" type="primary" color={colors.backgroundSearchInput} width={'auto'} textColor={colors.colorText}
              styles={{ minHeight: 20, width: appInfo.sizes.WIDTH * 0.32, borderRadius: 5, paddingVertical: 10, borderColor: colors.white }} onPress={() => handleRejectNotification(notification)} />
          </RowComponent>
        )
      case 'answered':
        return (
          <TextComponent text={'Đã đồng ý'} title size={14} />
        )
      case 'cancelled':
        return (
          <TextComponent text={'Đã bị hủy bởi người gửi'} title size={14} />
        )
      case 'rejected':
        return (
          <TextComponent text={'Đã từ chối'} title size={14} />
        )
      default:
        return <></>
    }
  }
  const renderNofitications = (value: NotificationModel) => {
    switch (value.type) {
      case 'inviteEvent':
        return (
          <View key={`${value._id}`} style={{ flex: 1, paddingHorizontal: 12, backgroundColor: value.isRead ? colors.white : '#eff8ff' }}>
            <RowComponent key={`${value._id}`} styles={{ flex: 1, minHeight: appInfo.sizes.HEIGHT / 8, paddingTop: 10, alignItems: 'flex-start' }} >
              <AvatarItem size={sizeGlobal.avatarItem} styles={{}} photoUrl={value.senderID?.photoUrl} isShowIconAbsolute typeIcon="inviteEvent" />
              <TouchableOpacity style={{ flex: 1, paddingHorizontal: 12, minHeight: '100%' }}
                onPress={() => navigation.navigate('EventDetails', { id: value.eventId?._id })}>

                <Text style={[globalStyles.text, { fontWeight: 'bold' }]} numberOfLines={3}>
                  {`${value.senderID?.fullname} `}
                  <Text style={[globalStyles.text]}>
                    {value.content}
                  </Text>
                </Text>
                <SpaceComponent height={2} />
                <TextComponent text={DateTime.GetDateUpdate(new Date(value.createdAt).getTime()) ?? 0} color={colors.gray} size={12} />
                {/* <RowComponent>
                        <ButtonComponent text="Từ chối" type="primary" color="white" textColor={colors.colorText}
                        styles={{minHeight:20,paddingVertical:12,borderWidth:1,borderColor:colors.gray2}}/>
                        <ButtonComponent text="Chấp nhập" type="primary" styles={{minHeight:20,paddingVertical:12}}/>
                      </RowComponent> */}
              </TouchableOpacity>
              <ButtonComponent

                onPress={() => handleOpenModalize(value)}
                styles={{ paddingVertical: 4 }}
                icon={<Entypo name="dots-three-horizontal" size={12} color={colors.colorText} />}
                iconFlex="right" />
            </RowComponent>

          </View>
        )
      case 'follow':
        return (
          <View key={`${value._id}`} style={{ flex: 1, paddingHorizontal: 12, backgroundColor: value.isRead ? colors.white : '#eff8ff' }}>
            <RowComponent key={`${value._id}`} styles={{ flex: 1, minHeight: appInfo.sizes.HEIGHT / 8, paddingTop: 10, alignItems: 'flex-start' }} >
              <AvatarItem size={sizeGlobal.avatarItem} styles={{}} photoUrl={value.senderID?.photoUrl} isShowIconAbsolute typeIcon="follow" />
              <TouchableOpacity style={{ flex: 1, paddingHorizontal: 12, minHeight: '100%' }}>

                <Text style={[globalStyles.text, { fontWeight: 'bold' }]} numberOfLines={3}>
                  {`${value.senderID?.fullname} `}
                  <Text style={[globalStyles.text]}>
                    {value.content}
                  </Text>
                </Text>
                <SpaceComponent height={2} />
                <TextComponent text={DateTime.GetDateUpdate(new Date(value.createdAt).getTime()) ?? 0} color={colors.gray} size={12} />
                <SpaceComponent height={8} />
                {
                  renderStatusNotification(value)
                }
              </TouchableOpacity>
              <ButtonComponent

                onPress={() => handleOpenModalize(value)}
                styles={{ paddingVertical: 4 }}
                icon={<Entypo name="dots-three-horizontal" size={12} color={colors.colorText} />}
                iconFlex="right" />
            </RowComponent>

          </View>
        )
      case 'rejectFollow':
        return (
          <View key={`${value._id}`} style={{ flex: 1, paddingHorizontal: 12, backgroundColor: value.isRead ? colors.white : '#eff8ff' }}>
            <RowComponent key={`${value._id}`} styles={{ flex: 1, minHeight: appInfo.sizes.HEIGHT / 8, paddingTop: 10, alignItems: 'flex-start' }} >
              <AvatarItem size={sizeGlobal.avatarItem} styles={{}} photoUrl={value.senderID?.photoUrl} isShowIconAbsolute typeIcon="rejectFollow" />
              <TouchableOpacity style={{ flex: 1, paddingHorizontal: 12, minHeight: '100%' }}
              >

                <Text style={[globalStyles.text, { fontWeight: 'bold' }]} numberOfLines={3}>
                  {`${value.senderID?.fullname} `}
                  <Text style={[globalStyles.text]}>
                    {value.content}
                  </Text>
                </Text>
                <SpaceComponent height={2} />
                <TextComponent text={DateTime.GetDateUpdate(new Date(value.createdAt).getTime()) ?? 0} color={colors.gray} size={12} />
                {/* <RowComponent>
                <ButtonComponent text="Từ chối" type="primary" color="white" textColor={colors.colorText}
                styles={{minHeight:20,paddingVertical:12,borderWidth:1,borderColor:colors.gray2}}/>
                <ButtonComponent text="Chấp nhập" type="primary" styles={{minHeight:20,paddingVertical:12}}/>
              </RowComponent> */}
              </TouchableOpacity>
              <ButtonComponent

                onPress={() => handleOpenModalize(value)}
                styles={{ paddingVertical: 4 }}
                icon={<Entypo name="dots-three-horizontal" size={12} color={colors.colorText} />}
                iconFlex="right" />
            </RowComponent>

          </View>
        )
      case 'allowFollow':
        return (
          <View key={`${value._id}`} style={{ flex: 1, paddingHorizontal: 12, backgroundColor: value.isRead ? colors.white : '#eff8ff' }}>
            <RowComponent key={`${value._id}`} styles={{ flex: 1, minHeight: appInfo.sizes.HEIGHT / 8, paddingTop: 10, alignItems: 'flex-start' }} >
              <AvatarItem size={sizeGlobal.avatarItem} styles={{}} photoUrl={value.senderID?.photoUrl} isShowIconAbsolute typeIcon="allowFollow" />
              <TouchableOpacity style={{ flex: 1, paddingHorizontal: 12, minHeight: '100%' }}
              >

                <Text style={[globalStyles.text, { fontWeight: 'bold' }]} numberOfLines={3}>
                  {`${value.senderID?.fullname} `}
                  <Text style={[globalStyles.text]}>
                    {value.content}
                  </Text>
                </Text>
                <SpaceComponent height={2} />
                <TextComponent text={DateTime.GetDateUpdate(new Date(value.createdAt).getTime()) ?? 0} color={colors.gray} size={12} />
                {/* <RowComponent>
                  <ButtonComponent text="Từ chối" type="primary" color="white" textColor={colors.colorText}
                  styles={{minHeight:20,paddingVertical:12,borderWidth:1,borderColor:colors.gray2}}/>
                  <ButtonComponent text="Chấp nhập" type="primary" styles={{minHeight:20,paddingVertical:12}}/>
                </RowComponent> */}
              </TouchableOpacity>
              <ButtonComponent

                onPress={() => handleOpenModalize(value)}
                styles={{ paddingVertical: 4 }}
                icon={<Entypo name="dots-three-horizontal" size={12} color={colors.colorText} />}
                iconFlex="right" />
            </RowComponent>

          </View>
        )
      default:
        return (
          <></>
        )
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log("ok")
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <ContainerComponent back title="Thông báo">
      {
        !isLoading && notifications ? (notifications.length > 0 ? <SectionComponent styles={{ paddingHorizontal: 0, flex: 1 }}>
          <TextComponent text={'Trước đó'} title size={16} styles={{ paddingHorizontal: 12 }} />
          <SpaceComponent height={8} />
          <DataLoaderComponent isFlex data={notifications} isLoading={isLoading}
            messageEmpty="Không có sự kiện nào phù hợp"
            children={
              <FlatList
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={notifications}
                renderItem={({ item, index }) => renderNofitications(item)}

              />

            } />


        </SectionComponent> : <SectionComponent styles={[globalStyles.center, { flex: 1 }]}>
          <TextComponent text={'Không có thông báo nào'} />
        </SectionComponent>)
          : <><View style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 75,
          }}>

            <ActivityIndicator />
          </View></>
      }
      <LoadingModal visible={isLoadingModal} />
      <Portal>
        <Modalize ref={modalizeRef} adjustToContentHeight >
          <SectionComponent styles={{ minHeight: 150, paddingHorizontal: 12 }}>
            <SpaceComponent height={6} />
            <AvatarItem size={sizeGlobal.avatarItem} styles={{ alignItems: 'center' }} photoUrl={notificationSelected?.senderID?.photoUrl} />
            <SpaceComponent height={6} />
            <Text style={[globalStyles.text, { textAlign: 'center', lineHeight: 16 }]} numberOfLines={3}>
              {`${notificationSelected?.senderID?.fullname} `}
              <Text style={[globalStyles.text]}>
                {notificationSelected?.content}
              </Text>
            </Text>
            <SpaceComponent height={16} />
            <RowComponent>
              <CricleComponent styles={{ borderWidth: 0.5, borderColor: colors.gray5 }} size={36} color={colors.gray5}>
                <MaterialCommunityIcons name="delete" size={24} color={colors.black} />
              </CricleComponent>
              <SpaceComponent width={12} />
              <TextComponent text={'Gỡ thông báo này'} title size={16} />
            </RowComponent>
          </SectionComponent>
        </Modalize>
      </Portal>
    </ContainerComponent>
  )
}
export default NotificationsScreen;