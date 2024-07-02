/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging"
import { handleLinking } from './src/utils/handleLinking';
messaging().setBackgroundMessageHandler(async mess =>{
    handleLinking(`eventhub://app`)
})

messaging().onNotificationOpenedApp(mess => { //xử lý khi click vào thông báo
    handleLinking(`eventhub://app`)
})
AppRegistry.registerComponent(appName, () => App);
