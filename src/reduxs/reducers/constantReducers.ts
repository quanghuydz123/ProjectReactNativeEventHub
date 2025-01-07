import { createSlice } from "@reduxjs/toolkit";
import { RoleModel } from "../../models/RoleModel";
import { EventModelNew } from "../../models/EventModelNew";

export interface constantState {
    nameScreen:string,
    indexTabSelected:number
    events:EventModelNew[]
}

const initialState: constantState = {
    nameScreen:'',
    indexTabSelected:0,
    events:[]
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
        updateEvents:(state, action) => {
            const {events} = action.payload
            state.constantData.events = events;
        },
    }
});

export const constantReducer = constantSlice.reducer;
export const {updateNameScreen, updateIndexTabSelected,updateEvents } = constantSlice.actions;
export const constantSelector = (state: any) => state.constantReducer.constantData;
