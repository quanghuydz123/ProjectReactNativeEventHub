import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class CategoryAPI {
    HandleCategory = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/category${url}`,{
            method: method ?? 'get',
            data
        })
    }
}

const categoryAPI = new CategoryAPI()
export default categoryAPI