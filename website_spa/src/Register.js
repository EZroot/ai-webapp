import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection after login
import { useAuth } from './AuthProvider'; // Import useAuth hook
import './Login.css'; // Adjust the path as necessary
import DOMPurify from 'dompurify';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password_hash: '',
    role: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Use setUser function from AuthProvider

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sanitize user input to prevent XSS
    const sanitizedValue = DOMPurify.sanitize(value);
  
    setFormData({ ...formData, [name]: sanitizedValue });
    };

  const autoLogin = async () => {
    try {
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: formData.username, password: formData.password_hash }),
      });

      if (!loginResponse.ok) {
        throw new Error('Auto-login failed');
      }

      const data = await loginResponse.json();
      console.log('Auto-logged in successfully:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.username);

      setUser(formData.username); // Update authentication state

      navigate('/'); // Navigate to the home page or dashboard
    } catch (error) {
      console.error('Auto-login error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      username: formData.username,
      email: formData.email,
      password_hash: formData.password_hash,
      role: 'user',
    };
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error('Failed to register');

      setRegistrationSuccess(true); // Indicate registration success
      setTimeout(autoLogin, 3000);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="login-container" id="loginContainer">
      {registrationSuccess && (
        <div className="success-message">
          Registration successful! Redirecting...
        </div>
      )}
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>Register</h2>
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
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password_hash"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
  
}

export default Register;
