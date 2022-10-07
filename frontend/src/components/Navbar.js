import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleClick = () => {
        logout();
    }

    return (
        <header>
            <div className="container">
                <Link to="/chats">
                    <h1>Chat & Socialize</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <span className="material-symbols-outlined notifications">notifications</span>
                            <Link to="/login" onClick={handleClick}>Log out</Link>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <span className="material-symbols-outlined notifications">notifications</span>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;