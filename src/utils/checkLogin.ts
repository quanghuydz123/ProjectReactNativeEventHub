import { AuthState } from "../reduxs/reducers/authReducers"


const checkLogin = (auth:AuthState,navigation:any)=>{
    if(!auth.accesstoken){
      navigation.navigate('LoginScreen')
      return false
    }
    return true
}

export default checkLogin