import { appInfo } from "../constrants/appInfo"
import { FollowModel } from "../models/FollowModel"
import axiosClient from "./axiosClient"
interface ResponseCategory{
    status?:number,
    message?:string,
    data?:FollowModel[] | FollowModel
}
class FollowAPI {
    HandleFollwer = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        const response:ResponseCategory =  await axiosClient(`/follow${url}`,{
            method: method ?? 'get',
            data
        })
        return response;
    }
}

const followAPI = new FollowAPI()
export default followAPI