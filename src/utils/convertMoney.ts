import districts from "../constrants/addressVN/districts";
import { EventModelNew } from "../models/EventModelNew";
import { ShowTimeModel } from "../models/ShowTimeModel";
import { TypeTicketModel } from "../models/TypeTicketModel";

export const convertMoney = (num:number) =>{
    return num.toLocaleString('it-VN', {style : 'currency', currency : 'VND'});
}

export const renderPrice = (showTime:ShowTimeModel) => {
    const typeTickets = showTime?.typeTickets || [];
    
    const allFree = typeTickets.every(ticket => ticket.type === 'Free');
    if (allFree) {
      return `Từ ${convertMoney(0)}`;
    }
    
    return `Từ ${convertMoney(typeTickets[typeTickets.length - 1]?.price ?? 0)}`;
  };

export const renderPriceTypeTicket = (typeTicket:TypeTicketModel) => {
    return typeTicket.type === 'Paid' ? typeTicket.price : 0
}