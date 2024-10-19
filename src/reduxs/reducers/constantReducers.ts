import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";

export interface constantState {
    nameScreen:string

}

const initialState: constantState = {
    nameScreen:''
}

const constantSlice = createSlice({
    name: 'constant',
    initialState: {
        constantData: initialState
    },
    reducers: {
        updateNameScreen: (state, action) => {
            const {nameScreen} = action.payload
            state.constantData.nameScreen = nameScreen;
        },
    }
});

export const constantReducer = constantSlice.reducer;
export const {updateNameScreen } = constantSlice.actions;
export const constantSelector = (state: any) => state.constantReducer.constantData;
