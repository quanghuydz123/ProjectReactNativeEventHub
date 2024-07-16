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
    static Error = (message?:string)=>{
        Toast.show({
            type: 'error',
            text1: message ?? 'Lỗi rồi',
            visibilityTime:1500,
        });
    }
}