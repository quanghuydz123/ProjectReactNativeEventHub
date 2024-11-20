import { appInfo } from "../constrants/appInfo"
import axiosClient from "./axiosClient"

class InvoiceAPI {
    HandleInvoice = async (
        url:string,
        data?:any,
        method?: 'get' | 'post' | 'put' | 'delete'
    )=>{
        return await axiosClient(`/invoices${url}`,{
            method: method ?? 'get',
            data
        })
    }   
}

const invoiceAPI = new InvoiceAPI()
export default invoiceAPI