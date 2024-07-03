import { Platform, Text, View } from "react-native"
import React, { ReactNode } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ExploreNavigator from "./ExploreNavigator";
import EventsNavigator from "./EventsNavigator";
import { AddNewScreen } from "../screens";
import MapNavigator from "./MapNavigator";
import ProfileNavigator from "./ProfileNavigator";
import { colors } from "../constrants/color";
import { AddSquare, Home, Home2, Home3 } from "iconsax-react-native";
import { CricleComponent, TextComponent } from "../components";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { globalStyles } from "../styles/globalStyles";
import DrawerNavigate from "./DrawerNavigate";
import { ParamListBase } from "@react-navigation/native";

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const nameTab: { [key in keyof ParamListBase]: string } = {
    Explore: 'Trang chủ',
    Events: 'Sự kiện',
    Profile: 'Tôi',
    Map: 'Bản đồ'
  };  return <Tab.Navigator
  
    screenOptions={({route})=>({
      headerShown: false,
      tabBarStyle: {
        height: Platform.OS === 'ios' ?  76 : 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:colors.white
      },
      tabBarHideOnKeyboard:true,
      //focused khi click nào
      tabBarIcon: ({ focused, color, size }) => {//Chỉnh sửa hiện thị icon
        let icon: ReactNode;
        color = focused ? colors.primary : colors.gray5
        size=20
        switch (route.name){
          case "Explore":
            icon = <MaterialIcons name="explore" size={size} color={color}/>
            break
          case "Events":
            icon = <MaterialIcons name="event" size={size} color={color}/>
            break
          case "Add":
            icon = <CricleComponent size={50} styles={{marginBottom:Platform.OS === 'ios' ? 24 : 40,borderWidth:2,borderColor:'white'}}>
              <AddSquare size={26} color={colors.white} variant="Bold" />
            </CricleComponent>
            
            break
          case "Map":
            icon = <MaterialCommunityIcons name="map-marker" size={size} color={color}/>
            break
          case "Profile":
            icon = <FontAwesome name="user" size={size} color={color}/>
            break
        }
        return icon
      },
      tabBarIconStyle:{
        marginBottom:0,
        marginTop:8
      },
      tabBarLabel({focused}){//Cấu hình hiện thị name
        return route.name === 'Add' ? null : <TextComponent 
        text={nameTab[route.name]} 
        styles={{marginBottom: Platform.OS === 'android' ? 12 : 0}} 
        size={10} 
        color={focused ? colors.primary : colors.gray}/>
      },
      
    })}>

    <Tab.Screen name="Explore" component={ExploreNavigator}/>
    <Tab.Screen name="Events" component={EventsNavigator}/>
    <Tab.Screen name="Add" component={AddNewScreen}/>    
    <Tab.Screen name="Map" component={MapNavigator} />
    <Tab.Screen name="Profile" component={ProfileNavigator} />

  </Tab.Navigator>
}
export default TabNavigator;