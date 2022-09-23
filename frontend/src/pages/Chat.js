import { useEffect } from 'react';

const Chat = () => {
    
    useEffect(() => {
        const fetchChats = async () => {
            const response = await fetch('/api/chats');
            const json = response.json();
        }

        fetchChats();
    })

    return (
        <div>
            Chat Page
        </div>
    )
}

export default Chat;