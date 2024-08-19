import conversationAPI from "../apis/conversationAPI";


export class ConversationHandleCallAPI {
    static getAllChats = async (setConversations: any, setUsers: any) => {
        const chatsApi = '/get-all'; // API để lấy cuộc hội thoại
       
        try {
            // Lấy cuộc hội thoại
            const resChats: any = await conversationAPI.HandleConversation(chatsApi, {}, 'get');
            const conversations = resChats.data || [];
            // Cập nhật dữ liệu
            setConversations(conversations);
           
        } catch (error: any) {
            const errorMessage = JSON.parse(error.message);
            console.log(errorMessage);
        } 
    }
}
