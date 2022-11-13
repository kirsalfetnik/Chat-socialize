import { useChatContext } from "../hooks/useChatContext";

const ChatDetails = ({ chat }) => {
    
    const { setSelectedChat } = useChatContext();

    const selectChat = (chat) => {
        setSelectedChat(chat);
        console.log(chat._id);
        var theSelectedChat = document.querySelector(".chat-details");
        theSelectedChat.classList.toggle("active");
    }

    return (
        <div className="chat-details" onClick={() => {selectChat(chat)}}>
            <h4>{chat.chatName}</h4>
            <p>{chat._id}</p>
        </div>
    )
}

export default ChatDetails;