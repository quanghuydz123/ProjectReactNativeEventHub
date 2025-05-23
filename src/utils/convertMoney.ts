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
    
    return `Từ ${convertMoney(renderPriceTypeTicket(typeTickets[typeTickets.length - 1]))}`;
  };

export const renderPriceTypeTicket = (typeTicket:TypeTicketModel) => {
    const renderPrice = ()=>{
      if(typeTicket?.promotion){
        if(typeTicket.promotion.status === 'Ongoing'){
          if(typeTicket.promotion.discountType === 'Percentage'){
            return typeTicket.price * (100 - typeTicket.promotion.discountValue) / 100
          }else{
            if(typeTicket.price - typeTicket.promotion.discountValue < 0){
              return 0
            }
            return typeTicket.price - typeTicket.promotion.discountValue
          }
        }
      }
      return typeTicket.price
    }
    return typeTicket.type === 'Paid' ? renderPrice() : 0
}


export const renderPriceDisCountTypeTicket = (typeTicket:TypeTicketModel) => {
  const renderPrice = ()=>{
    if(typeTicket?.promotion){
      if(typeTicket.promotion.status === 'Ongoing'){
        if(typeTicket.promotion.discountType === 'Percentage'){
          return typeTicket.price * typeTicket.promotion.discountValue / 100
        }else{
          return typeTicket.promotion.discountValue
        }
      }
    }
    return 0
  }
  return typeTicket.type === 'Paid' ? renderPrice() : 0
}