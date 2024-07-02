import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"
import { StatusBar } from "react-native"


export const useStatusBar = (style:any)=>{
    useFocusEffect(
        useCallback(()=>{
            StatusBar.setBarStyle(style)
        },[])
    )
}