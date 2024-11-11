import { EventModelNew } from "./EventModelNew"
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
    eventsInterested?:{
      event:string,
      createdAt:Date
    }
    viewedEvents:[{
      event:EventModelNew,
      createdAt?:Date
    }]
    idRole:RoleModel
    createAt: string
    updateAt: string
    __v: number
  }