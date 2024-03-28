import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import './Login.css';
import DOMPurify from 'dompurify';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [loginError, setLoginError] = useState(''); // State for login error message
  const [loginSuccess, setLoginSuccess] = useState(false); // State to indicate login success

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(''); // Reset login error message
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
        throw new Error('Login failed. Please check your username and password.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.username); // Save username
      setUser(formData.username); // Update authentication state
      setLoginSuccess(true); // Indicate login success

      navigate('/'); // Redirect to home or another route after login
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message); // Set login error message
      setLoginSuccess(false); // Reset login success flag
    }
  };

  return (
    <div className="login-container" id="loginContainer">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}
        {loginSuccess && (
          <div className="success-message">
            Login successful! Redirecting...
          </div>
        )}
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
