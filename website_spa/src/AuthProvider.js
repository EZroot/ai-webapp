// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        // Optionally, decode the token to extract user information
        // If using jwt-decode, you might extract the username or user ID
        // Here, it's a simplified example
        if (token) {
            const username = localStorage.getItem('username'); // Assume you save username on successful login
            setUser({ username });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}
