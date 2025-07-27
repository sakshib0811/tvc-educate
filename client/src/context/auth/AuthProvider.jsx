import React from 'react';
import { AuthContext } from '../auth/AuthContext';
import useAuth from '../../hooks/useAuth';

const AuthProvider = ({ children }) => {
  const { token, login, logout, userId, user, setUser, isLoggedIn } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        currentUser: user,
        setUser,
        token,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
