import { numberToString } from "./numberToString"

export class DateTime {
    static GetTime = (num:Date) =>{
        const date = new Date(num)
        return `${numberToString(date.getHours())}:${numberToString(date.getMinutes())}`
    }

    static GetDate = (num:Date) =>{
        const date = new Date(num)
        return `Ngày ${numberToString(date.getDate())} tháng ${numberToString(date.getMonth()+1)} năm ${date.getFullYear()}`
    }

    static ConvertDayOfWeek = (num:number) =>{
        if(num === 0){
            return "Chủ nhật"
        }else{
            return `Thứ ${num+1}`
        }
    }

    static SetminimunDay = (num:Date)=>{
        const date = new Date(num)
        return `${date.getFullYear()}-${numberToString(date.getMonth())}-${numberToString(date.getDate())}T17:00:00.000Z`
    }
}