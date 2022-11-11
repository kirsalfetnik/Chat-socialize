import { useChatContext } from "../hooks/useChatContext";

const ChatDetails = ({ chat }) => {
    const { setSelectedChat } = useChatContext();

    const selectChat = (chat) => {
        setSelectedChat(chat);
        console.log(chat);
    }

    return (
        <div className="chat-details" onClick={() => {selectChat(chat)}}>
            <h4>{chat.chatName}</h4>
            <p>{chat._id}</p>
        </div>
    )
}

export default ChatDetails;