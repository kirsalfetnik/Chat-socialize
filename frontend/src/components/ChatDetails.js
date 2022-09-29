import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";

const ChatDetails = ({ chat }) => {
    const { dispatch } = useChatContext();
    const { user } = useAuthContext();

    return (
        <div className="chat-details" onClick={() => {}}>
            <h4>{chat.chatName}</h4>
            <p>{chat._id}</p>
        </div>
    )
}

export default ChatDetails;