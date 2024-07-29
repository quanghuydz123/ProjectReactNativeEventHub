import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {MapScreen, TransactionHistoryScreen } from "../screens";
import { useStatusBar } from "../hooks/useStatusBar";

const TransactionNavigator = ()=>{
const Stack = createNativeStackNavigator();
useStatusBar('dark-content')

  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="TransactionHistoryScreen" component={TransactionHistoryScreen} />
    </Stack.Navigator>
  )
}
export default TransactionNavigator;