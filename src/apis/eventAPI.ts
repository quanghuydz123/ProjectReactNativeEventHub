import { appInfo } from "../constrants/appInfo"
import { EventModelNew } from "../models/EventModelNew"
import axiosClient from "./axiosClient"
interface ResponseEvent{
        status?:number,
        message?:string,
        data?:EventModelNew[] | EventModelNew
}
class EventAPI {
    HandleEvent = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        const response:ResponseEvent =  await axiosClient(`/event${url}`,{
            method: method ?? 'get',
            data
        })
        return response;
    }
}

const eventAPI = new EventAPI()
export default eventAPI



// class EventAPI {
//     HandleEvent = async <T> (
//         url:string,
//         data?:any,
//         method?: 'get' | 'post' | 'put' | 'delete'
//     ):Promise<T> =>{
//         const response =  await axiosClient(`/event${url}`,{
//             method: method ?? 'get',
//             data
//         })
//         return response as T;
//     }
// }