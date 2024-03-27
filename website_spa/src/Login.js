import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from './AuthProvider'; // Import useAuth hook
import './Login.css'; // Adjust the path as necessary

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate
  const { setUser } = useAuth(); // Use setUser function from AuthProvider

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      username: formData.username,
      password: formData.password,
    };
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Logged in successfully:', data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.username); // Save username
      setUser(formData.username); // Update authentication state

      navigate('/'); // Redirect to home or another route after login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container" id="loginContainer">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
