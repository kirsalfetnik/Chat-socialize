import { useChatContext } from '../hooks/useChatContext';
import { useAuthContext } from '../hooks/useAuthContext';

const UserList = ({ person }) => {
    const { dispatch } = useChatContext();
    const { user } = useAuthContext();
    
    const accessChat = async (userId) => {

        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({type: 'CREATE_CHAT', payload: json});
        }
    }
    
    return (
        <div className="person" onClick={() => accessChat(person._id)}>
            <img src={person.picture} alt="Avatar" className="avatar" />
            <div className="container">
                <div>{person.name}</div>
                <div>{person.email}</div>
            </div>
        </div>
    );
}

export default UserList;