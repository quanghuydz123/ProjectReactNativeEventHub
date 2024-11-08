import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"
import { StatusBar } from "react-native"


export const useStatusBar = (style:'light-content' | 'dark-content',animated?:boolean)=>{
    useFocusEffect(
        useCallback(()=>{
            StatusBar.setBarStyle(style,animated)
        },[style,animated])
    )
}