/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging"
import { handleLinking } from './src/utils/handleLinking';
messaging().setBackgroundMessageHandler(async mess =>{ //Xử khi người dùng tắt app và ấn thông báo
    console.log("mes1",mess)
    handleLinking(`com.appeventhubmoinhat123://app/detail/666b0dcfedb7fe46ae8ecdd9`)
})

messaging().onNotificationOpenedApp(mess => {//Xử khi người dùng tắt app (Nhưng vẫn chạy ngầm) và ấn thông báo
    console.log("mes2",mess)
    if(mess.data.type==='InviteUserToEvent'){
        handleLinking(`com.appeventhubmoinhat123://app/detail/${mess.data.id}`)
    }
})
AppRegistry.registerComponent(appName, () => App);
