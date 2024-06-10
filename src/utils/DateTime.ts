import { numberToString } from "./numberToString"

export class DateTime {
    static GetTime = (num:Date) =>{
        const date = new Date(num)
        return `${numberToString(date.getHours())} : ${numberToString(date.getMinutes())}`
    }

    static GetDate = (num:Date) =>{
        const date = new Date(num)
        return `Ngày ${numberToString(date.getDate())} tháng ${numberToString(date.getMonth()+1)} năm ${date.getFullYear()}`
    }
}