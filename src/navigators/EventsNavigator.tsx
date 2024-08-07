import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventsScreen } from "../screens";
import { useStatusBar } from "../hooks/useStatusBar";

const EventsNavigator = ()=>{
const Stack = createNativeStackNavigator();
useStatusBar('dark-content')
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="EventScreen" component={EventsScreen} />
    </Stack.Navigator>
  )
}
export default EventsNavigator;