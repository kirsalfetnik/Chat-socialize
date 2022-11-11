import { createContext, useReducer, useState } from 'react';

export const ChatContext = createContext();

export const chatReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CHATS':
            return {
                chats: action.payload
            }
        case 'CREATE_CHAT':
            return {
                chats: [action.payload, ...state.chats]
            }
        case 'DELETE_CHAT':
            return {
                chats: state.chats.filter((chat) => chat._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const ChatContextProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer(chatReducer, {
        chats: null
    });

    const [selectedChat, setSelectedChat] = useState();

    return (
        <ChatContext.Provider value={{...state, dispatch, selectedChat, setSelectedChat}}>
            { children }
        </ChatContext.Provider>
    )
}