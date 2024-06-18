import axios from "axios";
import queryString from "query-string";
import { appInfo } from "../constrants/appInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
const getAccessToken = async () =>{
    const res = await AsyncStorage.getItem('auth')
    return res ? JSON.parse(res).accesstoken : ''
}
const axiosClient = axios.create({
    baseURL:appInfo.BASE_URL,
    paramsSerializer: params => queryString.stringify(params)
})


axiosClient.interceptors.request.use(async (config:any)=>
{
    const accessToken = await getAccessToken()
    config.headers = {
        Authorization : accessToken ? `Bearer ${accessToken}` : '',
        Accept: 'application/json',
        ...config.headers
    }

    config.data

    return config
})


axiosClient.interceptors.response.use(res => {
    if(res.data && res.status === 200){
        return res.data
    }
    throw new Error('Lỗi rồi')
}, error =>{
    console.log(`Error api: " ${JSON.stringify(error)}}`)
    const messageError = {
        message:error.response.data.message,
        statusCode:error.response.data.statusCode
    }
    throw new Error(JSON.stringify(messageError))
})


export default axiosClient
