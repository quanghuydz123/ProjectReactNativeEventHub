import { RoleModel } from "./RoleModel"

export interface UserModel {
    _id: string
    fullname: string
    email: string
    password: string
    photoUrl?:string
    phoneNumber?:string,
    bio?:string
    fcmTokens?:[]
    position?:{
      lat:number,
      lng:number
    }
    idRole:RoleModel
    createAt: string
    updateAt: string
    __v: number
  }