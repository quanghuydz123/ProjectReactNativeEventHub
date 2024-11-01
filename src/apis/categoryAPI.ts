import { appInfo } from "../constrants/appInfo"
import { CategoryModel } from "../models/CategoryModel"
import axiosClient from "./axiosClient"
// interface ResponseCategory{
//     status?:number,
//     message?:string,
//     data?:CategoryModel[] | CategoryModel
// }
class CategoryAPI {
    HandleCategory = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        const response:any =  await axiosClient(`/category${url}`,{
            method: method ?? 'get',
            data
        })
        return response;
    }
}

const categoryAPI = new CategoryAPI()
export default categoryAPI