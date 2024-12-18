# 🌟 EVENTHUB - NỀN TẢNG QUẢNG BÁ SỰ KIỆN 🌟  

EventHub là ứng dụng di động để quảng bá sự kiện dành cho những người tổ chức sự kiện, cho phép người dùng tìm kiếm, mua vé và tham dự sự kiện đồng thời giúp bạn dễ dàng mời bạn bè. Ứng dụng được thiết kế để trở thành trung tâm cho mọi thứ, từ hòa nhạc, hội nghị và sự kiện thể thao đến các cuộc tụ họp xã hội và các hoạt động công cộng khác
---

## 1. Yêu Cầu Hệ Thống

- **React Native CLI** 
- **ReactJS** 
- **Node.js** (phiên bản 16 trở lên)  
- **MongoDB** hoặc hệ quản trị cơ sở dữ liệu tương thích  
- **Github** Quản lý mã nguồn và cộng tác làm việc nhóm.
- **Firebase** Sử dụng cho tính năng Push notification (Gửi thông báo đến người dùng) và lưu trữ hình ảnh
- **HERE API** Dịch vụ lấy vị trí (kinh độ và vĩ độ) của sự kiện.
- **Visual Studio Code** Môi trường phát triển mã nguồn được đề xuất.
---

## 2. Cấu trúc dự án
- Backend: Node.js (Express)
- Frontend Website: ReactJS
- Mobile App: React Native

## 3. Hướng Dẫn Cài Đặt

### Bước 1: Clone hoặc Tải Dự Án
- **Backend**: Clone từ [Backend Repository](https://github.com/quanghuydz123/ProjectReactNativeEventHub.git)
- **Frontend App**: Clone từ [Frontend App Repository](https://github.com/quanghuydz123/BackEndProjectReactNaviteEventHub.git)
- **Frontend Website Manager**: Clone từ [Frontend Website Repository](https://github.com/quanghuydz123/WebsiteManagerEvent.git)
- **Server VNPAY**: Clone từ [Server VNPAY Repository](https://github.com/quanghuydz123/serverVNPAY.git)

### Bước 2: Cài Đặt Cơ Sở Dữ Liệu
1. Mở MongoDBCompass ấn "Connect" bên trái màn hình chọn "Import saved collections"
2. Chọn file `eventhubDatabase.json` và ấn import.

### Bước 3: Cấu Hình Backend
1. Mở **Visual Studio Code** và truy cập thư mục backend.
2. Cài đặt các dependencies với câu lệnh: npm install.
3. Tạo file `.env` trong thư mục `backend` với nội dung:
    ```properties
	DATABASE_USERNAME=test
	DATABASE_PASSOWRD=852347
	SECRET_KEY=yourSecretKey
	USERNAME_EMAIL=(your-email@gmail.com) dùng là email chính gửi gmail cho các chức năng gửi gmail
	PASSWORD=(your-app-password) Lưu ý là password app
    ```
    - `<Địa chỉ máy chủ>` mặc định là `localhost`.
    - `<Cổng>` mặc định là `3001`
4. Nhập lệnh npm start để chạy server

### Bước 4: Cấu Hình Server VNPAY
1. Mở **Visual Studio Code** và truy cập thư mục ServerVNPAY.
2. Cài đặt các dependencies với câu lệnh: npm install.
3. Nhập lệnh npm start để chạy server
    - `<Địa chỉ máy chủ>` mặc định là `localhost`.
    - `<Cổng>` mặc định là `8888`
### Bước 5: Cấu Hình Frontend App
1. Mở **Visual Studio Code** và truy cập thư mục Frontend App.
2. Cài đặt các dependencies với câu lệnh: npm install.
3. Tạo file `.env` trong thư mục `backend` với nội dung:
    ```properties
	API_KEY_REVGEOCODE=your_api (Đăng ký lấy api key trên https://www.here.com)
	API_KEY_AUTOCOMPLE=your_api (Đăng ký lấy api key trên https://www.here.com)
    ```
    - `<Địa chỉ máy chủ>` mặc định là `localhost`.
    - `<Cổng>` mặc định là `8081`
4. Nhập lệnh npm run android để chạy app (Nếu chạy trên máy thật thì chạy thêm 2 câu lệnh adb reverse tcp:3001 tcp:3001 và adb reverse tcp:8888 tcp:8888) 

### Bước 6: Frontend Website Manager
1. Mở **Visual Studio Code** và truy cập thư mục Frontend Website Manager.
2. Cài đặt các dependencies với câu lệnh: npm install.
3. Tạo file `.env` trong thư mục `backend` với nội dung:
    ```properties
	API_KEY_REVGEOCODE=your_api (Đăng ký lấy api key trên https://www.here.com)
	API_KEY_AUTOCOMPLE=your_api (Đăng ký lấy api key trên https://www.here.com)
    ```
    - `<Địa chỉ máy chủ>` mặc định là `localhost`.
    - `<Cổng>` mặc định là `3000`
4. Nhập lệnh npm start để chạy website 

## 4. Thông Tin Liên Hệ
- **Nhóm Phát Triển**:
  - [Nguyễn Quang Huy](https://github.com/quanghuydz123)
  - [Đặng Hoàng Toàn](https://github.com/dangtoan16)

