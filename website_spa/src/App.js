import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Chat from './Chat';
import ImageGen from './ImageGen';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Initial fetch to greet
    fetchGreeting();
  }, []);

  const fetchGreeting = (query = '') => {
    // Fetch data from the backend using the proxy setup
    // Optional query parameter can be used to send a dynamic query to the backend
    fetch(`/api/greet${query ? `?query=${encodeURIComponent(query)}` : ''}`)
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/imagegen">Image Gen</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/imagegen" element={<ImageGen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;