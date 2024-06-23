export interface UserModel {
    _id: string
    fullname: string
    email: string
    password: string
    isAdmin: boolean
    photoUrl?:string
    phoneNumber?:string,
    bio?:string
    fcmTokens?:[]
    position?:{
      lat:number,
      lng:number
    }
    createAt: string
    updateAt: string
    __v: number
  }