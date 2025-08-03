import React, { useRef, useEffect, useContext } from 'react';
import { SocketContext } from './SocketContext';
import { io } from 'socket.io-client';
import { AuthContext } from '../auth/AuthContext';
import { baseURL } from '../../utils';

const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userId } = useContext(AuthContext);
    
    useEffect(() => {
        if (!socket.current) {
            socket.current = io(baseURL);
        }
        if (socket.current && userId) {
            socket.current.emit('join', { userId });
        }
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;