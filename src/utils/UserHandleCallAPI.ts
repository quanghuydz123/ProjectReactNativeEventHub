import userAPI from "../apis/userApi";
import { apis } from "../constrants/apis";

export class UserHandleCallAPI{
    static getAll = async(setData:any,setIsLoading?:boolean)=>{
        const api = apis.user.getAll()
        try {
          const res:any = await userAPI.HandleUser(api, {}, 'get');
          if(res && res.data){
            setData(res.data.users)
          }
        } catch (error:any) {
          const errorMessage = JSON.parse(error.message)
          console.log(errorMessage)
        }
    }
}