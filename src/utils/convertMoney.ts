export const convertMoney = (num:number) =>{
    return num.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}