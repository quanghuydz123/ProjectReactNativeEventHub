import { OrganizerModel } from "./OrganizerModel"
import { ShowTimeModel } from "./ShowTimeModel"
import { UserModel } from "./UserModel"

export interface EventModelNew {
    _id: string
    title: string
    description?: any
    Address: string
    photoUrl: string
    // addressDetals: AddressDetals
    Location: string
    position: Position
    price: number
    category:Category,
    authorId: OrganizerModel,
    addressDetails:{
      province:{
          name:string,
          code:number,
      },
      districts:{
          name:string,
          code:number,
      },
      ward:{
          name:string,
          code:number,
      },
      houseNumberAndStreet:string
    },
    usersInterested?:[{
      user:UserModel,
      createdAt:Date
    }],
    totalComments:number,
    showTimes:[ShowTimeModel]
    statusEvent: 'PendingApproval' | "NotStarted" | 'Ongoing' | 'Ended' | 'Cancelled' | 'OnSale' | 'SoldOut' | 'SaleStopped' | 'NotYetOnSale'
    startAt: string
    endAt: string
    status: boolean
    viewCount:number
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export interface AddressDetals {
    city?: string
    county?: string
    district?: string
    postalCode?: string
    houseNumber?:string
    street?:string  
  }
  
  export interface Position {
    lat: number
    lng: number
  }
  
  export interface Category {
    _id: string
    name: string
    image: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  
  