import { ReactNode } from "react";
import { UserModel } from "./UserModel";
import { EventModelNew } from "./EventModelNew";

export interface FollowerModel {
    _id: string,
    status:boolean,
    user:UserModel,
    event:EventModelNew
}