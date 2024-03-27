import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password_hash: '',
    role: '', // Add this line if you want users to specify their role
  });
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construct a new object for the request, renaming `password` to `password_hash`
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
      console.log(requestData);
      if (!response.ok) throw new Error('Failed to register');
      // Handle success, e.g., navigate to login or show a success message
      console.log('Registered successfully');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle errors, e.g., show an error message
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
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
  );
}

export default Register;
