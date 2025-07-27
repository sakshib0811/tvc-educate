import React from 'react';
import '../../styles/main.css';
import AuthProvider from '../../context/auth/AuthProvider';
import SearchProvider from '../../context/search/SearchProvider';
import SocketProvider from '../../context/socket/SocketProvider';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SearchProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default AppProviders;
