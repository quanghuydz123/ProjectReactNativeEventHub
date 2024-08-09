import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class FollowAPI {
    HandleFollwer = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/follow${url}`,{
            method: method ?? 'get',
            data
        })
    }
}

const followAPI = new FollowAPI()
export default followAPI