import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging'
import userAPI from '../apis/userApi';

export class HandleNotification {
    static checkNotifitionPersion = async () => {
        const authStatus = await messaging().requestPermission();
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL // cấp phép yêu cầu người dùng
        ) {
            this.getFcmToken()
        }
    }

    static getFcmToken = async () => {
        const fcmToken = await AsyncStorage.getItem('fcmtoken')
        const token = await messaging().getToken()
        if (!fcmToken) {
            if (token) {
                await AsyncStorage.setItem('fcmtoken', token)
                this.updateTokenForUser(token)
            }
        } else {
            this.updateTokenForUser(token)
        }
    }
    static updateTokenForUser = async (token: string) => {
        const res = await AsyncStorage.getItem('auth')
        if (res) {
            const auth = JSON.parse(res)
            const { fcmTokens } = auth  
            if (fcmTokens && !fcmTokens.includes(token)) {
                fcmTokens.push(token)
                await this.Update(auth.id,fcmTokens)
            }else{
                console.log("dúng rồi")
            }
            console.log("auth123", auth)

        }

    }
    static Update = async (id:string,items:string[])=>{
        try {
            const data = await userAPI.HandleUser('/update-fcmtoken', { uid: id, fcmtokens: items }, 'post')
        } catch (error: any) {
            const errorMessage = JSON.parse(error.message)
            if (errorMessage.statusCode === 403) {
                console.log(errorMessage.message)
            } else {
                console.log('Lỗi rồi handleNotification')
            }
        }
    }
}