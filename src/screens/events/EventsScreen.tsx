import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonComponent, ContainerComponent, CricleComponent, InputComponent, ListEventRelatedComponent, ListVideoComponent, RowComponent, SectionComponent, SelectDropdownComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent, TicketComponent } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Animated, BackHandler, Dimensions, FlatList, Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
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
import { ArrowDown2, ArrowDown3 } from 'iconsax-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import WebView from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { convertMoney } from '../../utils/convertMoney';
import LottieView from 'lottie-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import SearchComponent from '../../components/SearchComponent';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingModal } from '../../../modals';
import CommentComponent from './components/CommentComponent';
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;
const EventsScreen = ({ navigation, route }: any) => {
  const [index, setIndex] = useState(-1)
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isInputFocused, setInputFocused] = useState(false);
  const [textComment,setTextComment] = useState('')
  // const handleSheetChanges = useCallback((index: number) => {
  //   setIndex(index)
  //   setIsShowing(index < 1 ? false : true);
  //   if (index === -1 && isInputFocused) {
  //     textInputRef.current?.blur();
  //   }
  // }, [isInputFocused]);
  const [isShowing, setIsShowing] = useState<boolean>(false);

  const textInputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isShowing) {
          bottomSheetRef.current?.close();
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
          return true;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [bottomSheetRef, isShowing])
  );
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  return (
    <>
      <ContainerComponent title={'asdads'} >
        <ButtonComponent text='Open' type='primary' onPress={() => handleOpenBottomSheet()} />
        <ButtonComponent text='Close' type='primary' onPress={() => bottomSheetRef?.current?.close()} />

       {/* <View style={{}}>
        <CommentComponent 
          textComment={textComment} 
          setTextComment={(val)=>setTextComment(val)}  
          setIndex={(val)=>setIndex(val)} 
          setIsShowing={(val)=>setIsShowing(val)} 
          ref={bottomSheetRef}/>
       </View> */}

      </ContainerComponent>
    </>
  )
}

export default EventsScreen;
