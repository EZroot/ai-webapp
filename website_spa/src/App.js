import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Chat from './Chat';
import ImageGen from './ImageGen';
import Register from './Register';
import Login from './Login';
import { useAuth } from './AuthProvider'; // Import useAuth hook
import logo from './ailogo.png';

function App() {
  const { user, setUser } = useAuth(); // Use the user state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ username }); // Set the user state if token and username are available
    }
    setIsLoading(false); // Set loading state to false after authentication check
  }, [setUser]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null); // Set user state to null on logout
    window.location.href = '/login'; // Redirect to login after logout
  };

  if (isLoading) {
    // Return a loading indicator while authentication check is in progress
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <nav>
        <div className="nav-header">
        <li style={{display: 'flex', alignItems: 'center'}}>
        <img src={logo} alt="logo" style={{ width: '30px', marginRight: '15px' }}/>
        <div>
    <span style={{color: 'white'}}>aioverlord.tech </span>
</div>    </li>
        <ul className="navLinks">
            <li><Link to="/">Home</Link></li>
            {user ? (
              <>
                <li><Link to="/chat">Chat</Link></li>
                <li><Link to="/imagegen">Image Gen</Link></li>
                <li><button className="logout-btn" onClick={logout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
          </div> 
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {user ? (
            <>
              <Route path="/chat" element={<Chat />} />
              <Route path="/imagegen" element={<ImageGen />} />
            </>
          ) : (
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
