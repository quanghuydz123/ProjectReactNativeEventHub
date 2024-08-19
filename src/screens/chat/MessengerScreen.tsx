import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet } from "react-native";
import socket from "../../utils/socket";
import conversationAPI from "../../apis/conversationAPI";
import { MessengerModel } from "../../models/MessengerModel";

const MessengerScreen = ({ route }: any) => {
    const { conversation } = route.params;
    const [messages, setMessages] = useState<MessengerModel[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const api = `/messages/${conversation.idConversation}`;
            try {
                const res = await conversationAPI.HandleConversation(api, {}, 'get');
                setMessages(res.data || []);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        const handleNewMessage = (message: MessengerModel) => {
            setMessages(prev => [...prev, message]);
        };

        socket.on('receiveMessage', handleNewMessage);

        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [conversation.idConversation]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                content: newMessage,
                senderId: conversation.senderId,
                createdAt: new Date().toISOString(), 
            };
            socket.emit('sendMessage', { conversationId: conversation.idConversation, message });
            conversationAPI.HandleConversation(`/messages/${conversation.idConversation}`, message, 'post');
            setNewMessage('');
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ''; 
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageContent}>{item.content}</Text>
                        <Text style={styles.messageTime}>{formatDate(item.createdAt?.toString())}</Text>
                    </View>
                )}
            />
            <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message"
                style={styles.input}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        marginBottom: 10,
    },
    messageContent: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 5,
    },
    messageTime: {
        fontSize: 10,
        color: 'gray',
        marginTop: 2,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
});

export default MessengerScreen;
