import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class UserApi {
    HandleUser = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/users${url}`,{
            method: method ?? 'get',
            data
        })
    }
}

const userAPI = new UserApi()
export default userAPI