import districts from "../constrants/addressVN/districts";

export const convertMoney = (num:number) =>{
    return num.toLocaleString('it-VN', {style : 'currency', currency : 'VND'});
}