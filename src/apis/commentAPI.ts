import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class CommentAPI {
    HandleComment = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/comments${url}`,{
            method: method ?? 'get',
            data
        })
    }   
}

const commentAPI = new CommentAPI()
export default commentAPI