import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux"; 
import { ContainerComponent, SectionComponent } from "../../components";
import SearchComponent from "../../components/SearchComponent";
import socket from "../../utils/socket";
import { ConversationModel } from "../../models/ConversationModel";
import { UserModel } from "../../models/UserModel";
import conversationAPI from "../../apis/conversationAPI";
import userAPI from "../../apis/userApi";
import LoadingComponent from "../../components/LoadingComponent";
import { authSelector } from "../../reduxs/reducers/authReducers";


const ChatsScreen = ({ navigation }: any) => {
    const [searchKey, setSearchKey] = useState('');
    const [conversations, setConversations] = useState<ConversationModel[]>([]);
    const [users, setUsers] = useState<UserModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Lấy thông tin người dùng app hiện tại
    const authData = useSelector(authSelector);
    const userId = authData.id; 

    useEffect(() => {
        const fetchData = async () => {
            await fetchConversations();
            await fetchUsers();
            setIsLoading(false);
        };
        fetchData();

        socket.on('updateConversations', fetchConversations);

        return () => {
            socket.off('updateConversations');
        };
    }, []);

    const fetchConversations = async () => {
        const api = `/getUserConversations/${userId}`; 
        try {
            const res: any = await conversationAPI.HandleConversation(api, {}, 'get');
            if (res && res.status === 200) {
                setConversations(res.data || []);
            }
        } catch (error: any) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchUsers = async () => {
        const api = '/get-users';
        try {
            const res = await userAPI.HandleUser(api, {}, 'get');
            if (res && res.data) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChatPress = (conversation: ConversationModel) => {
        navigation.navigate('ChatScreen', { conversation });
    };

    const filteredConversations = conversations.filter(conversation =>
        conversation.receiverId.includes(searchKey) || conversation.senderId.includes(searchKey)
    );

    const getUserDetails = (userId: string): UserModel | null => {
        return users.find(user => user._id === userId) || null;
    };

    return (
        <ContainerComponent back title="Đoạn chat">
            <View>
                <SectionComponent>
                    <SearchComponent onSearch={setSearchKey} value={searchKey} isNotShowArrow />
                </SectionComponent>
                {isLoading ? (
                    <LoadingComponent isLoading={isLoading} value={0} message="Đang tải..." />
                ) : (
                    <FlatList
                        data={filteredConversations}
                        keyExtractor={(item) => item.idConversation}
                        renderItem={({ item }) => {
                            const user = getUserDetails(item.receiverId === userId ? item.senderId : item.receiverId);
                            if (!user) return null;
                            return (
                                <TouchableOpacity onPress={() => handleChatPress(item)} style={styles.chatItem}>
                                    <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
                                    <View style={styles.chatInfo}>
                                        <Text>{user.fullname}</Text>
                                        <Text>{new Date(item.lastTime).toLocaleString()}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}
            </View>
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    chatInfo: {
        flex: 1,
    },
});

export default ChatsScreen;
