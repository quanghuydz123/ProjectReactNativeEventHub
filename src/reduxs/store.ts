import { configureStore, } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducers";
import { constantReducer } from "./reducers/constantReducers";
import { billingReducer } from "./reducers/billingReducer";

const store = configureStore({
    reducer:{
        authReducer,
        constantReducer,
        billingReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,  // Disables non-serializable check (not recommended)
        }),
})


export default store