import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import useStore from '../store/store';

const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3200';

export const useWebSocket = (conversationId) => {
  const { addMessageToConversation } = useStore();
  
  const socket = io(wsUrl, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling']
  });

  useEffect(() => {
    socket.connect();

    socket.emit('joinConversation', conversationId);

    socket.on('messageReceived', (newMessage) => {
      addMessageToConversation(conversationId, newMessage);
    });

    return () => {
      socket.emit('leaveConversation', conversationId);
      socket.disconnect();
    };
  }, [conversationId, socket]);

  const sendMessage = useCallback((messageData) => {
    socket.emit('newMessage', messageData);
  }, [socket]);

  return { sendMessage };
};