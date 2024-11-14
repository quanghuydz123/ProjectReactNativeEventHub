import { Linking } from "react-native"

export const handleLinking = (url:string)=>{
    Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        console.log('Không thể mở URL:', url);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('Lỗi khi mở bản đồ:', err));
}