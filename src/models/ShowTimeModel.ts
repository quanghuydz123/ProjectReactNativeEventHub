import { TypeTicketModel } from "./TypeTicketModel"

export interface ShowTimeModel {
    _id: string
    startDate:Date,
    endDate:Date,
    typeTickets:[TypeTicketModel],
    status:'NotStarted' | 'Ongoing' | 'Ended' | 'SoldOut' | 'OnSale'| 'SaleStopped' | 'NotYetOnSale' | 'Canceled'
}