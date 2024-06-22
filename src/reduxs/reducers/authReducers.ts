import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
    id: string,
    email: string,
    accesstoken: string,
    fullname: string,
    isAdmin: boolean,
    photoUrl: string,
    fcmTokens:string[],
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
    isAdmin: false,
    photoUrl: '',
    fcmTokens:[],
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
        }
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, addPositionUser } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;
