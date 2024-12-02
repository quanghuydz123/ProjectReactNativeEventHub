import { Button, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, DataLoaderComponent, EmptyComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components";
import { colors } from "../../constrants/color";
import { Notification, SearchNormal } from "iconsax-react-native";
import { appInfo } from "../../constrants/appInfo";
import { Screen } from "react-native-screens";
import { NotificationModel } from "../../models/NotificationModel";
import { apis } from "../../constrants/apis";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/authReducers";
import notificationAPI from "../../apis/notificationAPI";
import { FlatList } from "react-native-gesture-handler";
import AvatarItem from "../../components/AvatarItem";
import { globalStyles } from "../../styles/globalStyles";
import { DateTime } from "../../utils/DateTime";
import socket from "../../utils/socket";
import { LoadingModal } from "../../../modals";
import LoadingComponent from "../../components/LoadingComponent";
import { sizeGlobal } from "../../constrants/sizeGlobal";
import { FollowModel } from "../../models/FollowModel";
import followAPI from "../../apis/followAPI";

const HomeFriendsScreen = ({ navigation }: any) => {
    const [notifications, setNotifications] = useState<NotificationModel[]>()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingModal, setIsLoadingModal] = useState(false)
    const [follow, setFollower] = useState<FollowModel[]>([])
    const user = useSelector(authSelector)
    const [yourFollowers, setYourFollowers] = useState<FollowModel[]>([])
    const auth = useSelector(authSelector)
    // useEffect(() => {
    //     handleCallAPIGetNotifications(true)
    //     handleCallApiGetFollowerById()
    // }, [auth])
    const handleCallApiGetFollowerById = async (isLoading?: boolean) => {
        if (user.id) {
          const api = apis.follow.getById(user.id)
          isLoading && setIsLoading(isLoading)
    
          try {
            const res: any = await followAPI.HandleFollwer(api, {}, 'get');
            if (res && res.data && res.status === 200) {
              setFollower(res.data.followers)
              setYourFollowers(res.data.yourFollowers)
            }
            isLoading && setIsLoading(false)
    
          } catch (error: any) {
            const errorMessage = JSON.parse(error.message)
            console.log("FollowerScreen", errorMessage)
            isLoading && setIsLoading(false)
    
          }
        }
      }
    const handleCallAPIGetNotifications = async (isLoading?: boolean) => {
        const api = apis.notification.getNotificationsById({ idUser: user.id, typeFillter: 'follow', statusFillter: 'unanswered' })
        setIsLoading(isLoading ? isLoading : false)
        try {
            const res: any = await notificationAPI.HandleNotification(api)
            if (res && res.data && res.status === 200) {
                setNotifications(res.data.notifications)
            }
            setIsLoading(false)
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
    const renderStatusNotification = (notification: NotificationModel) => {
        switch (notification.status) {
            case 'unanswered':
                return (
                    <RowComponent>

                        <ButtonComponent text="Chấp nhập" type="primary" width={'auto'} styles={{ minHeight: 20, borderRadius: 5, paddingVertical: 10, width: appInfo.sizes.WIDTH * 0.32 }}
                            onPress={() => console.log("ok")}
                        />
                        <SpaceComponent width={20} />

                        <ButtonComponent text="Từ chối" type="primary" color={colors.backgroundSearchInput} width={'auto'} textColor={colors.colorText}
                            styles={{ minHeight: 20, borderRadius: 5, paddingVertical: 10, width: appInfo.sizes.WIDTH * 0.32, borderColor: colors.white }} onPress={() => console.log("ok")} />
                    </RowComponent>
                )
            default:
                return <></>
        }
    }
    const handleRemoveNotification = (notification: NotificationModel) => {
        let notificationsCopy: NotificationModel[] = notifications ? [...notifications] : []
        const index = notificationsCopy.findIndex(item => item.recipientId._id === notification.recipientId._id && item.senderID._id === notification.senderID._id)
        if (index != -1) {
            notificationsCopy.splice(index, 1)
        }
        setNotifications(notificationsCopy)
    }
    // const handleRejectNotification = async (notification: NotificationModel) => {
    //     const api = apis.notification.updateStatusNotifications()
    //     setIsLoadingModal(true)
    //     try {
    //         const res: any = await notificationAPI.HandleNotification(api, { idUserFollow: notification.senderID._id, idUserFollowed: notification.recipientId._id, type: 'rejected' }, 'put')
    //         setIsLoadingModal(false)
    //         if (res && res.status === 200) {
    //             handleRemoveNotification(notification)
    //             // socket.emit('getNotifications',{idUser: auth?.id})
    //         }
    //     } catch (error: any) {
    //         const errorMessage = JSON.parse(error.message)
    //         if (errorMessage.statusCode === 403) {
    //             console.log(errorMessage.message)
    //         } else {
    //             console.log('Lỗi rồi')
    //         }
    //         setIsLoadingModal(false)
    //     }
    // }
    // const handleComfirmNofitication = async (notification: NotificationModel) => {
    //     const api = apis.notification.updateStatusNotifications()
    //     setIsLoadingModal(true)
    //     try {
    //         const res: any = await notificationAPI.HandleNotification(api, { idUserFollow: notification.senderID._id, idUserFollowed: notification.recipientId._id, type: 'answered' }, 'put')
    //         setIsLoadingModal(false)
    //         if (res && res.status === 200) {
    //             handleRemoveNotification(notification)
    //             // socket.emit('getNotifications',{idUser: auth?.id})
    //             // socket.emit('followUser',{idUser:auth?.id})
    //         }
    //     } catch (error: any) {
    //         const errorMessage = JSON.parse(error.message)
    //         if (errorMessage.statusCode === 403) {
    //             console.log(errorMessage.message)
    //         } else {
    //             console.log('Lỗi rồi')
    //         }
    //         setIsLoadingModal(false)
    //     }
    // }
    const renderNofitications = (value: NotificationModel) => {
        return (
            <View key={`${value._id}`} style={{ flex: 1, paddingHorizontal: 12, backgroundColor: colors.white }}>
                <RowComponent key={`${value._id}`} styles={{ flex: 1, minHeight: appInfo.sizes.HEIGHT / 8, paddingTop: 10, alignItems: 'flex-start' }} >
                    <AvatarItem size={sizeGlobal.avatarItem} styles={{}} photoUrl={value.senderID?.photoUrl} isShowIconAbsolute typeIcon="follow" onPress={() => navigation.navigate("AboutProfileScreen", { uid: value.senderID._id })} />
                    <View style={{ flex: 1, paddingHorizontal: 12, minHeight: '100%' }}>

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
                    </View>

                </RowComponent>

            </View>
        )
    }
    // const emptyNotificationComponent = ()=>{
    //     return (
    //         <SectionComponent styles={{
    //             justifyContent:'center',
    //             alignItems:'center',
    //             height:appInfo.sizes.HEIGHT*0.2
    //         }}>
    //             <TextComponent text={'Không có lời mời theo dõi nào'}/>
    //         </SectionComponent>
    //     )
    // }
    return (
        <ContainerComponent back title="Bạn bè" 
        right={<SearchNormal size={20} color={colors.white} />}
        onPressRight={() => navigation.push('FriendsScreen', { screen: 'SearchFriendScreen' })}
        >
            <SectionComponent>
                <RowComponent>
                    {/* <TagComponent
                        bgColor={colors.backgroundSearchInput}
                        label={'Tìm kiếm người dùng'}
                        textColor={colors.black}
                        textSize={14}
                        onPress={() => navigation.push('FriendsScreen', { screen: 'FindFriendScreen' })}
                        styles={{
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            maxWidth: appInfo.sizes.WIDTH * 0.4
                        }}
                    />
                    <SpaceComponent width={8} /> */}
                    <TagComponent
                        bgColor={colors.backgroundSearchInput}
                        label={'Danh sách theo dõi'}
                        textColor={colors.black}
                        textSize={14}
                        onPress={() => navigation.push('FriendsScreen', { screen: 'ListFriendsScreen' })}

                        // onPress={() => navigation.push('FriendsScreen', { screen: 'ListFriendsScreen',params: { followRoute:follow,yourFollowersRoute:yourFollowers } })}
                        styles={{
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            width:'auto'
                        }}
                    />
                </RowComponent>
                <SpaceComponent height={0} />
                {/* <View style={{
                    width: '100%',
                    backgroundColor: colors.gray3,
                    height: 1
                }} /> */}
            </SectionComponent>
            {/* <SectionComponent styles={{}}>
                <TabBarComponent
                    styles={{ paddingHorizontal: 0, paddingVertical: 0, marginBottom: 0 }}
                    title={`Lời mời theo dõi  ${notifications?.length || ''}`}
                    onPress={() => console.log("ok")}
                    textSizeTitle={20}
                />
            </SectionComponent> */}
            {/* <View>
                {
                    isLoading  ? <LoadingComponent isLoading={isLoading} value={notifications?.length || 0} /> 
                    : (notifications && notifications?.length > 0) ?  <FlatList
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                    data={notifications}
                    renderItem={({ item, index }) => renderNofitications(item)}
                /> : <EmptyComponent message="Không có lời mời theo dõi nào" />
                }
            </View> */}
            {/* <DataLoaderComponent data={notifications} isLoading={isLoading} 
            messageEmpty="Không có lời mời theo dõi nào"
            children={
                <FlatList
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
                data={notifications}
                renderItem={({ item, index }) => renderNofitications(item)}
            />
            }/> */}


           {
             !isLoading && <SectionComponent styles={{}}>
             <View style={{
                 width: '100%',
                 backgroundColor: colors.gray3,
                 height: 1
             }} />

             <SpaceComponent height={12} />
             <TextComponent
                 styles={{ paddingHorizontal: 0, paddingVertical: 0, marginBottom: 0 }}
                 text="Những người bạn có thể biết"
                 size={20}
                 title
             />
         </SectionComponent>
           }
            <LoadingModal visible={isLoadingModal} />
        </ContainerComponent>
    )
}
export default HomeFriendsScreen;