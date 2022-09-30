import { useEffect } from "react";
import { useChatContext } from '../hooks/useChatContext';
import { useAuthContext } from "../hooks/useAuthContext";

// components
import ChatDetails from '../components/ChatDetails';
import ChatWindow from '../components/ChatWindow';
import Sidebar from '../components/Sidebar';

const ChatPage = () => {
    const {chats, dispatch} = useChatContext();
    const {user} = useAuthContext();

    const handleSearchClick = () => {
        const sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("active");
    }

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
            {user && 
            <div className="chatPage">
                <Sidebar />
                <div className="chatInfo">
                    <div className="chatHeader">
                        <div className="headerName">My chats</div>
                        <button>New Group Chat</button>
                    </div>
                    
                    <div className="searchField" onClick={handleSearchClick}>
                        <span className="material-symbols-outlined searchSymbol">search</span>
                        <span className="searchPhrase">Search a user</span>
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
            }
        </div>
    )
}

export default ChatPage;