import { useEffect, useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from '../hooks/useChatContext';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const ChatWindow = () => {
    const { user } = useAuthContext();
    const { selectedChat } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);

    const fetchMessages = async () => {
        if(!selectedChat) return;

        try {
            const response = await fetch(`/api/message/${selectedChat._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            setLoading(true);
            const data = await response.json();
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id)
            // console.log(data);
        } catch (error) {
            console.log('Error occured while fetching chats', error);
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connection', () => setSocketConnected(true));
    }, []);
    
    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on('message recieved', (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give a notification
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    });

    const sendMessage = async (event) => {
        if(event.key==="Enter" && newMessage) {
            event.preventDefault();
            
            try {
                if(!selectedChat) return;
                setNewMessage("");
                const response = await fetch("/api/message", {
                    method: 'POST',
                    body: JSON.stringify({ content: newMessage, chatId: selectedChat }),
                    headers: {
                        "Content-type": "application/json",
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                
                const data = await response.json();
                
                socket.emit('new message', data);
                setMessages([...messages, data]);

            } catch(error) {
                console.log('Error occured while sending the message', error);
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing indicator logic
    }
    
    return (
        <div className="chatWindow">
            <div className="chatWindowHeader"></div>

            <div className="chatWindowBody">
                {loading ? (
                    <span className="loader"></span>
                ) : (
                <div className="messages">
                    <ScrollableChat messages={messages} />
                </div>
                )}
            </div>

            <form className="writeMessage" onKeyDown={sendMessage} required>
                
                <input 
                placeholder="Write a message..." 
                onChange={typingHandler}
                value={newMessage}>
                </input>

                <span 
                className="material-symbols-outlined sendSymbol" onClick={sendMessage} value={newMessage}>send
                </span>
            </form>

        </div>
    )
}

export default ChatWindow;