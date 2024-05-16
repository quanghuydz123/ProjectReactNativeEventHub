import { createSlice } from "@reduxjs/toolkit";
interface AuthState {
    id:string,
    email:string,
    accesstoken:string,
    fullname:string
}

const initalState:AuthState={
    id:'',
    email:'',
    accesstoken:'',
    fullname:'  '
}
const authSlide = createSlice({
    name:'auth',
    initialState:{
        authData:initalState
    },
    reducers:{
        addAuth:(state,action) => {
            state.authData = action.payload
        },
        removeAuth:(state,action) => {
            state.authData = initalState
        }
    }
})

export const authReducer = authSlide.reducer
export const {addAuth,removeAuth} = authSlide.actions
export const authSelector = (state:any) => state.authReducer.authData