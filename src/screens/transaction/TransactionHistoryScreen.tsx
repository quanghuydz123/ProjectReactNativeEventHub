import { Button, Text, View } from "react-native"
import React, { useState } from "react"
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, TextComponent } from "../../components";
import QRCode from "react-native-qrcode-svg";
import Accordion from 'react-native-collapsible/Accordion';
import { colors } from "../../constrants/color";
import ListTicketComponent from "../events/components/ListTicketComponent";
const TransactionHistoryScreen = ()=>{
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white
    }}>
      {/* <ImageBackground style={[{
        flex: 1,
        height: appInfo.sizes.HEIGHT * 0.315,

      }]} imageStyle={[{
        resizeMode: 'stretch',
        height: appInfo.sizes.HEIGHT * 0.315,
        width: appInfo.sizes.WIDTH,
      }]} source={{ uri: event?.photoUrl ?? 'https://static6.depositphotos.com/1181438/670/v/450/depositphotos_6708849-stock-illustration-magic-spotlights-with-blue-rays.jpg' }}>
        <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}>
          <RowComponent styles={[{
            padding: 16,
            paddingTop: 30,
          }]} justify="space-between" >
            <RowComponent styles={{ flex: 1 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}
                style={{ minHeight: 48, minWidth: 48, justifyContent: 'center' }}
              >
                <ArrowLeft size={24} color={colors.white} />
              </TouchableOpacity>
            </RowComponent>
           

          </RowComponent>
        </LinearGradient>
        <View style={{
          flex: 1,
          paddingTop: 244 - 80,

        }}>
          <SectionComponent styles={{ paddingBottom: 0, paddingHorizontal: 12 }}>
            <View style={{
              marginTop: 0,
              justifyContent: 'center',
              alignItems: 'center',

            }}>
             
            </View>
          </SectionComponent>
          <SpaceComponent height={8} />
          <ScrollView

            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}
          >
            <SectionComponent styles={{ paddingBottom: 4, paddingTop: 8 }}>
              <View style={{
                justifyContent: 'space-around',
              }}>
                <TextComponent text={`${DateTime.ConvertDayOfWeek(new Date(event?.startAt ?? Date.now()).getDay())} ${DateTime.GetDateShort(new Date(event?.startAt ?? Date.now()), new Date(event?.endAt ?? Date.now()))} ${DateTime.GetTime(new Date(event?.startAt ?? Date.now()))} - ${DateTime.GetTime(new Date(event?.endAt ?? Date.now()))}`} font={fontFamilies.medium} size={15} color={colors.blue} />

               
              </View>
            </SectionComponent>
            <SectionComponent styles={{ paddingBottom: 4 }}>
              <TextComponent text={event?.title ?? ''} title size={30} font={fontFamilies.medium} />
            </SectionComponent>
            <SectionComponent styles={{ paddingBottom: 26 }}>
              <RowComponent>
                <AvatarItem photoUrl={event?.authorId?.photoUrl} colorBorderWidth={colors.background} size={30} />
                <SpaceComponent width={6} />
                <TextComponent text={`Được tổ chức bởi ${event?.authorId?.fullname}`} font={fontFamilies.medium} />
              </RowComponent>
            </SectionComponent>
            <SectionComponent styles={{ paddingBottom: 0 }}>
              <RowComponent justify="center" >
                <ButtonComponent
                  text={isInterested ? 'Đã quan tâm' : 'Quan tâm'}
                  textFont={'12'} type="primary"
                  width={appInfo.sizes.WIDTH * 0.45}
                  color={colors.white}
                  textColor={colors.primary}
                  styles={{ borderWidth: 1, borderColor: colors.primary, minHeight: 0, paddingVertical: 12 }}
                  icon={<FontAwesome name={isInterested ? "star" : "star-o"} size={16} color={colors.primary} />}
                  iconFlex="left"
                  onPress={() => handleInterestEvent()}
                />

                <SpaceComponent width={8} />
                <ButtonComponent
                  text={'Mời bạn bè'}
                  textFont={'12'}
                  type="primary"
                  width={appInfo.sizes.WIDTH * 0.45}
                  color={colors.white}
                  textColor={colors.primary}
                  styles={{ borderWidth: 1, borderColor: colors.primary, minHeight: 0, paddingVertical: 12 }}
                  icon={<Ionicons name="person-add" size={16} color={colors.primary} />}
                  iconFlex="left"
                  onPress={() => { setIsOpenModalizeInityUser(true) }}
                />
              </RowComponent>
            </SectionComponent>
            
            <SectionComponent styles={{ paddingVertical: 0, }} isSpace mgSpaceTop={10}>
              {<AvatarGroup  users={event?.usersInterested} size={40} />}
            </SectionComponent>

            <TabBarComponent title={'Giới thiệu sự kiện'} textColor={colors.colorText} textSizeTitle={18} />
            <SectionComponent isSpace mgSpaceTop={20 } styles={{}}>
              <RowComponent styles={{ flexWrap: 'wrap' }}>
               
                 <View style={{}} key={event?.category?._id}>
                    <TagComponent
                      bgColor={colors.primary}
                      label={event?.category.name}
                      textSize={12}
                      textColor={colors.white}
                      styles={{
                        minWidth: 50,
                        paddingVertical: 6,
                        paddingHorizontal: 20,
                        // marginRight: index === item.categories.length - 1 ? 28 : 8,
                      
                      }}
                    />
                  </View>
              </RowComponent>
              <SpaceComponent height={8} />
              <TextComponent text={event?.description ? event.description : ''} />

            </SectionComponent >
           
            <TabBarComponent title={'Ví trí tổ chức'} textColor={colors.colorText} textSizeTitle={18} />
            <SectionComponent isSpace mgSpaceTop={20}>
              <RowComponent styles={{ alignItems: 'flex-start' }}>
                <Ionicons size={24} color={colors.primary} name="location-sharp" />
                <SpaceComponent width={4} />
                <View style={{ flex: 1 }}>
                  <TextComponent text={event?.Location ?? ''} numberOfLine={1} font={fontFamilies.medium} size={16} />
                  <TextComponent numberOfLine={2} text={event?.Address ?? ''} color={colors.gray} />
                  <SpaceComponent height={6}/>
                  <ButtonComponent
                    text="Xem trên bảng đồ"
                    type="link"
                    textFont={fontFamilies.medium}
                    icon={<ArrowDown2 size={16} color={colors.link}/>}
                    iconFlex="right"
                    onPress={()=>openMap()}
                  />
                </View>
              </RowComponent>

            </SectionComponent>

            <TabBarComponent title={'Đơn vị tổ chức'} textSizeTitle={18} />
            <SectionComponent isSpace mgSpaceTop={20}>
              <AvatarItem
                photoUrl={event?.authorId?.photoUrl}
                size={100}
                textName={event?.authorId?.fullname}
                sizeName={18}
                onPress={() => {
                  if (event?.authorId?._id === auth.id) {
                    { ToastMessaging.Warning({ message: 'Đó là bạn mà', visibilityTime: 2000 }) }
                  }
                  else {
                    navigation.navigate("AboutProfileScreen", { uid: event?.authorId?._id })
                  }
                }}
              />
              <SpaceComponent height={8} />
              <RowComponent justify="center" >
                <ButtonComponent
                  text={'Theo dõi'}
                  textFont={'12'} type="primary"
                  width={appInfo.sizes.WIDTH * 0.4}
                  color={colors.white}
                  textColor={colors.primary}
                  styles={{ borderWidth: 1, borderColor: colors.primary, minHeight: 0, paddingVertical: 12 }}
                  icon={<FontAwesome name={'star-o'} size={16} color={colors.primary} />}
                  iconFlex="left"
                />

                <SpaceComponent width={12} />
                <ButtonComponent
                  text={'Nhắn tin'}
                  textFont={'12'}
                  type="primary"
                  width={appInfo.sizes.WIDTH * 0.4}
                  color={colors.white}
                  textColor={colors.primary}
                  styles={{ borderWidth: 1, borderColor: colors.primary, minHeight: 0, paddingVertical: 12 }}
                  icon={<AntDesign name="message1" size={22} color={colors.primary} />}
                  iconFlex="left"
                />
              </RowComponent>
            </SectionComponent>
            <SpaceComponent height={20} />
          </ScrollView>
        </View>
      </ImageBackground>
      {
        event?.price && <RowComponent justify="space-between">
          <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: colors.primary, paddingVertical: 4 }} onPress={() => handleCreateBillPaymentEvent()}>
            <TextComponent text={'Mua vé ngay'} size={12} color={colors.white} />
            <TextComponent text={convertMoney(event?.price ?? 0)} font={fontFamilies.medium} size={14} color={colors.white} />
          </TouchableOpacity>
        </RowComponent>
      }
      
      <LoadingModal visible={isLoading} />
      <LoadingModal visible={isLLoadingNotShow} notShowContent />
      <SelectModalize
        adjustToContentHeight
        title="Danh sách người dùng đang theo dõi"
        data={allUser}
        onClose={() => setIsOpenModalizeInityUser(false)}
        onSearch={(val: string) => setSearchUser(val)}
        valueSearch={searchUser}
        visible={isOpenModalizeInvityUser}
        footerComponent={<View style={{
          paddingBottom: 10,
        }}>
          <ButtonComponent disable={userSelected.length <= 0} text="Mời ngay" color="white" styles={{ borderWidth: 1, borderColor: colors.primary }}
            textColor={colors.primary} type="primary" onPress={() => handleInviteUsers()} />
        </View>}
        renderItem={(item: UserModel) => <RowComponent
          key={item.email} styles={[
            {
              paddingVertical: 6,
              borderBottomWidth: 1,
              borderBlockColor: colors.gray6,
            }
          ]}
        >
          <AvatarItem photoUrl={item?.photoUrl} size={38} onPress={() => {
            if (item?._id == auth?.id) {
              setIsOpenModalizeInityUser(false)
              navigation.navigate('Profile', {
                screen: 'ProfileScreen'
              })
            }
            else {
              setIsOpenModalizeInityUser(false)
              navigation.navigate("AboutProfileScreen", { uid: item?._id })
            }
          }} />
          <SpaceComponent width={8} />
          <View style={{ flex: 1 }}>
            <ButtonComponent
              text={`${item.fullname} (${item.email})`}
              onPress={() => handleSelectItem(item?._id)}
              textColor={userSelected.includes(item?._id) ?
                colors.primary : colors.colorText}
              numberOfLineText={1}
              textFont={fontFamilies.regular}
            />
          </View>
          {userSelected.includes(item?._id) ? <AntDesign color={colors.primary} size={18} name="checkcircle" /> : <AntDesign color={colors.gray} size={18} name="checkcircle" />}
        </RowComponent>}
      /> */}
    </View>
  )
}
export default TransactionHistoryScreen;