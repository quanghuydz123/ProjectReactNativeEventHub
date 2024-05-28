import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventsScreen } from "../screens";

const EventsNavigator = ()=>{
const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="EventScreen" component={EventsScreen} />
    </Stack.Navigator>
  )
}
export default EventsNavigator;