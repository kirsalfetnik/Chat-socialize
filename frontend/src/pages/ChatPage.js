import { useEffect } from "react";
import { useChatContext } from '../hooks/useChatContext';
import { useAuthContext } from "../hooks/useAuthContext";

// components
import ChatDetails from '../components/ChatDetails';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
    const {chats, dispatch} = useChatContext();
    const {user} = useAuthContext();

    useEffect(() => {
        const fetchChats = async () => {
            const response = await fetch('/api/chat', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_CHATS', payload: json});
            }
        }

        if (user) {
            fetchChats();
        }
    }, [dispatch, user]);

    return (
        <div>
            <div className="chatPage">
                <div className="chatInfo">
                    <div className="chatHeader">
                        <div>My chats</div>
                        <button>New Group Chat</button>
                    </div>
                    
                    <div className="dropdown">
                        <div className="searchField">
                            <span class="material-symbols-outlined searchSymbol">search</span>
                            <span className="searchPhrase">Search a user</span>
                            <div className="dropdown-menu">Dropdown Content</div>
                        </div>
                    </div>

                    <div className="chats">
                        {chats && chats.map((chat) => {
                            return (
                                <ChatDetails key={chat._id} chat={chat} />
                            );
                        })}
                    </div>
                </div>
                <ChatWindow />
            </div>
        </div>
    )
}

export default ChatPage;