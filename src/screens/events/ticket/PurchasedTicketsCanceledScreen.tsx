import { FlatList, ScrollView, View } from "react-native"
import { ButtonComponent, DataLoaderComponent, ListEventRelatedComponent, SectionComponent, SpaceComponent, TextComponent, TicketComponent } from "../../../components"
import { colors } from "../../../constrants/color"
import SearchComponent from "../../../components/SearchComponent";
import { useEffect, useState } from "react";
import { EventModelNew } from "../../../models/EventModelNew";
import CardComponent from "../../../components/CardComponent";
import { appInfo } from "../../../constrants/appInfo";
import { InvoiceDetailsModel } from "../../../models/InvoiceDetailsModel";
import { useSelector } from "react-redux";
import { authSelector } from "../../../reduxs/reducers/authReducers";
import { apis } from "../../../constrants/apis";
import ticketAPI from "../../../apis/ticketAPI";


const PurchasedTicketsCanceledScreen = ({ navigation, route }: any)=>{
    const [searchKey, setSearchKey] = useState('');
    const {relatedEvents }:{relatedEvents:EventModelNew[]} = route.params
    const [invoicePaid,setinvoicePaid] = useState<InvoiceDetailsModel[]>([])
    const [isLoading,setIsLoading] = useState(true)
    const auth = useSelector(authSelector)
    useEffect(()=>{
        handleCallAPIGetTicketsByIdUser()
    },[auth])
    const handleCallAPIGetTicketsByIdUser = async ()=>{
        const api = apis.ticket.getByIdUser({uid:auth.id,typeFilter:'Canceled'})
        setIsLoading(true)
        try {
          const res = await ticketAPI.HandleTicket(api)
          if(res && res.status === 200 && res.data){
            setinvoicePaid(res.data)
          }
          setIsLoading(false)
        } catch (error: any) {
        setIsLoading(false)
          const errorMessage = JSON.parse(error.message)
          console.log("Profile",errorMessage.message)
        }
      }
    return (
        <View style={{backgroundColor:colors.black,flex:1,paddingTop:12}}>
           
            <ScrollView style={{ flex: 1 }}>
                {   
                   <DataLoaderComponent 
                   data={invoicePaid}
                   height={appInfo.sizes.HEIGHT*0.6}
                   isLoading={isLoading}
                   children={
                    invoicePaid.map((invoice)=>{
                        return <TicketComponent invoice={invoice} key={invoice.invoiceDetails._id} />
                    })
                   }
                   />
                }
                <SpaceComponent height={10}/>
                <SpaceComponent height={1} color={colors.gray} width={appInfo.sizes.WIDTH} styles={{}} />

                <ListEventRelatedComponent relatedEvents={relatedEvents}/>
                <SpaceComponent height={20}/>
            </ScrollView>
        </View>
    )
}

export default PurchasedTicketsCanceledScreen