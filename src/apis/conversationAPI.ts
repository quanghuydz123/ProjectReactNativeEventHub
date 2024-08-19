import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class ConversationApi {
    HandleConversation = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/conversations${url}`,{
            method: method ?? 'get',
            data
        })
    }   
}

const conversationAPI = new ConversationApi()
export default conversationAPI