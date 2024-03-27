import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Chat from './Chat';
import ImageGen from './ImageGen';
import Register from './Register'; // Add this line to import the Register component
function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/imagegen">Image Gen</Link></li>
            <li><Link to="/register">Register</Link></li> {/* Add this line */}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/imagegen" element={<ImageGen />} />
          <Route path="/register" element={<Register />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
