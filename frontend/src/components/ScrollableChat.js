import { useAuthContext } from '../hooks/useAuthContext';

const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
    return 33;
    
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
    return 0;
    else return "auto";
};

const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

const isSameSender = (allMessages, currentMessage, index, userId) => {
    return (
        index < allMessages.length - 1 && 
        (allMessages[index+1].sender._id !== currentMessage.sender._id ||
        allMessages[index+1].sender._id === undefined) && 
        allMessages[index].sender._id !== userId
    )
}

const isLastMessage = (allMessages, index, userId) => {
    return (
        index === allMessages.length - 1 &&
        allMessages[allMessages.length - 1].sender._id !== userId &&
        allMessages[allMessages.length - 1].sender._id
    )
}

const ScrollableChat = ({ messages }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    return (
        <div className="scrollableField">
            {messages && messages.map((mes, index) => {
                return (
                <div>
                    <div style={{ display: "flex" }} key={mes._id}>
                        {(isSameSender(messages, mes, index, user.user_Id)
                        || isLastMessage(messages, index, user.user_Id)
                        ) && (
                            <div label={mes.sender.name} placement="bottom-start">
                                <img src={mes.sender.picture} alt="Avatar" className="avatar" />
                            </div>
                        )}
                    </div>

                    <span className="messageContent" style={{
                        backgroundColor: `${mes.sender._id === user.user_Id ? "#BEE3F8" : "#B9F5D0"}`,
                        marginLeft: isSameSenderMargin(messages, mes, index, user.user_Id),
                        marginTop: isSameUser(messages, mes, index, user.user_Id) ? 3 : 10,
                        borderRadius: "18px",
                        padding: "5px 15px",
                        maxWidth: "75%"
                    }}>
                        {mes.content}
                    </span>
                </div>
                )
            })}
        </div>
    )
}

export default ScrollableChat;