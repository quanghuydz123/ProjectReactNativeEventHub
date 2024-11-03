import { UserModel } from "./UserModel"

export interface OrganizerModel {
    _id: string
    address?: string
    contact?:{
        linkFacebook?:{type:String},
        linkZalo?:{type:String},
        linkYoutube?:{type:String},
        linkWebsite?:{type:String},
        email?:{type:String}
    },
    user:UserModel,
    eventCreated:[String]
  }