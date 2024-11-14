import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";
import { CategoryModel } from "../../models/CategoryModel";
import { EventModelNew } from "../../models/EventModelNew";
import { FollowModel } from "../../models/FollowModel";

export interface AuthState {
    id: string,
    email: string,
    accesstoken: string,
    fullname: string,
    photoUrl: string,
    numberPhone:string,
    bio:string,
    fcmTokens:string[],
    loginMethod:'google' | 'account' | ''
    role:RoleModel
    position: {
        lat: number,
        lng: number
    }
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
    follow:FollowModel | null
}

const initialState: AuthState = {
    id: '',
    email: '',
    accesstoken: '',
    fullname: '',
    numberPhone:'',
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
    follow:null
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
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, addPositionUser,updateFcmToken,updateEventsInterested,updateCategoriesInterested,addViewedEvent } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;
