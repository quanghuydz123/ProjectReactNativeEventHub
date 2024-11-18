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
    },
    address:{
      province:{
          name:{type:string},
          code:{type:number},
      },
      districts:{
          name:{type:string},
          code:{type:number},
      },
      ward:{
          name:{type:string},
          code:{type:number},
      },
      houseNumberAndStreet:{type:string}
    },
    eventsInterested?:{
      event:string,
      createdAt:Date
    }
    viewedEvents:[{
      event:EventModelNew,
      createdAt?:Date
    }] | []
    numberOfFollowers:{type:number},
    numberOfFollowing:{type:number},
    idRole:RoleModel,
    createAt: string,
    updateAt: string,
    __v: number
  }