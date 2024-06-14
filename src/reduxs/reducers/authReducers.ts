import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    id: string,
    email: string,
    accesstoken: string,
    fullname: string,
    isAdmin: boolean,
    photoUrl: string,
    position: {
        lat: number,
        long: number
    }
}

const initialState: AuthState = {
    id: '',
    email: '',
    accesstoken: '',
    fullname: '',
    isAdmin: false,
    photoUrl: '',
    position: {
        lat: 0,
        long: 0
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
            const { lat, long } = action.payload;
            // Kiểm tra và gán giá trị mới cho position
            state.authData.position = {
                lat: lat ?? state.authData.position.lat,
                long: long ?? state.authData.position.long
            };
        }
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, addPositionUser } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;
