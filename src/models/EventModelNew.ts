import { OrganizerModel } from "./OrganizerModel"
import { ShowTimeModel } from "./ShowTimeModel"
import { UserModel } from "./UserModel"

export interface EventModelNew {
    _id: string
    title: string
    description?: any
    Address: string
    photoUrl: string
    addressDetals: AddressDetals
    Location: string
    position: Position
    price: number
    category:Category,
    authorId: OrganizerModel
    usersInterested?:[{
      user:UserModel,
      createdAt:Date
    }],
    showTimes:[ShowTimeModel]
    statusEvent: 'PendingApproval' | "NotStarted" | 'Ongoing' | 'Ended' | 'Cancelled' | 'OnSale' | 'SoldOut',
    startAt: string
    endAt: string
    status: boolean
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
  
  
  