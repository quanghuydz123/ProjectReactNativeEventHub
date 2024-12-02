import { EventModelNew } from "./EventModelNew"
import { UserModel } from "./UserModel"

export interface NotificationModel {
    __v: number
    _id: string
    content?: string
    createdAt: string
    eventId?: EventModelNew,
    invoiceId?: string
    isRead: boolean
    isViewed: boolean
    recipientId: UserModel
    senderID: UserModel
    updatedAt: string,
    type:'inviteEvent' | 'paymentTicket' |'like' |'follow' |'rejectFollow'| 'allowFollow' | 'other' | 'newEvent',
    status:'answered' | 'unanswered' | 'cancelled' |'rejected' | 'other'
  }
  