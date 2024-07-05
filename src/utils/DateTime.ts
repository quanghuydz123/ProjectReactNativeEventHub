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
    static GetDateNew = (dateStart:Date,DateEnd:Date)=>{
        const date1 = new Date(dateStart)
        const date2 = new Date(DateEnd)
        const fullDate1 = {
            day:numberToString(date1.getDate()),
            month:numberToString(date1.getMonth()+1),
            year:date1.getFullYear()
        }
        const fullDate2 = {
            day:numberToString(date2.getDate()),
            month:numberToString(date2.getMonth()+1),
            year:date2.getFullYear()
        }
        if(fullDate1.day === fullDate2.day){
            return `Ngày ${fullDate1.day} tháng ${fullDate1.month} năm ${fullDate1.year}`
        }else{
            return `Ngày ${fullDate1.day}-${fullDate2.day} tháng ${fullDate1.month} năm ${fullDate1.year}`
        }
    }
    static GetDateShort = (dateStart:Date,DateEnd:Date) =>{
        const date1 = new Date(dateStart)
        const date2 = new Date(DateEnd)
        const fullDate1 = {
            day:numberToString(date1.getDate()),
            month:numberToString(date1.getMonth()+1),
            year:date1.getFullYear()
        }
        const fullDate2 = {
            day:numberToString(date2.getDate()),
            month:numberToString(date2.getMonth()+1),
            year:date2.getFullYear()
        }
        if(fullDate1.day === fullDate2.day){
            return `${fullDate1.day}/${fullDate1.month}/${fullDate1.year}`
        }else{
            return `${fullDate1.day}-${fullDate2.day}/${fullDate1.month}/${fullDate1.year}`
        }
    }

    static GetDateShortNew = (num:Date) =>{
        const date = new Date(num)
        return `${numberToString(date.getDate())}/${numberToString(date.getMonth()+1)}/${date.getFullYear()}`
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