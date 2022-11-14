import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// import pages 
import ChatPage from './pages/ChatPage';
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
            element={!user ? <Login /> : <ChatPage />}
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
