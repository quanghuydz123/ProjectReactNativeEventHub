import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {HomeFriendsScreen, MapScreen,ListFriendsScreen, FindFriendScreen} from "../screens";
import { useStatusBar } from "../hooks/useStatusBar";

const FriendsNavigate = ()=>{
const Stack = createNativeStackNavigator();
useStatusBar('dark-content')

  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="HomeFriendsScreen" component={HomeFriendsScreen} />
        <Stack.Screen name="ListFriendsScreen" component={ListFriendsScreen} />
        <Stack.Screen name="FindFriendScreen" component={FindFriendScreen} />

    </Stack.Navigator>
  )
}
export default FriendsNavigate;