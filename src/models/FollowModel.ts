import { ReactNode } from "react";
import { UserModel } from "./UserModel";
import { EventModelNew } from "./EventModelNew";
import { CategoryModel } from "./CategoryModel";

export interface FollowModel {
    _id: string,
    user:UserModel,
    users:{
        idUser:UserModel,
    }[]
}