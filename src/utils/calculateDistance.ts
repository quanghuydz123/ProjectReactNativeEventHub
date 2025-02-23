import { Position } from "../models/GeoCodeModel";


const calculateDistance = ({userPosition, addressPosition}:{userPosition:Position,addressPosition:Position}) => {
    const toRad = (value:number) => (value * Math.PI) / 180;
    const { lat: lat1, lng: lon1 } = userPosition;
    const { lat: lat2, lng: lon2 } = addressPosition;
    const R = 6371; // Bán kính Trái Đất tính theo km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance
  };

  export default calculateDistance