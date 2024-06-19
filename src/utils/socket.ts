import * as io from "socket.io-client";
const socket = io.connect("http://localhost:3001",{
    reconnection: true,       // Tự động kết nối lại
    reconnectionAttempts: 5,  // Số lần cố gắng kết nối lại
    reconnectionDelay: 1000,  // Thời gian chờ giữa các lần kết nối lại
});
export default socket;