import { useState, useEffect, useCallback } from 'react';
import useHttpClient from './useHttpClient';

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const { sendReq } = useHttpClient();

  //useCallback((uid, token, expirationDate)
  const login = useCallback((user, expirationDate) => {
    // setToken(token);
    // setUserId(uid);
    // console.log(user.token, user.userId);
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
    localStorage.setItem('currentUser',JSON.stringify({
      isLoggedIn: true
    }))
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUser(null);
    setTokenExpirationDate(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userData');
    localStorage.setItem('currentUser', {
      isLoggedIn: false
    });
    //GET request to backend for twitter since it uses passport
    sendReq(
      `${process.env.REACT_APP_BASE_URL}/users/auth/twitter/logout`,
      'GET',
      null,
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
      'include'
    );
    // remember to add sendReq in the [] below 
  }, [sendReq]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && new Date(storedData.expiration) > new Date()) {
      //console.log("I did execute");
      login(
        // storedData.userId,
        // storedData.token,
        storedData,
        new Date(storedData.expiration)
      );
    
    }
  }, [login]); // [] => only run once when the cmp is mounted first time
  return { token, login, logout, userId, user, setUser, isLoggedIn };
};

export default useAuth;
