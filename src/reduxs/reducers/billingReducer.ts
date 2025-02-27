import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";
import { ShowTimeModel } from "../../models/ShowTimeModel";
import { TypeTicketModel } from "../../models/TypeTicketModel";
import { EventModelNew } from "../../models/EventModelNew";

export interface billingState {
    showTimes: ShowTimeModel, 
    idEvent: string, 
    titleEvent: string, 
    addRessEvent: string, 
    locationEvent: string,
    totalPrice:number,
    totalTicket?:number,
    ticketChose?:[{
        ticket:TypeTicketModel,
        amount:number
    }],
    ticketsReserve?:string[],
    relatedEvents?:EventModelNew[],
    orderTime:number,
    totalDiscount:number,
    totalDiscountByCoin:number,
    isApplyCoinDiscount:boolean

}

const initialState: billingState = {
    showTimes:{
        _id:"",
        endDate:new Date(),
        startDate:new Date(),
        status:'NotStarted',
        typeTickets:[{
            _id:'',
            description:"",
            name:'',
            price:0,
            startSaleTime:new Date(),
            status:'Ended',
            endSaleTime:new Date(),
            type:'Paid',
            amount:0,
            promotion:[]
        }]
    },
    idEvent:'',
    addRessEvent:'',
    locationEvent:'',
    titleEvent:'',
    ticketsReserve:[],
    relatedEvents:[],
    orderTime:0,
    totalPrice:0,
    totalDiscount:0,
    totalDiscountByCoin:0,
    isApplyCoinDiscount:false
    
}

const billingSlice = createSlice({
    name: 'billing',
    initialState: {
        billingData: initialState
    },
    
    reducers: {
    addShowTimeChose: (state, action) => {
        state.billingData = action.payload
    },
    addtotalPriceAndTicket: (state, action) => {
    const {totalTicketChose,totalPrice,ticketChose,ticketsReserve,minutes,seconds,orderTime,totalDiscount} = action.payload
        state.billingData.totalPrice = totalPrice,
        state.billingData.totalTicket = totalTicketChose
        state.billingData.ticketChose = ticketChose
        state.billingData.ticketsReserve = ticketsReserve
        state.billingData.orderTime = orderTime
        state.billingData.totalDiscount = totalDiscount
        state.billingData.isApplyCoinDiscount = false
        state.billingData.totalDiscountByCoin = 0
    },
    addEventRelated: (state, action) => {
        const {relatedEvents} = action.payload
        state.billingData.relatedEvents = relatedEvents
    },
    removeShowTimeChose: (state, action) => {
        state.billingData = initialState;
    },
    updateTimeOrder: (state, action) => {
        const {orderTime} = action.payload
        state.billingData.orderTime = orderTime 
    },
    toggleApplyCoinDiscount: (state, action) => {
        const {totalDiscountByCoin,isApply} = action.payload
        state.billingData.isApplyCoinDiscount = isApply
        if(isApply){
            state.billingData.totalDiscountByCoin = totalDiscountByCoin 
            state.billingData.totalPrice -= totalDiscountByCoin
        }else{
            state.billingData.totalDiscountByCoin = 0 
            state.billingData.totalPrice += totalDiscountByCoin
        }
       
    },
    }
});

export const billingReducer = billingSlice.reducer;
export const {addShowTimeChose,addtotalPriceAndTicket,addEventRelated,updateTimeOrder,toggleApplyCoinDiscount} = billingSlice.actions;
export const billingSelector = (state: any) => state.billingReducer.billingData;
