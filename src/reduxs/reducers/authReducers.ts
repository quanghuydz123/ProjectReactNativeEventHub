import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";

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
    }
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
        }
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, addPositionUser,updateFcmToken } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;
