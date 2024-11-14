import React, { useEffect, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, InputComponent, ListVideoComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent, TicketComponent } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Animated, Dimensions, FlatList, Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import { Badge, List } from 'react-native-paper';
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
import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { fontFamilies } from '../../constrants/fontFamilies';
import { BlurView } from '@react-native-community/blur';
import AvatarItem from '../../components/AvatarItem';
import ListTicketComponent from './components/ListTicketComponent';
import { ArrowDown2 } from 'iconsax-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import WebView from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;
const EventsScreen = ({ navigation, route }: any) => {


  const cardRef = useRef(null); // Tạo tham chiếu cho card dưới
  const [cardHeitght, setCardHeitght] = useState(appInfo.sizes.HEIGHT * 0.24); // State để lưu width của card dưới


  
  return (
    <>
      <ContainerComponent title={'abc'} bgColor='black'>
        <SectionComponent>
            <TicketComponent />
            <TicketComponent />
        </SectionComponent>
      </ContainerComponent>
    </>
  )
}


export default EventsScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#22C55E',
    paddingTop: 20,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    position: 'relative',
    height: 40,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    width: TAB_WIDTH,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
});