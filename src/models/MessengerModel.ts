export interface MessengerModel{
    _id: string; 
    idConversation: string;
    content: string;
    senderId: string; 
    isReaded: boolean;
    isDeleted: boolean;
    createdAt?: Date;
}