import { configureStore, } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducers";
import { constantReducer } from "./reducers/constantReducers";

const store = configureStore({
    reducer:{
        authReducer,
        constantReducer
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //       serializableCheck: false,  // Disables non-serializable check (not recommended)
    //     }),
})


export default store