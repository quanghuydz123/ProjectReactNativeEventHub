import { EventModelNew } from "./EventModelNew"
import { UserModel } from "./UserModel"

export interface NotificationModel {
    __v: number
    _id: string
    content?: string
    createdAt: string
    eventId?: EventModelNew
    isRead: boolean
    isViewed: boolean
    recipientId: UserModel
    senderID: UserModel
    updatedAt: string,
    type:'inviteEvent' | 'message' |'like' |'follow' |'rejectFollow'| 'allowFollow' | 'other',
    status:'answered' | 'unanswered' | 'cancelled' |'rejected' | 'other'
  }
  