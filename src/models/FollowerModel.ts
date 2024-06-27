import { ReactNode } from "react";
import { UserModel } from "./UserModel";
import { EventModelNew } from "./EventModelNew";
import { CategoryModel } from "./CategoryModel";

export interface FollowerModel {
    _id: string,
    user:UserModel,
    events:EventModelNew[],
    categories:CategoryModel[],
    users:UserModel[]
}