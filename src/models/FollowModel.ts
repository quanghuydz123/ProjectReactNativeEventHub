import { ReactNode } from "react";
import { UserModel } from "./UserModel";
import { EventModelNew } from "./EventModelNew";
import { CategoryModel } from "./CategoryModel";

export interface FollowModel {
    _id: string,
    user:UserModel,
    events:EventModelNew[],
    categories:CategoryModel[],
    users:{
        idUser:UserModel,
        status:boolean,
        idNotification:string
    }[]
}