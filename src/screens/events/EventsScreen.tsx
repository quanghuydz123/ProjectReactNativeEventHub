import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent } from "../../components";
import Toast from "react-native-toast-message";
import EventItem from "../../components/EventItem";

const EventsScreen = () => {
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Cập nhập thành công',
      visibilityTime: 1500
    });
  }
  return (
    <ContainerComponent back title="abvc">
      <View>
          {/* <EventItem isShownVertical followers={[{ "__v": 0, "_id": "6673ed8e2ac44eb845f138ce", "categories": [[Object], [Object], [Object], [Object]], "events": [[Object], [Object]], "user": { "__v": 0, "_id": "6653720874c09a838c5a58f4", "bio": "Thích chơi game", "createAt": "2024-05-26T17:27:13.658Z", "email": "vonguoita454@gmail.com", "fcmTokens": [Array], "fullname": "Nguyễn Huy", "isAdmin": false, "password": "$2b$10$eywkO/vSuUxS5r1slys4nOPHb.ZTXk3df3aoZuy7TJ7CS4DU7ndPC", "phoneNumber": "0367386108", "photoUrl": "https://firebasestorage.googleapis.com/v0/b/eventapp-1cfef.appspot.com/o/images%2Fimage-1719173935607.evenhub%2Fcache%2Freact-native-image-crop-picker%2Fc51400d0-1a7f-4d37-a9dc-62000c07dbac?alt=media&token=9b9c93ee-cf2f-45f9-8180-b99c398c9878", "position": [Object], "updateAt": "2024-05-26T17:27:13.658Z" }, "users": [[Object], [Object]] }, { "__v": 0, "_id": "6673f5d4d2797c446124e1b8", "categories": [[Object]], "events": [[Object], [Object]], "user": { "__v": 0, "_id": "66537277f57d70d1a1a1f10f", "bio": "hủy đẹp trai", "createAt": "2024-05-26T17:33:03.198Z", "email": "vonguoita457@gmail.com", "fcmTokens": [Array], "fullname": "Nguyễn Quang Huy", "isAdmin": false, "password": "$2b$10$7GpGK6ARIavcGSC0Pt/CBuIJWcjMaXagypMNzg6FFy0teNyhMIcqG", "photoUrl": "https://gamek.mediacdn.vn/133514250583805952/2021/5/3/kai4-1620038475845741932232.jpg", "position": [Object], "updateAt": "2024-05-26T17:33:03.198Z" }, "users": [[Object]] }]} item={{ "Address": "Đường Linh Trung, Phường Linh Trung, Thủ Đức, Hồ Chí Minh, Việt Nam", "Location": " Nhà thi đấu Phú Thọ", "__v": 0, "_id": "666b4835733eaeed82eaecf6", "addressDetals": { "city": "Thủ Đức", "county": "Hồ Chí Minh", "district": "Phường Linh Trung", "postalCode": "71308", "street": "Đường Linh Trung" }, "authorId": { "__v": 0, "_id": "6653720874c09a838c5a58f4", "bio": "Thích chơi game", "createAt": "2024-05-26T17:27:13.658Z", "email": "vonguoita454@gmail.com", "fcmTokens": ["f7mLShwLT32biE5cWjxNvQ:APA91bHKXx63ouvjHUPdrfW8qxgnEE8JSn-91_aH6EhCEMOgpByb14mpL-74QurYsVXthIxbK0KLF2aVVe2SAbINIow1liSLQteE4zyCtXrQGwdoZVGDSdtC1iEmmpBU3IECpzeeMxoZ"], "fullname": "Nguyễn Huy", "isAdmin": false, "password": "$2b$10$eywkO/vSuUxS5r1slys4nOPHb.ZTXk3df3aoZuy7TJ7CS4DU7ndPC", "phoneNumber": "0367386108", "photoUrl": "https://firebasestorage.googleapis.com/v0/b/eventapp-1cfef.appspot.com/o/images%2Fimage-1719173935607.evenhub%2Fcache%2Freact-native-image-crop-picker%2Fc51400d0-1a7f-4d37-a9dc-62000c07dbac?alt=media&token=9b9c93ee-cf2f-45f9-8180-b99c398c9878", "position": { "lat": 10.855809, "lng": 106.768056 }, "updateAt": "2024-05-26T17:27:13.658Z" }, "category": { "__v": 0, "_id": "666ad89ad08fd9c8bec5bd61", "createdAt": "2024-06-13T11:31:38.510Z", "image": "imagetext", "name": "Âm nhạc", "updatedAt": "2024-06-13T11:31:38.510Z" }, "createdAt": "2024-06-13T19:27:49.657Z", "date": "2024-07-19T19:00:00.000Z", "description": "White Party Vietnam 2024 chính là lễ hội âm nhạc Indoor đầu tiên tại Việt Nam với hệ thống âm thanh, ánh sáng đẳng cấp thế giới. Bạn có cảm thấy háo hức và mong đợi sự kiện này không", "endAt": "2024-06-19T14:00:00.000Z", "photoUrl": "https://firebasestorage.googleapis.com/v0/b/eventapp-1cfef.appspot.com/o/images%2Fimage-1718306869283.evenhub%2Fcache%2Freact-native-image-crop-picker%2F3a61554f-d389-4f0d-b4aa-31e8a3b568b6?alt=media&token=cf3e8feb-fa03-490c-8754-b3b6f9aaeeab", "position": { "lat": 10.86069, "lng": 106.77244 }, "price": 100000, "startAt": "2024-06-19T12:00:00.000Z", "status": true, "title": "WHITE PARTY VIETNAM 2024", "updatedAt": "2024-06-13T19:27:49.657Z", "users": [] }} /> */}
      </View>
    </ContainerComponent>
  )
}
export default EventsScreen;