import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducers";

const store = configureStore({
    reducer:{
        authReducer
    }
})


export default store