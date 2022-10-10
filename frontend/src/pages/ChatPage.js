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

    const openModal = () => {
        const modal = document.querySelector(".modal-container");
        modal.classList.toggle("active");
    }

    const closeModal = () => {
        const modal = document.querySelector(".modal-container");
        modal.classList.toggle("active");
    }

    return (
        <div>
            {user && 
            <div className="chatPage">
                <Sidebar />
                <div className="chatInfo">
                    <div className="chatHeader">
                        <div className="headerName">My chats</div>

                        <button id="openModal" onClick={openModal}>New Group Chat</button>
                        
                        <div className="modal-container" id="modal-container">
                            <div className="modalHeader">
                                <div>Create group chat</div>
                                <span className="material-symbols-outlined sendSymbol" id="closeModal" onClick={closeModal}>close</span>
                            </div>
                            <input placeholder="Chat Name"></input>
                            <input placeholder="Add Users"></input>
                            <button className="createChatButton">Create Chat</button>
                        </div>

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