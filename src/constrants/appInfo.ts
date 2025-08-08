import { Dimensions } from "react-native";

export const appInfo = {
    sizes:{
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height
    },
    BASE_URL: 'http://172.16.0.158:3001'
    // BASE_URL: 'http://localhost:3001'

}