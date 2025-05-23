import {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Image,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {LoadingModal} from '../../../modals';
import followAPI from '../../apis/followAPI';
import userAPI from '../../apis/userApi';
import {
  ContainerComponent,
  SectionComponent,
  RowComponent,
  SpaceComponent,
  ButtonComponent,
  TextComponent,
  TagComponent,
} from '../../components';
import {openComposer} from 'react-native-email-link';
import AvatarItem from '../../components/AvatarItem';
import {apis} from '../../constrants/apis';
import {colors} from '../../constrants/color';
import {FollowModel} from '../../models/FollowModel';
import {UserModel} from '../../models/UserModel';
import {
  authSelector,
  AuthState,
  updateFollow,
} from '../../reduxs/reducers/authReducers';
import {globalStyles} from '../../styles/globalStyles';
import socket from '../../utils/socket';
import {appInfo} from '../../constrants/appInfo';
import CardComponent from '../../components/CardComponent';
import {OrganizerModel} from '../../models/OrganizerModel';
import {EventModelNew} from '../../models/EventModelNew';
import organizerAPI from '../../apis/organizerAPI';
import {CreativeCommons} from 'iconsax-react-native';
import AvatarGroup from '../../components/AvatarGroup';
import {fontFamilies} from '../../constrants/fontFamilies';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {convertMoney} from '../../utils/convertMoney';
import {DateTime} from '../../utils/DateTime';
import EventItemHorizontal from '../../components/EventItemHorizontal';
import checkLogin from '../../utils/checkLogin';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
const AboutProfileScreen = ({navigation, route}: any) => {
  const {uid, user}: {uid: string; user: UserModel} = route.params;
  const [uidOthor, setUidOther] = useState(uid);
  const [tabSelected, setTabSelected] = useState('about');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserModel>();
  const [followerUserOther, setFollowerUserOther] = useState<FollowModel[]>([]);
  const auth: AuthState = useSelector(authSelector);
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const [eventCreated, setEventCreated] = useState<EventModelNew[]>([]);
  const [width, setWidth] = useState(0);
  const [isCheckFollow, setIsCheckFollow] = useState(false);
  const {getItem} = useAsyncStorage('auth');
  const dispatch = useDispatch();
  useEffect(() => {
    Animated.spring(tabOffsetValue, {
      toValue: width * (tabSelected === 'about' ? 0 : 1),
      useNativeDriver: true,
      speed: 100,
    }).start();
  }, [tabSelected]);
  const tabs = [
    {
      key: 'about',
      title: 'Giới thiệu',
      content: '',
    },
    {
      key: 'events',
      title: `Sự kiện tổ chức (${eventCreated?.length ?? 0})`,
      content: '',
    },
  ];

  useEffect(() => {
    handleCallApiGetProfile();
    handleCallApiGetFollowerUserOtherById(true);
    getEventCreated();
  }, []);
  // useEffect(() => {
  //   handleCallApiGetFollowerById(true)
  // }, [auth.id])
  useEffect(() => {
    setIsCheckFollow(
      auth?.follow &&
        auth?.follow.users.length > 0 &&
        auth?.follow.users.some(user => user.idUser === uidOthor)
        ? true
        : false,
    );
  }, [uidOthor, auth.follow.users]);
  // const renderTabContent = (key: String) => {
  //   let content = <></>
  //   switch (key) {
  //     case 'about':
  //       break
  //     case 'events':
  //       break
  //     default:
  //       content = <></>
  //       break
  //   }
  //   return content
  // }
  const getEventCreated = async () => {
    if (uidOthor) {
      const api = `/get-eventCreatedOrganizerById?idUser=${uidOthor}`;
      try {
        const res = await organizerAPI.HandleOrganizer(api);
        if (res && res.data && res.status === 200) {
          setEventCreated(res.data);
        }
        setIsLoading(false);
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message);
        console.log('AboutScreen', errorMessage);
        setIsLoading(false);
      }
    }
  };
  const handleCallApiGetProfile = async () => {
    if (uidOthor) {
      setIsLoading(true);
      const api = apis.user.getById(uidOthor);
      try {
        const res = await userAPI.HandleUser(api);
        if (res && res.data && res.status === 200) {
          setProfile(res.data.user);
        }
        setIsLoading(false);
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message);
        console.log('AboutScreen', errorMessage);
        setIsLoading(false);
      }
    }
  };
  // const handleCallApiGetFollowerById = async (isLoading?: boolean) => {
  //   if (auth.id) {
  //     const api = apis.follow.getById(auth.id)
  //     setIsLoading(isLoading ? isLoading : false)

  //     try {
  //       const res: any = await followAPI.HandleFollwer(api, {}, 'get');
  //       if (res && res.data && res.status === 200) {
  //         // setFollower(res.data.followers)
  //       }
  //       setIsLoading(false)

  //     } catch (error: any) {
  //       const errorMessage = JSON.parse(error.message)
  //       console.log("FollowerScreen", errorMessage)
  //       setIsLoading(false)

  //     }
  //   }
  // }
  const handleUpdateAuthFollow = async () => {
    const users = [...(auth.follow?.users || [])];
    if (isCheckFollow) {
      const index = users.findIndex(
        item => item.idUser.toString() === uidOthor.toString(),
      );
      users.splice(index, 1);
    } else {
      users.push({idUser: uidOthor});
    }
    dispatch(updateFollow({users: users}));
    // await AsyncStorage.setItem('auth', JSON.stringify({ ...auth, follow: {
    //   ...auth.follow, // Giữ nguyên các thuộc tính khác của `follow`
    //   users: [...users]  // Cập nhật `users`
    // }}))
  };
  const handleFollowUser = async () => {
    const api = apis.follow.updateFollowUserOther();
    setIsLoading(true);
    try {
      const res = await followAPI.HandleFollwer(
        api,
        {idUser: auth.id, idUserOther: uidOthor},
        'put',
      );
      if (res && res.status === 200) {
        setIsCheckFollow(!isCheckFollow);
        await handleUpdateAuthFollow();
        // await handleCallApiGetFollowerUserOtherById()
        // await handleCallApiGetFollowerById()
        // socket.emit('followUser', { idUser: auth?.id })
        // socket.emit('getNotifications', { idUser: auth?.id })
      }
      setIsLoading(false);
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      if (errorMessage.statusCode === 403) {
        console.log(errorMessage.message);
      } else {
        console.log('Lỗi rồi EventDetails');
      }
      setIsLoading(false);
    }
  };
  const handleCallApiGetFollowerUserOtherById = async (isLoading?: boolean) => {
    if (uidOthor) {
      const api = apis.follow.getById(uidOthor);
      setIsLoading(isLoading ? isLoading : false);
      try {
        const res: any = await followAPI.HandleFollwer(api, {}, 'get');
        if (res && res.data && res.status === 200) {
          setFollowerUserOther(res.data.followers);
          setNumberOfFollowers(res.data.numberOfFollowers);
        }
        setIsLoading(false);
      } catch (error: any) {
        const errorMessage = JSON.parse(error.message);
        console.log('FollowerScreen', errorMessage);
        setIsLoading(false);
      }
    }
  };
  const renderEventCreated = (events: EventModelNew[]) => {
    return events?.length > 0 ? (
      <View style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={events}
          keyExtractor={item => item._id} // đảm bảo mỗi item có một key duy nhất
          renderItem={({item}) => {
            return <EventItemHorizontal item={item} />;
          }}
        />
      </View>
    ) : (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TextComponent text={'Không có sự kiện nào cả'} />
      </View>
    );
  };
  const SendEmailButton = (email: string) => {
    try {
      openComposer({
        to: email,
        subject: 'Liên hệ',
        body: 'Hỏi gì đó ...',
      });
    } catch (error) {
      Alert.alert('Lỗi rồi');
    }
  };

  return (
    <ContainerComponent
      back
      title="Hồ sơ người ta"
      bgColor={colors.backgroundBluishWhite}
      right={<Feather name="more-vertical" size={22} color={colors.white} />}>
      <SectionComponent isNoPaddingBottom>
        <CardComponent
          isShadow
          styles={[globalStyles.center, {paddingBottom: 20}]}>
          <RowComponent>
            <AvatarItem
              size={90}
              photoUrl={user?.photoUrl ?? profile?.photoUrl}
              borderWidth={1}
              colorBorderWidth={colors.gray4}
            />
          </RowComponent>
          <SpaceComponent height={8} />
          <TextComponent
            text={user?.fullname ?? (profile?.fullname || profile?.email || '')}
            title
            size={24}
          />
          {/* {profile?.phoneNumber && <>
            <TextComponent text={profile.phoneNumber} size={14} color={colors.gray} />
            <SpaceComponent height={8} />
          </>} */}
          <SpaceComponent height={8} />

          <RowComponent>
            <View style={[globalStyles.center, {flex: 1}]}>
              <TextComponent text={`${numberOfFollowers}`} size={20} />
              <TextComponent text="Người theo dõi" />
            </View>
            <View
              style={{height: '100%', width: 1, backgroundColor: colors.gray2}}
            />
            <View style={[globalStyles.center, {flex: 1}]}>
              <TextComponent
                text={
                  followerUserOther[0]?.users.length !== undefined
                    ? `${followerUserOther[0]?.users.length}`
                    : '0'
                }
                size={20}
              />
              <TextComponent text="Đang theo dõi" />
            </View>
          </RowComponent>
          <SpaceComponent height={16} />
          <RowComponent justify="center">
            <ButtonComponent
              text={isCheckFollow ? 'Đã theo dõi' : 'Theo dõi'}
              onPress={() => {
                if (checkLogin(auth, navigation)) {
                  handleFollowUser();
                }
              }}
              type="primary"
              color={isCheckFollow ? colors.gray8 : colors.primary}
              textColor={isCheckFollow ? colors.gray : colors.white}
              textSize={14}
              width={appInfo.sizes.WIDTH * 0.4}
              styles={{
                borderWidth: 1,
                borderColor: isCheckFollow ? colors.gray8 : colors.primary,
                marginBottom: 0,
                minHeight: 0,
                paddingVertical: 12,
              }}
              icon={
                isCheckFollow ? (
                  <AntDesign
                    name="deleteuser"
                    size={18}
                    color={isCheckFollow ? colors.gray : colors.white}
                  />
                ) : (
                  <AntDesign
                    name="adduser"
                    size={18}
                    color={isCheckFollow ? colors.gray : colors.white}
                  />
                )
              }
              iconFlex="left"
            />
            <SpaceComponent width={10} />
            <ButtonComponent
              text="Liên hệ"
              type="primary"
              color="white"
              textColor={colors.primary}
              textSize={14}
              styles={{
                borderWidth: 1,
                borderColor: colors.primary,
                marginBottom: 0,
                minHeight: 0,
                paddingVertical: 12,
              }}
              width={appInfo.sizes.WIDTH * 0.4}
              icon={
                <AntDesign name="message1" size={18} color={colors.primary} />
              }
              onPress={() => SendEmailButton(user.email)}
              iconFlex="left"
            />
          </RowComponent>
        </CardComponent>
      </SectionComponent>

      <SectionComponent>
        <CardComponent isShadow styles={{height: '79%'}}>
          <RowComponent>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  globalStyles.center,
                  {
                    flex: 1,
                    paddingBottom: 4,
                    // borderBottomWidth: 2,
                    // borderBottomColor: tab.key === tabSelected ? colors.primary : colors.white
                  },
                ]}
                onPress={() => setTabSelected(tab.key)}>
                <TextComponent
                  text={tab.title}
                  size={16}
                  title={tab.key === tabSelected}
                  color={
                    tab.key === tabSelected ? colors.primary : colors.black
                  }
                />
              </TouchableOpacity>
            ))}
            <Animated.View
              onLayout={event => setWidth(event.nativeEvent.layout.width)}
              style={{
                height: 2,
                position: 'absolute',
                width: '50%',
                backgroundColor: colors.primary,
                bottom: 0,
                left: 0,
                borderRadius: 100,
                transform: [{translateX: tabOffsetValue}],
              }}
            />
          </RowComponent>
          <SpaceComponent height={6} />
          <View style={{flex: 1}}>
            {tabSelected === 'about' ? (
              <TextComponent
                text={user?.bio ?? (profile?.bio || 'Chưa có gì cả')}
              />
            ) : (
              <>{renderEventCreated(eventCreated)}</>
            )}
          </View>
        </CardComponent>
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};
export default AboutProfileScreen;
