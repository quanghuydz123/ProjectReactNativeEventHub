import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";

export interface constantState {
    nameScreen:string,
    indexTabSelected:number

}

const initialState: constantState = {
    nameScreen:'',
    indexTabSelected:0
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
        updateIndexTabSelected:(state, action) => {
            const {indexTabSelected} = action.payload
            state.constantData.indexTabSelected = indexTabSelected;
        },
    }
});

export const constantReducer = constantSlice.reducer;
export const {updateNameScreen, updateIndexTabSelected } = constantSlice.actions;
export const constantSelector = (state: any) => state.constantReducer.constantData;
