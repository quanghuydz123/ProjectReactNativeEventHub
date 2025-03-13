import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class KeywordAPI {
    HandleKeyword = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/keywords${url}`,{
            method: method ?? 'get',
            data
        })
    }   
}

const keywordAPI = new KeywordAPI()
export default keywordAPI