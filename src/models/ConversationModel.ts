import {  MessengerModel } from "./MessengerModel";

export interface ConversationModel {
    idConversation: string;
    receiverId: string;
    senderId: string;
    lastTime: Date;
    messenger: MessengerModel;
}