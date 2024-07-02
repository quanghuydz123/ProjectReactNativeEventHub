import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventDetails, HomeScreen, SearchEventsScreen } from "../screens";
import { useStatusBar } from "../hooks/useStatusBar";

const ExploreNavigator = ()=>{
const Stack = createNativeStackNavigator();
useStatusBar('light-content')

  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  )
}
export default ExploreNavigator;