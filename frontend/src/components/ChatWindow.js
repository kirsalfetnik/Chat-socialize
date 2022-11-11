import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from '../hooks/useChatContext';

const ChatWindow = () => {
    const { user } = useAuthContext();
    const { selectedChat } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = async (event) => {
        if(event.key==="Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user.token}`
                    }
                }

                setNewMessage("");

                const { data } = await fetch("/api/message", {
                    method: 'POST',
                    content: newMessage,
                    chatId: selectedChat
                }, config);

                setMessages([...messages, data]);
            } catch(error) {
                console.log('Error occured', error);
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing indicator logic
    }
    
    return (
        <div className="chatWindow">
            <div className="chatWindowHeader">
                <div>Name</div>
            </div>

            <div className="chatWindowBody">
                Hello people!
            </div>

            <form className="writeMessage" onKeyDown={sendMessage} required>
                
                <input 
                placeholder="Write a message..." 
                onChange={typingHandler}
                value={newMessage}>
                </input>

                <span className="material-symbols-outlined sendSymbol">send</span>
            </form>

        </div>
    )
}

export default ChatWindow;