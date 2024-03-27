import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Chat from './Chat';
import ImageGen from './ImageGen';
import Register from './Register';
import Login from './Login';
import { useAuth } from './AuthProvider'; // Import useAuth hook

function App() {
  const { user } = useAuth(); // Use the user state

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login'; // Redirect to login after logout
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {/* <li><Link to="/about">About</Link></li> */}
            {user && <><li><Link to="/chat">Chat</Link></li>
            <li><Link to="/imagegen">Image Gen</Link></li></>}
            {!user && <><li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li></>}
            {user &&               <li><button className="logout-btn" onClick={logout}>Logout</button></li>}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Conditionally render protected routes */}
          {user && (
            <>
              <Route path="/chat" element={<Chat />} />
              <Route path="/imagegen" element={<ImageGen />} />
            </>
          )}
          {!user && (
            <>
              <Route path="/chat" element={<Navigate to="/login" replace />} />
              <Route path="/imagegen" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
