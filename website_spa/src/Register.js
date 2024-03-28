import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import './Login.css';
import DOMPurify from 'dompurify';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password_hash: '',
    role: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.username);
      setUser(formData.username);
      navigate('/');
    } catch (error) {
      console.error('Auto-login error:', error);
      setErrorMessage(error.message);
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

      setRegistrationSuccess(true);
      setTimeout(autoLogin, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.message);
      setRegistrationSuccess(false); // Ensure to reset the success state in case of error
    }
  };

  return (
    <div className="login-container" id="loginContainer">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {/* Move success and error messages here, inside the form */}
        {registrationSuccess && (
        <div className="success-message">
          Registration successful! Redirecting...
        </div>
      )}
      {errorMessage && !registrationSuccess && ( // Only display if registrationSuccess is false
        <div className="error-message">
          {errorMessage}
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
            value={formData.password_hash}
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
