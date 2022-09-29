const ChatWindow = () => {
    
    return (
        <div className="chatWindow">
            <div className="chatWindowHeader">
                <div>Name</div>
            </div>
            <div className="chatWindowBody">Hello people!</div>
            <div className="writeMessage">
                <input placeholder="Write a message..."></input>
                <span class="material-symbols-outlined sendSymbol">send</span>
            </div>
        </div>
    )
}

export default ChatWindow;