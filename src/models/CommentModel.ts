import { UserModel } from "./UserModel"


export interface CommentModel {
    _id: string
    user:{
      _id:string,
      fullname:string,
      photoUrl?:string
    },
    content:string,
    event:string,
    replyComment:{
      _id:string,
      user:{
        _id:string,
        fullname:string,
        photoUrl?:string
      },
      content:string,
      seeMore?:boolean,
      createdAt:Date
    }[],
    replyCommentCount:number
    createdAt:Date
    isLoading?:boolean

  }
  