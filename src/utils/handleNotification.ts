import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging'
import userAPI from '../apis/userApi';
import { useDispatch } from 'react-redux';
import { updateFcmToken } from '../reduxs/reducers/authReducers';
export class HandleNotification {
    static checkNotifitionPersion = async (dispatch?:any) => {
        const authStatus = await messaging().requestPermission();
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL // cấp phép yêu cầu người dùng
        ) {
            this.getFcmToken(dispatch)
        }
    }

    static getFcmToken = async (dispatch?:any) => {
        const fcmToken = await AsyncStorage.getItem('fcmtoken')
        const token = await messaging().getToken()
        if (!fcmToken) {
            if (token) {
                await AsyncStorage.setItem('fcmtoken', token)
                this.updateTokenForUser(token,dispatch)
            }
        } else {
            this.updateTokenForUser(token,dispatch)
        }
    }
    static updateTokenForUser = async (token: string,dispatch?:any) => {
        const res = await AsyncStorage.getItem('auth')
        if (res) {
            const auth = JSON.parse(res)
            const { fcmTokens } = auth  
            if (fcmTokens && !fcmTokens.includes(token)) {
                fcmTokens.push(token)
                await this.Update(auth.id,fcmTokens,dispatch)
            }else{
                console.log("dúng rồi")
            }

        }

    }
    static Update = async (id:string,items:string[],dispatch?:any)=>{
        try {
            const res = await userAPI.HandleUser('/update-fcmtoken', { uid: id, fcmtokens: items }, 'post')
            if(res && res.data && res.status===200){
                dispatch && dispatch(updateFcmToken({fcmTokens:res?.data?.fcmTokens}))
            }
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