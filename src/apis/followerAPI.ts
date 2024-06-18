import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class FollowerAPI {
    HandleFollwer = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/follower${url}`,{
            method: method ?? 'get',
            data
        })
    }
}

const followerAPI = new FollowerAPI()
export default followerAPI