import React, { useEffect, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, ListVideoComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';
import { Badge } from 'react-native-paper';
import { Switch } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import provinces from '../../constrants/addressVN/provinces';
import Video, { VideoRef } from 'react-native-video';
import { colors } from '../../constrants/color';
import LinearGradient from 'react-native-linear-gradient';
import { appInfo } from '../../constrants/appInfo';
import { globalStyles } from '../../styles/globalStyles';
import CardComponent from '../../components/CardComponent';
import Entypo from 'react-native-vector-icons/Entypo'
import Swiper from 'react-native-swiper';
const EventsScreen = ({ navigation, route }: any) => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);

  const [value2, setValue2] = useState(null);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ]);
  const [items1, setItems1] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ]);
  const [items2, setItems2] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [pauseVideo, setPauseVideo] = useState(false)
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const onBuffer = () => {
    console.log('Video đang tải...');
  }
  const onError = (error: any) => {
    console.log('Lỗi phát video:', error);
  }
  const [index,setIndex] = useState(0)

  const VideoPlayer = ({background,isPaused}:{background:any,isPaused:boolean}) => {
    const videoRef = useRef<VideoRef>(null);
    return (
      <Video
        // Can be a URL or a local file.
        source={background}
        // Store reference  
        ref={videoRef}
        onBuffer={onBuffer}
        onError={onError}
        style={[{ width: '100%', height: 220, backgroundColor: 'red' }]}
        paused={isPaused}
        repeat={true}
        muted={true}//bỏ âm thanh
      />
    )
  }
  const renderVideo = (index:number,isPaused: boolean)=>{
    let background
    if(index===0){
     background = require('../../assets/video/video1.mp4');
    }else if(index ===1){
       background = require('../../assets/video/video3.mp4');
    }

    return (
      <View>
        <VideoPlayer background={background} isPaused={isPaused}/>
        <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']} style={{ position: 'absolute', left: 0, bottom: 0, flex: 1, width: '100%', height: '37%' }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 2 }}>
            <RowComponent>
              <RowComponent>
                <CricleComponent size={10} color={colors.white} children={<></>} />
                <SpaceComponent width={4} />
                <TextComponent text={'Từ 599.000 VNĐ'} size={12} title color={colors.primary} />
              </RowComponent>
              <SpaceComponent width={8}/>
              <RowComponent>
                <CricleComponent size={10} color={colors.white} children={<></>} />
                <SpaceComponent width={4} />
                <TextComponent text={'06 Tháng 12, 2024'} size={12} title color={colors.white} />
              </RowComponent>
            </RowComponent>
            <SpaceComponent height={12}/>
            <RowComponent justify='space-between' styles={{alignItems:'flex-start',paddingRight:12}}>
            <ButtonComponent 
              text='Xem chi tiết' 
              color={colors.white} 
              textColor={colors.background} 
              type='primary'
              width={appInfo.sizes.WIDTH * 0.29}
              textSize={14}
              styles={{ minHeight: 0, paddingVertical: 8 }}
              alignItems='flex-start'
              />
              <CardComponent isShadow styles={[globalStyles.noSpaceCard,{height:24,width:28,borderRadius:4}]} color={`rgba(255,255,255,0.6)`}>
                    <Entypo name="triangle-right" size={24} color={colors.black} />
              </CardComponent>
            </RowComponent>
          </View>
        </LinearGradient>
      </View>
    )
  }
  const videoRef = useRef<VideoRef>(null);
  const background = require('../../assets/video/video1.mp4');
  const [isPase,setIsPause] = useState(false)
  const handleClick = ()=>{
    if(videoRef.current){
      setIsPause(!isPase)
    }
  }
  return (

    <ContainerComponent title={"Sự kiện"} bgColor={colors.background}>
        {/* <ListVideoComponent /> */}
        <TextComponent text={'abc'} title color='white'/>
        {/* <Video
                // Can be a URL or a local file.
                source={{uri:require('../../assets/video/video1.mp4')}}
                // Store reference  
                ref={videoRef}
                onBuffer={onBuffer}
                onError={onError}
                
                style={[{ width: '100%', height: 220}]}
                paused={isPase}
                
                repeat={true}
                muted={true}//bỏ âm thanh
                 */}
            {/* /> */}
    </ContainerComponent>
  )
}
const styles = StyleSheet.create({

});

export default EventsScreen;
