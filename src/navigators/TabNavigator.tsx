import { Animated, Platform, Text, View } from "react-native"
import React, { ReactNode, useRef, useState } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ExploreNavigator from "./ExploreNavigator";
import EventsNavigator from "./EventsNavigator";
import { AddNewScreen } from "../screens";
import TransactionNavigator from "./TransactionNavigator";
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
import * as Animatable from 'react-native-animatable';
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { appInfo } from "../constrants/appInfo";
const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const nameTab: { [key in keyof ParamListBase]: string } = {
    Explore: 'Trang chủ',
    Events: 'Sự kiện',
    Profile: 'Tôi',
    Transaction: 'Lịch sử GD'
  };
  const getWidth = ()=>{
    return appInfo.sizes.WIDTH/5
  }
  const [width,setWidth] = useState(getWidth()-24)
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  return <>
    <Tab.Navigator

      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 80 : 60,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,

        },
        tabBarHideOnKeyboard: true,
        //focused khi click nào
        tabBarIcon: ({ focused, color, size }) => {//Chỉnh sửa hiện thị icon
          let icon: ReactNode;
          color = focused ? colors.primary : colors.gray5
          size = 24
          switch (route.name) {
            case "Explore":
              icon = <Ionicons name={focused ? "home-sharp" : "home-outline"} size={size} color={color} />
              break
            case "Events":
              icon = <MaterialIcons name="event" size={size} color={color} />
              break
            case "Add":
              icon = <CricleComponent size={50}
                styles={[globalStyles.shadow, { marginBottom: Platform.OS === 'ios' ? 30 : 46, borderWidth: 2, borderColor: 'white' }]}>
                <AddSquare size={26} color={colors.white} variant="Bold" />
              </CricleComponent>

              break
            case "Transaction":
              icon = <Octicons name="history" size={size - 1} color={color} />
              break
            case "Profile":
              icon = <FontAwesome name="user-circle-o" size={size} color={color} />
              break
          }
          return icon
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 8,

        },
        tabBarLabel({ focused }) {//Cấu hình hiện thị name
          return route.name === 'Add' ? null : <TextComponent
            text={nameTab[route.name]}
            styles={{ marginBottom: Platform.OS === 'android' ? 12 : 0 }}
            size={10}
            color={focused ? colors.primary : colors.gray} />
        },

      })}>

      <Tab.Screen name="Explore" component={ExploreNavigator} listeners={{
        tabPress: e => {
          setWidth(getWidth()-24)
          Animated.spring(tabOffsetValue, {
            toValue: 0,
            useNativeDriver: true,
            speed:250
          }).start();
        }
      }}/>
      <Tab.Screen name="Events" component={EventsNavigator} listeners={{
        tabPress: e => {
          setWidth(getWidth()-24)
          Animated.spring(tabOffsetValue, {
            toValue: getWidth() * 1,
            useNativeDriver: true,
            speed:250
          }).start();
        }
      }}/>
      <Tab.Screen name="Add" component={AddNewScreen} listeners={{
        tabPress: e => {
         setWidth(0)
        }
      }}/>
      <Tab.Screen name="Transaction" component={TransactionNavigator} listeners={{
        tabPress: e => {
          setWidth(getWidth()-24)
          Animated.spring(tabOffsetValue, {
            toValue: getWidth() * 3,
            useNativeDriver: true,
            speed:250
          }).start();
        }
      }}/>
      <Tab.Screen name="Profile" component={ProfileNavigator} listeners={{
        tabPress: e => {
          setWidth(getWidth()-24)
          Animated.spring(tabOffsetValue, {
            toValue: getWidth() * 4,
            useNativeDriver: true,
            speed:250
          }).start();
        }
      }}/>

    </Tab.Navigator>
    <Animated.View style={{
      height:2,
      position:'absolute',
      width:width,
      backgroundColor:colors.primary,
      bottom:58,
      left:0,
      borderRadius:100,
      marginHorizontal:12,
      transform: [
        { translateX: tabOffsetValue }
      ]
    }}>

    </Animated.View>
  </>
}
export default TabNavigator;