
import { PromotionModel } from "./PromotionModel"


export interface TypeTicketModel {
    _id: string
    name:string,
    amount?:number,
    description:string,
    type:'Free' | 'Paid',
    price:number,
    startSaleTime:Date,
    promotion:PromotionModel[],
    endSaleTime:Date,
    status:'NotStarted' | 'OnSale' | "Ended" | "SoldOut" | "Canceled",

}