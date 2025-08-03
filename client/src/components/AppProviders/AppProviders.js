import React from 'react';
import '../../styles/main.css';
import AuthProvider from '../../context/auth/AuthProvider';
import SearchProvider from '../../context/search/SearchProvider';
import SocketProvider from '../../context/socket/SocketProvider';
import { DataProvider } from '../../context/data/DataContext';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SearchProvider>
        <SocketProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </SocketProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default AppProviders;
