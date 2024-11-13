import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import OrganizerUnfollowedScreen from "../screens/organizer/OrganizerUnfollowedScreen"
import OrganizerFollowingScreen from "../screens/organizer/OrganizerFollowingScreen"
import { ContainerComponent, SpaceComponent, TextComponent } from "../components"
import { colors } from "../constrants/color"
import { fontFamilies } from "../constrants/fontFamilies"


const OrganizerNavigator = ({navigation,route}:any)=>{
    const {organizersFollowing, organizersUnFollowed} = route.params
    const Tab = createMaterialTopTabNavigator()
    return <>
        <ContainerComponent back title={'Các đơn vị tổ chức'} isHiddenSpaceTop bgColor={colors.background}>
            <Tab.Navigator 
             screenOptions={({route})=>({
                
                tabBarStyle:{
                    backgroundColor:colors.background,
                },
                tabBarIndicatorStyle:{
                    backgroundColor:colors.primary,
                },
                tabBarLabel({focused}){
                    if(route.name === 'OrganizerUnfollowedScreen'){
                        return <TextComponent text={'Tất cả'} styles={{width:100}} textAlign="center" color={focused ? colors.primary : colors.gray4} font={ focused ? fontFamilies.semiBold : fontFamilies.medium}/>
                    }else{
                        return <TextComponent text={'Đã theo dõi'} styles={{width:100}} textAlign="center" color={focused ? colors.primary : colors.gray4} font={ focused ? fontFamilies.semiBold : fontFamilies.medium}/>
                    }
                }
             })}
            >
                <Tab.Screen name="OrganizerUnfollowedScreen" component={OrganizerUnfollowedScreen} initialParams={{organizersUnFollowed:organizersUnFollowed}}/>
                <Tab.Screen name="OrganizerFollowingScreen" component={OrganizerFollowingScreen} initialParams={{organizersFollowing:organizersFollowing}}/>

            </Tab.Navigator>
        </ContainerComponent>
    </>
}

export default OrganizerNavigator