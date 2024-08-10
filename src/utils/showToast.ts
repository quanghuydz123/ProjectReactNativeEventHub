import Toast from "react-native-toast-message";

export class ToastMessaging {
    static Success = ({message,title,onPress}:{message?:string,title?:string,onPress?:()=>void})=>{
        Toast.show({
            type: 'success',
            text1:title ?? 'Thông báo',
            text2:message ?? 'Cập nhập thành công',
            visibilityTime:500,
            onPress:onPress
        });
    }
    static Error = ({message,visibilityTime}:{message:string,visibilityTime?:number})=>{
        Toast.show({
            type: 'error',
            text1: message ?? 'Lỗi rồi',
            visibilityTime:visibilityTime ?? 1500,
        });
    }
    static Warning = ({message,visibilityTime}:{message?:string,visibilityTime?:number})=>{
        Toast.show({
            type: 'info',
            text1: message ?? 'Lỗi rồi',
            visibilityTime:visibilityTime ?? 1500,
        });
    }
}