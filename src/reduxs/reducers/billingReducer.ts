import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";
import { ShowTimeModel } from "../../models/ShowTimeModel";
import { TypeTicketModel } from "../../models/TypeTicketModel";

export interface billingState {
    showTimes: ShowTimeModel, 
    idEvent: string, 
    titleEvent: string, 
    addRessEvent: string, 
    locationEvent: string,
    totalPrice?:number,
    totalTicket?:number,
    ticketChose?:[{
        ticket:TypeTicketModel,
        amount:number
    }]

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
            amount:0
        }]
    },
    idEvent:'',
    addRessEvent:'',
    locationEvent:'',
    titleEvent:''
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
        const {totalTicketChose,totalPrice,ticketChose} = action.payload
        state.billingData.totalPrice = totalPrice,
        state.billingData.totalTicket = totalTicketChose
        state.billingData.ticketChose = ticketChose
    },
    removeShowTimeChose: (state, action) => {
        state.billingData = initialState;
    },
    }
});

export const billingReducer = billingSlice.reducer;
export const {addShowTimeChose,addtotalPriceAndTicket} = billingSlice.actions;
export const billingSelector = (state: any) => state.billingReducer.billingData;
