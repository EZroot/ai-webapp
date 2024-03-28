import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import App from './App';
import { AuthProvider } from './AuthProvider';

// Find the container element where you want to mount your React app.
const container = document.getElementById('root');

// Use createRoot to create a root for your application.
const root = createRoot(container); // Create a root instance.

// Render your application inside the root.
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
