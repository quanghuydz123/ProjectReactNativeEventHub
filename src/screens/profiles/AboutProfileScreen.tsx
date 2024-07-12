import { Button, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { ButtonComponent, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { Icon } from "iconsax-react-native";
import Feather from "react-native-vector-icons/Feather"
import { colors } from "../../constrants/color";
import { globalStyles } from "../../styles/globalStyles";
import AvatarItem from "../../components/AvatarItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import SimpleLineIcons from "react-native-vector-icons/"
import { TouchableOpacity } from "react-native";
import { apis } from "../../constrants/apis";
import userAPI from "../../apis/userApi";
import { UserModel } from "../../models/UserModel";
import { LoadingModal } from "../../../modals";
import { FollowerModel } from "../../models/FollowerModel";
import followerAPI from "../../apis/followerAPI";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/authReducers";
import socket from "../../utils/socket";
const AboutProfileScreen = ({navigation,route}:any)=>{
  const {uid} = route.params
  const [uidOthor,setUidOther] = useState('')
  const [tabSelected,setTabSelected] = useState('about')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserModel>()
  const [follower, setFollower] = useState<FollowerModel[]>([])
  const [followerUserOther, setFollowerUserOther] = useState<FollowerModel[]>([])
  const [isLLoadingNotShow,setIsLLoadingNotShow] = useState(false)
  const auth = useSelector(authSelector)
  const [numberOfFollowers,setNumberOfFollowers] = useState(0)
  const tabs = [{
    key:'about',
    title:'About'
  },{
    key:'events',
    title:'Events',
  },
  {
    key:'reviews',
    title:'Reviews'
  }
]
  useEffect(()=>{
    if(uid){
      setUidOther(uid)
    }
  },[])
  useEffect(()=>{
    handleCallApiGetProfile()
    handleCallApiGetFollowerUserOtherById()
  },[uidOthor])
  useEffect(()=>{
    handleCallApiGetFollowerById()
  },[])
  const renderTabContent = (key:String)=>{
    let content = <></>
    switch (key){
      case 'about':
        break
      case 'events':
        break
      case 'reviews':
        break
      default:
        content=<></>
        break
    }
    return content
  }
  const handleCallApiGetProfile = async () => {
    if (uidOthor) {
      setIsLoading(true)
      const api = apis.user.getById(uidOthor)
      try {
        const res = await userAPI.HandleUser(api)
        if (res && res.data && res.status === 200) {
          setProfile(res.data.user)
        }
        setIsLoading(false)
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message)
        console.log("AboutScreen", errorMessage)
        setIsLoading(false)
      }
    }
  }
  const handleCallApiGetFollowerById = async () => {
    if(auth.id){
      const api = apis.follow.getById(auth.id)
      setIsLoading(true)

    try {
      const res: any = await followerAPI.HandleFollwer(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setFollower(res.data.followers)
      }
      setIsLoading(false)

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("FollowerScreen", errorMessage)
      setIsLoading(false)

    }
    }
  }
  const handleFollowUser = async ()=>{
    const api = '/update-follower-userOther'
    setIsLoading(true)
    try {
      const res = await followerAPI.HandleFollwer(api,{idUser:auth.id,idUserOther:uidOthor},'put')
      if(res && res.data && res.status===200){
        await handleCallApiGetFollowerById()
        await handleCallApiGetFollowerUserOtherById()
        socket.emit('followUser')
        socket.emit('getNotifications')
      }
      setIsLoading(false)
    } catch (error:any) {
      const errorMessage = JSON.parse(error.message)
      if(errorMessage.statusCode === 403){
        console.log(errorMessage.message)
      }else{
        console.log('Lỗi rồi EventDetails')
      }
      setIsLoading(false)
    }
  }
  const handleCallApiGetFollowerUserOtherById = async ( )=>{
    if(uidOthor){
      const api = apis.follow.getById(uidOthor)
      setIsLoading(true)
    try {
      const res: any = await followerAPI.HandleFollwer(api, {}, 'get');
      if (res && res.data && res.status === 200) {
        setFollowerUserOther(res.data.followers)
        setNumberOfFollowers(res.data.numberOfFollowers)
      }
      setIsLoading(false)

    } catch (error: any) {
      const errorMessage = JSON.parse(error.message)
      console.log("FollowerScreen", errorMessage)
      setIsLoading(false)
    }
    }
  }
 return (
    <ContainerComponent back title="Hồ sơ người ta" right={<Feather name="more-vertical" size={22} color={colors.black}/>}>
     <SectionComponent styles={[globalStyles.center]}>
        <RowComponent>
          <AvatarItem size={80} photoUrl={profile?.photoUrl} notBorderWidth />
        </RowComponent>
        <SpaceComponent height={8} />
        <TextComponent text={profile?.fullname || profile?.email || ''} title size={24} />
        {profile?.phoneNumber && <>
          <TextComponent text={profile.phoneNumber} size={14} color={colors.gray} />
          <SpaceComponent height={8} />
          </>}
        <RowComponent>
          <View style={[globalStyles.center, { flex: 1 }]}>
            <TextComponent text={`${numberOfFollowers}`} size={20} />
            <TextComponent text="Người theo dõi" />
          </View>
          <View style={{height:'100%', width:1,backgroundColor:colors.gray2}}/>
          <View style={[globalStyles.center, { flex: 1 }]}>
          <TextComponent text={followerUserOther[0]?.users.length !== undefined ? `${followerUserOther[0]?.users.length}` : '0'} size={20} />
            <TextComponent text="Đang theo dõi" />
          </View>
        </RowComponent>
      </SectionComponent>
      <SectionComponent>
      <RowComponent justify="center">
          <ButtonComponent 
            text={(follower[0]?.users.length > 0 && follower[0]?.users.some(user => user._id === uidOthor)) ?  "Hủy theo dõi" : "Theo dõi"}
            onPress={()=>handleFollowUser()}
            type="primary"
            color={colors.primary}
            textColor={colors.white}
            styles={{ borderWidth: 1, borderColor: colors.primary,width:'auto',marginBottom:0}}
            icon={(follower[0]?.users.length > 0 && follower[0]?.users.some(user => user._id === uidOthor)) ? 
            <AntDesign name="deleteuser" size={22} color={colors.white}/> : 
            <AntDesign name="adduser" size={22} color={colors.white}/>}
            iconFlex="left"
          />
          <SpaceComponent width={20}/>
          <ButtonComponent text="Nhắn tin"
            type="primary"
            color="white"
            textColor={colors.primary}
            styles={{ borderWidth: 1, borderColor: colors.primary,width:'auto',marginBottom:0}}
            icon={<AntDesign name="message1" size={22} color={colors.primary} />}
            iconFlex="left"
          />
      </RowComponent>
      </SectionComponent>
      <SectionComponent>
        <RowComponent>
          {
            tabs.map((tab)=>(
              <TouchableOpacity key={tab.key} 
              style={[
                globalStyles.center,{flex:1,
                  paddingBottom:4,
                  borderBottomWidth:2,
                  borderBottomColor:tab.key === tabSelected ?colors.primary : colors.white
                },
              
              ]}
              onPress={()=>setTabSelected(tab.key)}
              >
                <TextComponent text={tab.title} size={16} title={tab.key === tabSelected} color={tab.key === tabSelected ?colors.primary : colors.black}/>
              </TouchableOpacity>
            ))
          }
        </RowComponent>
        <TextComponent text="abc"/>
        
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  )
}
export default AboutProfileScreen;