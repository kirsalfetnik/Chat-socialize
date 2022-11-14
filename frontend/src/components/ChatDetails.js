import { useChatContext } from "../hooks/useChatContext";

const ChatDetails = ({ chat }) => {
    const { setSelectedChat } = useChatContext();
    const user = JSON.parse(localStorage.getItem('user'));

    const chatName = () => {
        if (chat.users[0].name !== user.userName) { 
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

    const handleDelete = () => {

    }

    return (
            <div className="chat-details" id={chat._id} onClick={() => {selectChat(chat)}}>
                <h4>{chatName()}</h4>
                <p>{chat._id}</p>
                <span className="material-symbols-outlined deleteSymbol" onClick={handleDelete}>delete</span>
            </div>
    )
}

export default ChatDetails;