import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// import pages 
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';

// import components
import Navbar from './components/Navbar';

function App() {
  const { user } = useAuthContext();
  
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            
            <Route
            path="/"
            element={<Home />}
            />
            <Route
            path="/chats"
            element={<Chat />}
            />
            <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
            />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
