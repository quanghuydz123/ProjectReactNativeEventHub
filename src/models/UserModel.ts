export interface UserModel {
    _id: string
    fullname: string
    email: string
    password: string
    isAdmin: boolean
    position?:{
      lat:number,
      lng:number
    }
    createAt: string
    updateAt: string
    __v: number
  }