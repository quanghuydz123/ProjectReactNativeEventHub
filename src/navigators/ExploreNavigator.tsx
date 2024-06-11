import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventDetails, HomeScreen, SearchEventsScreen } from "../screens";

const ExploreNavigator = ()=>{
const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SearchEventsScreen" component={SearchEventsScreen} />
    </Stack.Navigator>
  )
}
export default ExploreNavigator;