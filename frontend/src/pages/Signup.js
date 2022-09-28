import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [picture, setPicture] = useState('');
    const [show, setShow] = useState(false);
    const eyeHide = "visibility_off", eyeShow = "visibility";
    const [eye, setEye] = useState(eyeHide);
    const {signup, error, isLoading} = useSignup();

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        await signup(name, email, password, picture);
    }

    const handleEyeClick = () => {
        
        if (show === false) {
            // switch to text
            setShow(!show);
            
            // change icon
            setEye(eyeShow);

        } else {
            // switch to password
            setShow(!show);

            // change icon
            setEye(eyeHide);
        }
    }
    
    const postPicture = async (picture) => {
        
        if (picture.type === "image/jpeg" || picture.type === "image/png") {
            const data = new FormData();
            data.append("file", picture);
            data.append("upload_preset", "Chat-socialize");
            data.append("cloud_name", "dxmyvf4cx");
            
            const response = await fetch("https://api.cloudinary.com/v1_1/dxmyvf4cx/image/upload", {
                method: "POST",
                body: data
            });
            
            const json = await response.json();
            const url = await json.url.toString();
            setPicture(url);
            
            return url;
        }
    }
    
    return (
        <form className="signup" onSubmit={handleSubmit}>
            <div className="tab">
                <Link to="/login" className="tablinks">Log in</Link>
                <Link to="/signup" className="tablinks">Sign up</Link>
            </div>

            <h3>Sign up</h3>

            <label className="required">Name:</label>
            <input
                type="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
            />

            <label className="required">Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label className="required">Password:</label>
            <div className="input-container">
            <input
                type={show ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <i className="material-symbols-outlined" id="input-icon" onClick={handleEyeClick}>{eye}</i>
            </div>

            <label className="required">Picture:</label>
            <input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postPicture(e.target.files[0])}
            />

            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup;