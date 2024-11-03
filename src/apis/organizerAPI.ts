import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class OrganizerAPI {
    HandleOrganizer = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/organizers${url}`,{
            method: method ?? 'get',
            data
        })
    }
}

const organizerAPI = new OrganizerAPI()
export default organizerAPI