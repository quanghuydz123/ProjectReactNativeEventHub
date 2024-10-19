import React, { memo, useEffect, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from './index';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';
import { Badge } from 'react-native-paper';
import { Switch } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import Video, { VideoRef } from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo'
import Swiper from 'react-native-swiper';
import { colors } from '../constrants/color';
import CardComponent from './CardComponent';
import { globalStyles } from '../styles/globalStyles';
import { appInfo } from '../constrants/appInfo';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { constantSelector, constantState } from '../reduxs/reducers/constantReducers';
const ListVideoComponent = ({route }: any) => {


    const [isSound,setIsSound] = useState(true)
    const videoRef = useRef<VideoRef>(null);
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
    const [index, setIndex] = useState(0)
   
    const VideoPlayer = ({ background, isPaused }: { background: any, isPaused: boolean }) => {
        return (
            <Video
                // Can be a URL or a local file.
                source={background}
                // Store reference  
                ref={videoRef}
                onBuffer={onBuffer}
                onError={onError}
                
                style={[{ width: '100%', height: 220}]}
                paused={isPaused}
                
                repeat={true}
                muted={isSound}//bỏ âm thanh
                
            />
        )
    }
    const renderVideo = (index: number, isPaused: boolean) => {
        let background
        if (index === 0) {
            background = require('../assets/video/video1.mp4');
        } else if (index === 1) {
            background = require('../assets/video/video3.mp4');
        } else if (index === 2) {
            background = require('../assets/video/video2.mp4');
        } else if (index === 3) {
            background = require('../assets/video/video4.mp4');

        }

        return (
            <View>
                <VideoPlayer background={background} isPaused={isPaused} />
                <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']} style={{ position: 'absolute', left: 0, bottom: 0, flex: 1, width: '100%', height: '38%' }}>
                    <View style={{ paddingLeft:16, paddingVertical: 1 }}>
                        <RowComponent>
                            <RowComponent>
                                <CricleComponent size={10} color={colors.white} children={<></>} />
                                <SpaceComponent width={4} />
                                <TextComponent text={'Từ 599.000 VNĐ'} size={12} title color={colors.primary} />
                            </RowComponent>
                            <SpaceComponent width={8} />
                            <RowComponent>
                                <CricleComponent size={10} color={colors.white} children={<></>} />
                                <SpaceComponent width={4} />
                                <TextComponent text={'06 Tháng 12, 2024'} size={12} title color={colors.white} />
                            </RowComponent>
                        </RowComponent>
                        <SpaceComponent height={12} />
                        <RowComponent justify='space-between' styles={{ alignItems: 'flex-start', paddingRight: 12 }}>
                            <ButtonComponent
                                text='Xem chi tiết'
                                color={colors.white}
                                textColor={colors.background}
                                type='primary'
                                width={appInfo.sizes.WIDTH * 0.26}
                                textSize={12}
                                styles={{ minHeight: 0, paddingVertical: 8 }}
                                alignItems='flex-start'
                            />
                            {/* <CardComponent onPress={()=>setIsSound(!isSound)} isShadow styles={[globalStyles.noSpaceCard, { height: 24, width: 28, borderRadius: 4 }]} color={`rgba(255,255,255,0.6)`}>
                                <Entypo name={isSound ? "sound-mute" : "sound"} size={14} color={colors.black} />
                            </CardComponent> */}
                        </RowComponent>
                    </View>
                </LinearGradient>
            </View>
        )
    }
    return (

        <View style={{ flex: 1,height:220}}>
            <Swiper
                loop={false}
                style={{ height: '100%' }}
                onIndexChanged={(num) => setIndex(num)}
                activeDotColor={colors.primary}
                dotColor={colors.white}
                dotStyle={{}}
                index={index}
                paginationStyle={{ bottom: -24 }}
            >
                <View style={{ flex: 1 }}>{renderVideo(0, index !== 0)}</View>
                <View style={{ flex: 1 }}>{renderVideo(1, index !== 1)}</View>
                <View style={{ flex: 1 }}>{renderVideo(2, index !== 2)}</View>
                <View style={{ flex: 1 }}>{renderVideo(3, index !== 3)}</View>


            </Swiper>
        </View>
    )
}
const styles = StyleSheet.create({

});

export default memo(ListVideoComponent);
