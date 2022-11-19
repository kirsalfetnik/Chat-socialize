import { useEffect, useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from '../hooks/useChatContext';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;
const objectSelector = document.getElementById('chatWindowBody');

const ChatWindow = () => {
    const { user } = useAuthContext();
    const { selectedChat } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

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
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            console.log('Error occured while fetching chats', error);
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);
    
    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
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
            socket.emit('stop typing', selectedChat._id);
            
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
            
            objectSelector.scrollTop = objectSelector.scrollHeight;
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing indicator logic
        if(!socketConnected) return;
        
        if(!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }
    
    return (
        <div className="chatWindow">
            <div className="chatWindowHeader"></div>

            <div className="chatWindowBody" id="chatWindowBody">
                {loading ? (
                    <span className="loader"></span>
                ) : (
                <div className="messages">
                    <ScrollableChat messages={messages} isTyping={isTyping}/>
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