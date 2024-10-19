import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducers";
import { constantReducer } from "./reducers/constantReducers";

const store = configureStore({
    reducer:{
        authReducer,
        constantReducer
    }
})


export default store