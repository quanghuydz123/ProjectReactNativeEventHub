import { Button, Text, TouchableOpacity, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components";
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

const HomeFriendsScreen = ({ navigation }: any) => {
    const [notifications, setNotifications] = useState<NotificationModel[]>()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingModal, setIsLoadingModal] = useState(false)
    const user = useSelector(authSelector)
    useEffect(() => {
        handleCallAPIGetNotifications(true)
    }, [])
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
                            onPress={() => handleComfirmNofitication(notification)}
                        />
                        <SpaceComponent width={20} />

                        <ButtonComponent text="Từ chối" type="primary" color={colors.backgroundSearchInput} width={'auto'} textColor={colors.colorText}
                            styles={{ minHeight: 20, borderRadius: 5, paddingVertical: 10, width: appInfo.sizes.WIDTH * 0.32, borderColor: colors.white }} onPress={() => handleRejectNotification(notification)} />
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
    const handleRejectNotification = async (notification: NotificationModel) => {
        const api = apis.notification.updateStatusNotifications()
        setIsLoadingModal(true)
        try {
            const res: any = await notificationAPI.HandleNotification(api, { idUserFollow: notification.senderID._id, idUserFollowed: notification.recipientId._id, type: 'rejected' }, 'put')
            setIsLoadingModal(false)
            if (res && res.status === 200) {
                handleRemoveNotification(notification)
                socket.emit('getNotifications')
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
                handleRemoveNotification(notification)
                socket.emit('getNotifications')
                socket.emit('followUser')
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
    const renderNofitications = (value: NotificationModel) => {
        return (
            <View key={`${value._id}`} style={{ flex: 1, paddingHorizontal: 12, backgroundColor: colors.white }}>
                <RowComponent key={`${value._id}`} styles={{ flex: 1, minHeight: appInfo.sizes.HEIGHT / 8, paddingTop: 10, alignItems: 'flex-start' }} >
                    <AvatarItem size={66} styles={{}} photoUrl={value.senderID?.photoUrl} isShowIconAbsolute typeIcon="follow" onPress={() => navigation.navigate("AboutProfileScreen", { uid: value.senderID._id })} />
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
    return (
        <ContainerComponent back title="Bạn bè" right={<SearchNormal size={20} color={colors.gray} />}>
            <SectionComponent>
                <RowComponent>
                    <TagComponent
                        bgColor={colors.backgroundSearchInput}
                        label={'Tìm kiếm bạn bè'}
                        textColor={colors.black}
                        textSize={14}
                        onPress={() => navigation.push('FriendsScreen', { screen: 'FindFriendScreen' })}
                        styles={{
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            maxWidth: appInfo.sizes.WIDTH * 0.4
                        }}
                    />
                    <SpaceComponent width={8} />
                    <TagComponent
                        bgColor={colors.backgroundSearchInput}
                        label={'Danh sách bạn bè'}
                        textColor={colors.black}
                        textSize={14}
                        onPress={() => navigation.push('FriendsScreen', { screen: 'ListFriendsScreen' })}
                        styles={{
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            maxWidth: appInfo.sizes.WIDTH * 0.4
                        }}
                    />
                </RowComponent>
                <SpaceComponent height={20} />
                <View style={{
                    width: '100%',
                    backgroundColor: colors.gray3,
                    height: 1
                }} />
            </SectionComponent>
            <SectionComponent styles={{}}>
                <TabBarComponent
                    styles={{ paddingHorizontal: 0, paddingVertical: 0, marginBottom: 0 }}
                    title={`Lời mời theo dõi  ${notifications?.length || 0}`}
                    onPress={() => console.log("ok")}
                    textSizeTitle={20}
                />
            </SectionComponent>
            <View>
                {
                    isLoading ? <LoadingComponent isLoading={isLoading} value={notifications?.length || 0} /> : <FlatList
                        contentContainerStyle={{ paddingBottom: 16 }}
                        showsVerticalScrollIndicator={false}
                        data={notifications}
                        renderItem={({ item, index }) => renderNofitications(item)}
                    />
                }
            </View>


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