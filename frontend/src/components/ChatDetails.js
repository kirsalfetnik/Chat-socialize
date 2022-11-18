import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";

const ChatDetails = ({ chat }) => {
    const { dispatch } = useChatContext();
    const { setSelectedChat } = useChatContext();
    const { user } = useAuthContext();
    const userInfo = JSON.parse(localStorage.getItem('user'));

    const chatName = () => {
        if (chat.users[0].name !== userInfo.userName) { 
            return chat.users[0].name
        }
        else return chat.users[1].name;
    }

    const selectChat = (chat) => {
        setSelectedChat(chat);
        console.log(chat._id);

        var elems = document.querySelectorAll(".active");
        [].forEach.call(elems, function(el) {el.classList.remove("active")});
        const theSelectedChat = document.getElementById(chat._id);
        theSelectedChat.classList.toggle("active");
    }

    const handleDelete = async () => {
        if (!user) {
            return
        }
        const response = await fetch('/api/chat/' + chat._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({type: 'DELETE_CHAT', payload: json});
        }
    }

    return (
            <div className="chat-details" id={chat._id} onClick={() => {selectChat(chat)}}>
                <h4>{chatName()}</h4>
                <p>Chat ID: {chat._id}</p>
                <span className="material-symbols-outlined deleteSymbol" onClick={handleDelete}>delete</span>
            </div>
    )
}

export default ChatDetails;