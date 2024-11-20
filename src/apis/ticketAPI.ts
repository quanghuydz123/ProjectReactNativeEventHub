import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class TicketAPI {
    HandleTicket = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/tickets${url}`,{
            method: method ?? 'get',
            data
        })
    }   
}

const ticketAPI = new TicketAPI()
export default ticketAPI