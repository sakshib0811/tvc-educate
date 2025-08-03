import { useState, useEffect, useCallback } from 'react';
// import useHttpClient from './useHttpClient';

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  // const { sendReq } = useHttpClient();

  const login = useCallback((user, expirationDate) => {
    setToken(user.token);
    setUserId(user.userId);
    setUser(user);
    setIsLoggedIn(true);
    
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: user.userId,
        token: user.token,
        bio: user.bio,
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        tags: user.tags,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUser({});
    setTokenExpirationDate(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      if (remainingTime > 0) {
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        logout();
      }
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && parsedData.token && new Date(parsedData.expiration) > new Date()) {
          login(parsedData, new Date(parsedData.expiration));
        } else {
          localStorage.removeItem('userData');
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData');
      }
    }
  }, [login]);

  return { token, login, logout, userId, user, setUser, isLoggedIn };
};

export default useAuth;
