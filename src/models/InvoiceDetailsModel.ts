import { EventModelNew } from "./EventModelNew"
import { ShowTimeModel } from "./ShowTimeModel"
import { TypeTicketModel } from "./TypeTicketModel"

export interface InvoiceDetailsModel {
    ticketsPurchase:TicketsPurchase[],
    invoiceDetails:{
        _id: string
        fullname: string
        email: string
        paymentMethod: string
        phoneNumber: number
        fullAddress: string
        invoiceCode: string
        totalTicket: number
        totalPrice: number
        status: string
        createdAt: Date
        totalDiscount:number

    },
    showTimeDetails:ShowTimeModel,
    eventDetails:EventModelNew,

    
}

export interface TicketsPurchase{
    _id: string
    price: number
    isCheckIn: boolean
    qrCode: string
    status: string
    createdAt: string
    invoice: string
    showTime: string
    current_owner: string
    event: string,
    typeTicketDetails:TypeTicketModel,
    discountType:'FixedAmount' | 'Percentage',
    discountValue:number,
    promotion:string
}