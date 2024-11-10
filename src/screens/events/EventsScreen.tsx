import React, { useEffect, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, InputComponent, ListVideoComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;
const EventsScreen = ({ navigation, route }: any) => {





  const renderTypeTicket = ()=>{
    const [activeTab, setActiveTab] = useState(0);
    const slideAnimation = useRef(new Animated.Value(0)).current;
  
    const tabs = [
      { id: 0, title: 'Tất cả' },
      { id: 1, title: 'Thành công' },
      { id: 2, title: 'Đang xử lý' },
      { id: 3, title: 'Đã hủy' },
    ];
  
    const handleTabPress = (index: number) => {
      Animated.spring(slideAnimation, {
        toValue: index * TAB_WIDTH,
        useNativeDriver: true,
        tension: 68,
        friction: 10,
      }).start();
      setActiveTab(index);
    };
  
    return (
     <>
      <View style={styles.container}>
        <Text style={styles.header}>Vé của tôi</Text>
        <View style={styles.tabContainer}>
          <Animated.View
            style={[
              styles.slider,
              {
                transform: [{ translateX: slideAnimation }],
              },
            ]}
          />
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <Text>123123</Text>
        </View>
      </View>
     </>
    );
  }
  return (
    <>
      {renderTypeTicket()}
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