import * as io from "socket.io-client";
import { appInfo } from "../constrants/appInfo";
const socket = io.connect(appInfo.BASE_URL,{
    reconnection: true,       // Tự động kết nối lại
    reconnectionAttempts: 5,  // Số lần cố gắng kết nối lại
    reconnectionDelay: 1000,  // Thời gian chờ giữa các lần kết nối lại
});
export default socket;