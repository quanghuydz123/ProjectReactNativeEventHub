import Toast from "react-native-toast-message";

export class ToastMessaging {
    static Success = (message?:string)=>{
        Toast.show({
            type: 'success',
            text1:message ?? 'Cập nhập thành công',
            visibilityTime:1000
        });
    }
    static Error = (message?:string)=>{
        Toast.show({
            type: 'error',
            text1: message ?? 'Lỗi rồi',
            visibilityTime:1000
        });
    }
}