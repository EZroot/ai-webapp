// src/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth from your AuthContext

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user } = useAuth(); // Get the current user from context

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
  );
};

export default PrivateRoute;
