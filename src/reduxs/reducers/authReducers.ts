import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";
import { CategoryModel } from "../../models/CategoryModel";
import { EventModelNew } from "../../models/EventModelNew";
import { FollowModel } from "../../models/FollowModel";
export interface Invoice {
    _id: string
    invoiceCode: string
    totalTicket: number
    totalPrice: number
    user: string
    status: string
    createdAt: Date
    titleEvent: string
}
  
export interface AuthState {
    id: string,
    email: string,
    accesstoken: string,
    fullname: string,
    photoUrl: string,
    phoneNumber:string,
    bio:string,
    fcmTokens:string[],
    loginMethod:'google' | 'account' | ''
    role:RoleModel
    position: {
        lat: number,
        lng: number
    },
    address:{
        province:{
            name:string,
            code:number,
        },
        districts:{
            name:string,
            code:number,
        },
        ward:{
            name:string,
            code:number,
        },
        houseNumberAndStreet:string
    }
    ,
    eventsInterested:[{
        event:string,
        createdAt:Date | string
    }],
    categoriesInterested:[{
        category:CategoryModel,
    }],
    viewedEvents: { event: EventModelNew }[];
    numberOfFollowers:number,
    numberOfFollowing:number,
    follow:{
        _id:string,
        user:string,
        users:{
            idUser:string
        }[]
    },
    invoices:Invoice[][],
    isHasPassword:boolean,
    searchHistory:{
        _id:string,
        keyword:string,
        searchedAt:Date
    }[]

}

const initialState: AuthState = {
    id: '',
    email: '',
    accesstoken: '',
    fullname: '',
    phoneNumber:'',
    bio:'',
    photoUrl: '',
    loginMethod:'',
    fcmTokens:[],
    role:{
        _id:'',
        key:'',
        name:''
    },
    position: {
        lat: 0,
        lng: 0
    },
    address:{
        province:{name:'',code:0},
        districts:{name:'',code:0},
        ward:{name:'',code:0},
        houseNumberAndStreet:''
    },
    
    eventsInterested:[{
        event:'',
        createdAt:new Date().toISOString() as string
    }],
    categoriesInterested:[{
        category:{
            name:'',
            image:'',
            _id:''
        },
    }],
    viewedEvents:[],
    numberOfFollowers:0,
    numberOfFollowing:0,
    follow:{
        _id:'',
        user:'',
        users:[]
    },
    invoices:[],
    isHasPassword:true,
    searchHistory:[]
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authData: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            state.authData = action.payload;
        },
        removeAuth: (state) => {
            state.authData = initialState;
        },
        addPositionUser: (state, action) => {
            const { lat, lng } = action.payload;
            // Kiểm tra và gán giá trị mới cho position
            state.authData.position = {
                lat: lat ?? state.authData.position.lat,
                lng: lng ?? state.authData.position.lng
            };
        },
        updateFcmToken: (state,action)=>{
            const { fcmTokens } = action.payload;
            state.authData.fcmTokens=fcmTokens ?? state.authData.fcmTokens
        },
        updateEventsInterested:(state,action)=>{
            const { eventsInterested } = action.payload;
            state.authData.eventsInterested= eventsInterested
        },
        updateCategoriesInterested:(state,action)=>{
            const { categoriesInterested } = action.payload;
            state.authData.categoriesInterested= categoriesInterested
        },
        addViewedEvent:(state,action)=>{
            const { viewedEvents } = action.payload;
            state.authData.viewedEvents = viewedEvents
        },
        updateFollow:(state,action)=>{
            const { users } = action.payload;
            // Nếu `state.authData.follow` là null hoặc undefined, tạo một đối tượng mới
            state.authData.follow.users = users;

        },
        updateInvoices:(state,action)=>{
            const { invoices } = action.payload;
            state.authData = {  
                ...state.authData,
                invoices: [...invoices],         
            };

        },
        updateIsHasPassword:(state,action)=>{
            state.authData.isHasPassword = true
        },
        updateSearchHistory:(state,action)=>{
            const { searchHistory } = action.payload
            state.authData.searchHistory = searchHistory
        },
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, addPositionUser,updateFcmToken,updateFollow,updateEventsInterested,updateSearchHistory,updateIsHasPassword,updateCategoriesInterested,addViewedEvent,updateInvoices } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;
